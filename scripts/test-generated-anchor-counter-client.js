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
const connection_1 = require("./helpers/connection");
const keypair_1 = require("./helpers/keypair");
const airdrop_1 = require("./helpers/airdrop");
const web3_js_2 = require("@solana/web3.js");
const anchor_counter_1 = require("../clients/js/generated/anchor_counter");
const kit_1 = require("@solana/kit");
const anchor_counter_2 = require("../clients/js/generated/anchor_counter");
const toTxInstruction_1 = require("./helpers/toTxInstruction");
const pkToStr = (key) => key.toBase58();
(() => __awaiter(void 0, void 0, void 0, function* () {
    const programId = new web3_js_1.PublicKey(anchor_counter_2.COUNTER_PROGRAM_ADDRESS);
    const payer = (0, keypair_1.loadOrCreateKeypair)((0, keypair_1.keypairPath)('payer'));
    const counterSeed = new Uint8Array(Buffer.from('counter'));
    const [counterPda] = web3_js_1.PublicKey.findProgramAddressSync([counterSeed], programId);
    yield (0, airdrop_1.airdropIfNeeded)(payer.publicKey);
    const info = yield connection_1.connection.getAccountInfo(counterPda);
    if (!info) {
        console.log('Initializing counter...');
        const ixRaw = yield anchor_counter_1.getInitializeInstruction({
            payer: pkToStr(payer.publicKey),
            counter: pkToStr(counterPda),
            initialValue: BigInt(42),
        });
        const ix = (0, toTxInstruction_1.toTxInstruction)(ixRaw, { adminPubkey: payer.publicKey });
        const tx = new web3_js_1.Transaction().add(ix);
        const sig = yield (0, web3_js_2.sendAndConfirmTransaction)(connection_1.connection, tx, [payer]);
        console.log('Initialized. Tx:', sig);
    }
    else {
        console.log('Counter already exists.');
    }
    console.log('Incrementing counter...');
    const ixIncRaw = yield anchor_counter_1.getIncrementInstruction({
        counter: pkToStr(counterPda),
        payer: pkToStr(payer.publicKey),
    });
    const ixInc = (0, toTxInstruction_1.toTxInstruction)(ixIncRaw, { userPubkey: payer.publicKey });
    const txInc = new web3_js_1.Transaction().add(ixInc);
    const sigInc = yield (0, web3_js_2.sendAndConfirmTransaction)(connection_1.connection, txInc, [payer]);
    console.log('Incremented. Tx:', sigInc);
    const counterState = yield (0, anchor_counter_1.fetchCounter)(connection_1.rpcConnection, (0, kit_1.address)(pkToStr(counterPda)));
    console.log('Counter value is:', counterState.data.value.toString());
}))();
