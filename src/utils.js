const fs = require("fs");
const crypto = require("crypto");
const Path = require("path");

const isDirectory = path => fs.statSync(path).isDirectory();
const getDirectories = path =>
    fs.readdirSync(path).map(name => Path.join(path, name)).filter(isDirectory);

const isFile = path => fs.statSync(path).isFile();
const getFiles = path =>
    fs.readdirSync(path).map(name => Path.join(path, name)).filter(isFile);

const getFilesRecursively = (path) => {
    let dirs = getDirectories(path);
    let files = dirs
        .map(dir => getFilesRecursively(dir))
        .reduce((a,b) => a.concat(b), []);
    return files.concat(getFiles(path));
};

function encrypt(hash, key = crypto.randomBytes(32), iv = crypto.randomBytes(16)) {
    try {
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        let encrypted = cipher.update(hash.toString());
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {key: key.toString('hex'), iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
    } catch (e) {
        return e;
    }
}

function decrypt(encrypted, key, iv1) {
    try {
        let iv = Buffer.from(iv1, 'hex');
        let encryptedText = Buffer.from(encrypted, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        return false;
    }
}

module.exports = {
    getFilesRecursively, encrypt, decrypt
}