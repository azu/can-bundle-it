import meow from "meow";
import path from "path";
import { canBundleIt, validTarget } from "./can-bundle-it.js";

export const cli = meow(
    `
    Usage
      $ can-bundle-it /path/to/file.js
 
    Options
      --verbose        Show info/warning/error messages 
      
    Bundle Options
      
      --target              [String]  Bundle target. Available: https://webpack.js.org/configuration/target/
      --node-fallback       [Boolean] enable Node.js modules fallback
                            webpack 5 disable Node.js polyfill by default. This options set node-libs-browser to resolve.fallback.
     
    Examples
      $ can-bundle-it lib/index.js
      $ can-bundle-it lib/*.js --verbose
      # Enable Node.js polyfill like "assert"
      $ can-bundle-it lib/*.js --verbose --node-fallback
`, {
        flags: {
            verbose: {
                type: "boolean"
            },
            target: {
                type: "string",
                default: "web"
            },
            nodeFallback: {
                type: "boolean",
                default: false
            },
        },
        importMeta: import.meta,
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
        const absoluteFilePath = path.resolve(process.cwd(), filePath);
        return canBundleIt({
            filePath: absoluteFilePath,
            verbose: flags.verbose,
            target: target,
            nodeFallback: flags.nodeFallback
        });
    });
    try {
        await Promise.all(promises);
        return {
            exitStatus: 0,
            stderr: null,
            stdout: null
        };
    } catch (error: any) {
        return {
            exitStatus: 1,
            stderr: error,
            stdout: null
        };
    }
};
