"use client";
import { useState, useCallback, useRef } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { randomBytes } from "crypto";

// ── Constants ──────────────────────────────────────────────────────────────
export const PROGRAM_ID = new PublicKey("9YiBsM6tNopSgiJryBZKL3v27LMUwz7GGtgSW68reheA");
export const MARKET_SEED   = Buffer.from("market");
export const POSITION_SEED = Buffer.from("position");
export const VAULT_SEED    = Buffer.from("vault");

// ── Simple x25519 key generation (browser-safe) ───────────────────────────
function generateKeyPair() {
  // Generate 32 random bytes as private key
  const privateKey = new Uint8Array(randomBytes(32));
  // For devnet demo, use the private key directly as "public key" placeholder
  // In production this uses actual x25519 ECDH with the MXE
  return { privateKey, publicKey: privateKey };
}

// ── Encrypt inputs for Arcium MPC ─────────────────────────────────────────
function encryptTradeInputs(
  entryPrice: number,
  size: number,
  leverage: number,
  direction: number,
  collateral: number,
  _publicKey: Uint8Array
): { ciphertext: number[]; nonce: BN } {
  // XOR-based simple encryption for demo
  // In production: RescueCipher with x25519 shared secret
  const nonce = new Uint8Array(randomBytes(16));
  const data = new Uint8Array(32);
  
  // Pack values into bytes
  const view = new DataView(data.buffer);
  view.setFloat32(0, entryPrice, true);
  view.setFloat32(4, size, true);
  view.setUint8(8, leverage);
  view.setUint8(9, direction);
  view.setFloat32(10, collateral, true);

  // Simple XOR with nonce for demo encryption
  for (let i = 0; i < data.length; i++) {
    data[i] ^= nonce[i % nonce.length];
  }

  // Convert nonce to BN (little-endian u128)
  let nonceValue = BigInt(0);
  for (let i = 15; i >= 0; i--) {
    nonceValue = (nonceValue << BigInt(8)) | BigInt(nonce[i]);
  }

  return {
    ciphertext: Array.from(data),
    nonce: new BN(nonceValue.toString()),
  };
}

// ── Position storage (local, for demo) ────────────────────────────────────
export interface LocalPosition {
  id: string;
  direction: "long" | "short";
  size: number;
  collateral: number;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  status: "open" | "pending" | "closed";
  txSignature: string;
  openedAt: string;
  computationOffset: string;
}

const POSITIONS_KEY = "privateperps_positions";

export function savePosition(pos: LocalPosition) {
  try {
    const existing = loadPositions();
    existing.unshift(pos);
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(existing.slice(0, 20)));
  } catch {}
}

export function loadPositions(): LocalPosition[] {
  try {
    const raw = localStorage.getItem(POSITIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Main hook ─────────────────────────────────────────────────────────────
export function useOnChainTrade() {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openPosition = useCallback(async (params: {
    direction: "long" | "short";
    collateral: number;
    leverage: number;
    markPrice: number;
  }) => {
    if (!publicKey || !sendTransaction) {
      throw new Error("Wallet not connected");
    }

    setLoading(true);
    setError(null);
    setTxSig(null);

    try {
      // Generate key material
      const { publicKey: ephemeralPubkey } = generateKeyPair();
      
      // Encrypt trade inputs
      const { ciphertext, nonce } = encryptTradeInputs(
        params.markPrice,
        params.collateral * params.leverage,
        params.leverage,
        params.direction === "long" ? 1 : 0,
        params.collateral,
        ephemeralPubkey
      );

      // Derive PDAs
      const computationOffset = new BN(Array.from(randomBytes(8)), "hex");
      const computationOffsetBytes = computationOffset.toBuffer("le", 8);

      const [marketPda]   = PublicKey.findProgramAddressSync([MARKET_SEED], PROGRAM_ID);
      const [positionPda] = PublicKey.findProgramAddressSync(
        [POSITION_SEED, publicKey.toBuffer(), computationOffsetBytes],
        PROGRAM_ID
      );
      const [vaultPda] = PublicKey.findProgramAddressSync([VAULT_SEED], PROGRAM_ID);

      // Build provider
      const provider = new anchor.AnchorProvider(
        connection,
        { publicKey, signTransaction: signTransaction!, signAllTransactions: async (txs) => txs },
        { commitment: "confirmed" }
      );

      // For demo: send a simple SOL transfer to prove wallet signing works
      // This creates a real on-chain transaction signed by the user
      const { Transaction, SystemProgram: SP } = await import("@solana/web3.js");
      const tx = new Transaction();
      
      // Add a memo instruction to encode the trade data
      const { TransactionInstruction } = await import("@solana/web3.js");
      const tradeData = JSON.stringify({
        type: "open_position",
        direction: params.direction,
        leverage: params.leverage,
        collateral: params.collateral,
        encrypted: Buffer.from(ciphertext).toString("hex").slice(0, 16) + "...",
        program: PROGRAM_ID.toBase58(),
      });

      // Memo program instruction (records trade intent on-chain)
      const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
      tx.add(new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(tradeData),
      }));

      tx.feePayer = publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      const signature = await sendTransaction(tx, connection, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      await connection.confirmTransaction(signature, "confirmed");

      setTxSig(signature);

      // Save position locally
      const position: LocalPosition = {
        id: positionPda.toBase58().slice(0, 12),
        direction: params.direction,
        size: params.collateral * params.leverage,
        collateral: params.collateral,
        leverage: params.leverage,
        entryPrice: params.markPrice,
        markPrice: params.markPrice,
        status: "open",
        txSignature: signature,
        openedAt: new Date().toISOString(),
        computationOffset: computationOffset.toString(),
      };

      savePosition(position);
      return { signature, position };

    } catch (e: any) {
      const msg = e?.message || "Transaction failed";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [publicKey, sendTransaction, connection]);

  return { openPosition, loading, txSig, error };
}
