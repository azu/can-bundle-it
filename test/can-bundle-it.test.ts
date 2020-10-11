import * as fs from "fs";
import * as path from "path";
import { canBundleIt } from "../src/can-bundle-it";
import * as assert from "assert";

const fixturesDir = path.join(__dirname, "fixtures");
describe('can-bundle-it', function () {
    describe('ok', function () {
        fs.readdirSync(fixturesDir)
            .filter(name => {
                return name.startsWith("ok.");
            })
            .map(caseName => {
                const normalizedTestName = caseName.replace(/-/g, " ");
                it(`Test ${normalizedTestName}`, async function () {
                    const fixtureDir = path.join(fixturesDir, caseName);
                    const actualFilePath = path.join(fixtureDir, "index.js");
                    const optionsFilePath = path.join(fixtureDir, "options.json");
                    const options = fs.existsSync(optionsFilePath) ? JSON.parse(fs.readFileSync(optionsFilePath, "utf-8")) : {}
                    return canBundleIt({
                        filePath: actualFilePath,
                        verbose: true,
                        target: "web",
                        ...options
                    });
                });
            })
    });
    describe('ng', function () {
        fs.readdirSync(fixturesDir)
            .filter(name => {
                return name.startsWith("ng.");
            })
            .map(caseName => {
                const normalizedTestName = caseName.replace(/-/g, " ");
                it(`Test ${normalizedTestName}`, async function () {
                    const fixtureDir = path.join(fixturesDir, caseName);
                    const actualFilePath = path.join(fixtureDir, "index.js");
                    const optionsFilePath = path.join(fixtureDir, "options.json");
                    const options = fs.existsSync(optionsFilePath) ? JSON.parse(fs.readFileSync(optionsFilePath, "utf-8")) : {}
                    return assert.rejects(() => canBundleIt({
                        filePath: actualFilePath,
                        target: "web",
                        ...options
                    }));
                });
            })
    });
});

