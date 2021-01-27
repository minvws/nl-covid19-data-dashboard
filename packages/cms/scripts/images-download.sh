#!/usr/bin/env bash
set -e

# Start with a clean slate
[ -e *.tar.gz ] && rm *.tar.gz
rm -rf export development-export-*
rm -rf ../app/public/cms

# Download the data and unzip it in a predictable folder
sanity dataset export development development.tar.gz --overwrite
tar -xzf *.gz 
mv *-export* export

# Rename sha1-widthxheight.extension to sha1.extension
cd export/images
for f in *; do mv "$f" "`echo $f | sed s/\-[0-9]*x[0-9]*//g`"; done;

# Put images in the public images folder of application.
mkdir ../../../app/public/cms
mv * ../../../app/public/cms
