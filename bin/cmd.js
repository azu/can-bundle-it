#!/usr/bin/env node

const meow = require("meow");
const { run } = require("../lib/cli");
const cli = meow(`
    Usage
      $ can-bundle-it /path/to/file.js
 
    Options
      --verbose show info/warning/error messages 
 
    Examples
      $ can-bundle-it lib/index.js
      $ can-bundle-it lib/*.js --verbose
`, {
    flags: {
        verbose: {
            type: "boolean"
        }
    },
    autoHelp: true,
    autoVersion: true
});

run({
    filePathList: cli.input,
    verbose: cli.flags.verbose
}).then(() => {
    process.exit(0);
}).catch(() => {
    process.exit(1);
});
