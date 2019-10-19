const fs = require("fs");
const path = require("path");
const output = fs.readFileSync(path.join(__dirname, "sample.txxt"), "utf-8");
console.log(output);
