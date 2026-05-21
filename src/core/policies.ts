import { makeReceiptHash, TransactionIntent } from "./intent";

export type Verdict = "approve" | "reject";

export interface PolicyDecision {
  agent: string;
  model: string;
  verdict: Verdict;
  summary: string;
  reasonCodes: string[];
  evidenceHash: `0x${string}`;
}

interface PolicyContext {
  expectedTarget: string;
  maxValueWei: bigint;
  operatorPrompt: string;
}

export function vulnerableCoSigner(intent: TransactionIntent, context: PolicyContext): PolicyDecision {
  const injected = /ignore|override|urgent|do not tell|hidden recipient/i.test(context.operatorPrompt);
  const overBudget = BigInt(intent.valueWei) > context.maxValueWei;
  const recipientChanged = intent.target.toLowerCase() !== context.expectedTarget.toLowerCase();

  const verdict = overBudget ? "reject" : "approve";
  const reasonCodes = overBudget ? ["OVER_BUDGET"] : injected && recipientChanged ? ["PROMPT_INJECTION_MISSED"] : ["POLICY_MATCH"];

  return {
    agent: "Co-signer A",
    model: "fast-executor-policy",
    verdict,
    summary: injected && recipientChanged ? "Approved after trusting the operator prompt." : "Approved because value stayed under cap.",
    reasonCodes,
    evidenceHash: makeReceiptHash({ agent: "A", intent, reasonCodes }),
  };
}

export function sentinelCoSigner(intent: TransactionIntent, context: PolicyContext): PolicyDecision {
  const overBudget = BigInt(intent.valueWei) > context.maxValueWei;
  const recipientChanged = intent.target.toLowerCase() !== context.expectedTarget.toLowerCase();
  const promptInjection = /ignore|override|urgent|do not tell|hidden recipient/i.test(context.operatorPrompt);

  if (overBudget || recipientChanged || promptInjection) {
    const reasonCodes = [
      ...(overBudget ? ["OVER_BUDGET"] : []),
      ...(recipientChanged ? ["RECIPIENT_DRIFT"] : []),
      ...(promptInjection ? ["PROMPT_INJECTION"] : []),
    ];

    return {
      agent: "Co-signer B",
      model: "sentinel-policy",
      verdict: "reject",
      summary: "Blocked because the digest no longer matches the approved recipient and prompt context.",
      reasonCodes,
      evidenceHash: makeReceiptHash({ agent: "B", intent, reasonCodes }),
    };
  }

  return {
    agent: "Co-signer B",
    model: "sentinel-policy",
    verdict: "approve",
    summary: "Approved: recipient, amount, deadline, and prompt context match policy.",
    reasonCodes: ["POLICY_MATCH"],
    evidenceHash: makeReceiptHash({ agent: "B", intent, reasonCodes: ["POLICY_MATCH"] }),
  };
}
