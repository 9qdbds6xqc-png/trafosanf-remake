#!/bin/bash

# Script to add OpenAI API Key to GitHub Secrets
# Make sure you're authenticated: gh auth login

echo "Adding VITE_OPENAI_API_KEY to GitHub Secrets..."

gh secret set VITE_OPENAI_API_KEY \
  --repo 9qdbds6xqc-png/trafosanf-remake \
  --body "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"

if [ $? -eq 0 ]; then
  echo "✅ API Key successfully added!"
  echo "🚀 Triggering workflow..."
  gh workflow run deploy.yml --repo 9qdbds6xqc-png/trafosanf-remake
  echo "✅ Done! Check: https://github.com/9qdbds6xqc-png/trafosanf-remake/actions"
else
  echo "❌ Failed. Please authenticate first with: gh auth login"
  echo "Or use the web interface: https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions"
fi

