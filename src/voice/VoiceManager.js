/**
 * VoiceManager -- manages the WebRTC connection to the OpenAI Realtime API.
 *
 * This is a plain ES class (not a Phaser object) with callback properties that
 * the game wires up.  It owns the RTCPeerConnection, the data channel, and the
 * local microphone stream.
 *
 * Usage:
 *   const vm = VoiceManager.getInstance();
 *   vm.onGameStateUpdate = (data) => gameState.updateFromAI(data);
 *   vm.onDesktopAction   = (data) => scene.handleDesktopAction(data);
 *   vm.onCallEnd         = (reason) => gameState.endCall(reason);
 *   await vm.requestMicPermission();
 *   await vm.startCall(levelNum);
 */

const REALTIME_API_URL =
  'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17';

const SESSION_ENDPOINT = '/api/session';

class VoiceManager {
  constructor() {
    /** @type {RTCPeerConnection|null} */
    this.pc = null;

    /** @type {RTCDataChannel|null} */
    this.dc = null;

    /** @type {HTMLAudioElement|null} */
    this.audioEl = null;

    /** @type {MediaStream|null} */
    this.localStream = null;

    /** @type {boolean} */
    this.connected = false;

    // ---- Audio analysis (for mic-level meter) ----
    /** @type {AudioContext|null} */
    this._audioCtx = null;

    /** @type {AnalyserNode|null} */
    this._analyser = null;

    /** @type {Uint8Array|null} */
    this._analyserData = null;

    // ---- Callbacks -- set these before calling startCall() ----

    /**
     * Called when the AI triggers update_game_state.
     * @type {function(object)|null}
     */
    this.onGameStateUpdate = null;

    /**
     * Called when the AI triggers tech_support_desktop_action.
     * @type {function(object)|null}
     */
    this.onDesktopAction = null;

    /**
     * Called when the call should end (e.g. AI finishes, connection drops).
     * @type {function(string)|null}
     */
    this.onCallEnd = null;

    /**
     * Called on any data-channel error.
     * @type {function(object)|null}
     */
    this.onError = null;

    /**
     * Called when the session is successfully created and the AI is ready.
     * @type {function()|null}
     */
    this.onConnected = null;
  }

  /* ==================================================================
   * Singleton accessor
   * ================================================================*/

  /** @returns {VoiceManager} */
  static getInstance() {
    if (!VoiceManager._instance) {
      VoiceManager._instance = new VoiceManager();
    }
    return VoiceManager._instance;
  }

  /* ==================================================================
   * Microphone
   * ================================================================*/

  /**
   * Request microphone permission and store the local stream.
   * Also sets up an AnalyserNode so getMicLevel() works immediately.
   *
   * @returns {Promise<boolean>} true if permission was granted.
   */
  async requestMicPermission() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Set up analyser for mic level meter
      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = this._audioCtx.createMediaStreamSource(this.localStream);
      this._analyser = this._audioCtx.createAnalyser();
      this._analyser.fftSize = 256;
      this._analyserData = new Uint8Array(this._analyser.frequencyBinCount);
      source.connect(this._analyser);

      return true;
    } catch (err) {
      console.error('[VoiceManager] Microphone permission denied:', err);
      return false;
    }
  }

  /* ==================================================================
   * Call lifecycle
   * ================================================================*/

  /**
   * Full flow to start a WebRTC voice call against the OpenAI Realtime API.
   *
   * @param {number} level - The current game level (1-5), sent to the backend
   *                         so the server configures the correct victim prompt.
   * @returns {Promise<boolean>} true if the connection was established.
   */
  async startCall(level) {
    try {
      // -----------------------------------------------------------
      // 1. Fetch an ephemeral key from our backend
      // -----------------------------------------------------------
      const sessionRes = await fetch(SESSION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level }),
      });

      if (!sessionRes.ok) {
        const errText = await sessionRes.text();
        throw new Error(`Session endpoint returned ${sessionRes.status}: ${errText}`);
      }

      const sessionData = await sessionRes.json();
      const ephemeralKey = sessionData.client_secret?.value ?? sessionData.key;

      if (!ephemeralKey) {
        throw new Error('No ephemeral key returned from /api/session');
      }

      // -----------------------------------------------------------
      // 2. Create the RTCPeerConnection
      // -----------------------------------------------------------
      this.pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      // -----------------------------------------------------------
      // 3. Set up remote audio playback
      // -----------------------------------------------------------
      this.audioEl = document.createElement('audio');
      this.audioEl.autoplay = true;

      this.pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          this.audioEl.srcObject = event.streams[0];
        }
      };

      // -----------------------------------------------------------
      // 4. Add local microphone track
      // -----------------------------------------------------------
      if (!this.localStream) {
        const granted = await this.requestMicPermission();
        if (!granted) {
          throw new Error('Microphone permission not granted');
        }
      }

      this.localStream.getTracks().forEach((track) => {
        this.pc.addTrack(track, this.localStream);
      });

      // -----------------------------------------------------------
      // 5. Create the data channel
      // -----------------------------------------------------------
      this.dc = this.pc.createDataChannel('oai-events', { ordered: true });

      this.dc.onopen = () => {
        console.log('[VoiceManager] Data channel open');
        this.connected = true;
        if (this.onConnected) this.onConnected();
      };

      this.dc.onclose = () => {
        console.log('[VoiceManager] Data channel closed');
        this.connected = false;
      };

      this.dc.onerror = (err) => {
        console.error('[VoiceManager] Data channel error:', err);
        if (this.onError) this.onError(err);
      };

      // -----------------------------------------------------------
      // 6. Set up message handler for function calls
      // -----------------------------------------------------------
      this.dc.onmessage = (event) => this.handleDataChannelMessage(event);

      // -----------------------------------------------------------
      // 7-8. Create offer and set local description
      // -----------------------------------------------------------
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // -----------------------------------------------------------
      // 9. Send the offer SDP to OpenAI and get the answer
      // -----------------------------------------------------------
      const sdpRes = await fetch(REALTIME_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });

      if (!sdpRes.ok) {
        const errText = await sdpRes.text();
        throw new Error(`OpenAI Realtime SDP exchange failed (${sdpRes.status}): ${errText}`);
      }

      const answerSdp = await sdpRes.text();

      // -----------------------------------------------------------
      // 10. Set remote description from the answer
      // -----------------------------------------------------------
      await this.pc.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp,
      });

      // Monitor ICE connection state for unexpected disconnects
      this.pc.oniceconnectionstatechange = () => {
        const state = this.pc?.iceConnectionState;
        console.log('[VoiceManager] ICE state:', state);

        if (state === 'disconnected' || state === 'failed' || state === 'closed') {
          this.connected = false;
          if (this.onCallEnd) this.onCallEnd('connection_lost');
        }
      };

      return true;
    } catch (err) {
      console.error('[VoiceManager] startCall failed:', err);
      this._cleanup();
      if (this.onError) this.onError(err);
      return false;
    }
  }

  /* ==================================================================
   * Data channel message handling
   * ================================================================*/

  /**
   * Parse and dispatch messages received over the WebRTC data channel.
   *
   * OpenAI Realtime API message format (key event types):
   *   { type: "session.created" }
   *   { type: "session.updated" }
   *   { type: "response.function_call_arguments.done",
   *     call_id: "...", name: "function_name", arguments: "json_string" }
   *   { type: "response.done", response: { ... } }
   *   { type: "error", error: { ... } }
   *
   * @param {MessageEvent} event
   */
  handleDataChannelMessage(event) {
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch {
      console.warn('[VoiceManager] Non-JSON data channel message:', event.data);
      return;
    }

    switch (msg.type) {
      // ----------------------------------------------------------
      // Function call completed -- the AI has finished producing
      // the arguments for a tool call.
      // ----------------------------------------------------------
      case 'response.function_call_arguments.done': {
        const fnName = msg.name;
        const callId = msg.call_id;
        let args;

        try {
          args = JSON.parse(msg.arguments);
        } catch {
          console.error(
            `[VoiceManager] Failed to parse arguments for ${fnName}:`,
            msg.arguments,
          );
          break;
        }

        // Dispatch to the appropriate callback
        if (fnName === 'update_game_state' && this.onGameStateUpdate) {
          this.onGameStateUpdate(args);
        } else if (fnName === 'tech_support_desktop_action' && this.onDesktopAction) {
          this.onDesktopAction(args);
        }

        // Send the function call output back so the model can continue
        this._sendFunctionCallOutput(callId, { success: true });

        // Trigger the model to generate the next response turn
        this._triggerResponse();

        break;
      }

      // ----------------------------------------------------------
      // The model finished a full response turn.
      // ----------------------------------------------------------
      case 'response.done': {
        // The response object may contain output items; we can inspect
        // them if needed in the future.  For now, no special handling
        // beyond logging.
        console.log('[VoiceManager] Response done');
        break;
      }

      // ----------------------------------------------------------
      // Session lifecycle events
      // ----------------------------------------------------------
      case 'session.created':
        console.log('[VoiceManager] Session created');
        break;

      case 'session.updated':
        console.log('[VoiceManager] Session updated');
        break;

      // ----------------------------------------------------------
      // Conversation item events (useful for detecting AI speech)
      // ----------------------------------------------------------
      case 'conversation.item.created':
      case 'conversation.item.input_audio_transcription.completed':
      case 'response.audio_transcript.done':
        // Can be used by the UI to show transcripts if desired
        break;

      // ----------------------------------------------------------
      // Errors
      // ----------------------------------------------------------
      case 'error': {
        console.error('[VoiceManager] API error:', msg.error);
        if (this.onError) this.onError(msg.error);
        break;
      }

      default:
        // Many event types flow through the channel (rate_limits, audio
        // deltas, etc.).  We intentionally ignore the ones we don't need.
        break;
    }
  }

  /* ==================================================================
   * Outbound data-channel helpers
   * ================================================================*/

  /**
   * Send a function_call_output message back to the model.
   *
   * @param {string} callId - The call_id from the function call event.
   * @param {object} output - The output payload (e.g. { success: true }).
   * @private
   */
  _sendFunctionCallOutput(callId, output) {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.warn('[VoiceManager] Cannot send function output -- data channel not open');
      return;
    }

    this.dc.send(
      JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: callId,
          output: JSON.stringify(output),
        },
      }),
    );
  }

  /**
   * Ask the model to generate a new response after receiving function output.
   * @private
   */
  _triggerResponse() {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.warn('[VoiceManager] Cannot trigger response -- data channel not open');
      return;
    }

    this.dc.send(JSON.stringify({ type: 'response.create' }));
  }

  /* ==================================================================
   * End call / cleanup
   * ================================================================*/

  /**
   * Gracefully end the current call: close the data channel, peer
   * connection, and stop local media tracks.
   */
  endCall() {
    this._cleanup();
  }

  /**
   * Internal cleanup -- tear down WebRTC resources.
   * @private
   */
  _cleanup() {
    this.connected = false;

    if (this.dc) {
      try {
        this.dc.close();
      } catch { /* ignore */ }
      this.dc = null;
    }

    if (this.pc) {
      try {
        this.pc.close();
      } catch { /* ignore */ }
      this.pc = null;
    }

    if (this.audioEl) {
      this.audioEl.srcObject = null;
      this.audioEl.remove();
      this.audioEl = null;
    }

    // NOTE: We intentionally do NOT stop localStream tracks here so the
    // mic stays available for subsequent calls without re-prompting.
    // Call stopMic() explicitly if you want to release the microphone.
  }

  /**
   * Fully release the microphone (stops all tracks and closes the audio
   * context).  Call this when leaving the game or on the menu screen.
   */
  stopMic() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this._audioCtx) {
      this._audioCtx.close().catch(() => {});
      this._audioCtx = null;
      this._analyser = null;
      this._analyserData = null;
    }
  }

  /* ==================================================================
   * Mic level (for mic test UI)
   * ================================================================*/

  /**
   * Return the current microphone input level as a normalised value 0-1.
   * Useful for rendering a mic-level meter in the menu / settings screen.
   *
   * @returns {number} 0 (silence) to 1 (loud).
   */
  getMicLevel() {
    if (!this._analyser || !this._analyserData) return 0;

    this._analyser.getByteFrequencyData(this._analyserData);

    // Compute RMS of the frequency data
    let sum = 0;
    for (let i = 0; i < this._analyserData.length; i++) {
      const val = this._analyserData[i] / 255;
      sum += val * val;
    }
    const rms = Math.sqrt(sum / this._analyserData.length);

    // Clamp to 0-1 (rms will naturally be in that range)
    return Math.min(rms * 2, 1); // scale up slightly for visual feedback
  }
}

/** @type {VoiceManager|null} */
VoiceManager._instance = null;

export default VoiceManager;
export { VoiceManager };
