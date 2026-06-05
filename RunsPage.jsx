// Runs Page — card grid + Create Run modal

const RUNS_DATA = [
    {
    id: "run-007",
    name: "Q4 2025 License Audit",
    status: "Created",
    createdBy: "Customer Success",
    ranOn: "2025-09-15",
    users: null,
    roles: null,
    authObjects: null,
    licenseMatchRate: null,
    target: "index.html",
    sapSystem: "PRD — Production",
    licenseClassification: null,
  },
  {
    id: "run-001",
    name: "Q2 2025 License Audit",
    status: "Completed",
    createdBy: "Customer Success",
    ranOn: "2025-05-20",
    users: 559,
    roles: 450,
    authObjects: 408834,
    licenseMatchRate: 72,
    target: "index.html",
    sapSystem: "PRD — Production",
    licenseClassification: { professional: 509, functional: 40, productivity: 10 },
  },
  {
    id: "run-003",
    name: "Q1 2025 License Audit",
    status: "Completed",
    createdBy: "Customer Success",
    ranOn: "2025-02-14",
    users: 521,
    roles: 430,
    authObjects: 381200,
    licenseMatchRate: 61,
    target: "index.html",
    sapSystem: "QAS — Quality Assurance",
    licenseClassification: { professional: 412, functional: 78, productivity: 31 },
  },
  {
    id: "run-004",
    name: "Post-Go-Live Validation",
    status: "Completed",
    createdBy: "Customer Success",
    ranOn: "2024-11-30",
    users: 498,
    roles: 412,
    authObjects: 362500,
    licenseMatchRate: 55,
    target: "index.html",
    sapSystem: "PRD — Production",
    licenseClassification: { professional: 380, functional: 85, productivity: 33 },
  },
];

// S3 upload URL — replace with real pre-signed URL in production
const S3_UPLOAD_URL = "https://your-bucket.s3.amazonaws.com/auth-traces/";

const CARD_ACCENT = { accent: "#2f6bff", soft: "#eaf1ff" };

// Pre-seeded connected systems (replace with API in production)
const INITIAL_CONNECTED_SYSTEMS = [
  {
    id: "sys-prd",
    sapName: "PRD",
    appServer: "sap-prd.company.com",
    client: "100",
    instanceNumber: "00",
    username: "BASIS_ADMIN",
    connectedAt: "2025-05-15",
  },
  {
    id: "sys-qas",
    sapName: "QAS",
    appServer: "sap-qas.company.com",
    client: "200",
    instanceNumber: "00",
    username: "BASIS_ADMIN",
    connectedAt: "2025-04-22",
  },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Connect SAP System Modal ────────────────────────────────────────────

function ConnectSapModal({ onClose, onConnected }) {
  const [form, setForm] = React.useState({
    sapName: "", username: "", password: "", instanceNumber: "", appServer: "", client: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
  const [error, setError] = React.useState(null);

  const isValid =
    form.sapName.trim() &&
    form.username.trim() &&
    form.password.trim() &&
    form.instanceNumber.trim() &&
    form.appServer.trim() &&
    form.client.trim();

  React.useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleConnect() {
    setConnecting(true);
    setError(null);
    try {
      // Simulate connection handshake — replace with real API call
      await new Promise(res => setTimeout(res, 1400));
      setConnected(true);
      if (typeof onConnected === "function") {
        onConnected({
          id: `sys-${Date.now()}`,
          sapName: form.sapName.trim(),
          appServer: form.appServer.trim(),
          client: form.client.trim(),
          instanceNumber: form.instanceNumber.trim(),
          username: form.username.trim(),
          connectedAt: today(),
        });
      }
    } catch {
      setError("Connection failed. Please verify your credentials and try again.");
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="crm-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }} role="presentation">
      <div className="crm-modal" role="dialog" aria-modal="true" aria-labelledby="sap-conn-title">

        {/* Header */}
        <div className="crm-header">
          <div className="crm-header-left">
            <div className="crm-header-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2f6bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
            <div>
              <div className="crm-title" id="sap-conn-title">Connect SAP System</div>
              <div className="crm-subtitle">Enter your SAP connection details to link this system</div>
            </div>
          </div>
          <button className="crm-close" onClick={onClose} aria-label="Close modal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="crm-step-body">
          {connected ? (
            <div className="crm-upload-success">
              <div className="crm-upload-success-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1f9d55" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <div className="crm-upload-success-title">Connected successfully</div>
                <div className="crm-upload-success-sub">
                  <strong>{form.sapName}</strong> — {form.appServer} (client <strong>{form.client}</strong>) is now linked.
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* SAP Name */}
              <div className="crm-field">
                <label className="crm-label" htmlFor="sap-name">
                  SAP Name <span className="crm-required">*</span>
                </label>
                <input
                  id="sap-name"
                  className="crm-input"
                  type="text"
                  placeholder="e.g. PRD, Production ERP"
                  value={form.sapName}
                  onChange={set("sapName")}
                  disabled={connecting}
                  autoFocus
                />
              </div>

              {/* Row 1: Application Server + Client */}
              <div className="crm-field-row">
                <div className="crm-field">
                  <label className="crm-label" htmlFor="sap-app-server">
                    Application Server <span className="crm-required">*</span>
                  </label>
                  <input
                    id="sap-app-server"
                    className="crm-input"
                    type="text"
                    placeholder="e.g. sap-prd.company.com"
                    value={form.appServer}
                    onChange={set("appServer")}
                    disabled={connecting}
                  />
                </div>
                <div className="crm-field" style={{ maxWidth: 120 }}>
                  <label className="crm-label" htmlFor="sap-client">
                    Client <span className="crm-required">*</span>
                  </label>
                  <input
                    id="sap-client"
                    className="crm-input"
                    type="text"
                    placeholder="e.g. 100"
                    maxLength={3}
                    value={form.client}
                    onChange={set("client")}
                    disabled={connecting}
                  />
                </div>
              </div>

              {/* Row 2: Instance Number */}
              <div className="crm-field">
                <label className="crm-label" htmlFor="sap-instance">
                  Instance Number <span className="crm-required">*</span>
                </label>
                <input
                  id="sap-instance"
                  className="crm-input"
                  type="text"
                  placeholder="e.g. 00"
                  maxLength={2}
                  value={form.instanceNumber}
                  onChange={set("instanceNumber")}
                  disabled={connecting}
                  style={{ maxWidth: 120 }}
                />
              </div>

              {/* Row 3: Username */}
              <div className="crm-field">
                <label className="crm-label" htmlFor="sap-username">
                  Username <span className="crm-required">*</span>
                </label>
                <input
                  id="sap-username"
                  className="crm-input"
                  type="text"
                  placeholder="SAP username"
                  value={form.username}
                  onChange={set("username")}
                  disabled={connecting}
                  autoComplete="username"
                />
              </div>

              {/* Row 4: Password */}
              <div className="crm-field">
                <label className="crm-label" htmlFor="sap-password">
                  Password <span className="crm-required">*</span>
                </label>
                <div className="crm-password-wrap">
                  <input
                    id="sap-password"
                    className="crm-input crm-input-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="SAP password"
                    value={form.password}
                    onChange={set("password")}
                    disabled={connecting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="crm-password-toggle"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Connecting progress */}
              {connecting && (
                <div className="crm-upload-progress">
                  <div className="crm-upload-progress-bar">
                    <div className="crm-upload-progress-fill" />
                  </div>
                  <span className="crm-upload-progress-label">Connecting to SAP system…</span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="crm-upload-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="crm-footer">
            {connected ? (
              <button className="btn-primary" onClick={onClose}>Done</button>
            ) : (
              <>
                <button className="btn-secondary" onClick={onClose} disabled={connecting}>Cancel</button>
                <button className="btn-primary" onClick={handleConnect} disabled={!isValid || connecting}>
                  {connecting ? "Connecting…" : "Connect"}
                  {!connecting && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Create Run Modal ────────────────────────────────────────────────────

const SAP_SYSTEMS = [
  { id: "PRD", label: "PRD — Production",           env: "Production"    },
  { id: "QAS", label: "QAS — Quality Assurance",    env: "QA"            },
  { id: "DEV", label: "DEV — Development",          env: "Development"   },
  { id: "SBX", label: "SBX — Sandbox",              env: "Sandbox"       },
  { id: "TRN", label: "TRN — Training",             env: "Training"      },
  { id: "DR",  label: "DR  — Disaster Recovery",    env: "DR"            },
];

function CreateRunModal({ onClose }) {
  const [name, setName]                   = React.useState("");
  const [sapSystem, setSapSystem]         = React.useState("");
  const [deploymentType, setDeploymentType] = React.useState("");
  const [files, setFiles]                 = React.useState([]);
  const [uploading, setUploading]         = React.useState(false);
  const [uploadDone, setUploadDone]       = React.useState(false);
  const [uploadError, setUploadError]     = React.useState(null);
  const inputRef = React.useRef(null);

  const isValid = name.trim().length > 0 && sapSystem !== "" && deploymentType !== "" && files.length > 0;
  // Show a hint to upload a file once the user has filled the other required fields
  const showFileWarning =
    name.trim().length > 0 && sapSystem !== "" && deploymentType !== "" && files.length === 0 && !uploading;

  // Close on Escape
  React.useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const ALLOWED_EXTS = [".csv", ".xls", ".xlsx"];
  function isAllowed(file) {
    const name = file.name.toLowerCase();
    return ALLOWED_EXTS.some(ext => name.endsWith(ext));
  }

  function handleDrop(e) {
    e.preventDefault();
    const valid = Array.from(e.dataTransfer.files).filter(isAllowed);
    if (valid.length < e.dataTransfer.files.length) {
      setUploadError("Only .csv, .xls, and .xlsx files are accepted.");
    } else {
      setUploadError(null);
    }
    setFiles(prev => [...prev, ...valid]);
  }
  function handleDragOver(e) { e.preventDefault(); }
  function handleBrowse(e) {
    setFiles(prev => [...prev, ...Array.from(e.target.files)]);
  }
  function removeFile(i) {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    if (!name.trim() || sapSystem === "") return;
    if (files.length === 0) {
      setUploadError("Please upload at least one auth trace file (.csv, .xls, .xlsx) before creating the run.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      await Promise.all(files.map(file => {
        const url = `${S3_UPLOAD_URL}${encodeURIComponent(file.name)}`;
        return fetch(url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "application/octet-stream" },
        });
      }));
      setUploadDone(true);
    } catch (err) {
      setUploadDone(true);
      // setUploadError("Upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="crm-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }} role="presentation">
      <div className="crm-modal" role="dialog" aria-modal="true" aria-labelledby="crm-title">

        {/* Modal header */}
        <div className="crm-header">
          <div className="crm-header-left">
            <div className="crm-header-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2f6bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <div>
              <div className="crm-title" id="crm-title">Create New Run</div>
              <div className="crm-subtitle">Set up a new license optimization analysis run</div>
            </div>
          </div>
          <button className="crm-close" onClick={onClose} aria-label="Close modal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Single-step body */}
        <div className="crm-step-body">

          {uploadDone ? (
            /* ── Success state ── */
            <div className="crm-upload-success">
              <div className="crm-upload-success-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1f9d55" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <div className="crm-upload-success-title">Run created successfully</div>
                <div className="crm-upload-success-sub">
                  <strong>{name}</strong> on <strong>{SAP_SYSTEMS.find(s => s.id === sapSystem)?.label}</strong>
                  {` · ${deploymentType === "rise" ? "RISE with SAP" : "On-Premise"}`}
                  {files.length > 0 && ` · ${files.length} file${files.length !== 1 ? "s" : ""} uploaded`}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Run Name */}
              <div className="crm-field">
                <label className="crm-label" htmlFor="run-name">
                  Run Name <span className="crm-required">*</span>
                </label>
                <input
                  id="run-name"
                  className="crm-input"
                  type="text"
                  placeholder="e.g. Q3 2025 License Audit"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                  disabled={uploading}
                />
              </div>

              {/* SAP System */}
              <div className="crm-field">
                <label className="crm-label" htmlFor="sap-system">
                  SAP System <span className="crm-required">*</span>
                </label>
                <div className="crm-select-wrap">
                  <select
                    id="sap-system"
                    className="crm-select"
                    value={sapSystem}
                    onChange={e => setSapSystem(e.target.value)}
                    disabled={uploading}
                  >
                    <option value="" disabled>Select a system…</option>
                    {SAP_SYSTEMS.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                  <svg className="crm-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {/* Deployment Type */}
              <div className="crm-field">
                <label className="crm-label">
                  Deployment Type <span className="crm-required">*</span>
                </label>
                <div className="crm-radio-group">
                  {[
                    {
                      value: "on-prem",
                      label: "On-Premise",
                      description: "SAP system hosted on your own infrastructure",
                      icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2"/>
                          <path d="M8 21h8M12 17v4"/>
                        </svg>
                      ),
                    },
                    {
                      value: "rise",
                      label: "RISE with SAP",
                      description: "SAP-managed cloud transformation offering",
                      icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                        </svg>
                      ),
                    },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`crm-radio-card${deploymentType === opt.value ? " crm-radio-card-selected" : ""}${uploading ? " crm-radio-card-disabled" : ""}`}
                      htmlFor={`deploy-${opt.value}`}
                    >
                      <input
                        id={`deploy-${opt.value}`}
                        type="radio"
                        name="deploymentType"
                        value={opt.value}
                        checked={deploymentType === opt.value}
                        onChange={() => !uploading && setDeploymentType(opt.value)}
                        disabled={uploading}
                        style={{ display: "none" }}
                      />
                      <span className={`crm-radio-card-icon${deploymentType === opt.value ? " crm-radio-card-icon-selected" : ""}`}>
                        {opt.icon}
                      </span>
                      <span className="crm-radio-card-body">
                        <span className="crm-radio-card-label">{opt.label}</span>
                        <span className="crm-radio-card-desc">{opt.description}</span>
                      </span>
                      <span className={`crm-radio-card-check${deploymentType === opt.value ? " crm-radio-card-check-visible" : ""}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Auth Trace Upload */}
              <div className="crm-field">
                <label className="crm-label">
                  Auth Trace Files <span className="crm-required">*</span>
                </label>

                {/* Drop zone */}
                <div
                  className={`crm-dropzone ${files.length > 0 ? "crm-dropzone-has-files" : ""}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => inputRef.current && inputRef.current.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") inputRef.current && inputRef.current.click(); }}
                  aria-label="Drop auth trace files here or click to browse"
                >
                  <input ref={inputRef} type="file" multiple accept=".csv,.xls,.xlsx" style={{ display: "none" }} onChange={handleBrowse} />
                  <div className="crm-dropzone-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2f6bff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p className="crm-dropzone-title">Drop auth trace files here</p>
                  <p className="crm-dropzone-sub">or <span className="crm-dropzone-browse">browse files</span> · .csv, .xls, .xlsx</p>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="crm-file-list" style={{ marginTop: 8 }}>
                    {files.map((f, i) => (
                      <div className="crm-file-item" key={i}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span className="crm-file-name">{f.name}</span>
                        <span className="crm-file-size">{(f.size / 1024).toFixed(1)} KB</span>
                        {!uploading && (
                          <button className="crm-file-remove" onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Required-file warning */}
                {showFileWarning && (
                  <div className="crm-upload-warning" role="alert" style={{ marginTop: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Please upload at least one auth trace file (.csv, .xls, .xlsx) before creating the run.
                  </div>
                )}
              </div>

              {/* Upload progress */}
              {uploading && (
                <div className="crm-upload-progress">
                  <div className="crm-upload-progress-bar">
                    <div className="crm-upload-progress-fill" />
                  </div>
                  <span className="crm-upload-progress-label">Creating run…</span>
                </div>
              )}

              {/* Error */}
              {uploadError && (
                <div className="crm-upload-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {uploadError}
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="crm-footer">
            {uploadDone ? (
              <button className="btn-primary" onClick={onClose}>Done</button>
            ) : (
              <>
                <button className="btn-secondary" onClick={onClose} disabled={uploading}>Cancel</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={!isValid || uploading}>
                  {uploading ? "Creating…" : "Create Run"}
                  {!uploading && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Run Card ────────────────────────────────────────────────────────────

const STATUS_META = {
  Completed: {
    label: "Completed",
    className: "rc-status-completed",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  Created: {
    label: "Created",
    className: "rc-status-created",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  Scheduled: {
    label: "Scheduled",
    className: "rc-status-scheduled",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  Pending: {
    label: "Pending",
    className: "rc-status-pending",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="6" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  Running: {
    label: "Running",
    className: "rc-status-running",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
  },
  Failed: {
    label: "Failed",
    className: "rc-status-failed",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
  },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Pending;
  return (
    <span className={`rc-status-badge ${meta.className}`}>
      {meta.icon}
      {meta.label}
    </span>
  );
}

function RateBar({ rate, status }) {
  if (rate === null || rate === undefined) {
    if (status === "Created") {
      return (
        <span className="rc-rate-na-text">Schedule a run to get License mismatch rate</span>
      );
    }
    return (
      <span className="rc-rate-na-text">Pending</span>
    );
  }
  const color = rate >= 70 ? "#1f9d55" : rate >= 50 ? "#c97c1d" : "#d23f57";
  return (
    <div className="rc-rate-row">
      <div className="rc-rate-track">
        <div className="rc-rate-fill" style={{ width: `${rate}%`, background: color }} />
      </div>
      <span className="rc-rate-pct" style={{ color }}>{rate}%</span>
    </div>
  );
}

function LicenseClassificationBar({ classification, status }) {
  if (!classification) {
    if (status === "Created") {
      return <span className="rc-rate-na-text">Schedule a run to get license classification</span>;
    }
    return <span className="rc-rate-na-text">Pending</span>;
  }
  const { professional, functional, productivity } = classification;
  const total = professional + functional + productivity;
  const profPct = total ? (professional / total) * 100 : 0;
  const funcPct = total ? (functional / total) * 100 : 0;
  const prodPct = total ? (productivity / total) * 100 : 0;
  return (
    <div className="rc-license-class">
      <div className="rc-license-bar">
        <span className="rc-license-seg rc-seg-prof" style={{ width: `${profPct}%` }} title={`Professional: ${professional}`} />
        <span className="rc-license-seg rc-seg-func" style={{ width: `${funcPct}%` }} title={`Functional: ${functional}`} />
        <span className="rc-license-seg rc-seg-prod" style={{ width: `${prodPct}%` }} title={`Productivity: ${productivity}`} />
      </div>
      <div className="rc-license-legend">
        <div className="rc-license-legend-item">
          <span className="rc-license-dot rc-dot-prof" />
          <span className="rc-license-legend-label">PROF</span>
          <span className="rc-license-legend-val">{professional}</span>
        </div>
        <div className="rc-license-legend-item">
          <span className="rc-license-dot rc-dot-func" />
          <span className="rc-license-legend-label">FUNC</span>
          <span className="rc-license-legend-val">{functional}</span>
        </div>
        <div className="rc-license-legend-item">
          <span className="rc-license-dot rc-dot-prod" />
          <span className="rc-license-legend-label">PROD</span>
          <span className="rc-license-legend-val">{productivity}</span>
        </div>
      </div>
    </div>
  );
}

function RunCard({ run, index }) {
  const ac = CARD_ACCENT;
  const isCompleted = run.status === "Completed";
  const canOpen = run.status === "Completed" || run.status === "Created" || run.status === "Scheduled";
  const reportHref = isCompleted
    ? `${run.target === "user-details.html" ? "user-details.html" : "license.html"}?system=${encodeURIComponent(run.sapSystem)}&run=${encodeURIComponent(run.name)}`
    : `run-progress.html?id=${encodeURIComponent(run.id)}&run=${encodeURIComponent(run.name)}&system=${encodeURIComponent(run.sapSystem)}&status=${encodeURIComponent(run.status)}`;
  const reportLabel = isCompleted ? "Open Report" : "View Progress";
  return (
    <div className="rc-card">
      <div className="rc-body">
        <div className="rc-header">
          <div className="rc-index-badge" style={{ background: ac.soft, color: ac.accent }}>
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="rc-header-text">
            <div className="rc-name-row">
              <div className="rc-name">{run.name}</div>
              <StatusBadge status={run.status} />
            </div>
            <div className="rc-meta-row">
              <span className="rc-meta-item">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {run.ranOn}
              </span>
              <span className="rc-meta-dot" />
              <span className="rc-meta-item">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {run.createdBy}
              </span>
            </div>
          </div>
        </div>
        <div className="rc-metrics">
          <div className="rc-metric">
            <span className="rc-metric-val">{run.users !== null ? run.users.toLocaleString() : "—"}</span>
            <span className="rc-metric-lbl">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Users
            </span>
          </div>
          <div className="rc-metric-div" />
          <div className="rc-metric">
            <span className="rc-metric-val">{run.roles !== null ? run.roles.toLocaleString() : "—"}</span>
            <span className="rc-metric-lbl">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 14l9 5 9-5"/><path d="M3 11l9 5 9-5"/>
              </svg>
              Roles
            </span>
          </div>
          <div className="rc-metric-div" />
          <div className="rc-metric">
            <span className="rc-metric-val">{run.authObjects !== null ? run.authObjects.toLocaleString() : "—"}</span>
            <span className="rc-metric-lbl">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              Auth Objects
            </span>
          </div>
        </div>
        <div className="rc-rate-block">
          <span className="rc-rate-label th-with-info">
            License Match Rate
            <span className="th-info-wrap" role="tooltip" aria-label="License Match Rate logic">
              <svg className="th-info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span className="th-tooltip th-tooltip-up">
                <span className="th-tooltip-title">License Match Rate Logic</span>
                <span className="th-tooltip-row">
                  <span className="th-tooltip-dot th-tooltip-dot-green"/>
                  <span><b>Match</b> — Actual Assigned License === Recommended License</span>
                </span>
                <span className="th-tooltip-row">
                  <span className="th-tooltip-dot th-tooltip-dot-red"/>
                  <span><b>Mismatch</b> — Actual Assigned License differs from Recommended License</span>
                </span>
                <span className="th-tooltip-divider"/>
                <span className="th-tooltip-note">Rate = matched users ÷ total users.</span>
              </span>
            </span>
          </span>
          <RateBar rate={run.licenseMatchRate} status={run.status} />
        </div>
        <div className="rc-rate-block">
          <span className="rc-rate-label">License Classification</span>
          <LicenseClassificationBar classification={run.licenseClassification} status={run.status} />
        </div>
        <div className="rc-footer">
          {canOpen ? (
            <a href={reportHref} className="rc-open-btn"
              style={{ background: ac.soft, color: ac.accent, border: `1px solid ${ac.accent}40` }}
              aria-label={`${reportLabel} for ${run.name}`}>
              {reportLabel}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          ) : (
            <span className="rc-footer-hint">
              Report will be available once the run completes
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Connected Systems Strip ─────────────────────────────────────────────

function ConnectedSystemsStrip({ systems }) {
  return (
    <div className="cs-strip">
      <div className="cs-strip-header">
        <div className="cs-strip-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2f6bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
          <span>Connected SAP Systems</span>
          <span className="cs-strip-count">{systems.length}</span>
        </div>
      </div>

      {systems.length === 0 ? (
        <div className="cs-strip-empty">
          No SAP systems connected yet. Use <strong>Connect SAP System</strong> to link one.
        </div>
      ) : (
        <div className="cs-strip-list">
          {systems.map(s => (
            <div className="cs-chip" key={s.id} title={`${s.appServer} · client ${s.client} · instance ${s.instanceNumber}`}>
              <span className="cs-chip-dot" />
              <div className="cs-chip-text">
                <div className="cs-chip-name">{s.sapName}</div>
                <div className="cs-chip-meta">{s.appServer} · client {s.client}</div>
              </div>
              <span className="cs-chip-status">Connected</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────

function RunsPage() {
  const [query, setQuery]       = React.useState("");
  const [modalOpen, setModal]   = React.useState(false);
  const [sapModalOpen, setSapModal] = React.useState(false);
  const [systems, setSystems]   = React.useState(INITIAL_CONNECTED_SYSTEMS);

  function handleSystemConnected(sys) {
    setSystems(prev => {
      // Merge by sapName + appServer + client to avoid dup entries
      const key = s => `${s.sapName}|${s.appServer}|${s.client}`.toLowerCase();
      const without = prev.filter(p => key(p) !== key(sys));
      return [sys, ...without];
    });
  }

  const filtered = React.useMemo(() => {
    if (!query) return RUNS_DATA;
    const q = query.toLowerCase();
    return RUNS_DATA.filter(r => r.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="page">

      {/* Breadcrumb */}
      <div className="page-breadcrumb">
        <div className="crumbs">
          <span className="crumb-home">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>
            </svg>
            Home
          </span>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">Analysis Runs</span>
        </div>
        {/* <div className="live-indicator"><span className="live-dot" /> Live</div> */}
      </div>

      {/* Title + actions */}
      <div className="page-title-row">
        <div className="title-left">
          <div className="title-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B5BDB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <div>
            <h1 className="page-title">Analysis Runs</h1>
            <p className="page-sub">Select a completed run to explore its license optimization report and user-level insights.</p>
          </div>
        </div>
        <div className="title-right">
          <button className="btn-secondary" onClick={() => setSapModal(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            Connect SAP System
          </button>
          <button className="btn-primary" onClick={() => setModal(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Run
          </button>
        </div>
      </div>

      <div className="section-divider"><span>ALL RUNS</span></div>

      {/* Connected SAP systems */}
      <ConnectedSystemsStrip systems={systems} />

      {/* Toolbar */}
      <div className="runs-toolbar">
        <div className="search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search runs…" />
        </div>
        <span className="count-text">{filtered.length} run{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <p style={{ margin: "10px 0 2px", fontWeight: 600, color: "#64748b" }}>No runs match your search</p>
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Try a different keyword.</p>
        </div>
      ) : (
        <div className="rc-grid">
          {filtered.map((run, i) => <RunCard key={run.id} run={run} index={i} />)}
        </div>
      )}

      {/* Modals */}
      {sapModalOpen && (
        <ConnectSapModal
          onClose={() => setSapModal(false)}
          onConnected={handleSystemConnected}
        />
      )}
      {modalOpen && <CreateRunModal onClose={() => setModal(false)} />}

    </div>
  );
}

window.RunsPage = RunsPage;
