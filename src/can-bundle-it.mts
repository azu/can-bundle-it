import webpack from "webpack";
import tempfile from "tempfile";
import * as fs from "fs";
// @ts-expect-error
import nodeModules from "node-libs-browser";

// remove null value
const ValidNodeModules = Object.keys(nodeModules).reduce((m, key) => {
    if (nodeModules[key]) {
        m[key] = nodeModules[key];
    }
    return m
}, {} as { [key in keyof typeof nodeModules]: string })
// FIXME: Its hack
const DisableNodeModules = Object.keys(nodeModules).reduce((m, key) => {
    m[key] = "./webpack_does_not_nodejs_core_modules_by_default.js";
    return m
}, {} as { [key in keyof typeof nodeModules]: string })

export interface CanBundleItOptions {
    filePath: string;
    verbose?: boolean;
    target: webpack.Configuration["target"];
    nodeFallback?: boolean;
}

interface WebpackConfig {
    filePath: string;
    outputTempFilePath: string;
    target: webpack.Configuration["target"];
    nodeFallback?: boolean;
}

export const validTarget = (target: unknown): target is webpack.Configuration["target"] => {
    return typeof target === "string";
}

export const createWebpackConfig = ({filePath, outputTempFilePath, target, nodeFallback}: WebpackConfig): webpack.Configuration => {
    return {
        mode: 'development',
        entry: filePath,
        output: {
            path: outputTempFilePath
        },
        target,
        ...(nodeFallback ? {
            resolve: {
                fallback: ValidNodeModules
            }
        } : {
            // TODO: We want to just use {}
            // But, webpack 5 polyfill node.js modules automatically when "node-libs-browser" is installed.
            // Force disable these by alias
            resolve: {
                alias: DisableNodeModules
            }
        })
    };
};

type WebpackError = undefined | Error & { details?: string; };
export const canBundleIt = (options: CanBundleItOptions): Promise<void> => {
    // output to {temp}/main.js
    const outputFilePath = tempfile();
    return new Promise<void>((resolve, reject) => {
        const config = createWebpackConfig({
            filePath: options.filePath,
            outputTempFilePath: outputFilePath,
            target: options.target,
            nodeFallback: options.nodeFallback
        });
        webpack([config], (error: WebpackError, stats) => {
            // @ts-ignore
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

            const info = stats?.toJson();
            if (stats?.hasErrors()) {
                if (verbose && info) {
                    console.error(info.errors);
                }
                return reject(error);
            }
            if (verbose && stats?.hasWarnings() && info?.warnings) {
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
