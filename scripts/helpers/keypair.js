"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keypairPath = keypairPath;
exports.loadOrCreateKeypair = loadOrCreateKeypair;
const web3_js_1 = require("@solana/web3.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function keypairPath(name) {
    return path_1.default.resolve(__dirname, `../../.${name}.json`);
}
function loadOrCreateKeypair(file) {
    if (fs_1.default.existsSync(file)) {
        return web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs_1.default.readFileSync(file, 'utf-8'))));
    }
    const kp = web3_js_1.Keypair.generate();
    fs_1.default.writeFileSync(file, JSON.stringify(Array.from(kp.secretKey)));
    return kp;
}
