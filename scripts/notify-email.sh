#!/bin/bash

# Email Notification Script for Monetly Task Completion
# Usage: ./scripts/notify-email.sh "Task batch description" "Details"

# Configuration
EMAIL_TO="${NOTIFY_EMAIL:-your@email.com}"  # Set NOTIFY_EMAIL env var or edit here
SUBJECT="$1"
BODY="$2"

# Check if mail command is available
if ! command -v mail &> /dev/null; then
    echo "⚠️  'mail' command not found. Install mailutils:"
    echo "   Ubuntu/Debian: sudo apt-get install mailutils"
    echo "   macOS: brew install mailutils"
    exit 1
fi

# Send email
echo "$BODY" | mail -s "Monetly: $SUBJECT" "$EMAIL_TO"

if [ $? -eq 0 ]; then
    echo "✅ Email notification sent to $EMAIL_TO"
else
    echo "❌ Failed to send email notification"
    exit 1
fi
