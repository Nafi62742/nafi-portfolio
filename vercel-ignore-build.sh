#!/bin/bash

# Vercel Ignored Build Step Script
# Determines whether Vercel should proceed with compiling this push.
#
# Return Code 1: Build proceeds
# Return Code 0: Build is skipped / ignored

echo "Checking deployment branch..."
echo "Current branch: $VERCEL_GIT_COMMIT_REF"

if [ "$VERCEL_GIT_COMMIT_REF" = "live" ]; then
  echo "✅ Target branch is 'live'. Proceeding with build."
  exit 1
else
  echo "🛑 Target branch is '$VERCEL_GIT_COMMIT_REF' (not 'live'). Skipping build."
  exit 0
fi
