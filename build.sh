#!/bin/bash
start=`date +%s`
set -e # Any subsequent(*) commands which fail will cause the shell script to exit immediately

# Zip JSON files so the data is included in the build.
cd packages/app/public/ && zip -qq latest-data.zip json/* && mv latest-data.zip json/ && cd -

# Install dependencies
yarn
yarn workspace @corona-dashboard/common build

# Validate data
yarn workspace @corona-dashboard/cli validate-json-all
yarn workspace @corona-dashboard/cli validate-last-values
yarn workspace @corona-dashboard/cli validate-features

# Prepare types and assets
yarn workspace @corona-dashboard/cli generate-typescript
<<<<<<< HEAD
=======
yarn workspace @corona-dashboard/cli generate-sitemap
yarn workspace @corona-dashboard/cms sync-assets
yarn workspace @corona-dashboard/cms lokalize:export

# Build the Dutch application and move to export folder
export NEXT_PUBLIC_LOCALE="nl"
yarn workspace @corona-dashboard/app build
yarn workspace @corona-dashboard/app export
mv packages/app/out/ exports/nl
>>>>>>> 0d7da875c90b6d7d42baeab3ea4e07f39b6e06d7

# Build the application in Docker 

# Done
end=`date +%s`
runtime=$((end-start))
echo "Build executed in $runtime seconds, proceed to build Dockerfile."
