"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigPda = getConfigPda;
exports.getRewardPoolPda = getRewardPoolPda;
exports.getCounterPda = getCounterPda;
exports.getStoragePda = getStoragePda;
const web3_js_1 = require("@solana/web3.js");
const anchor_gamble_1 = require("../../clients/js/generated/anchor_gamble");
const vladi_counter_1 = require("../../clients/js/generated/vladi_counter");
function getConfigPda(programId = new web3_js_1.PublicKey(anchor_gamble_1.ANCHOR_GAMBLE_PROGRAM_ADDRESS)) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('config')], programId)[0];
}
function getRewardPoolPda(programId = new web3_js_1.PublicKey(anchor_gamble_1.ANCHOR_GAMBLE_PROGRAM_ADDRESS)) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('reward_pool')], programId)[0];
}
function getCounterPda(programId = new web3_js_1.PublicKey(vladi_counter_1.COUNTER_PROGRAM_ADDRESS)) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('counter')], programId)[0];
}
function getStoragePda(programId = new web3_js_1.PublicKey(vladi_counter_1.COUNTER_PROGRAM_ADDRESS)) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('storage')], programId)[0];
}
