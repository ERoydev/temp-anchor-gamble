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
exports.airdropIfNeeded = airdropIfNeeded;
const web3_js_1 = require("@solana/web3.js");
const connection_1 = require("./connection");
function airdropIfNeeded(pubkey) {
    return __awaiter(this, void 0, void 0, function* () {
        const bal = yield connection_1.connection.getBalance(pubkey);
        if (bal < (1.5 * web3_js_1.LAMPORTS_PER_SOL)) {
            const signature = yield connection_1.connection.requestAirdrop(pubkey, 2 * web3_js_1.LAMPORTS_PER_SOL);
            const { blockhash, lastValidBlockHeight } = yield (0, connection_1.getConnectionBlock)();
            yield connection_1.connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight,
            }, 'confirmed');
        }
    });
}
