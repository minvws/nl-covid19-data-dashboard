#!/bin/bash
start=`date +%s`
set -e # Any subsequent(*) commands which fail will cause the shell script to exit immediately

# Zip JSON files so the data is included in the build.
cd packages/app/public/ && zip -qq latest-data.zip json/* && mv latest-data.zip json/ &&cd ../../../

# Prepare the export folders
rm -rf ./exports
mkdir -p exports/nl
mkdir -p exports/en

# Install dependencies
yarn
yarn workspace @corona-dashboard/common build

# Validate data
yarn workspace @corona-dashboard/cli validate-json
yarn workspace @corona-dashboard/cli validate-last-values

# Prepare types and assets
yarn workspace @corona-dashboard/cli generate-typescript
yarn workspace @corona-dashboard/cms sync-assets

# Build the Dutch application and move to export folder
export NEXT_PUBLIC_LOCALE="nl"
yarn workspace @corona-dashboard/app build
yarn workspace @corona-dashboard/app export
mv packages/app/out/ exports/nl

# Do the same thing again for EN build
rm -rf packages/app/out
export NEXT_PUBLIC_LOCALE="en"
yarn workspace @corona-dashboard/app build
yarn workspace @corona-dashboard/app export
mv packages/app/out/ exports/en

# Done
end=`date +%s`
runtime=$((end-start))
echo "Build executed in $runtime seconds, proceed to build Dockerfile."

# Now you need to copy .exports/ to the Nginx folder.
# The Dockerfile will take care of this