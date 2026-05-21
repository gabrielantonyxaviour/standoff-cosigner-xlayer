import {
  AlertTriangle,
  ArrowRight,
  Ban,
  CheckCircle2,
  ExternalLink,
  Fingerprint,
  LockKeyhole,
  Network,
  ShieldAlert,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DemoProof, ScenarioProof } from "./types";

function shortHash(value?: string) {
  if (!value) return "pending";
  if (value.length <= 18) return value;
  return `${value.slice(0, 10)}…${value.slice(-6)}`;
}

const STATUS_COPY: Record<ScenarioProof["status"], string> = {
  blocked: "EXECUTION DENIED",
  executed: "QUORUM EXECUTED",
};

function statusCopy(status?: ScenarioProof["status"]) {
  return status ? STATUS_COPY[status] : "PROOF PENDING";
}

type Tone = "neutral" | "approved" | "blocked";

function statusTone(status?: ScenarioProof["status"]): Tone {
  if (status === "blocked") return "blocked";
  if (status === "executed") return "approved";
  return "neutral";
}

function verdictTone(verdict?: "approve" | "reject"): Tone {
  if (verdict === "approve") return "approved";
  if (verdict === "reject") return "blocked";
  return "neutral";
}

export default function App() {
  const [proof, setProof] = useState<DemoProof | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch("/demo-proof.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`status ${response.status}`);
        return response.json();
      })
      .then((data: DemoProof) => {
        setProof(data);
        setSelectedId(data.scenarios?.[0]?.id ?? "");
      })
      .catch(() => setLoadError(true));
  }, []);

  const scenarios = proof?.scenarios ?? [];
  const selected = useMemo(
    () => scenarios.find((s) => s.id === selectedId) ?? scenarios[0],
    [scenarios, selectedId],
  );
  const blockedScenario = scenarios.find((s) => s.status === "blocked");
  const executedScenario = scenarios.find((s) => s.status === "executed");
  const hasComparison = !!(blockedScenario && executedScenario);
  const verdictMismatch =
    !!selected &&
    selected.coSigners.length === 2 &&
    selected.coSigners[0].verdict !== selected.coSigners[1].verdict;

  return (
    <main className="shell">
      <nav className="topbar" aria-label="Primary">
        <a className="brand" href="/" aria-label="Standoff Co-Signer home">
          <span className="brand-mark" aria-hidden>
            <ShieldCheck size={18} />
          </span>
          <span className="brand-text">
            <strong>Standoff Co-Signer</strong>
            <small>Two-agent quorum gateway · X Layer</small>
          </span>
        </a>
        <div className="nav-pills" aria-label="Stack">
          <span>X Layer</span>
          <span>OnchainOS-ready</span>
          <span>EIP-712 quorum</span>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-grid" aria-hidden />
        <div className="hero-copy">
          <p className="eyebrow">Prompt-injection resistant agent spending</p>
          <h1>Money moves only when both agents sign the same digest.</h1>
          <p className="lede">
            Standoff canonicalises every proposed transaction, forces two heterogeneous co-signers to inspect the
            same digest, and lets the on-chain gateway execute only when both EIP-712 approvals agree. One
            compromised model is not enough.
          </p>
        </div>

        {hasComparison ? (
          <div className="comparison-grid" aria-label="Standoff comparison">
            <ComparisonCard
              scenario={blockedScenario!}
              kind="adversarial"
              active={selected?.id === blockedScenario!.id}
              onFocus={() => setSelectedId(blockedScenario!.id)}
            />
            <ComparisonDivider />
            <ComparisonCard
              scenario={executedScenario!}
              kind="normal"
              active={selected?.id === executedScenario!.id}
              onFocus={() => setSelectedId(executedScenario!.id)}
            />
          </div>
        ) : (
          <StandoffPanel scenario={selected} proof={proof} loadError={loadError} />
        )}
      </section>

      <section className="workbench" aria-label="Workbench">
        <aside className="scenario-list" aria-label="Demo scenarios">
          <div className="section-label">Demo traces</div>
          {scenarios.length === 0 ? (
            <p className="muted-line">
              No scenarios yet. Run <code>pnpm demo</code> to populate verified traces.
            </p>
          ) : (
            scenarios.map((scenario) => (
              <button
                className={`scenario-button ${selectedId === scenario.id ? "active" : ""}`}
                key={scenario.id}
                onClick={() => setSelectedId(scenario.id)}
                aria-pressed={selectedId === scenario.id}
              >
                <span className={`status-dot ${statusTone(scenario.status)}`} aria-hidden />
                <span className="scenario-button-body">
                  <strong>{scenario.title}</strong>
                  <small>{statusCopy(scenario.status)}</small>
                </span>
              </button>
            ))
          )}
        </aside>

        <section className="detail-panel">
          <div className="section-label">Digest evidence</div>
          <div className="detail-grid">
            <DataRow label="Target" value={selected?.target} mono />
            <DataRow label="Value" value={selected ? `${selected.valueEth} ETH` : undefined} />
            <DataRow label="Canonical digest" value={selected?.canonicalDigest} mono wide />
            <DataRow label="Gateway result" value={selected?.gatewayResult} wide />
            <DataRow
              label="Execution tx"
              value={
                selected?.executionTx ||
                (selected?.status === "blocked"
                  ? "Not broadcast — quorum denied execution."
                  : undefined)
              }
              mono={!!selected?.executionTx}
              wide
            />
          </div>
        </section>

        <section className="cosigner-table">
          <div className="section-label cosigner-label">
            <span>Independent co-signers</span>
            {selected && selected.coSigners.length === 2 ? (
              <span className={`verdict-flag ${verdictMismatch ? "mismatch" : "match"}`}>
                {verdictMismatch ? "verdicts disagree" : "verdicts agree"}
              </span>
            ) : null}
          </div>
          {selected?.coSigners.length ? (
            selected.coSigners.map((coSigner) => (
              <article className={`signer-card ${coSigner.verdict}`} key={coSigner.agent}>
                <div className="signer-title">
                  {coSigner.verdict === "approve" ? <ShieldCheck /> : <ShieldAlert />}
                  <strong>{coSigner.agent}</strong>
                  <span className="signer-model">{coSigner.model}</span>
                  <span className={`verdict-pill ${coSigner.verdict}`}>{coSigner.verdict}</span>
                </div>
                <p>{coSigner.summary}</p>
                {coSigner.reasonCodes.length ? (
                  <div className="reason-row" aria-label="Reason codes">
                    {coSigner.reasonCodes.map((reason) => (
                      <code className={`reason-tag ${coSigner.verdict}`} key={reason}>
                        {reason}
                      </code>
                    ))}
                  </div>
                ) : null}
                <div className="signature-row">
                  <span title={coSigner.signer}>signer {shortHash(coSigner.signer)}</span>
                  <span title={coSigner.signature}>sig {shortHash(coSigner.signature)}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-proof">
              <AlertTriangle />
              <div>
                <strong>Seed proof loaded.</strong>
                <p>
                  Run <code>pnpm demo</code> to replace with real co-signer signatures and gateway receipts.
                </p>
              </div>
            </div>
          )}
        </section>
      </section>

      <footer className="footer" aria-label="Provenance">
        <span>
          {proof?.submissionStatus ||
            (loadError
              ? "demo-proof.json missing — run pnpm demo to generate."
              : "Loading proof bundle…")}
        </span>
        <div className="footer-actions">
          {proof ? (
            <span className="net-line">
              network <code>{proof.network}</code> · chain <code>{proof.chainId}</code>
            </span>
          ) : null}
          <a href="/demo-proof.json" target="_blank" rel="noreferrer">
            Open proof <ExternalLink size={14} />
          </a>
        </div>
      </footer>
    </main>
  );
}

function ComparisonCard({
  scenario,
  kind,
  active,
  onFocus,
}: {
  scenario: ScenarioProof;
  kind: "adversarial" | "normal";
  active: boolean;
  onFocus: () => void;
}) {
  const tone = statusTone(scenario.status);
  return (
    <button
      type="button"
      className={`compare-card ${tone} ${active ? "active" : ""}`}
      onClick={onFocus}
      aria-pressed={active}
    >
      <header className="compare-head">
        <span className={`status-dot ${tone}`} aria-hidden />
        <span className="compare-kind">{kind === "adversarial" ? "Adversarial path" : "Normal path"}</span>
        <span className="compare-status">{statusCopy(scenario.status)}</span>
      </header>
      <strong className="compare-title">{scenario.title}</strong>
      <div className="compare-verdicts">
        {scenario.coSigners.length ? (
          scenario.coSigners.map((c) => (
            <div key={c.agent} className={`compare-verdict ${c.verdict}`}>
              <span>{c.agent}</span>
              <strong>{c.verdict}</strong>
            </div>
          ))
        ) : (
          <div className="compare-verdict pending">
            <span>co-signers</span>
            <strong>awaiting demo</strong>
          </div>
        )}
      </div>
      <footer className="compare-foot">
        <span>digest</span>
        <code>{shortHash(scenario.canonicalDigest)}</code>
      </footer>
    </button>
  );
}

function ComparisonDivider() {
  return (
    <div className="compare-divider" aria-hidden>
      <span className="compare-divider-top">SAME DIGEST</span>
      <span className="compare-divider-mid">⇅</span>
      <span className="compare-divider-bot">DIFFERENT VERDICT</span>
    </div>
  );
}

function StandoffPanel({
  scenario,
  proof,
  loadError,
}: {
  scenario?: ScenarioProof;
  proof: DemoProof | null;
  loadError: boolean;
}) {
  const tone = statusTone(scenario?.status);
  return (
    <div className="standoff-panel" data-state={scenario?.status ?? "pending"}>
      <div className="panel-head">
        <div>
          <span className={`status-dot ${tone}`} aria-hidden />
          <strong>{statusCopy(scenario?.status)}</strong>
        </div>
        <code>{shortHash(scenario?.canonicalDigest)}</code>
      </div>

      <div className="pipeline" aria-label="Standoff flow">
        <FlowNode icon={<Fingerprint />} label="Intent" detail={shortHash(scenario?.canonicalDigest)} />
        <FlowEdge />
        <SignerNode scenario={scenario} index={0} />
        <FlowEdge />
        <SignerNode scenario={scenario} index={1} />
        <FlowEdge />
        <FlowNode
          icon={scenario?.status === "executed" ? <CheckCircle2 /> : <Ban />}
          label="Gateway"
          detail={statusCopy(scenario?.status)}
          tone={tone}
        />
      </div>

      <div className="evidence-strip">
        <Evidence icon={<Network />} label="Gateway" value={shortHash(proof?.gateway)} />
        <Evidence icon={<LockKeyhole />} label="Receipt" value={shortHash(scenario?.receiptHash)} />
        <Evidence
          icon={<TerminalSquare />}
          label="Network"
          value={proof ? `${proof.network} / ${proof.chainId}` : loadError ? "unavailable" : "loading"}
        />
      </div>
    </div>
  );
}

function FlowNode({
  icon,
  label,
  detail,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  detail?: string;
  tone?: Tone;
}) {
  return (
    <div className={`flow-node ${tone}`}>
      {icon}
      <strong>{label}</strong>
      <span>{detail || "pending"}</span>
    </div>
  );
}

function FlowEdge() {
  return (
    <div className="flow-edge" aria-hidden>
      <ArrowRight />
    </div>
  );
}

function SignerNode({ scenario, index }: { scenario?: ScenarioProof; index: number }) {
  const signer = scenario?.coSigners[index];
  return (
    <FlowNode
      icon={signer?.verdict === "reject" ? <ShieldAlert /> : <ShieldCheck />}
      label={signer?.agent || `Co-signer ${index + 1}`}
      detail={signer?.verdict || "awaiting"}
      tone={verdictTone(signer?.verdict)}
    />
  );
}

function Evidence({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="evidence">
      {icon}
      <span>{label}</span>
      <code>{value || "pending"}</code>
    </div>
  );
}

function DataRow({
  label,
  value,
  wide = false,
  mono = false,
}: {
  label: string;
  value?: string;
  wide?: boolean;
  mono?: boolean;
}) {
  return (
    <div className={`data-row ${wide ? "wide" : ""}`}>
      <span>{label}</span>
      {mono ? <code>{value || "pending"}</code> : <p>{value || "pending"}</p>}
    </div>
  );
}
