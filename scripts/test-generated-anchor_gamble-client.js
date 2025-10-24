"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const keypair_1 = require("./helpers/keypair");
const airdrop_1 = require("./helpers/airdrop");
const pda_1 = require("./helpers/pda");
const initialize_1 = require("../clients/js/generated/anchor_gamble/instructions/initialize");
const gamble_1 = require("../clients/js/generated/anchor_gamble/instructions/gamble");
const setGambleCost_1 = require("../clients/js/generated/anchor_gamble/instructions/setGambleCost");
const anchorGamble_1 = require("../clients/js/generated/anchor_gamble/programs/anchorGamble");
const connection_1 = require("./helpers/connection");
const parseGambleResult_1 = require("./helpers/parseGambleResult");
const toTxInstruction_1 = require("./helpers/toTxInstruction");
const pkToStr = (key) => key.toBase58();
(() => __awaiter(void 0, void 0, void 0, function* () {
    const programId = new web3_js_1.PublicKey(anchorGamble_1.ANCHOR_GAMBLE_PROGRAM_ADDRESS);
    const admin = (0, keypair_1.loadOrCreateKeypair)((0, keypair_1.keypairPath)('admin'));
    const user = (0, keypair_1.loadOrCreateKeypair)((0, keypair_1.keypairPath)('user'));
    const configPda = (0, pda_1.getConfigPda)(programId);
    const rewardPoolPda = (0, pda_1.getRewardPoolPda)(programId);
    yield (0, airdrop_1.airdropIfNeeded)(admin.publicKey);
    yield (0, airdrop_1.airdropIfNeeded)(user.publicKey);
    let adminBal = yield connection_1.connection.getBalance(admin.publicKey);
    let userBal = yield connection_1.connection.getBalance(user.publicKey);
    let rewardBal = yield connection_1.connection.getBalance(rewardPoolPda);
    const configAccount = yield connection_1.connection.getAccountInfo(configPda);
    if (!configAccount) {
        console.log('Config account does NOT exist yet, will initialize.');
    }
    else {
        console.log('Config account already exists, data:', configAccount.data.toString('hex'));
    }
    if (!configAccount) {
        console.log('Initializing program...');
        const gambleCost = BigInt(0.1 * web3_js_1.LAMPORTS_PER_SOL);
        const ixRaw = yield initialize_1.getInitializeInstruction({
            admin: pkToStr(admin.publicKey),
            gambleCost,
            config: pkToStr(configPda),
            rewardPool: pkToStr(rewardPoolPda),
        });
        const ix = (0, toTxInstruction_1.toTxInstruction)(ixRaw, { adminPubkey: admin.publicKey });
        const tx = new web3_js_1.Transaction().add(ix);
        const sig = yield (0, web3_js_1.sendAndConfirmTransaction)(connection_1.connection, tx, [admin]);
        console.log('Initialized. Tx:', sig);
    }
    else {
        console.log('Config already initialized');
    }
    if (rewardBal <= 1 * web3_js_1.LAMPORTS_PER_SOL) {
        console.log('Funding reward pool PDA with 1 SOL...');
        const tx = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
            fromPubkey: admin.publicKey,
            toPubkey: rewardPoolPda,
            lamports: 1 * web3_js_1.LAMPORTS_PER_SOL,
        }));
        const sig = yield (0, web3_js_1.sendAndConfirmTransaction)(connection_1.connection, tx, [admin]);
        console.log('Funded reward pool. Tx:', sig);
    }
    console.log(`Test starts with \n 
        pool PDA balance: ${rewardBal / web3_js_1.LAMPORTS_PER_SOL} SOL, \n
        user balance: ${userBal / web3_js_1.LAMPORTS_PER_SOL} SOL, \n
        admin balance: ${adminBal / web3_js_1.LAMPORTS_PER_SOL} SOL, \n
        `);
    {
        console.log('User is gambling...');
        const ixRaw = yield gamble_1.getGambleInstruction({
            user: pkToStr(user.publicKey),
            config: pkToStr(configPda),
            rewardPool: pkToStr(rewardPoolPda),
        });
        const ix = (0, toTxInstruction_1.toTxInstruction)(ixRaw, { userPubkey: user.publicKey });
        const tx = new web3_js_1.Transaction().add(ix);
        const sig = yield (0, web3_js_1.sendAndConfirmTransaction)(connection_1.connection, tx, [user]);
        console.log('User gambled. Tx:', sig);
        const result = yield (0, parseGambleResult_1.parseGambleResult)(sig);
        if (result === 'win') {
            console.log('Result: User WON!');
        }
        else if (result === 'lose') {
            console.log('Result: User LOST!');
        }
        else {
            console.log('Result: Could not determine from logs.');
        }
    }
    {
        console.log('Admin changing gamble cost...');
        const ixRaw = yield setGambleCost_1.getSetGambleCostInstruction({
            admin: pkToStr(admin.publicKey),
            config: pkToStr(configPda),
            newCost: BigInt(0.2 * web3_js_1.LAMPORTS_PER_SOL),
        });
        const ix = (0, toTxInstruction_1.toTxInstruction)(ixRaw, { adminPubkey: admin.publicKey });
        const tx = new web3_js_1.Transaction().add(ix);
        const sig = yield (0, web3_js_1.sendAndConfirmTransaction)(connection_1.connection, tx, [admin]);
        console.log('Set new gamble cost. Tx:', sig);
    }
    {
        console.log('User gambling again at new cost...');
        const ixRaw = yield gamble_1.getGambleInstruction({
            user: pkToStr(user.publicKey),
            config: pkToStr(configPda),
            rewardPool: pkToStr(rewardPoolPda),
        });
        const ix = (0, toTxInstruction_1.toTxInstruction)(ixRaw, { userPubkey: user.publicKey });
        const tx = new web3_js_1.Transaction().add(ix);
        const sig = yield (0, web3_js_1.sendAndConfirmTransaction)(connection_1.connection, tx, [user]);
        console.log('User gambled (new cost). Tx:', sig);
        const result = yield (0, parseGambleResult_1.parseGambleResult)(sig);
        if (result === 'win') {
            console.log('Result: User WON!');
        }
        else if (result === 'lose') {
            console.log('Result: User LOST!');
        }
        else {
            console.log('Result: Could not determine from logs.');
        }
    }
    adminBal = yield connection_1.connection.getBalance(admin.publicKey);
    userBal = yield connection_1.connection.getBalance(user.publicKey);
    rewardBal = yield connection_1.connection.getBalance(rewardPoolPda);
    console.log(`Test ends with \n 
        pool PDA balance: ${rewardBal / web3_js_1.LAMPORTS_PER_SOL} SOL, \n
        user balance: ${userBal / web3_js_1.LAMPORTS_PER_SOL} SOL, \n
        admin balance: ${adminBal / web3_js_1.LAMPORTS_PER_SOL} SOL, \n
        `);
}))();
