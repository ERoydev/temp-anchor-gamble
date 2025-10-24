import { PublicKey, Transaction } from '@solana/web3.js';
import {
    connection,
    rpcConnection,
} from './helpers/connection';
import { loadOrCreateKeypair, keypairPath } from './helpers/keypair';
import { airdropIfNeeded } from './helpers/airdrop';
import { sendAndConfirmTransaction } from '@solana/web3.js';

import {
    getInitializeInstruction,
    getIncrementInstruction,
    fetchCounter,
} from '../clients/js/generated/anchor_counter';

import {
    address,
} from '@solana/kit';

import { COUNTER_PROGRAM_ADDRESS } from '../clients/js/generated/anchor_counter';
import { toTxInstruction } from './helpers/toTxInstruction';

const pkToStr = (key: PublicKey): string => key.toBase58();

(async () => {
    const programId = new PublicKey(COUNTER_PROGRAM_ADDRESS);
    const payer = loadOrCreateKeypair(keypairPath('payer'));

    const counterSeed = new Uint8Array(Buffer.from('counter'));
    const [counterPda] = PublicKey.findProgramAddressSync([counterSeed], programId);

    await airdropIfNeeded(payer.publicKey);

    const info = await connection.getAccountInfo(counterPda);

    if (!info) {
        console.log('Initializing counter...');

        const ixRaw = await (getInitializeInstruction as any)({
            payer: pkToStr(payer.publicKey),
            counter: pkToStr(counterPda),
            initialValue: BigInt(42),
        });

        const ix = toTxInstruction(ixRaw, { adminPubkey: payer.publicKey });

        const tx = new Transaction().add(ix);
        const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
        console.log('Initialized. Tx:', sig);
    } else {
        console.log('Counter already exists.');
    }

    console.log('Incrementing counter...');

    const ixIncRaw = await (getIncrementInstruction as any)({
        counter: pkToStr(counterPda),
        payer: pkToStr(payer.publicKey),
    });

    const ixInc = toTxInstruction(ixIncRaw, { userPubkey: payer.publicKey });

    const txInc = new Transaction().add(ixInc);
    const sigInc = await sendAndConfirmTransaction(connection, txInc, [payer]);

    console.log('Incremented. Tx:', sigInc);
    const counterState = await fetchCounter(rpcConnection, address(pkToStr(counterPda)));
    console.log('Counter value is:', counterState.data.value.toString());
})();
