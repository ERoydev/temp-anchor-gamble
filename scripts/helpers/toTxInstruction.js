"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTxInstruction = toTxInstruction;
const web3_js_1 = require("@solana/web3.js");
function toTxInstruction(ix, opts = {}) {
    const keys = ix.accounts.map((acc, idx) => {
        let pubkey;
        if (typeof acc.address === 'string') {
            pubkey = new web3_js_1.PublicKey(acc.address);
        }
        else if (acc.address instanceof web3_js_1.PublicKey) {
            pubkey = acc.address;
        }
        else if (acc.address && acc.address.publicKey) {
            pubkey = acc.address.publicKey;
        }
        else {
            throw new Error(`Unknown account address type: ${acc.address}`);
        }
        let isSigner = false;
        let isWritable = !!acc.isWritable || acc.role === 1;
        if (pubkey.toBase58() === '11111111111111111111111111111111') {
            isSigner = false;
            isWritable = false;
        }
        if (opts.adminPubkey && pubkey.equals(opts.adminPubkey)) {
            isSigner = true;
            isWritable = true;
        }
        if (opts.userPubkey && pubkey.equals(opts.userPubkey)) {
            isSigner = true;
            isWritable = true;
        }
        return { pubkey, isSigner, isWritable };
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: new web3_js_1.PublicKey(ix.programAddress),
        data: Buffer.from(ix.data),
    });
}
