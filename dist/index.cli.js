const fs = require('fs');
const {version} = require("../package.json");
const {program} = require("commander");
const crypto = require("crypto");
const { check, hashSave, hashFile, hashSaveDir, checkDir } = require("../src/index");

program.version(version, "-v, --vers", "Check the current version.");

program
    .command("check <file> <key> <iv>")
    .description("Check the integrity of a file.")
    .action((file, key, iv) => {
        let stats = fs.statSync(file);

        if (stats.isDirectory()) {
            console.log(
                checkDir(file, key, iv, true) ? "Integrity check passed." : "Integrity check failed."
            );
        } else {
            if (!file.endsWith(".js")) return console.log("Must be a JavaScript file.");

            console.log(
                check(file, key, iv) ? "Integrity check passed." : "Integrity check failed."
            );
        }
    });

program
    .command("hash <file>")
    .description("Get the hash value of a file.")
    .action((file) => {
        console.log(`The hash of "${file}" is: ` + hashFile(file));
    });

program
    .command("genkeys")
    .description("Generate keys for hash encryption.")
    .action(() => {
        console.log(`Key: ${crypto.randomBytes(32).toString("hex")}\nIV: ${crypto.randomBytes(16).toString("hex")}`)
    });

program
    .command("save <file> [key] [iv]")
    .description("Save the file's hash for a integrity check.")
    .action((file, key, iv) => {
        let stats = fs.statSync(file);

        if (stats.isDirectory()) {
            let hashInfo = hashSaveDir(file, key, iv, true);

            console.log(
                hashInfo ? `Integrity save successful. Encryption - Key | IV: ${hashInfo.key} | ${hashInfo.IV}` : "Integrity save failed."
            );

            if (!hashInfo) return;

            console.log(
                checkDir(file, hashInfo.key, hashInfo.IV, true) ? "Integrity check passed." : "Integrity check failed."
            );
        } else {
            if (!file.endsWith(".js")) return console.log("Must be a JavaScript file.");

            let hashInfo = hashSave(file, key, iv);

            console.log(
                hashInfo ? `Integrity save successful. Encryption - Key | IV: ${hashInfo.key} | ${hashInfo.IV}` : "Integrity save failed."
            );

            if (!hashInfo) return;

            console.log(
                check(file, hashInfo.key, hashInfo.IV) ? "Integrity check passed." : "Integrity check failed."
            );
        }
    });

program.parse(process.argv);