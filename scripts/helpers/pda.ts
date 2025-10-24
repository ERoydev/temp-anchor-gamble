import { PublicKey } from '@solana/web3.js';
import { ANCHOR_GAMBLE_PROGRAM_ADDRESS } from '../../clients/js/generated/anchor_gamble';
import { COUNTER_PROGRAM_ADDRESS } from '../../clients/js/generated/vladi_counter';


export function getConfigPda(programId: PublicKey = new PublicKey(ANCHOR_GAMBLE_PROGRAM_ADDRESS)) {
    return PublicKey.findProgramAddressSync([Buffer.from('config')], programId)[0];
}
export function getRewardPoolPda(programId: PublicKey = new PublicKey(ANCHOR_GAMBLE_PROGRAM_ADDRESS)) {
    return PublicKey.findProgramAddressSync([Buffer.from('reward_pool')], programId)[0];
}

export function getCounterPda(programId: PublicKey = new PublicKey(COUNTER_PROGRAM_ADDRESS)) {
    return PublicKey.findProgramAddressSync([Buffer.from('counter')], programId)[0];
}

export function getStoragePda(programId: PublicKey = new PublicKey(COUNTER_PROGRAM_ADDRESS)) {
    return PublicKey.findProgramAddressSync([Buffer.from('storage')], programId)[0];
}
