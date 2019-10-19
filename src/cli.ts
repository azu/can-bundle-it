import { canBundleIt } from "./can-bundle-it";

export interface CliOptions {
    filePathList: string[];
    verbose: boolean;
}

export const run = async (options: CliOptions) => {
    const promises = options.filePathList.map(filePath => {
        return canBundleIt({
            filePath,
            verbose: options.verbose
        });
    });
    return Promise.all(promises);
};
