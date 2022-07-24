#!/usr/bin/env node
const cli = await import("../lib/cli.mjs")
cli.run()
    .then(
        ({ exitStatus, stderr, stdout }) => {
            if (stdout) {
                console.log(stdout);
            }
            if (stderr) {
                console.error(stderr);
            }
            process.exit(exitStatus);
        },
        error => {
            console.error(error);
            process.exit(1);
        }
    );
