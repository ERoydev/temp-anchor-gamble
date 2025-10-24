"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const anchor = __importStar(require("@coral-xyz/anchor"));
// Should install this lib to work with SPL tokens
const token = __importStar(require("@solana/spl-token"));
describe("Spl escrow program", () => {
    // Configure the client
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.SplEscrow;
    // Setup Wallet accounts for two sides of the escrow
    const aliceWallet = anchor.web3.Keypair.generate();
    const bobWallet = anchor.web3.Keypair.generate();
    // Setup mint authority accounts
    // Mint Accounts have the authority and authority can mint from these mint accounts
    const a_to_b_mint_authority = anchor.web3.Keypair.generate();
    const b_to_a_mint_authority = anchor.web3.Keypair.generate();
    // Placeholders for mint accounts
    let a_to_b_mint;
    let b_to_a_mint;
    // Specify amounts for the exchange
    // So Alice sends 15 of token X to Bob and Bob sends 38 of token Y to Alice
    let a_to_b_amount = new anchor.BN(15);
    let b_to_a_amount = new anchor.BN(38);
    // The initial value of tokens we are going to mint for Alice and Bob
    // 100 Euros for Alice and 100 Dollars for Bob and they are going to exchange these tokens
    const to_mint = new anchor.BN(100);
    let alice_send_ata;
    let alice_receive_ata;
    let bob_send_ata;
    let bob_receive_ata;
    /*
    ## This Setup is very similar to what a frontend would do when interacting with Solana SPL Tokens Programs.
  
      - The frontend would request airdrops (on devnet/testnet) for wallet funding.
      - It would create mint accounts if needed (for custom tokens).
      - It would create token accounts (ATAs) for users to hold specific tokens.
      - It would mint tokens to those accounts.
      - All these operations use the same SPL Token program instructions as your test.
      
      - In production, the frontend would use wallet providers (like Phantom or Solflare) to sign transactions,
        and would interact with already-existing mints (like USDC).
    */
    it("Setup mints and token accs", () => __awaiter(void 0, void 0, void 0, function* () {
        yield airdrop(provider.connection, a_to_b_mint_authority.publicKey);
        yield airdrop(provider.connection, b_to_a_mint_authority.publicKey);
        yield airdrop(provider.connection, aliceWallet.publicKey);
        yield airdrop(provider.connection, bobWallet.publicKey);
        // Euroes
        a_to_b_mint = yield token.createMint(provider.connection, a_to_b_mint_authority, // The payer for initialization fees
        a_to_b_mint_authority.publicKey, // Mint authority the account that controls minting
        null, // No freeze authority
        9 // Decimals
        );
        // Dollars
        b_to_a_mint = yield token.createMint(provider.connection, b_to_a_mint_authority, // The payer for initialization fees
        b_to_a_mint_authority.publicKey, // Mint authority the account that controls minting
        null, // No freeze authority
        6 // Decimals
        );
        // This is Alice's Token Account for token X (Euroes) -> Sender
        // This creates an Associated Token Account (ATA) for Alice to send tokens of type 'a_to_b_mint' (Euroes) during the escrow exchange.
        alice_send_ata = yield token.createAccount(provider.connection, aliceWallet, // The wallet that will pay the fee to create this token account on the blockchain
        a_to_b_mint, // The mint address for the token type this account will hold (e.g., Euroes)
        aliceWallet.publicKey // The owner of this token account; only this wallet can control the tokens in it
        );
        // This is Alice's Token Account for token Y (Dollars) -> Receiver
        alice_receive_ata = yield token.createAccount(provider.connection, aliceWallet, // Payer for the account creation
        b_to_a_mint, // Mint account for this Token Account (So this is the type of Mint Account this ATA holds)
        aliceWallet.publicKey // Owner of this Token Account
        );
        // This is Bob's Token Account for token Y (Dollars) -> Sender
        bob_send_ata = yield token.createAccount(provider.connection, bobWallet, // Payer for the account creation
        b_to_a_mint, // Mint account for this Token Account (So this is the type of Mint Account this ATA holds)
        bobWallet.publicKey // Owner of this Token Account
        );
        // This is Alice's Token Account for token X (Euros) -> Receiver
        // This creates an Associated Token Account (ATA) for Bob to receive tokens of type 'a_to_b_mint' (Euroes) during the escrow exchange.
        bob_receive_ata = yield token.createAccount(provider.connection, bobWallet, // The wallet that will pay the fee to create this token account on the blockchain
        a_to_b_mint, // The mint address for the token type this account will hold (e.g., Euroes)
        bobWallet.publicKey // The owner of this token account; only this wallet can control the tokens in it
        );
        yield token.mintTo(provider.connection, aliceWallet, a_to_b_mint, alice_send_ata, a_to_b_mint_authority, to_mint.toNumber());
        yield token.mintTo(provider.connection, bobWallet, b_to_a_mint, bob_send_ata, b_to_a_mint_authority, to_mint.toNumber());
    }));
});
// Util functions 
function airdrop(connection_1, address_1) {
    return __awaiter(this, arguments, void 0, function* (connection, address, amount = 1000000000) {
        yield connection.confirmTransaction(yield connection.requestAirdrop(address, amount), "confirmed");
    });
}
