import { AccountMeta, PublicKey, TransactionInstruction } from '@solana/web3.js';

export function toTxInstruction(
  ix: {
    accounts: any[],
    programAddress: string | PublicKey,
    data: Buffer | Uint8Array,
  },
  opts: { adminPubkey?: PublicKey; userPubkey?: PublicKey } = {}
) {

  const keys: AccountMeta[] = ix.accounts.map((acc, idx) => {
    let pubkey: PublicKey;

    if (typeof acc.address === 'string') {
      pubkey = new PublicKey(acc.address);
    } else if (acc.address instanceof PublicKey) {
      pubkey = acc.address;
    } else if (acc.address && acc.address.publicKey) {
      pubkey = acc.address.publicKey;
    } else {
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

  return new TransactionInstruction({
    keys,
    programId: new PublicKey(ix.programAddress),
    data: Buffer.from(ix.data),
  });
}
