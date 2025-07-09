#!/bin/sh
# Cross-platform (bash/sh) pre-run script to set DECRYPT_SECRET for test sessions
# Usage: source ./set-decrypt-secret.sh "your_secret_here"

if [ -z "$1" ]; then
  echo "Usage: source ./set-decrypt-secret.sh \"your_secret_here\""
  return 1 2>/dev/null || exit 1
fi

export DECRYPT_SECRET="$1"
echo "DECRYPT_SECRET set for this shell session."
echo "You can now run your test commands in this window."
