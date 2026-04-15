"use client";
import { useCallback, useRef, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { RescueCipher } from "@arcium-hq/client";
import { x25519 } from "@noble/curves/ed25519";

// ── Types ──────────────────────────────────────────────────────────────────

export type PositionDirection = "long" | "short";

export interface OpenPositionParams {
  entryPrice:  number; // USD (will be converted to micro-units ×1e6)
  size:        number; // base units (×1e6)
  leverage:    number; // 1-100
  direction:   PositionDirection;
  collateral:  number; // USDC (×1e6)
}

export interface PositionState {
  address:         string;
  status:          "open" | "liquidated" | "closed" | "pending";
  collateralLocked: number;
  signalEmitted:   boolean;
  copySignal:      number;
}

export interface LiquidationResult {
  liquidated:  boolean;
  ciphertext:  string;
}

export interface CopySignal {
  direction: "long" | "short";
  trader:    string;
}

// ── Constants ──────────────────────────────────────────────────────────────

function deserializeLE(bytes: Uint8Array): bigint {
  let r = BigInt(0);
  for (let i = bytes.length - 1; i >= 0; i--) r = (r << BigInt(8)) | BigInt(bytes[i]);
  return r;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function usePrivatePerps(programId?: string) {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();

  const [loading, setLoading]   = useState(false);
  const [status,  setStatus]    = useState<string>("");

  // Per-session MPC key material (stored in memory only)
  const keyMaterial = useRef<{
    privateKey:  Uint8Array;
    publicKey:   Uint8Array;
    sharedSecret: Uint8Array;
    cipher:      RescueCipher;
  } | null>(null);

  // ── Initialise key material ──────────────────────────────────────────

  const initKeyMaterial = useCallback(async (progId: PublicKey) => {
    if (keyMaterial.current) return keyMaterial.current;

    const provider = new anchor.AnchorProvider(
      connection,
      { publicKey: publicKey!, signTransaction: signTransaction!, signAllTransactions: signAllTransactions! },
      { commitment: "confirmed" }
    );

    // Temporary demo key (Arcium MXE public key placeholder)
    const mxePublicKeyBytes = new Uint8Array(32).fill(1);
    
    const privKey = x25519.utils.randomSecretKey();
    const pubKey  = x25519.getPublicKey(privKey);
    const shared  = x25519.getSharedSecret(privKey, mxePublicKeyBytes);
    const cipher      = new RescueCipher(shared);

    keyMaterial.current = { privateKey: privKey, publicKey: pubKey, sharedSecret: shared, cipher };
    return keyMaterial.current;
  }, [connection, publicKey, signTransaction, signAllTransactions]);

  // ── Encrypt open position inputs ─────────────────────────────────────

  const encryptPositionInputs = useCallback(async (
    params: OpenPositionParams,
    progId: PublicKey
  ) => {
    const km = await initKeyMaterial(progId);
    const { randomBytes } = await import("crypto");

    const entryPriceMicro = BigInt(Math.round(params.entryPrice * 1e6));
    const sizeMicro       = BigInt(Math.round(params.size * 1e6));
    const leverageBig     = BigInt(params.leverage);
    const directionBig    = BigInt(params.direction === "long" ? 1 : 0);
    const collateralMicro = BigInt(Math.round(params.collateral * 1e6));

    const nonce      = randomBytes(16);
    const plaintext  = [entryPriceMicro, sizeMicro, leverageBig, directionBig, collateralMicro];
    const ciphertext = km.cipher.encrypt(plaintext, nonce);

    return {
      encryptedInputs: ciphertext[0],
      pubKey:          km.publicKey,
      nonce,
      collateralMicro,
    };
  }, [initKeyMaterial]);

  // ── Decrypt a result from MPC ─────────────────────────────────────────

  const decryptResult = useCallback(async (
    ciphertextBytes: number[],
    nonceBytes: number[],
    progId: PublicKey
  ): Promise<bigint> => {
    const km = await initKeyMaterial(progId);
   const ct = Array.from(new Uint8Array(ciphertextBytes));
  const nc = Array.from(new Uint8Array(nonceBytes));
  const [result] = km.cipher.decrypt([ct], nc);
    return result;
  }, [initKeyMaterial]);

  return {
    loading,
    status,
    setLoading,
    setStatus,
    encryptPositionInputs,
    decryptResult,
    keyMaterial,
    initKeyMaterial,
    walletConnected: !!publicKey,
    walletAddress: publicKey?.toBase58(),
  };
}
