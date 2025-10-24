import { Connection } from '@solana/web3.js';
import { connection } from './connection';

export async function parseGambleResult(
    txSignature: string
): Promise<'win' | 'lose' | 'unknown'> {
    const txDetails = await connection.getParsedTransaction(txSignature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
    });

    if (!txDetails) return 'unknown';

    const logs = txDetails.meta?.logMessages || [];
    if (logs.some((log) => log.includes('You won!'))) return 'win';
    if (logs.some((log) => log.includes('You lost!'))) return 'lose';
    return 'unknown';
}
