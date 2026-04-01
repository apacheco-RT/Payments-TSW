#!/bin/bash
set -e

# @ds-foundation/tokens is hosted on GitHub Packages and requires authentication.
# @ds-foundation/react is vendored locally (vendor/ directory) — no auth needed for it.
#
# Replit setup:
#   1. Go to Secrets tab in your Replit project
#   2. Add: NODE_AUTH_TOKEN = <GitHub PAT with read:packages scope>
#   3. Get token at: https://github.com/settings/tokens (select read:packages)
if [ -z "$NODE_AUTH_TOKEN" ]; then
  echo "⚠️  NODE_AUTH_TOKEN is not set. Add it in Replit → Secrets."
  echo "    Without it, @ds-foundation/tokens cannot be installed from GitHub Packages."
  echo "    Get the token from: https://github.com/settings/tokens (read:packages scope)"
  exit 1
fi

npm install --legacy-peer-deps
