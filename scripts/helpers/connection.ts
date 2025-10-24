import { createRpc, createSolanaRpc } from '@solana/kit';
import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const connection = new Connection('https://api.devnet.solana.com');
export const rpcConnection = createSolanaRpc(connection.rpcEndpoint);

export async function getConnectionBlock() {
    return connection.getLatestBlockhash();
}
