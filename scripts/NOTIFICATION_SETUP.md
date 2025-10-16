# Global Email Notification Setup

This guide helps you set up email notifications that work across ALL your projects.

## Option 1: Global npm Package (Recommended)

### Step 1: Create global notification script
```bash
# Create directory for global scripts
mkdir -p ~/.local/bin

# Copy the notification script
cp scripts/notify-email.js ~/.local/bin/notify-task
chmod +x ~/.local/bin/notify-task
```

### Step 2: Install nodemailer globally
```bash
npm install -g nodemailer
```

### Step 3: Configure email credentials
Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Email Notification Configuration
export EMAIL_SERVICE="gmail"              # or "outlook", "yahoo"
export EMAIL_USER="your@gmail.com"        # Your email
export EMAIL_PASS="your-app-password"     # App-specific password
export EMAIL_TO="your@gmail.com"          # Recipient (can be same)

# Add to PATH
export PATH="$HOME/.local/bin:$PATH"
```

Then reload:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

### Step 4: Get Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and your device
3. Copy the 16-character password
4. Use that as `EMAIL_PASS`

### Step 5: Test it
```bash
notify-task "Test" "This is a test notification"
```

---

## Option 2: Simple curl with Mailgun/SendGrid (No dependencies)

### Setup Mailgun (Free tier: 5,000 emails/month)

1. Sign up: https://www.mailgun.com/
2. Get API key from dashboard
3. Add to `~/.bashrc`:

```bash
export MAILGUN_API_KEY="your-api-key"
export MAILGUN_DOMAIN="your-domain.mailgun.org"
export EMAIL_TO="your@email.com"
```

4. Create global script:

```bash
# ~/.local/bin/notify-task
#!/bin/bash
SUBJECT="$1"
BODY="$2"

curl -s --user "api:$MAILGUN_API_KEY" \
  https://api.mailgun.net/v3/$MAILGUN_DOMAIN/messages \
  -F from="Monetly Bot <noreply@$MAILGUN_DOMAIN>" \
  -F to="$EMAIL_TO" \
  -F subject="$SUBJECT" \
  -F text="$BODY"

echo "✅ Email sent via Mailgun"
```

---

## Option 3: Desktop Notifications (No email)

For local-only notifications without email:

```bash
# Install node-notifier globally
npm install -g node-notifier-cli

# Create alias in ~/.bashrc
alias notify-task='notify -t "Monetly" -m'

# Usage
notify-task "Tasks completed!"
```

---

## Usage in Any Project

Once set up globally, use from any project:

```bash
# After completing tasks
notify-task "Security Fixes Complete" "
✅ CSV injection fixed
✅ ID generation secured
✅ Input sanitization added
✅ CSP headers configured

Ready for review!
"
```

### Integrate with git hooks

Add to any project's `.git/hooks/post-commit`:

```bash
#!/bin/bash
COMMIT_MSG=$(git log -1 --pretty=%B)
notify-task "Commit Complete" "New commit: $COMMIT_MSG"
```

### Integrate with npm scripts

Add to any `package.json`:

```json
{
  "scripts": {
    "build": "next build",
    "build:notify": "npm run build && notify-task 'Build Complete' 'Production build succeeded'"
  }
}
```

---

## Recommended Setup for You

Since you use Claude Code across multiple projects:

1. **Use Option 1 (nodemailer)** - Most reliable, works offline
2. **Set up once in `~/.bashrc`** - Works everywhere
3. **Create alias**: `alias task-done='notify-task'`
4. **Test**: `task-done "Test" "Hello from terminal"`

Then in ANY Claude Code session, I can run:
```bash
task-done "Monetly Phase 1 Complete" "Security + Mobile fixes done!"
```

---

## Quick Setup Commands

Run these to set up RIGHT NOW:

```bash
# 1. Create global bin directory
mkdir -p ~/.local/bin

# 2. Install nodemailer globally
npm install -g nodemailer

# 3. Copy script and make executable
cp ~/Desktop/expense-tracker-ai/scripts/notify-email.js ~/.local/bin/notify-task
chmod +x ~/.local/bin/notify-task

# 4. Add to PATH (choose your shell)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 5. Configure email (edit with your details)
echo 'export EMAIL_SERVICE="gmail"' >> ~/.bashrc
echo 'export EMAIL_USER="your@gmail.com"' >> ~/.bashrc
echo 'export EMAIL_PASS="your-app-password"' >> ~/.bashrc
source ~/.bashrc

# 6. Test
notify-task "Setup Complete" "Global notifications are working!"
```

---

## For This Session

For now, I'll run at the end:
```bash
node scripts/notify-email.js "Monetly Batch 1 Complete" "
✅ Security fixes
✅ WOW factor improvements
✅ Mobile optimizations

Ready to review and test!
"
```

But once you set up globally, I can just use:
```bash
notify-task "Tasks Done" "Details here"
```

From ANY project, ANY session!
