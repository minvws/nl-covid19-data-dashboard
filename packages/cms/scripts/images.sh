# Start with a clean slate
rm *.tar.gz
rm -rf export development-export-*
rm -rf ../app/public/sanity

# Download the data and unzip it in a predictable folder
sanity dataset export development development.tar.gz --overwrite
tar -xzf *.gz 
mv development-export* export

cd export/images

# Rename sha1-widthxheight.extension to sha1.extension
for f in *; do mv "$f" "`echo $f | sed s/\-[0-9]*x[0-9]*//g`"; done;
# Output resized images using imagemagick: $f.ext => $f-width.ext.
# Demo = resize to 300px wide.
# for f in *; do convert "$f" -resize 300x "`echo $f | sed 's|\.|\-300\.|g'`"; done;
# Put images in the public images folder of application.
mkdir ../../../app/public/sanity
mv * ../../../app/public/sanity
