#!/bin/bash
MESHY_API_KEY="msy_Mkc6SNdgYujwSaFhdCFN7d9EBVkpiA1x9rqI"
ASSETS_DIR="$(dirname "$0")/../public/assets"

PHONE_B64=$(base64 -w 0 "$ASSETS_DIR/office_v3/phone.png")
MONITOR_B64=$(base64 -w 0 "$ASSETS_DIR/office_v3/main_monitor.png")
COFFEE_B64=$(base64 -w 0 "$ASSETS_DIR/office_v2/coffee_mug.png")

PAYLOAD_FILE=$(mktemp)
cat > "$PAYLOAD_FILE" <<JSONEOF
{
  "ai_model": "nano-banana",
  "prompt": "wide rectangular digital desk alarm clock seen from above at about 20 degrees looking down, symmetrical left-right, the top surface of the clock is clearly visible as a dark flat plane, the front face shows a large blank pale LCD screen with no numbers no text no digits, the clock is wider than tall like a brick shape, dark black plastic body with rounded corners and small feet, centered in the image, solid bright magenta pink background, hand-painted dark grimy cartoon illustration style matching the reference objects",
  "reference_image_urls": [
    "data:image/png;base64,$PHONE_B64",
    "data:image/png;base64,$MONITOR_B64",
    "data:image/png;base64,$COFFEE_B64"
  ]
}
JSONEOF

echo "Submitting..."
RESPONSE=$(curl -s -X POST https://api.meshy.ai/openapi/v1/image-to-image \
  -H "Authorization: Bearer $MESHY_API_KEY" \
  -H "Content-Type: application/json" \
  -d @"$PAYLOAD_FILE")
rm -f "$PAYLOAD_FILE"

TASK_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'])" 2>/dev/null)
if [ -z "$TASK_ID" ]; then echo "Failed: $RESPONSE"; exit 1; fi
echo "Task ID: $TASK_ID"

while true; do
  sleep 5
  STATUS_RESP=$(curl -s "https://api.meshy.ai/openapi/v1/image-to-image/$TASK_ID" \
    -H "Authorization: Bearer $MESHY_API_KEY")
  STATE=$(echo "$STATUS_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])" 2>/dev/null)
  PROGRESS=$(echo "$STATUS_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('progress',0))" 2>/dev/null)
  echo "Status: $STATE ($PROGRESS%)"
  if [ "$STATE" = "SUCCEEDED" ]; then
    URL=$(echo "$STATUS_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['image_urls'][0])" 2>/dev/null)
    curl -s -o "$ASSETS_DIR/office_v3/digital_clock.png" "$URL"
    echo "Done"
    break
  elif [ "$STATE" = "FAILED" ]; then
    echo "FAILED"; echo "$STATUS_RESP"; exit 1
  fi
done
