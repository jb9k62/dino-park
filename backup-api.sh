#!/bin/bash

# Dino Park API Backup Script
# Fetches event data from the API and persists it locally

API_URL="https://5rz6r1it73.execute-api.eu-west-2.amazonaws.com/nudls/feed"
OUTPUT_DIR="API"
OUTPUT_FILE="static API data.json"
OUTPUT_PATH="$OUTPUT_DIR/$OUTPUT_FILE"

# Create API directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Fetching data from Dino Park API..."

# Fetch data with curl and save to file
# -f: Fail silently on HTTP errors
# -s: Silent mode (no progress bar)
# -S: Show errors even in silent mode
# -o: Write output to file
if curl -fsSL "$API_URL" -o "$OUTPUT_PATH"; then
    echo "✓ API data successfully saved to: $OUTPUT_PATH"

    # Show file size for verification
    FILE_SIZE=$(stat -f%z "$OUTPUT_PATH" 2>/dev/null || stat -c%s "$OUTPUT_PATH" 2>/dev/null)
    echo "  File size: $FILE_SIZE bytes"

    # Show timestamp
    echo "  Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "✗ Failed to fetch API data"
    exit 1
fi
