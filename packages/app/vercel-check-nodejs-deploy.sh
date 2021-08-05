#!/bin/bash
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == *"topic/production-on-node"* ]]; then
  echo "✅ - Build can proceed"
  exit 1;

else
  # Cancel the build
  echo "🛑 - Canceling build, static builds are filtered out on this projects."
  exit 0;
fi
