const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const walkPath = "../app/public/cms";

// These are the sizes we want to resize our original images to
const sizes = [320, 640, 768, 1024, 1280, 1536, 2048];

const walk = function (dir, done) {
  fs.readdir(dir, function (error, list) {
    if (error) {
      return done(error);
    }

    var i = 0;

    (function next() {
      var file = list[i++];

      if (!file) {
        return done(null);
      }

      file = dir + "/" + file;

      fs.stat(file, function (error, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (error) {
            next();
          });
        } else {
          // do stuff to file here

          const ext = path.extname(file);
          const filename = path
            .basename(file)
            .split(".")
            .slice(0, -1)
            .join(".");
          console.log(`Now resizing: ${file}`);

          sizes.forEach((size) => {
            const output = `../app/public/cms/${filename}-${size}${ext}`;
            sharp(file)
              .resize({ width: size, withoutEnlargement: true })
              .toFile(output);
          });

          next();
        }
      });
    })();
  });
};

// optional command line params
//      source for walk path
process.argv.forEach(function (val, index, array) {
  if (val.indexOf("source") !== -1) {
    walkPath = val.split("=")[1];
  }
});

console.log("-------------------------------------------------------------");
console.log(`We're going to resize images in ${walkPath}...`);
console.log("-------------------------------------------------------------");

// Walk through the sanity image directory and report
// that we're done or throw an error
walk(walkPath, function (error) {
  if (error) {
    throw error;
  } else {
    console.log(
      "-------------------------------------------------------------"
    );
    console.log("All done!");
    console.log(
      "-------------------------------------------------------------"
    );
  }
});
