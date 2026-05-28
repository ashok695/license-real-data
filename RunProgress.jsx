// Run Progress page — shown for runs that are Created, Scheduled, or in-flight.
// Simulates a 3-step pipeline (collect users → collect roles → calculate) with
// retry support when a step fails.

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    id: params.get("id") || "",
    runName: params.get("run") || "Untitled Run",
    sapSystem: params.get("system") || "—",
    initialStatus: params.get("status") || "Created",
  };
}

const STEP_DEFS = [
  {
    id: "users",
    label: "Collecting users from the SAP system",
    desc: "Fetching user master data, validity windows, and license assignments.",
    durationMs: 2200,
  },
  {
    id: "roles",
    label: "Collecting roles from the SAP system",
    desc: "Pulling role definitions, derived role hierarchy, and role-to-user mappings.",
    durationMs: 2600,
  },
  {
    id: "calc",
    label: "Running license classification logic",
    desc: "Analysing transactions, mapping to license types, and computing recommendations.",
    durationMs: 3200,
  },
];

// Step states: pending | running | completed | failed
function StepIcon({ state }) {
  if (state === "completed") {
    return (
      <span className="rp-step-icon rp-step-icon-done" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
    );
  }
  if (state === "failed") {
    return (
      <span className="rp-step-icon rp-step-icon-failed" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </span>
    );
  }
  if (state === "running") {
    return (
      <span className="rp-step-icon rp-step-icon-running" aria-hidden="true">
        <span className="rp-spinner" />
      </span>
    );
  }
  return <span className="rp-step-icon rp-step-icon-pending" aria-hidden="true" />;
}

function stateLabel(state) {
  switch (state) {
    case "completed": return "Completed";
    case "running":   return "In progress";
    case "failed":    return "Failed";
    default:          return "Pending";
  }
}

function RunProgressPage() {
  const { runName, sapSystem, initialStatus } = React.useMemo(getQueryParams, []);

  // Each step has its own state so retry can target a specific failed step.
  const [stepStates, setStepStates] = React.useState(() => STEP_DEFS.map(() => "pending"));
  const [overallStatus, setOverallStatus] = React.useState(initialStatus); // Created/Scheduled/Running/Completed/Failed
  const [startedAt, setStartedAt] = React.useState(null);
  const [completedAt, setCompletedAt] = React.useState(null);
  const cancelledRef = React.useRef(false);
  const timerRef = React.useRef(null);

  // For deterministic-but-realistic flakiness, fail step #2 (roles) on the first
  // run only. After a retry, every step succeeds.
  const failedOnceRef = React.useRef(false);

  function clearTimer() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }

  function runStep(index, states) {
    if (cancelledRef.current) return;
    if (index >= STEP_DEFS.length) {
      setOverallStatus("Completed");
      setCompletedAt(new Date());
      return;
    }
    const next = [...states];
    next[index] = "running";
    setStepStates(next);

    timerRef.current = setTimeout(() => {
      if (cancelledRef.current) return;
      // Inject a one-time failure on the "roles" step to demonstrate retry UX.
      const shouldFail = index === 1 && !failedOnceRef.current;
      const updated = [...next];
      if (shouldFail) {
        updated[index] = "failed";
        failedOnceRef.current = true;
        setStepStates(updated);
        setOverallStatus("Failed");
      } else {
        updated[index] = "completed";
        setStepStates(updated);
        runStep(index + 1, updated);
      }
    }, STEP_DEFS[index].durationMs);
  }

  function startPipeline() {
    cancelledRef.current = false;
    clearTimer();
    setStartedAt(new Date());
    setCompletedAt(null);
    setOverallStatus("Running");
    const fresh = STEP_DEFS.map(() => "pending");
    setStepStates(fresh);
    runStep(0, fresh);
  }

  function retryFromFailedStep() {
    const failedIdx = stepStates.findIndex(s => s === "failed");
    if (failedIdx === -1) return;
    cancelledRef.current = false;
    clearTimer();
    const next = [...stepStates];
    next[failedIdx] = "pending";
    // Anything after the failed step should also be reset to pending.
    for (let i = failedIdx + 1; i < next.length; i++) next[i] = "pending";
    setStepStates(next);
    setOverallStatus("Running");
    runStep(failedIdx, next);
  }

  // Auto-start the pipeline when the page loads (Created → Running).
  React.useEffect(() => {
    startPipeline();
    return () => {
      cancelledRef.current = true;
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completedCount = stepStates.filter(s => s === "completed").length;
  const totalCount = STEP_DEFS.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const hasFailure = stepStates.some(s => s === "failed");

  // Modal that asks the user where to go after the pipeline completes.
  const [showCompletionModal, setShowCompletionModal] = React.useState(false);
  React.useEffect(() => {
    if (overallStatus === "Completed") setShowCompletionModal(true);
  }, [overallStatus]);

  const resultsHref = `license.html?system=${encodeURIComponent(sapSystem)}&run=${encodeURIComponent(runName)}`;
  const runsHref    = "index.html";

  return (
    <div className="page">

      {/* Breadcrumb */}
      <div className="page-breadcrumb">
        <div className="crumbs">
          <a className="crumb-link" href="index.html">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>
            </svg>
            Home
          </a>
          <span className="crumb-sep">/</span>
          <a className="crumb-link" href="index.html">Analysis Runs</a>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{runName}</span>
        </div>
      </div>

      {/* Title */}
      <div className="page-title-row">
        <div className="title-left">
          <div className="title-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B5BDB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3-6.7"/><polyline points="21 4 21 12 13 12"/>
            </svg>
          </div>
          <div>
            <h1 className="page-title">Run Progress</h1>
            <p className="page-sub">We're collecting data from your SAP system and computing the license report. You can leave this page and come back later.</p>
          </div>
        </div>
        <div className="title-right">
          <a className="btn-secondary" href="index.html">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Runs
          </a>
        </div>
      </div>

      {/* Run summary */}
      <div className="rp-summary-card">
        <div className="rp-summary-grid">
          <div className="rp-summary-item">
            <span className="rp-summary-label">Run Name</span>
            <span className="rp-summary-value">{runName}</span>
          </div>
          <div className="rp-summary-item">
            <span className="rp-summary-label">Connected SAP System</span>
            <span className="rp-summary-value">
              <span className="rp-system-dot" />
              {sapSystem}
            </span>
          </div>
          <div className="rp-summary-item">
            <span className="rp-summary-label">Status</span>
            <span className={`rc-status-badge ${overallStatusBadgeClass(overallStatus)}`}>
              {overallStatus}
            </span>
          </div>
          <div className="rp-summary-item">
            <span className="rp-summary-label">Started</span>
            <span className="rp-summary-value">
              {startedAt ? formatTime(startedAt) : "—"}
            </span>
          </div>
        </div>

        {/* Overall progress */}
        <div className="rp-overall">
          <div className="rp-overall-row">
            <span className="rp-overall-label">
              {overallStatus === "Completed"
                ? "All steps completed"
                : hasFailure
                  ? "A step failed — retry to continue"
                  : `Step ${Math.min(completedCount + 1, totalCount)} of ${totalCount} in progress`}
            </span>
            <span className="rp-overall-pct">{progressPct}%</span>
          </div>
          <div className="rp-overall-track">
            <div
              className={`rp-overall-fill ${hasFailure ? "rp-overall-fill-failed" : ""}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="rp-steps-card">
        <div className="rp-steps-header">
          <h2 className="rp-steps-title">Pipeline Steps</h2>
          {hasFailure && (
            <button className="btn-primary rp-retry-btn" onClick={retryFromFailedStep}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Retry failed step
            </button>
          )}
        </div>

        <ol className="rp-step-list">
          {STEP_DEFS.map((def, i) => {
            const state = stepStates[i];
            return (
              <li key={def.id} className={`rp-step rp-step-${state}`}>
                <StepIcon state={state} />
                <div className="rp-step-body">
                  <div className="rp-step-top">
                    <span className="rp-step-label">
                      <span className="rp-step-num">{i + 1}.</span> {def.label}
                    </span>
                    <span className={`rp-step-state rp-step-state-${state}`}>
                      {stateLabel(state)}
                    </span>
                  </div>
                  <div className="rp-step-desc">{def.desc}</div>
                  {state === "running" && (
                    <div className="rp-step-bar">
                      <div className="rp-step-bar-fill" />
                    </div>
                  )}
                  {state === "failed" && (
                    <div className="rp-step-error" role="alert">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      The connection to the SAP system timed out. Please retry to resume from this step.
                      <button className="rp-step-retry-link" onClick={retryFromFailedStep}>Retry</button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {overallStatus === "Completed" && (
          <div className="rp-complete-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f9d55" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <div>
              <div className="rp-complete-title">Run completed successfully</div>
              <div className="rp-complete-sub">Your license optimization report is ready.</div>
            </div>
            <button className="btn-primary rp-complete-btn" onClick={() => setShowCompletionModal(true)}>
              View Results
            </button>
          </div>
        )}
      </div>

      {showCompletionModal && (
        <RunCompletionModal
          runName={runName}
          sapSystem={sapSystem}
          resultsHref={resultsHref}
          runsHref={runsHref}
          onClose={() => setShowCompletionModal(false)}
        />
      )}

    </div>
  );
}

function RunCompletionModal({ runName, sapSystem, resultsHref, runsHref, onClose }) {
  React.useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="crm-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }} role="presentation">
      <div className="crm-modal rp-completion-modal" role="dialog" aria-modal="true" aria-labelledby="rp-completion-title">

        {/* Header */}
        <div className="crm-header">
          <div className="crm-header-left">
            <div className="crm-header-icon rp-completion-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f9d55" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <div className="crm-title" id="rp-completion-title">Run completed</div>
              <div className="crm-subtitle">
                <strong>{runName}</strong> on <strong>{sapSystem}</strong> finished successfully.
              </div>
            </div>
          </div>
          <button className="crm-close" onClick={onClose} aria-label="Close dialog">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="crm-step-body">
          <p className="rp-completion-prompt">
            Your license optimization analysis is ready. Where would you like to go next?
          </p>

          {/* Footer */}
          <div className="crm-footer rp-completion-footer">
            <a className="btn-secondary" href={runsHref}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Runs
            </a>
            <a className="btn-primary" href={resultsHref}>
              Go to Results
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function overallStatusBadgeClass(status) {
  switch (status) {
    case "Completed": return "rc-status-completed";
    case "Created":   return "rc-status-created";
    case "Scheduled": return "rc-status-scheduled";
    case "Running":   return "rc-status-running";
    case "Failed":    return "rc-status-failed";
    default:          return "rc-status-pending";
  }
}

function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function App() {
  const Sidebar = window.Sidebar;
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className={`app ${collapsed ? "sidebar-collapsed" : ""}`} data-screen-label="Run Progress">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <main className="main">
        <RunProgressPage />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
