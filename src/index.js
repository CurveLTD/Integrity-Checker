const fs = require("fs");
const utils = require("./utils");
const crypto = require("crypto");

function hashStr(str, seed = 500) {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
        Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
        Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function hashFile(file) {
    let content = fs.readFileSync(file, "utf8");
    let toHash = content.replace(/(\/\*)(.*?)(\*\/)/g, "");

    return hashStr(toHash);
}

function hashSave(file, key, iv) {
    try {
        let content = fs.readFileSync(file, "utf8");

        let savedHash = content.match(/(\/\*)(.*?)(\*\/)/g);
        if (savedHash) content = content.replace(/(\/\*)(.*?)(\*\/)/g, "");

        let hash = utils.encrypt(hashFile(file), key, iv);

        if (hash.message) return console.log(`[File: ${file}] Error: ${hash.message}`), null;

        content += `/* ${hash.encryptedData} */`;
        fs.writeFileSync(file, content);

        return {IV: hash.iv, key: hash.key};
    } catch (err) {
        return null;
    }
}

function check(file, key, IV) {
    let content = fs.readFileSync(file, "utf8");
    let savedHash = content.match(/(?<=\/\* )(.*?)(?= \*\/)/g);

    if (!savedHash) return false;

    let toHash = content.replace(/(\/\*)(.*?)(\*\/)/g, "");

    let hash = hashStr(toHash);
    savedHash = utils.decrypt(savedHash[0].toString(), key, IV);

    return hash.toString() === savedHash;
}

function hashSaveDir(file, key = crypto.randomBytes(32), IV = crypto.randomBytes(16), cli = false) {
    let files = utils.getFilesRecursively(file);
    let invalid = [];

    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        hashSave(file, key, IV) ? "" : invalid.push(file);
    });

    if (cli && invalid.length > 0) {
        console.log("1 or more files have failed saving: ");
        invalid.map(invalid => console.log(`- ${invalid}`));
        return null;
    }

    return {key: key.toString('hex'), IV: IV.toString('hex')};
}

function checkDir(file, key, IV, cli = false) {
    let files = utils.getFilesRecursively(file);
    let invalid = [];

    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        check(file, key, IV) ? "" : invalid.push(file);
    });

    if (cli && invalid.length > 0) {
        console.log("1 or more files have failed the integrity check: ");
        invalid.map(invalid => console.log(`- ${invalid}`));
    }

    return invalid.length <= 0;
}

module.exports = {
    check,
    hashFile,
    hashSave,
    hashSaveDir,
    checkDir
};
