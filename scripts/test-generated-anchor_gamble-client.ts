import {
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';

import { loadOrCreateKeypair, keypairPath } from './helpers/keypair';
import { airdropIfNeeded } from './helpers/airdrop';
import { getConfigPda, getRewardPoolPda } from './helpers/pda';

import { getInitializeInstruction } from '../clients/js/generated/anchor_gamble/instructions/initialize';
import { getGambleInstruction } from '../clients/js/generated/anchor_gamble/instructions/gamble';
import { getSetGambleCostInstruction } from '../clients/js/generated/anchor_gamble/instructions/setGambleCost';
import { ANCHOR_GAMBLE_PROGRAM_ADDRESS } from '../clients/js/generated/anchor_gamble/programs/anchorGamble';
import { connection } from './helpers/connection';
import { parseGambleResult } from './helpers/parseGambleResult';
import { toTxInstruction } from './helpers/toTxInstruction';

const pkToStr = (key: PublicKey): string => key.toBase58();

(async () => {
    const programId = new PublicKey(ANCHOR_GAMBLE_PROGRAM_ADDRESS);

    const admin = loadOrCreateKeypair(keypairPath('admin'));
    const user = loadOrCreateKeypair(keypairPath('user'));

    const configPda = getConfigPda(programId);
    const rewardPoolPda = getRewardPoolPda(programId);

    await airdropIfNeeded(admin.publicKey);
    await airdropIfNeeded(user.publicKey);
    let adminBal = await connection.getBalance(admin.publicKey);
    let userBal = await connection.getBalance(user.publicKey);
    let rewardBal = await connection.getBalance(rewardPoolPda);

    const configAccount = await connection.getAccountInfo(configPda);
    if (!configAccount) {
        console.log('Config account does NOT exist yet, will initialize.');
    } else {
        console.log('Config account already exists, data:', configAccount.data.toString('hex'));
    }

    if (!configAccount) {
        console.log('Initializing program...');
        const gambleCost = BigInt(0.1 * LAMPORTS_PER_SOL);

        const ixRaw = await (getInitializeInstruction as any)({
            admin: pkToStr(admin.publicKey),
            gambleCost,
            config: pkToStr(configPda),
            rewardPool: pkToStr(rewardPoolPda),
        });

        const ix = toTxInstruction(ixRaw, { adminPubkey: admin.publicKey });

        const tx = new Transaction().add(ix);
        const sig = await sendAndConfirmTransaction(connection, tx, [admin]);
        console.log('Initialized. Tx:', sig);
    } else {
        console.log('Config already initialized');
    }


    if (rewardBal <= 1 * LAMPORTS_PER_SOL) {
        console.log('Funding reward pool PDA with 1 SOL...');
        const tx = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: admin.publicKey,
                toPubkey: rewardPoolPda,
                lamports: 1 * LAMPORTS_PER_SOL,
            }),
        );
        const sig = await sendAndConfirmTransaction(connection, tx, [admin]);
        console.log('Funded reward pool. Tx:', sig);
    }

    console.log(
        `Test starts with \n 
        pool PDA balance: ${rewardBal / LAMPORTS_PER_SOL} SOL, \n
        user balance: ${userBal / LAMPORTS_PER_SOL} SOL, \n
        admin balance: ${adminBal / LAMPORTS_PER_SOL} SOL, \n
        `
    );

    {
        console.log('User is gambling...');
        const ixRaw = await (getGambleInstruction as any)({
            user: pkToStr(user.publicKey),
            config: pkToStr(configPda),
            rewardPool: pkToStr(rewardPoolPda),
        });

        const ix = toTxInstruction(ixRaw, { userPubkey: user.publicKey });
        const tx = new Transaction().add(ix);
        const sig = await sendAndConfirmTransaction(connection, tx, [user]);
        console.log('User gambled. Tx:', sig);
        const result = await parseGambleResult(sig);
        if (result === 'win') {
            console.log('Result: User WON!');
        } else if (result === 'lose') {
            console.log('Result: User LOST!');
        } else {
            console.log('Result: Could not determine from logs.');
        }
    }


    {
        console.log('Admin changing gamble cost...');
        const ixRaw = await (getSetGambleCostInstruction as any)({
            admin: pkToStr(admin.publicKey),
            config: pkToStr(configPda),
            newCost: BigInt(0.2 * LAMPORTS_PER_SOL),
        });

        const ix = toTxInstruction(ixRaw, { adminPubkey: admin.publicKey });
        const tx = new Transaction().add(ix);
        const sig = await sendAndConfirmTransaction(connection, tx, [admin]);
        console.log('Set new gamble cost. Tx:', sig);
    }


    {
        console.log('User gambling again at new cost...');
        const ixRaw = await (getGambleInstruction as any)({
            user: pkToStr(user.publicKey),
            config: pkToStr(configPda),
            rewardPool: pkToStr(rewardPoolPda),
        });

        const ix = toTxInstruction(ixRaw, { userPubkey: user.publicKey });
        const tx = new Transaction().add(ix);
        const sig = await sendAndConfirmTransaction(connection, tx, [user]);
        console.log('User gambled (new cost). Tx:', sig);
        const result = await parseGambleResult(sig);
        if (result === 'win') {
            console.log('Result: User WON!');
        } else if (result === 'lose') {
            console.log('Result: User LOST!');
        } else {
            console.log('Result: Could not determine from logs.');
        }
    }

    adminBal = await connection.getBalance(admin.publicKey);
    userBal = await connection.getBalance(user.publicKey);
    rewardBal = await connection.getBalance(rewardPoolPda);

    console.log(
        `Test ends with \n 
        pool PDA balance: ${rewardBal / LAMPORTS_PER_SOL} SOL, \n
        user balance: ${userBal / LAMPORTS_PER_SOL} SOL, \n
        admin balance: ${adminBal / LAMPORTS_PER_SOL} SOL, \n
        `
    );
})();
