set -x
#!/bin/bash

# Set the log file
LOG_FILE="ngrok_log.txt"

# Start ngrok and capture the output
echo "Starting ngrok..." >> $LOG_FILE
ngrok_output=$(ngrok http 3000 2>&1)
echo "Ngrok output: $ngrok_output" >> $LOG_FILE

# Check if ngrok started successfully
if [ $? -ne 0 ]; then
  echo "Error: Unable to start ngrok." >> $LOG_FILE
  exit 1
fi

# Extract the URL from the ngrok output
echo "Extracting URL from ngrok output..." >> $LOG_FILE
NGROK_URL=$(echo "$ngrok_output" | grep "Forwarding" | awk '{print $3}' | sed 's/->//' | awk '{print $1}')
echo "Extracted URL: $NGROK_URL" >> $LOG_FILE

# Check if the URL was extracted successfully
if [ -z "$NGROK_URL" ]; then
  echo "Error: Unable to extract URL from ngrok output." >> $LOG_FILE
  exit 1
fi

# Update the .env file
echo "Updating .env file..." >> $LOG_FILE
sed -i "s|^NGROK_URL=.*|NGROK_URL=https://${NGROK_URL}|" .env
echo "Updated .env file successfully." >> $LOG_FILE