"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
const random = (len) => {
    const option = "dasjkbdksadjasjdnansjndasadgoasodi";
    const length = option.length;
    let result = "";
    for (let i = 0; i < length; i++) {
        result += option[Math.floor(Math.random() * option.length)];
    }
    return result;
};
exports.random = random;
