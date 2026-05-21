import { keccak256, toBytes } from "viem";

export type HexString = `0x${string}`;

export interface TransactionIntent {
  target: HexString;
  valueWei: string;
  calldata: HexString;
  chainId: number;
  nonce: string;
  deadline: string;
  policyHash: HexString;
  metadataHash: HexString;
  purpose: string;
}

export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(",")}}`;
  }

  return JSON.stringify(value);
}

export function canonicalIntentDigest(intent: TransactionIntent): HexString {
  return keccak256(toBytes(stableStringify(intent)));
}

export function makeReceiptHash(payload: unknown): HexString {
  return keccak256(toBytes(stableStringify(payload)));
}
