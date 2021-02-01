#!/usr/bin/env bash
set -e

CWD=$(pwd)
EXPORT_DIR="$CWD/export"
TARGET_DIR="$CWD/../app/public/cms"

# Start with a clean slate
rm -rf "$EXPORT_DIR"
rm -rf "$TARGET_DIR"

# Ensure directories exist
mkdir -p "$EXPORT_DIR"
mkdir -p "$TARGET_DIR"

# Download the data and unzip it in a predictable folder
sanity dataset export "$SANITY_DATASET" "$EXPORT_DIR/__export.tar.gz"
tar -xzf "$EXPORT_DIR/__export.tar.gz" -C "$EXPORT_DIR" --strip-components=1

# Rename sha1-{width}x{height}.extension to sha1.extension
for f in $EXPORT_DIR/images/*
do mv "$f" "`echo $f | sed s/\-[0-9]*x[0-9]*//g`"
done

# Put images in the public images folder of application.
cp -r "$EXPORT_DIR/images" "$TARGET_DIR/images";

# Optionally move files-directory
if [ -d "$EXPORT_DIR/files" ]
then
  cp -r "$EXPORT_DIR/files" "$TARGET_DIR/files"
else
  echo "No files to move"
fi
