"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
// it will generate random hash for link
function random(len) {
    let options = "qwertyuiopasdfghjklzxcvbnm12345678";
    let length = options.length;
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options[Math.floor((Math.random() * length))];
    }
    return ans;
}
