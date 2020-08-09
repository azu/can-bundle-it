const fs = require("fs");
const path = require("path");
const output = fs.readFileSync(path.join(__dirname, "sample.txt"), "utf-8");
console.log(output);
