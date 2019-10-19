import webpack from "webpack";

import tempfile from "tempfile";
import * as fs from "fs";

export interface CanBundleItOptions {
    filePath: string;
    verbose?: boolean;
}

export const createWebpackConfig = (filePath: string, outputTempFilePath: string): webpack.Configuration => {
    return {
        mode: 'development',
        entry: filePath,
        output: {
            path: outputTempFilePath
        }
    };
};

export const canBundleIt = (options: CanBundleItOptions) => {
    const outputFilePath = tempfile(".js");
    return new Promise((resolve, reject) => {
        const config = createWebpackConfig(options.filePath, outputFilePath);
        webpack([config], (error: Error & { details?: string; }, stats) => {
            const verbose = options.verbose;
            if (error) {
                if (verbose) {
                    console.error(error.stack || error);
                }
                if (verbose && error.details) {
                    console.error(error.details);
                }
                return reject(error);
            }

            const info = stats.toJson();
            if (stats.hasErrors()) {
                if (verbose) {
                    console.error(info.errors.join("\n"));
                }
                return reject(new Error(info.errors.join("\n")));
            }
            if (verbose && stats.hasWarnings()) {
                console.warn(info.warnings);
            }
            resolve();
        })
    }).finally(() => {
        try {
            fs.unlinkSync(outputFilePath);
        } catch {
            // nope
        }
    });
};
