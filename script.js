const fs = require("fs");
const { stringify } = require("csv-stringify/sync");
const archiver = require('archiver');

const IMAGES_DIR_PATH = './images/';
const METADATA_FILE_NAME = 'metadata.csv';

/**
 * Generates an object with the 3 required fields and 3 optional properties.
 */
function generateObject(i, fileName) {
  return {
    name: `Sqwid #${i}`, // required
    description: `Cute Sqwid number ${i}`, // required, but can be empty
    filename: fileName, // required
    prop_one: "Foo", // optional, it can be named anything
    prop_two: "true", // optional, it can be named anything
    prop_three: Math.floor(Math.random() * 100), // optional, it can be named anything
  };
}

function zipFiles(metadataCsv, jpegs) {
  var output = fs.createWriteStream('sqwidAppUpload.zip');
  var archive = archiver('zip');

  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.on('error', function(err){
    throw err;
  });

  archive.pipe(output);

// append files from a sub-directory, putting its contents at the root of archive
  archive.directory(IMAGES_DIR_PATH, false);
  archive.file(METADATA_FILE_NAME, { name: METADATA_FILE_NAME });

  archive.finalize();
}

function main() {
  const jpegs = fs.readdirSync(IMAGES_DIR_PATH).filter(file => file.endsWith('.jpg'));
  const metadataJson = jpegs.map((file, i) => generateObject(i, file));
  console.log("file len=",metadataJson.length);

  const metadataCsv = stringify(metadataJson, { header: true });

  fs.writeFile(METADATA_FILE_NAME, metadataCsv, "utf8", function (err) {
    if (err) {
      console.log("An error occured while creating CSV file.");
    } else {
      console.log("CSV file has been generated.");
    }
  });

  zipFiles(metadataCsv, jpegs);
}

main();
