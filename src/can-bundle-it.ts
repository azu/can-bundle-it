import webpack from "webpack";

import tempfile from "tempfile";
import * as fs from "fs";

export interface CanBundleItOptions {
    filePath: string;
    verbose?: boolean;
    target: webpack.Configuration["target"];
    fs?: boolean;
}

interface WebpackConfig {
    filePath: string;
    outputTempFilePath: string;
    target: webpack.Configuration["target"];
    fs?: boolean;
}

export const validTarget = (target: unknown): target is webpack.Configuration["target"] => {
    return typeof target === "string";
}

export const createWebpackConfig = ({filePath, outputTempFilePath, target, fs}: WebpackConfig): webpack.Configuration => {
    return {
        mode: 'development',
        entry: filePath,
        output: {
            path: outputTempFilePath
        },
        target,
        // Disable fs in target:web
        node: fs === false
            ? {
                fs: "empty"
            }
            : {}
    };
};

export const canBundleIt = (options: CanBundleItOptions): Promise<void> => {
    const outputFilePath = tempfile(".js");
    return new Promise<void>((resolve, reject) => {
        const config = createWebpackConfig({
            filePath: options.filePath,
            outputTempFilePath: outputFilePath,
            target: options.target,
            fs: options.fs
        });
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
