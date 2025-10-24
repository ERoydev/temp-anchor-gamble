import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { connection, getConnectionBlock } from './connection';

export async function airdropIfNeeded(
    pubkey: PublicKey,
) {
    const bal = await connection.getBalance(pubkey);
    if (bal < (1.5 * LAMPORTS_PER_SOL)) {
        const signature = await connection.requestAirdrop(pubkey, 2 * LAMPORTS_PER_SOL);
        const { blockhash, lastValidBlockHeight } = await getConnectionBlock()
        await connection.confirmTransaction(
            {
                signature,
                blockhash,
                lastValidBlockHeight,
            },
            'confirmed'
        );
    }
}
