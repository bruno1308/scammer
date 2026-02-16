/**
 * SocialNetworkScene.js - FriendBook Social Network Overlay
 *
 * A fake Facebook-parody social network ("FriendBook") accessible via the
 * office monitor. Players browse interconnected profiles of their victim
 * and the victim's family to gather intel that provides compliance boosts
 * during calls.
 *
 * Launched as an overlay on top of OfficeScene. Can co-exist with CallScene
 * during active calls.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';

export default class SocialNetworkScene extends Phaser.Scene {
  constructor() {
    super({ key: 'social-network' });
  }

  init(data) {
    this.friendbookData = data?.friendbookData;  // { profiles, posts, intelKeys }
    this.currentProfileId = data?.targetProfileId; // ID of the victim's profile
    this.levelNum = data?.level;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Semi-transparent background overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
      .setInteractive()
      .on('pointerdown', () => {}); // Prevent click-through

    // Browser window dimensions
    this.browserX = 60;
    this.browserY = 30;
    this.browserW = width - 120;
    this.browserH = height - 60;

    // Internal state
    this.tabScrollOffset = 0;
    this.tabContentTotalHeight = 0;
    this._intelZones = [];
    this._scrollListener = null;
    this.intelItemTexts = {};
    this.tabButtons = [];
    this.activeTab = 'Timeline';

    this._drawBrowserChrome();
    this._drawFriendBookHeader();
    this._drawSearchBar();
    this._drawProfileArea();
    this._drawTabs();
    this._drawIntelTracker();

    // Show the target victim's profile initially
    this._showProfile(this.currentProfileId);
  }

  // =========================================================================
  //  BROWSER CHROME
  // =========================================================================

  _drawBrowserChrome() {
    const g = this.add.graphics();

    // Window shadow
    g.fillStyle(0x000000, 0.3);
    g.fillRoundedRect(this.browserX + 4, this.browserY + 4, this.browserW, this.browserH, 8);

    // Window body (white)
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(this.browserX, this.browserY, this.browserW, this.browserH, 8);

    // Title bar (light gray, top rounded corners)
    g.fillStyle(0xe8e8e8, 1);
    g.fillRoundedRect(this.browserX, this.browserY, this.browserW, 32, { tl: 8, tr: 8, bl: 0, br: 0 });

    // macOS-style window dots: green, yellow, red (left to right from the left side)
    this.add.circle(this.browserX + 20, this.browserY + 16, 7, 0xff5f57)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this._close());
    this.add.circle(this.browserX + 44, this.browserY + 16, 7, 0xffbd2e); // minimize (decorative)
    this.add.circle(this.browserX + 68, this.browserY + 16, 7, 0x28c840); // maximize (decorative)

    // URL bar (white rounded rect inside title bar)
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(this.browserX + 100, this.browserY + 6, this.browserW - 200, 20, 10);

    // URL text
    this.urlText = this.add.text(this.browserX + 112, this.browserY + 9, '\uD83D\uDD12 www.friendbook.com', {
      fontSize: '11px',
      color: '#666666',
      fontFamily: 'Arial'
    });
  }

  // =========================================================================
  //  FRIENDBOOK HEADER
  // =========================================================================

  _drawFriendBookHeader() {
    const y = this.browserY + 32;
    const g = this.add.graphics();

    // Blue header bar (#1877f2), 40px tall
    g.fillStyle(0x1877f2, 1);
    g.fillRect(this.browserX, y, this.browserW, 40);

    // "FriendBook" text in Georgia bold
    this.add.text(this.browserX + 16, y + 8, 'FriendBook', {
      fontSize: '22px',
      color: '#ffffff',
      fontFamily: 'Georgia',
      fontStyle: 'bold'
    });
  }

  // =========================================================================
  //  SEARCH BAR
  // =========================================================================

  _drawSearchBar() {
    const headerY = this.browserY + 32;
    const searchX = this.browserX + 180;
    const searchY = headerY + 7;
    const searchW = 250;

    // Search bar background (semi-transparent white)
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.2);
    g.fillRoundedRect(searchX, searchY, searchW, 26, 13);

    // Hint text
    this.searchText = this.add.text(searchX + 12, searchY + 5, '\uD83D\uDD0D Search FriendBook...', {
      fontSize: '13px',
      color: '#bbbbbb',
      fontFamily: 'Arial'
    });

    // Clickable area that opens the dropdown
    this.add.rectangle(searchX + searchW / 2, searchY + 13, searchW, 26, 0xffffff, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this._openSearchDropdown());

    // Search dropdown container (hidden initially)
    this.searchDropdown = this.add.container(searchX, searchY + 30);
    this.searchDropdown.setVisible(false);
  }

  _openSearchDropdown() {
    // Clear existing dropdown items
    this.searchDropdown.removeAll(true);

    const profiles = this.friendbookData.profiles;
    const keys = Object.keys(profiles);
    let yOffset = 0;

    // Background panel
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.lineStyle(1, 0xdddddd, 1);
    bg.fillRoundedRect(0, 0, 250, keys.length * 36 + 8, 6);
    bg.strokeRoundedRect(0, 0, 250, keys.length * 36 + 8, 6);
    this.searchDropdown.add(bg);

    keys.forEach((id) => {
      const profile = profiles[id];
      const displayName = `${profile.isTarget ? '\u2B50 ' : ''}${profile.name}`;

      // Hover background zone
      const hoverBg = this.add.graphics();
      this.searchDropdown.add(hoverBg);

      const item = this.add.text(12, 8 + yOffset, displayName, {
        fontSize: '13px',
        color: '#1877f2',
        fontFamily: 'Arial'
      })
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this._showProfile(id);
          this.searchDropdown.setVisible(false);
        })
        .on('pointerover', function () {
          this.setColor('#0a5dc2');
        })
        .on('pointerout', function () {
          this.setColor('#1877f2');
        });

      this.searchDropdown.add(item);
      yOffset += 36;
    });

    this.searchDropdown.setVisible(true);
    this.searchDropdown.setDepth(100);

    // Close dropdown when clicking outside it (next frame to avoid immediate close)
    this.time.delayedCall(50, () => {
      const closeHandler = (pointer) => {
        if (!this.searchDropdown || !this.searchDropdown.visible) {
          this.input.off('pointerdown', closeHandler);
          return;
        }
        const localX = pointer.x - this.searchDropdown.x;
        const localY = pointer.y - this.searchDropdown.y;
        const dropH = keys.length * 36 + 8;
        if (localX < 0 || localX > 250 || localY < 0 || localY > dropH) {
          this.searchDropdown.setVisible(false);
          this.input.off('pointerdown', closeHandler);
        }
      };
      this.input.on('pointerdown', closeHandler);
    });
  }

  // =========================================================================
  //  PROFILE AREA
  // =========================================================================

  _drawProfileArea() {
    const contentY = this.browserY + 72; // Below FriendBook header
    const contentX = this.browserX + 1;
    const contentW = this.browserW - 2;

    // Cover photo area (blue gradient placeholder, 80px tall)
    const g = this.add.graphics();
    g.fillGradientStyle(0x1877f2, 0x42a5f5, 0x1565c0, 0x1877f2, 1, 1, 1, 1);
    g.fillRect(contentX, contentY, contentW, 80);

    // Profile pic container (left side, overlapping cover photo)
    this.profilePicContainer = this.add.container(contentX + 60, contentY + 50);

    // Name & bio text (to the right of the profile pic)
    this.profileNameText = this.add.text(contentX + 110, contentY + 82, '', {
      fontSize: '18px',
      color: '#1c1e21',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    });
    this.profileBioText = this.add.text(contentX + 110, contentY + 104, '', {
      fontSize: '12px',
      color: '#65676b',
      fontFamily: 'Arial',
      wordWrap: { width: contentW - 300 }
    });

    // Tab content container (scrollable area below tabs)
    this.tabContentY = contentY + 148;
    this.tabContentContainer = this.add.container(contentX + 16, this.tabContentY);

    // Geometry mask for scrollable area
    const maskShape = this.make.graphics({ add: false });
    maskShape.fillRect(
      contentX,
      this.tabContentY,
      contentW,
      this.browserH - (this.tabContentY - this.browserY) - 8
    );
    this.tabContentContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, maskShape));
    this.tabContentMaskBottom = this.browserY + this.browserH - 8;
  }

  // =========================================================================
  //  TABS
  // =========================================================================

  _drawTabs() {
    const tabY = this.browserY + 120;
    const tabX = this.browserX + 16;
    const tabs = ['Timeline', 'About', 'Friends & Family'];
    this.tabButtons = [];
    this.activeTab = 'Timeline';

    tabs.forEach((label, i) => {
      const x = tabX + i * 140;
      const text = this.add.text(x, tabY, label, {
        fontSize: '13px',
        color: i === 0 ? '#1877f2' : '#65676b',
        fontFamily: 'Arial',
        fontStyle: i === 0 ? 'bold' : 'normal'
      })
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this._switchTab(label));
      this.tabButtons.push(text);
    });

    // Blue underline indicator
    this.tabIndicator = this.add.graphics();
    this._updateTabIndicator(0);
  }

  _switchTab(tabName) {
    this.activeTab = tabName;
    const tabNames = ['Timeline', 'About', 'Friends & Family'];
    const idx = tabNames.indexOf(tabName);
    this.tabButtons.forEach((btn, i) => {
      btn.setColor(i === idx ? '#1877f2' : '#65676b');
      btn.setFontStyle(i === idx ? 'bold' : 'normal');
    });
    this._updateTabIndicator(idx);
    this._renderTabContent();
  }

  _updateTabIndicator(idx) {
    this.tabIndicator.clear();
    this.tabIndicator.fillStyle(0x1877f2, 1);
    this.tabIndicator.fillRect(this.browserX + 16 + idx * 140, this.browserY + 138, 80, 3);
  }

  // =========================================================================
  //  PROFILE DISPLAY
  // =========================================================================

  _showProfile(profileId) {
    const profile = this.friendbookData.profiles[profileId];
    if (!profile) return;

    this.currentProfileId = profileId;

    // Update URL bar text
    const urlName = profile.name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '');
    this.urlText.setText(`\uD83D\uDD12 www.friendbook.com/${urlName}`);

    // Update profile pic
    this.profilePicContainer.removeAll(true);
    if (profile.portraitKey && this.textures.exists(profile.portraitKey)) {
      const pic = this.add.image(0, 0, profile.portraitKey).setDisplaySize(72, 72);
      // Circular mask for portrait
      const mask = this.make.graphics({ add: false });
      mask.fillStyle(0xffffff);
      mask.fillCircle(this.profilePicContainer.x, this.profilePicContainer.y, 36);
      pic.setMask(new Phaser.Display.Masks.GeometryMask(this, mask));
      this.profilePicContainer.add(pic);
    } else {
      // Programmatic avatar: colored circle + initials
      const initials = profile.name.split(' ').map(w => w[0]).join('').substring(0, 2);
      const colors = [0x1877f2, 0x42b72a, 0xf02849, 0xf7b928, 0x8b5cf6];
      const color = colors[profileId.length % colors.length];
      const circle = this.add.circle(0, 0, 36, color);
      const text = this.add.text(0, 0, initials, {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      this.profilePicContainer.add([circle, text]);
    }

    // Update name (with star for targets) and bio
    this.profileNameText.setText(`${profile.name}${profile.isTarget ? ' \u2B50' : ''}`);
    this.profileBioText.setText(profile.bio || '');

    // Switch to Timeline tab
    this._switchTab('Timeline');
  }

  // =========================================================================
  //  TAB CONTENT RENDERING
  // =========================================================================

  _renderTabContent() {
    this.tabContentContainer.removeAll(true);
    this.tabContentContainer.setY(this.tabContentY);
    this.tabScrollOffset = 0;
    this._intelZones = [];

    switch (this.activeTab) {
      case 'Timeline':
        this._renderTimeline();
        break;
      case 'About':
        this._renderAbout();
        break;
      case 'Friends & Family':
        this._renderFriends();
        break;
    }

    // Enable mouse wheel scrolling on the content area
    this._enableScroll();
  }

  // =========================================================================
  //  TIMELINE TAB
  // =========================================================================

  _renderTimeline() {
    const posts = this.friendbookData.posts[this.currentProfileId] || [];
    const contentW = this.browserW - 50;
    let yOffset = 0;

    posts.forEach((post) => {
      const cardH = this._estimatePostHeight(post, contentW);

      // Post card background with border
      const cardBg = this.add.graphics();
      cardBg.fillStyle(0xffffff, 1);
      cardBg.lineStyle(1, 0xe4e6eb, 1);
      cardBg.fillRoundedRect(0, yOffset, contentW, cardH, 8);
      cardBg.strokeRoundedRect(0, yOffset, contentW, cardH, 8);
      this.tabContentContainer.add(cardBg);

      // Author avatar (portrait image or colored circle fallback)
      const profile = this.friendbookData.profiles[this.currentProfileId];
      const authorColors = [0x1877f2, 0x42b72a, 0xf02849, 0xf7b928, 0x8b5cf6];
      const authorColor = authorColors[this.currentProfileId.length % authorColors.length];
      if (profile.portraitKey && this.textures.exists(profile.portraitKey)) {
        const avatarImg = this.add.image(20, yOffset + 20, profile.portraitKey)
          .setDisplaySize(32, 32);
        this.tabContentContainer.add(avatarImg);
      } else {
        const avatarCircle = this.add.circle(20, yOffset + 20, 16, authorColor);
        const avatarInitials = this.add.text(20, yOffset + 20,
          profile.name.split(' ').map(w => w[0]).join('').substring(0, 2), {
            fontSize: '11px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
          }).setOrigin(0.5);
        this.tabContentContainer.add([avatarCircle, avatarInitials]);
      }

      // Author name
      const authorText = this.add.text(44, yOffset + 8, profile.name, {
        fontSize: '13px',
        color: '#1c1e21',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      });
      this.tabContentContainer.add(authorText);

      // Timestamp
      const timeText = this.add.text(44, yOffset + 26, post.time, {
        fontSize: '11px',
        color: '#65676b',
        fontFamily: 'Arial'
      });
      this.tabContentContainer.add(timeText);

      // Post text (word-wrapped)
      const postText = this.add.text(12, yOffset + 48, post.text, {
        fontSize: '13px',
        color: '#1c1e21',
        fontFamily: 'Arial',
        wordWrap: { width: contentW - 24 },
        lineSpacing: 2
      });
      this.tabContentContainer.add(postText);

      // Post image (if this post has an associated image)
      let postImageHeight = 0;
      if (post.imageKey && this.textures.exists(post.imageKey)) {
        const maxImgW = contentW - 24;
        const maxImgH = 180;
        const postImg = this.add.image(contentW / 2, 0, post.imageKey);
        const scale = Math.min(maxImgW / postImg.width, maxImgH / postImg.height);
        postImg.setScale(scale);
        const imgY = yOffset + 48 + postText.height + 8 + postImg.displayHeight / 2;
        postImg.setY(imgY);
        this.tabContentContainer.add(postImg);
        postImageHeight = postImg.displayHeight + 8;
      }

      // Like count
      const likeY = yOffset + 48 + postText.height + 8 + postImageHeight;
      const likeText = this.add.text(12, likeY, `\uD83D\uDC4D ${post.likes}`, {
        fontSize: '12px',
        color: '#65676b',
        fontFamily: 'Arial'
      });
      this.tabContentContainer.add(likeText);

      // Comments
      let commentY = likeY + 24;
      if (post.comments && post.comments.length > 0) {
        // Divider line
        const divider = this.add.graphics();
        divider.lineStyle(1, 0xe4e6eb, 1);
        divider.lineBetween(12, commentY - 4, contentW - 12, commentY - 4);
        this.tabContentContainer.add(divider);

        post.comments.forEach((comment) => {
          const authorProfile = this.friendbookData.profiles[comment.author];
          const commenterName = authorProfile ? authorProfile.name : comment.author;

          // Clickable author name (navigates to that profile)
          const commentAuthor = this.add.text(12, commentY, commenterName, {
            fontSize: '12px',
            color: '#1877f2',
            fontFamily: 'Arial',
            fontStyle: 'bold'
          })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this._showProfile(comment.author));
          this.tabContentContainer.add(commentAuthor);

          // Comment text
          const commentText = this.add.text(12 + commentAuthor.width + 6, commentY, comment.text, {
            fontSize: '12px',
            color: '#1c1e21',
            fontFamily: 'Arial',
            wordWrap: { width: contentW - commentAuthor.width - 30 }
          });
          this.tabContentContainer.add(commentText);

          commentY += Math.max(commentText.height, 18) + 8;
        });
      }

      // Track this post for intel visibility detection
      if (post.intel) {
        this._trackIntelVisibility(post.intel.key, yOffset, yOffset + cardH);
      }

      yOffset += cardH + 12;
    });

    this.tabContentTotalHeight = yOffset;

    // Check initial visibility (posts that are already visible without scrolling)
    this._checkIntelVisibility();
  }

  _estimatePostHeight(post, width) {
    // Rough estimation: header(44) + text lines(~20 per line) + image(188 if present) + likes(28) + comments(28 each) + padding(16)
    const charsPerLine = Math.floor((width - 24) / 7);
    const textLines = Math.max(1, Math.ceil(post.text.length / charsPerLine));
    const commentLines = (post.comments || []).length;
    const imageHeight = (post.imageKey && this.textures.exists(post.imageKey)) ? 188 : 0;
    return 44 + textLines * 20 + imageHeight + 28 + commentLines * 28 + 16;
  }

  // =========================================================================
  //  ABOUT TAB
  // =========================================================================

  _renderAbout() {
    const profile = this.friendbookData.profiles[this.currentProfileId];
    if (!profile) return;

    const contentW = this.browserW - 50;
    let yOffset = 0;

    const sections = [
      { icon: '\uD83C\uDF82', label: 'Birthday', value: profile.birthday },
      { icon: '\uD83D\uDCCD', label: 'Lives in', value: profile.location },
      { icon: '\uD83D\uDC8D', label: 'Relationship', value: profile.relationship },
      { icon: '\uD83D\uDCBC', label: 'Workplace', value: profile.workplace },
      { icon: '\u2B50', label: 'Interests', value: (profile.interests || []).join(', ') },
      { icon: '\uD83D\uDC65', label: 'Groups', value: (profile.groups || []).join(', ') },
      { icon: '\uD83D\uDCCC', label: 'Check-ins', value: (profile.checkIns || []).join(', ') },
    ];

    sections.forEach(({ icon, label, value }) => {
      if (!value) return;
      const line = this.add.text(12, yOffset, `${icon}  ${label}: ${value}`, {
        fontSize: '13px',
        color: '#1c1e21',
        fontFamily: 'Arial',
        wordWrap: { width: contentW - 24 },
        lineSpacing: 2
      });
      this.tabContentContainer.add(line);
      yOffset += line.height + 12;
    });

    this.tabContentTotalHeight = yOffset;
  }

  // =========================================================================
  //  FRIENDS & FAMILY TAB
  // =========================================================================

  _renderFriends() {
    const profile = this.friendbookData.profiles[this.currentProfileId];
    if (!profile || !profile.friends) return;

    const contentW = this.browserW - 50;
    let yOffset = 0;

    // Header
    const title = this.add.text(12, yOffset, 'Friends & Family', {
      fontSize: '15px',
      color: '#1c1e21',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    });
    this.tabContentContainer.add(title);
    yOffset += 30;

    profile.friends.forEach((friendId) => {
      const friend = this.friendbookData.profiles[friendId];
      if (!friend) return;

      // Mini avatar (portrait image or colored circle fallback)
      if (friend.portraitKey && this.textures.exists(friend.portraitKey)) {
        const avatar = this.add.image(24, yOffset + 18, friend.portraitKey)
          .setDisplaySize(32, 32);
        this.tabContentContainer.add(avatar);
      } else {
        const colors = [0x1877f2, 0x42b72a, 0xf02849, 0xf7b928, 0x8b5cf6];
        const color = colors[friendId.length % colors.length];
        const avatar = this.add.circle(24, yOffset + 18, 16, color);
        const initials = this.add.text(24, yOffset + 18,
          friend.name.split(' ').map(w => w[0]).join('').substring(0, 2), {
            fontSize: '10px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
          }).setOrigin(0.5);
        this.tabContentContainer.add([avatar, initials]);
      }

      // Clickable name (navigates to that profile)
      const nameText = this.add.text(48, yOffset + 6, friend.name, {
        fontSize: '13px',
        color: '#1877f2',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      })
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this._showProfile(friendId));

      // Bio text
      const bioText = this.add.text(48, yOffset + 22, friend.bio || '', {
        fontSize: '11px',
        color: '#65676b',
        fontFamily: 'Arial',
        wordWrap: { width: contentW - 80 }
      });

      this.tabContentContainer.add([nameText, bioText]);
      yOffset += Math.max(44, bioText.height + 30);
    });

    this.tabContentTotalHeight = yOffset;
  }

  // =========================================================================
  //  SCROLL HANDLING
  // =========================================================================

  _enableScroll() {
    // Remove previous scroll listener if any
    if (this._scrollListener) {
      this.input.off('wheel', this._scrollListener);
    }

    this._scrollListener = (pointer, gameObjects, deltaX, deltaY) => {
      const viewableHeight = this.tabContentMaskBottom - this.tabContentY;
      const maxScroll = Math.max(0, this.tabContentTotalHeight - viewableHeight);
      this.tabScrollOffset = Phaser.Math.Clamp(this.tabScrollOffset + deltaY * 0.5, 0, maxScroll);
      this.tabContentContainer.setY(this.tabContentY - this.tabScrollOffset);

      // Check intel visibility after scroll
      this._checkIntelVisibility();
    };

    this.input.on('wheel', this._scrollListener);
  }

  // =========================================================================
  //  INTEL VISIBILITY TRACKING
  // =========================================================================

  _trackIntelVisibility(key, topY, bottomY) {
    this._intelZones.push({ key, topY, bottomY });
  }

  _checkIntelVisibility() {
    if (!this._intelZones || this._intelZones.length === 0) return;

    const viewTop = this.tabScrollOffset;
    const viewBottom = viewTop + (this.tabContentMaskBottom - this.tabContentY);

    this._intelZones.forEach(({ key, topY, bottomY }) => {
      // If the post is at least partially visible in the viewport
      if (bottomY > viewTop && topY < viewBottom) {
        gameState.markIntelSeen(key);
      }
    });
  }

  // =========================================================================
  //  INTEL TRACKER PANEL
  // =========================================================================

  _drawIntelTracker() {
    if (!this.friendbookData || !this.friendbookData.intelKeys || this.friendbookData.intelKeys.length === 0) {
      return;
    }

    const intelKeys = this.friendbookData.intelKeys;
    const trackerX = this.browserX + this.browserW - 180;
    const trackerY = this.browserY + 76;
    const panelH = 30 + intelKeys.length * 22;

    this.intelTrackerContainer = this.add.container(trackerX, trackerY);

    // Background panel (light yellow sticky note style)
    const bg = this.add.graphics();
    bg.fillStyle(0xfffde7, 1);
    bg.lineStyle(1, 0xe0d68a, 1);
    bg.fillRoundedRect(0, 0, 165, panelH, 6);
    bg.strokeRoundedRect(0, 0, 165, panelH, 6);
    this.intelTrackerContainer.add(bg);

    // Header: "Intel" with count
    const header = this.add.text(8, 6, '\uD83D\uDCCB Intel', {
      fontSize: '12px',
      color: '#5d4037',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    });
    this.intelTrackerContainer.add(header);

    // Count text
    this.intelCountText = this.add.text(120, 6, '0/' + intelKeys.length, {
      fontSize: '11px',
      color: '#8d6e63',
      fontFamily: 'Arial'
    });
    this.intelTrackerContainer.add(this.intelCountText);

    // Intel items (each starts as locked/unknown)
    this.intelItemTexts = {};
    intelKeys.forEach((intel, i) => {
      const y = 28 + i * 22;

      // Check if already seen or used (in case scene is reopened)
      let displayText = '\uD83D\uDD12 ???';
      let displayColor = '#999999';
      if (gameState.intelUsed.has(intel.key)) {
        displayText = `\u2705 ${intel.description}`;
        displayColor = '#2e7d32';
      } else if (gameState.intelSeen.has(intel.key)) {
        displayText = `\uD83D\uDC41 ${intel.description}`;
        displayColor = '#5d4037';
      }

      const text = this.add.text(8, y, displayText, {
        fontSize: '11px',
        color: displayColor,
        fontFamily: 'Arial'
      });
      this.intelTrackerContainer.add(text);
      this.intelItemTexts[intel.key] = text;
    });

    this.intelTrackerContainer.setDepth(50);

    // Update initial count
    this._updateIntelCount();

    // Listen for intel events from GameState
    gameState.on('intel_seen', this._onIntelSeen, this);
    gameState.on('intel_used', this._onIntelUsed, this);
  }

  _onIntelSeen(key) {
    const intel = this.friendbookData.intelKeys.find(i => i.key === key);
    if (!intel) return;

    const text = this.intelItemTexts[key];
    if (text && !gameState.intelUsed.has(key)) {
      text.setText(`\uD83D\uDC41 ${intel.description}`);
      text.setColor('#5d4037');
    }
    this._updateIntelCount();
  }

  _onIntelUsed(key) {
    const intel = this.friendbookData.intelKeys.find(i => i.key === key);
    if (!intel) return;

    const text = this.intelItemTexts[key];
    if (text) {
      text.setText(`\u2705 ${intel.description}`);
      text.setColor('#2e7d32');
    }
    this._updateIntelCount();
  }

  _updateIntelCount() {
    if (!this.intelCountText) return;
    const seen = gameState.intelSeen.size;
    const total = this.friendbookData.intelKeys.length;
    this.intelCountText.setText(`${seen}/${total}`);
  }

  // =========================================================================
  //  CLOSE
  // =========================================================================

  _close() {
    this.cameras.main.fadeOut(150, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop();
    });
  }

  // =========================================================================
  //  CLEANUP
  // =========================================================================

  shutdown() {
    gameState.off('intel_seen', this._onIntelSeen, this);
    gameState.off('intel_used', this._onIntelUsed, this);
    if (this._scrollListener) {
      this.input.off('wheel', this._scrollListener);
      this._scrollListener = null;
    }
  }
}
