let integrity = require("./dist/index");

let isValid = integrity.hashSaveDir("./test", "696260a18072d97c7a7b3fed7119a4482f4835ac13be2d2db11707d7445ad783", "280c5f857d762e467d9015f20f115d74");

console.log(isValid);