export interface CoSignerProof {
  agent: string;
  model: string;
  verdict: "approve" | "reject";
  summary: string;
  reasonCodes: string[];
  signer: string;
  evidenceHash: string;
  signature: string;
}

export interface ScenarioProof {
  id: string;
  title: string;
  status: "blocked" | "executed";
  digest: string;
  canonicalDigest: string;
  target: string;
  valueEth: string;
  receiptHash: string;
  executionTx?: string;
  gatewayResult: string;
  coSigners: CoSignerProof[];
}

export interface DemoProof {
  generatedAt: string;
  network: string;
  chainId: number;
  gateway: string;
  receiptRegistry: string;
  agenticWalletAddress: string;
  submissionStatus: string;
  scenarios: ScenarioProof[];
}
