import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';

export function keypairPath(name: string) {
    return path.resolve(__dirname, `../../.${name}.json`);
}

export function loadOrCreateKeypair(file: string): Keypair {
    if (fs.existsSync(file)) {
        return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(file, 'utf-8'))));
    }
    const kp = Keypair.generate();
    fs.writeFileSync(file, JSON.stringify(Array.from(kp.secretKey)));
    return kp;
}
