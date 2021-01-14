const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const config = require("../../app/src/config.js");

const walkPath = "../app/public/cms";

// These are the sizes we want to resize our original images to

const { sizes } = config;

function walk(dir, done) {
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
}

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
