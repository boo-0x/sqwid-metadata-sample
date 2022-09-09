const fs = require("fs");
const { stringify } = require("csv-stringify/sync");

const PATH_OUT = "./metadata.csv";
const NUM_ITEMS = 99;

/**
 * Generates an object with the 3 required fields and 3 optional properties.
 */
function generateObject(i) {
  return {
    name: `Sqwid #${i}`, // required
    description: `Cute Sqwid number ${i}`, // required, but can be empty
    filename: `sqwid-${i.toString().padStart(4, "0")}.png`, // required
    prop_one: "Foo", // optional, it can be named anything
    prop_two: "true", // optional, it can be named anything
    prop_three: Math.floor(Math.random() * 100), // optional, it can be named anything
  };
}

function main() {
  const metadataJson = [];
  for (var i = 0; i < NUM_ITEMS; i++) {
    metadataJson.push(generateObject(i + 1));
  }

  const metadataCsv = stringify(metadataJson, { header: true });

  fs.writeFile(PATH_OUT, metadataCsv, "utf8", function (err) {
    if (err) {
      console.log("An error occured while creating CSV file.");
    } else {
      console.log("CSV file has been generated.");
    }
  });
}

main();
