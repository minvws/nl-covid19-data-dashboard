#!/bin/bash
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == *"lokalise-"* ]]; then
  echo "🛑 - Canceling build, Lokalise previews aren't useful."
  exit 1;

else
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 0;
fi
