import meow from "meow";
import { canBundleIt, validTarget } from "./can-bundle-it";

export const cli = meow(
    `
    Usage
      $ can-bundle-it /path/to/file.js
 
    Options
      --verbose        Show info/warning/error messages 
      --target         Bundle target. Available: "web"
     
    Examples
      $ can-bundle-it lib/index.js
      $ can-bundle-it lib/*.js --verbose
`, {
        flags: {
            verbose: {
                type: "boolean"
            },
            target: {
                type: "string",
                default: "web"
            }
        },
        autoHelp: true,
        autoVersion: true
    }
);

export const run = async (
    input = cli.input,
    flags = cli.flags
): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    const target = flags.target;
    if (!validTarget(target)) {
        throw new Error(`target: ${target} is not supported`);
    }
    const promises = input.map(filePath => {
        return canBundleIt({
            filePath,
            verbose: flags.verbose,
            target: target,
        });
    });
    try {
        await Promise.all(promises);
        return {
            exitStatus: 0,
            stderr: null,
            stdout: null
        };
    } catch (error) {
        return {
            exitStatus: 1,
            stderr: error,
            stdout: null
        };
    }
};
