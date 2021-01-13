# Start with a clean slate
rm *.tar.gz
rm -rf export production-export-*
rm -rf ../app/public/sanity

# Download the data and unzip it in a predictable folder
sanity dataset export production production.tar.gz --overwrite
tar -xzf *.gz 
mv production-export* export

# Rename sha1-widthxheight.extension to sha1.extension
cd export/images
for f in *; do mv "$f" "`echo $f | sed s/\-[0-9]*x[0-9]*//g`"; done;

# Put images in the public images folder of application.
mkdir ../../../app/public/sanity
mv * ../../../app/public/sanity
