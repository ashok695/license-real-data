// License Optimization page — tree-table style

function avatarColor(i) {
  const palette = [
    { bg: "#EAF2FF", fg: "#2A55C7" },
    { bg: "#FEF1E6", fg: "#B5560A" },
    { bg: "#E9F8EE", fg: "#137A3A" },
    { bg: "#F3EAFE", fg: "#6B30C2" },
    { bg: "#FCEAEE", fg: "#B0234A" },
    { bg: "#E5F4F7", fg: "#0E6E84" },
    { bg: "#F5F2E8", fg: "#7B6724" },
  ];
  return palette[i % palette.length];
}

function Stat({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value.toLocaleString()}</div>
        <div className="stat-sub">{sub}</div>
      </div>
    </div>
  );
}

function TopKpiCard({ tone, icon, label, value, sub, breakdown, layout }) {
  const breakdownTotal = breakdown
    ? breakdown.reduce((sum, item) => sum + item.value, 0)
    : 0;
  const hasValue = value !== undefined && value !== null;
  const renderedValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className={`top-kpi-card top-kpi-${tone || "blue"}`}>
      <div className="top-kpi-head">
        <div className="top-kpi-icon">{icon}</div>
        <div className="top-kpi-label">{label}</div>
      </div>
      {breakdown ? (
        <div className={`top-kpi-breakdown top-kpi-breakdown-${layout || "tiles"}`}>
          {hasValue ? <div className="top-kpi-value">{renderedValue}</div> : null}
          {layout === "chart" && (
            <div className="top-kpi-chart" aria-hidden="true">
              {breakdown.map(item => (
                <span
                  className={`top-kpi-chart-segment ${item.tone ? `top-kpi-item-${item.tone}` : ""}`}
                  key={item.label}
                  style={{ width: `${breakdownTotal ? Math.max(3, (item.value / breakdownTotal) * 100) : 0}%` }}
                  title={`${item.label}: ${item.value.toLocaleString()}`}
                />
              ))}
            </div>
          )}
          <div className="top-kpi-legend">
            {breakdown.map(item => (
              <div className={`top-kpi-breakdown-item ${item.tone ? `top-kpi-item-${item.tone}` : ""}`} key={item.label} title={`${item.label}: ${item.value.toLocaleString()}`}>
                <div className="top-kpi-breakdown-main">
                  <div className="top-kpi-breakdown-label">{item.shortLabel || item.label}</div>
                  <div className="top-kpi-breakdown-value">{item.value.toLocaleString()}</div>
                </div>
                {layout === "bars" && (
                  <div className="top-kpi-bar-track" aria-hidden="true">
                    <span style={{ width: `${breakdownTotal ? Math.max(4, (item.value / breakdownTotal) * 100) : 0}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="top-kpi-value">{renderedValue}</div>
      )}
      {sub ? <div className="top-kpi-sub">{sub}</div> : null}
    </div>
  );
}

function FieldStatusPill({ status }) {
  const normalized = status === "Unused" ? "Unused" : "Used";
  const map = { "Used": "pill-green", "Unused": "pill-red" };
  return <span className={`pill ${map[normalized] || "pill-gray"}`}>{normalized}</span>;
}
function LicensePill({ license }) {
  if (license === "NA" || !license) return <span className="pill pill-slate">NA</span>;
  const map = {
    "HD Productivity": "pill-blue", "HD Professional": "pill-violet",
    "HD Functional": "pill-cyan", "HD Developer": "pill-amber",
    "HD Platform": "pill-rose", "Employee": "pill-slate"
  };
  return <span className={`pill ${map[license] || "pill-blue"}`}>{license}</span>;
}

function LicenseMismatchPill({ actualLicense, targetLicense }) {
  const mismatched = (actualLicense || "NA") !== (targetLicense || "NA");
  return (
    <span className={`pill ${mismatched ? "pill-red" : "pill-green"}`}>
      {mismatched ? "Mismatched" : "No Change"}
    </span>
  );
}

function licenseDivisionFromAuthObjs(authObjs) {
  return authObjs.reduce((counts, auth) => {
    if (auth.license === "HD Professional") counts.professional++;
    else if (auth.license === "HD Functional") counts.functional++;
    else if (auth.license === "HD Productivity") counts.productivity++;
    return counts;
  }, { professional: 0, functional: 0, productivity: 0 });
}

function LicenseDivision({ counts }) {
  const c = counts || { professional: 0, functional: 0, productivity: 0 };
  const parts = [
    { key: "professional", value: c.professional || 0 },
    { key: "functional", value: c.functional || 0 },
    { key: "productivity", value: c.productivity || 0 }
  ];
  return (
    <span className="license-division" title="Professional | Functional | Productivity">
      {parts.map(part => (
        <span className={`license-division-chip license-division-${part.key}`} key={part.key}>
          <span className="license-division-value">{part.value.toLocaleString()}</span>
        </span>
      ))}
    </span>
  );
}

function AssignmentPill({ value }) {
  const assignment = value || "Directly Assigned";
  const label = assignment === "Indirectly Assigned" ? "Indirect" : "Direct";
  return (
    <span className={`pill ${assignment === "Indirectly Assigned" ? "pill-amber" : "pill-green"}`}>
      {label}
    </span>
  );
}

function RoleTypePill({ value }) {
  const roleType = value || "Single";
  return (
    <span className={`type-pill ${roleType === "Composite" ? "type-comp" : "type-single"}`}>
      {roleType}
    </span>
  );
}

// License count chip for Pro/Func/Prod columns
function CountCell({ value, kind }) {
  if (!value) return <span className="lic-count lic-count-zero">0</span>;
  return <span className={`lic-count lic-count-${kind}`}>{value.toLocaleString()}</span>;
}
function LicDot({ kind }) { return <span className={`lic-dot lic-dot-${kind}`} />; }

function authUsageCounts(items) {
  const total = items.length;
  const used = items.filter(item => item.fieldStatus !== "Unused").length;
  return { used, total };
}

// Returns the count of redundant roles for a user. A role is redundant if
// the same role name is assigned more than once, or if its auth objects
// are shared with at least one other assigned role.
function getRedundantRoleCount(user) {
  const roleNameCounts = {};
  const authObjectRoleNames = {};
  user.roles.forEach(role => {
    roleNameCounts[role.name] = (roleNameCounts[role.name] || 0) + 1;
    const uniqueAuthObjects = new Set(role.authObjs.map(a => a.name));
    uniqueAuthObjects.forEach(authName => {
      if (!authObjectRoleNames[authName]) authObjectRoleNames[authName] = new Set();
      authObjectRoleNames[authName].add(role.name);
    });
  });
  return user.roles.filter(role => {
    if (roleNameCounts[role.name] > 1) return true;
    return role.authObjs.some(a => {
      const names = authObjectRoleNames[a.name];
      return names && names.size > 1;
    });
  }).length;
}

function getRedundantRoles(user) {
  const roleNameCounts = {};
  const authObjectRoleNames = {};
  user.roles.forEach(role => {
    roleNameCounts[role.name] = (roleNameCounts[role.name] || 0) + 1;
    const uniqueAuthObjects = new Set(role.authObjs.map(a => a.name));
    uniqueAuthObjects.forEach(authName => {
      if (!authObjectRoleNames[authName]) authObjectRoleNames[authName] = new Set();
      authObjectRoleNames[authName].add(role.name);
    });
  });
  return user.roles.map(role => {
    const sameRoleAssigned = roleNameCounts[role.name] > 1;
    const sharedAuthObjects = role.authObjs
      .filter(a => { const names = authObjectRoleNames[a.name]; return names && names.size > 1; })
      .map(a => a.name);
    return {
      ...role,
      redundancyReason: sameRoleAssigned ? "Duplicate role assignment" : "Shared authorization objects",
      sharedAuthObjects: Array.from(new Set(sharedAuthObjects))
    };
  }).filter(role => roleNameCounts[role.name] > 1 || role.sharedAuthObjects.length > 0);
}

function RedundantRolesModal({ roles, userName, onClose }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  function handleBackdrop(e) { if (e.target === e.currentTarget) onClose(); }

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="redundant-modal-title" style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title" id="redundant-modal-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: "middle" }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Redundant Roles
            </h3>
            <p className="modal-sub">{userName} · {roles.length} role{roles.length !== 1 ? "s" : ""} flagged for review</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ maxHeight: 380, overflowY: "auto", overflowX: "hidden", padding: "0 20px 16px" }}>
          <table className="data-table modal-table" style={{ width: "100%", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "70%" }} />
              <col style={{ width: "30%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Role Type</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, i) => (
                <tr key={`${role.name}-${i}`}>
                  <td className="mono link" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{role.name}</td>
                  <td><span className={`type-pill ${role.type === "Composite" ? "type-comp" : "type-single"}`}>{role.type || "Single"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-footer" style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function RedundantRolesPill({ count, onClick }) {
  if (count > 0) {
    return (
      <button type="button" className="pill pill-red ud-clickable-pill" onClick={onClick}>
        Yes ({count})
      </button>
    );
  }
  return <span className="pill pill-green">No</span>;
}

function getAuthLastUsedDate(user, role, auth, index) {
  if (auth.lastUsed) return auth.lastUsed;
  if (auth.fieldStatus === "Unused") return "NA";

  const seed = `${user.id}|${role.name}|${auth.name}|${auth.field}|${index}`;
  const hash = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const date = new Date();
  date.setDate(date.getDate() - (1 + (hash % 180)));
  return date.toISOString().slice(0, 10);
}

// Recommendation cell — used in the new Recommendation column
function RecommendationCell({ rec }) {
  if (!rec) return <span className="muted">—</span>;
  const typeMap = {
    "Role-Based Cleaning": { cls: "rec-amber", icon: "trash" },
    "Authorization-Based Optimization": { cls: "rec-violet", icon: "merge" },
    "Object-Level Cleaning": { cls: "rec-rose", icon: "down" },
    "Retain": { cls: "rec-green", icon: "check" }
  };
  const meta = typeMap[rec.type] || { cls: "rec-slate", icon: "dot" };
  const icons = {
    trash: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
    merge: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6l4 4 4-4"/><path d="M12 10v8"/></svg>,
    down: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    dot: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>
  };
  return (
    <div className={`rec-cell ${meta.cls}`} title={rec.justification}>
      <span className="rec-icon">{icons[meta.icon]}</span>
      <div className="rec-body">
        <div className="rec-action">{rec.action}</div>
        <div className="rec-type">{rec.type}</div>
      </div>
    </div>
  );
}

function SortIcon({ active, dir }) {
  return (
    <svg className={`sort-icon ${active ? "active" : ""}`} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {active
        ? (dir === "asc" ? <polyline points="6 14 12 8 18 14"/> : <polyline points="6 10 12 16 18 10"/>)
        : <><polyline points="6 9 12 4 18 9"/><polyline points="6 15 12 20 18 15"/></>
      }
    </svg>
  );
}

function ChevDown({ open }) {
  return (
    <svg className={`chev ${open ? "open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18"/>
    </svg>
  );
}

function highlight(text, query) {
  if (!query || !text) return text;
  const idx = String(text).toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text;
  return (<>{String(text).slice(0, idx)}<mark>{String(text).slice(idx, idx + query.length)}</mark>{String(text).slice(idx + query.length)}</>);
}

function ExportPreviewModal({ onConfirm, onClose, columns, hidden, filters, rowCount }) {
  const visibleCols = columns.filter(c => !hidden.has(c.key));
  const hiddenCols  = columns.filter(c => hidden.has(c.key));

  const activeFilters = filters.filter(f => f.active);

  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-box export-preview-modal" role="dialog" aria-modal="true" aria-labelledby="export-preview-title">

        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title" id="export-preview-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: "middle" }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export Preview
            </h3>
            <p className="modal-sub">Review your selection before downloading</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="export-preview-body">

          {/* Active filters */}
          <div className="export-section">
            <div className="export-section-head">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Active Filters
              {activeFilters.length === 0 && <span className="export-none-badge">None</span>}
            </div>
            {activeFilters.length > 0 && (
              <div className="export-filter-list">
                {activeFilters.map(f => (
                  <div className="export-filter-chip" key={f.label}>
                    <span className="export-filter-label">{f.label}</span>
                    <span className="export-filter-value">{f.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Included columns */}
          <div className="export-section">
            <div className="export-section-head">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
              Included Columns
              <span className="export-count-badge">{visibleCols.length}</span>
            </div>
            <div className="export-col-grid">
              {visibleCols.map((c, i) => (
                <div className="export-col-chip export-col-included" key={c.key}>
                  <span className="export-col-num">{i + 1}</span>
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          {/* Excluded columns */}
          {hiddenCols.length > 0 && (
            <div className="export-section">
              <div className="export-section-head export-section-head-muted">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Excluded Columns
                <span className="export-count-badge export-count-badge-muted">{hiddenCols.length}</span>
              </div>
              <div className="export-col-grid">
                {hiddenCols.map(c => (
                  <div className="export-col-chip export-col-excluded" key={c.key}>{c.label}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="export-preview-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}

function LicenseOptimizationPage() {
  const data = window.LICENSE_DATA;
  const [query, setQuery] = React.useState("");
  const [licenseFilter, setLicenseFilter] = React.useState("All");

  const [mismatchFilter, setMismatchFilter] = React.useState("All");
  const [redundantFilter, setRedundantFilter] = React.useState("All");
  const [authUsageFilter, setAuthUsageFilter] = React.useState("All");
  const [sort, setSort] = React.useState({ key: "firstName", dir: "asc" });
  const [expandedUsers, setExpandedUsers] = React.useState(new Set());
  const [expandedAssignments, setExpandedAssignments] = React.useState(new Set());
  const [expandedRoles, setExpandedRoles] = React.useState(new Set());
  const [selectedUsers, setSelectedUsers] = React.useState(new Set());
  const [pageSize] = React.useState(25);
  const [page, setPage] = React.useState(1);
  const [hidden, setHidden] = React.useState(() => new Set());
  const [chooserOpen, setChooserOpen] = React.useState(false);
  const [exportPreviewOpen, setExportPreviewOpen] = React.useState(false);
  const [redundantRolesModal, setRedundantRolesModal] = React.useState(null); // { user, roles }

  const allocColumns = [
    { key: "name",   label: "Name (First / Last)",            required: true },
    { key: "sapId",  label: "SAP ID" },
    { key: "email",  label: "Email" },
    { key: "actual", label: "Actual Assigned License",                 required: true },
    { key: "target", label: "Recommended Target License",  required: true },
    { key: "mismatch", label: "License Mismatch",             required: true },
    { key: "licenseDivision", label: "License Division" },
    { key: "redundant", label: "Redundant Roles" },
    { key: "assignmentSource", label: "Assignment Source" },
    { key: "role",   label: "Roles" },
    { key: "roleType", label: "Role Type" },
    { key: "auth",   label: "Auth Objects" },
    { key: "authDesc", label: "Auth Description" },
    { key: "field",  label: "Auth Field" },
    { key: "values", label: "Auth Value" },
    { key: "fstat",  label: "Field Status" },
    { key: "usage", label: "Auth Usage Count" },
    { key: "lastUsed", label: "Last Used Date" },
    { key: "lic",    label: "License" }
    // { key: "rec",    label: "Recommendation" }
  ];
  function show(k) { return k !== "rec" && !hidden.has(k); }
  function toggleColumn(k) {
    setHidden(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  }

  const topKpis = React.useMemo(() => {
    const totals = {
      users: data.users.length,
      activeUsers: 0,
      inactiveUsers: 0,
      professional: 0,
      functional: 0,
      productivity: 0,
      licenseMatches: 0,
      licenseMismatches: 0,
      licenseMatchRate: 0,
      rolesCreated: data.totals?.roles || data.rolesAggregated?.length || 0,
      assignedRoles: 0
    };

    data.users.forEach(user => {
      if (user.status === "Active") totals.activeUsers++;
      else totals.inactiveUsers++;

      if (user.targetLicense === "HD Professional") totals.professional++;
      else if (user.targetLicense === "HD Functional") totals.functional++;
      else if (user.targetLicense === "HD Productivity") totals.productivity++;

      if ((user.license || "NA") === (user.targetLicense || "NA")) totals.licenseMatches++;
      else totals.licenseMismatches++;

      totals.assignedRoles += user.roleCount || user.roles.length;
    });

    totals.licenseMatchRate = totals.users
      ? Math.round((totals.licenseMatches / totals.users) * 100)
      : 0;

    return totals;
  }, [data.users]);

  const filtered = React.useMemo(() => {
    let list = data.users;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(u =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.sapId.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    if (licenseFilter !== "All") list = list.filter(u => u.license === licenseFilter);

    if (mismatchFilter !== "All") {
      const wantMismatch = mismatchFilter === "Mismatch";
      list = list.filter(u => {
        const isMismatch = (u.license || "NA") !== (u.targetLicense || "NA");
        return wantMismatch ? isMismatch : !isMismatch;
      });
    }
    if (redundantFilter !== "All") {
      const wantRedundant = redundantFilter === "Yes";
      list = list.filter(u => {
        const hasRedundant = getRedundantRoleCount(u) > 0;
        return wantRedundant ? hasRedundant : !hasRedundant;
      });
    }
    if (authUsageFilter !== "All") {
      const wantUsed = authUsageFilter === "Used";
      list = list.filter(u => {
        const allAuthObjs = u.roles.flatMap(r => r.authObjs).concat(u.directAuthObjs || []);
        return wantUsed
          ? allAuthObjs.some(a => a.fieldStatus !== "Unused")
          : allAuthObjs.every(a => a.fieldStatus === "Unused");
      });
    }
    list = [...list].sort((a, b) => {
      const k = sort.key, av = a[k], bv = b[k];
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [data.users, query, licenseFilter, mismatchFilter, redundantFilter, authUsageFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const selectedInFilteredCount = filtered.filter(u => selectedUsers.has(u.id)).length;

  function toggleSort(key) { setSort((s) => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }); }
  function toggleUser(id) {
    setExpandedUsers((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAssignment(key) {
    setExpandedAssignments((s) => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }
  function toggleRole(key) {
    setExpandedRoles((s) => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }
  function toggleSelectedUser(id) {
    setSelectedUsers((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function toggleVisibleUsers() {
    setSelectedUsers((s) => {
      const n = new Set(s);
      const allVisibleSelected = visible.length > 0 && visible.every(u => n.has(u.id));
      visible.forEach(u => allVisibleSelected ? n.delete(u.id) : n.add(u.id));
      return n;
    });
  }
  function expandAll() {
    const u = new Set(visible.map(x => x.id));
    const a = new Set();
    const r = new Set();
    visible.forEach(x => {
      if ((x.directAuthObjs || []).length > 0) a.add(`${x.id}::direct`);
      if (x.roles.length > 0) {
        a.add(`${x.id}::indirect`);
        x.roles.forEach((role, roleIndex) => r.add(`${x.id}::indirect::${role.name}::${roleIndex}`));
      }
    });
    setExpandedUsers(u); setExpandedAssignments(a); setExpandedRoles(r);
  }
  function collapseAll() { setExpandedUsers(new Set()); setExpandedAssignments(new Set()); setExpandedRoles(new Set()); }

  // Aggregate user-level rec summary (count of roles needing action)
  function userRecSummary(u) {
    const actionable = u.roles.filter(r => r.recommendation && r.recommendation.type !== "Retain").length;
    return actionable;
  }

  // Build active filter descriptors for the export preview
  function buildActiveFilters() {
    const f = [];
    if (query) f.push({ label: "Search", value: `"${query}"` });
    if (licenseFilter !== "All") f.push({ label: "Recommended User License", value: licenseFilter });
    if (mismatchFilter !== "All") f.push({ label: "License Match", value: mismatchFilter });
    if (redundantFilter !== "All") f.push({ label: "Redundant Roles", value: redundantFilter });
    if (authUsageFilter !== "All") f.push({ label: "Auth Usage", value: authUsageFilter });
    if (selectedInFilteredCount > 0) f.push({ label: "Selection", value: `${selectedInFilteredCount} users selected` });
    return f.map(x => ({ ...x, active: true }));
  }

  // Export current view as CSV — only visible columns + filtered users
  function exportCsv() {
    const cols = allocColumns.filter(c => !hidden.has(c.key));
    const head = cols.map(c => c.label);
    const rows = [head];
    const exportUsers = selectedInFilteredCount > 0
      ? filtered.filter(u => selectedUsers.has(u.id))
      : filtered;
    exportUsers.forEach(u => {
      // one row per role per user (so license counts make sense per role)
      u.roles.forEach(role => {
        const row = [];
        cols.forEach(c => {
          if (c.key === "name") row.push(`${u.firstName} ${u.lastName}`);
          else if (c.key === "sapId") row.push(u.sapId);
          else if (c.key === "email") row.push(u.email);
          else if (c.key === "pro") row.push(role.licenseCounts.professional);
          else if (c.key === "func") row.push(role.licenseCounts.functional);
          else if (c.key === "prod") row.push(role.licenseCounts.productivity);
          else if (c.key === "actual") row.push(u.license);
          else if (c.key === "target") row.push(u.targetLicense);
          else if (c.key === "mismatch") row.push(u.license === u.targetLicense ? "No Change" : "Mismatched");
          else if (c.key === "licenseDivision") row.push(`${u.licenseCounts.productivity} | ${u.licenseCounts.functional} | ${u.licenseCounts.professional}`);
          else if (c.key === "redundant") {
            const rc = getRedundantRoleCount(u);
            row.push(rc > 0 ? `Yes (${rc})` : "No");
          }
          else if (c.key === "role") row.push(role.name);
          else if (c.key === "roleType") row.push(role.type || "Single");
          else if (c.key === "assignmentSource") row.push("");
          else if (c.key === "auth") row.push(role.authObjs.length);
          else if (c.key === "authDesc") row.push("");
          else if (c.key === "usage") {
            const usage = authUsageCounts(role.authObjs);
            row.push(usage.used);
          }
          else if (c.key === "lastUsed") row.push("");
          else if (c.key === "field") row.push("");
          else if (c.key === "values") row.push("");
          else if (c.key === "fstat") row.push("");
          else if (c.key === "lic") row.push(role.targetLicense);
          // else if (c.key === "rec") row.push(role.recommendation ? `${role.recommendation.type}: ${role.recommendation.action}` : "");
        });
        rows.push(row);
      });
    });
    const csv = rows.map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "license-allocation.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <div className="page-breadcrumb">
        <div className="crumbs">
          <a className="crumb-home crumb-link" href="/">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>
            </svg>
            Home
          </a>
          <span className="crumb-sep">/</span>
          <a className="crumb-link" href="/">Analysis Runs</a>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">License Optimization</span>
        </div>
        <div className="breadcrumb-right">
          {(() => {
            const params = new URLSearchParams(window.location.search);
            const system = params.get("system");
            const run    = params.get("run");
            return (
              <>
                {system && (
                  <div className="run-system-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/>
                      <path d="M8 21h8M12 17v4"/>
                    </svg>
                    {system}
                  </div>
                )}
                <div className="live-indicator"><span className="live-dot" /> Live</div>
              </>
            );
          })()}
        </div>
      </div>

      <div className="page-title-row">
        <div className="title-left">
          <div className="title-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B5BDB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="9" r="3"/><path d="M11.5 11.5l8 8"/><path d="M16 16l-2.5 2.5 2 2 2.5-2.5"/>
            </svg>
          </div>
          <div>
            <h1 className="page-title">License Optimization</h1>
            <p className="page-sub">Analyze and optimize SAP user license allocation across your organization.</p>
          </div>
        </div>
        <div className="title-right">
          
        </div>
      </div>

      <div className="top-kpi-grid" aria-label="License optimization KPIs">
        <TopKpiCard
          tone="blue"
          label="No. of Users"
          value={topKpis.users}
          sub="Total SAP users analyzed"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <TopKpiCard
          tone="green"
          label="Active and Inactive Users"
          sub="Inactive includes locked and expired"
          layout="chart"
          breakdown={[
            { label: "Active", value: topKpis.activeUsers, tone: "green" },
            { label: "Inactive", value: topKpis.inactiveUsers, tone: "slate" }
          ]}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/><path d="M21 12a9 9 0 1 1-3.2-6.9"/></svg>}
        />
        <TopKpiCard
          tone="violet"
          label="License Classification"
          sub="By Recommended Target License"
          layout="chart"
          breakdown={[
            { label: "Professional", shortLabel: "PROF", value: topKpis.professional, tone: "violet" },
            { label: "Functional", shortLabel: "FUNC", value: topKpis.functional, tone: "cyan" },
            { label: "Productivity", shortLabel: "PROD", value: topKpis.productivity, tone: "blue" }
          ]}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 14l9 5 9-5"/><path d="M3 11l9 5 9-5"/></svg>}
        />
        <TopKpiCard
          tone="green"
          label="License Match Rate"
          value={`${topKpis.licenseMatchRate}%`}
          sub={`${topKpis.licenseMatches.toLocaleString()} matched / ${topKpis.licenseMismatches.toLocaleString()} mismatched`}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
        />
        <TopKpiCard
          tone="amber"
          label="Total Roles Created"
          value={topKpis.rolesCreated}
          sub={`${topKpis.assignedRoles.toLocaleString()} assigned roles`}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 14l9 5 9-5"/><path d="M3 11l9 5 9-5"/></svg>}
        />
      </div>

      <div className="section-divider"><span>USER LICENSE DETAILS</span></div>

      <div className="card">
        <div className="card-head">
          <div>
            <h2 className="card-title">License Allocation Tree</h2>
            <p className="card-sub">Expand any user to see their roles and authorisation objects. Each role carries an optimization recommendation.</p>
          </div>
        </div>

        <div className="card-toolbar card-toolbar-stacked">
          <div className="toolbar-row toolbar-filters">
            <div className="search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search first name, last name, SAP ID, email…" />
            </div>
            <select className="select" value={licenseFilter} onChange={(e) => { setLicenseFilter(e.target.value); setPage(1); }}>
              <option value="All">Recommended User License</option>
              {data.licenses.map(l => <option key={l}>{l}</option>)}
            </select>
            <select className="select" value={mismatchFilter} onChange={(e) => { setMismatchFilter(e.target.value); setPage(1); }}>
              <option value="All">License Match</option>
              <option value="Match">Match</option>
              <option value="Mismatch">Mismatch</option>
            </select>
            <select className="select" value={redundantFilter} onChange={(e) => { setRedundantFilter(e.target.value); setPage(1); }}>
              <option value="All">Redundant Roles</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <select className="select" value={authUsageFilter} onChange={(e) => { setAuthUsageFilter(e.target.value); setPage(1); }}>
              <option value="All">Auth Usage</option>
              <option value="Used">Used</option>
              <option value="Unused">Unused</option>
            </select>
          </div>
          <div className="toolbar-row toolbar-actions">
            <div className="col-chooser-wrap">
              <button className="btn-ghost" onClick={() => setChooserOpen(o => !o)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
                Columns
                {hidden.size > 0 && <span className="col-chooser-badge">{allocColumns.length - hidden.size}</span>}
              </button>
              {window.ColumnChooser ? React.createElement(window.ColumnChooser, {
                open: chooserOpen,
                columns: allocColumns,
                hidden,
                onToggle: toggleColumn,
                onClose: () => setChooserOpen(false)
              }) : null}
            </div>
            <button className="btn-ghost" onClick={() => setExportPreviewOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Excel{selectedInFilteredCount > 0 ? ` (${selectedInFilteredCount})` : ""}
            </button>
            <button className="link-btn" onClick={expandAll}>Expand all</button>
            <button className="link-btn" onClick={collapseAll}>Collapse all</button>
            {selectedInFilteredCount > 0 && <span className="count-text">{selectedInFilteredCount.toLocaleString()} selected</span>}
            <span className="count-text">{filtered.length.toLocaleString()} users</span>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table tree-table">
            <thead>
              <tr>
                <th className="col-select">
                  <input
                    type="checkbox"
                    className="row-check"
                    checked={visible.length > 0 && visible.every(u => selectedUsers.has(u.id))}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = visible.some(u => selectedUsers.has(u.id)) && !visible.every(u => selectedUsers.has(u.id));
                      }
                    }}
                    onChange={toggleVisibleUsers}
                    aria-label="Select visible users"
                  />
                </th>
                <th style={{ width: 32 }}></th>
                {show("name")   && <th onClick={() => toggleSort("firstName")} className="sortable">Name <SortIcon active={sort.key === "firstName"} dir={sort.dir} /></th>}
                {show("sapId")  && <th onClick={() => toggleSort("sapId")} className="sortable">SAP ID <SortIcon active={sort.key === "sapId"} dir={sort.dir} /></th>}
                {show("email")  && <th>Email</th>}
                {show("actual") && <th onClick={() => toggleSort("license")} className="sortable">Actual Assigned License <SortIcon active={sort.key === "license"} dir={sort.dir} /></th>}
                {show("target") && (
                  <th onClick={() => toggleSort("targetLicense")} className="sortable">
                    <span className="th-with-info">
                      Recommended Target License
                      <SortIcon active={sort.key === "targetLicense"} dir={sort.dir} />
                      <span className="th-info-wrap" role="tooltip" aria-label="Recommended Target License logic" onClick={e => e.stopPropagation()}>
                        <svg className="th-info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span className="th-tooltip">
                          <span className="th-tooltip-title">How is this determined?</span>
                          <span className="th-tooltip-row">
                            <span>The recommended license is the <b>highest license tier</b> found across all authorization objects assigned to the user.</span>
                          </span>
                          <span className="th-tooltip-divider"/>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-tier th-tooltip-tier-pro">Pro</span>
                            <span><b>HD Professional</b> — highest priority</span>
                          </span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-tier th-tooltip-tier-func">Func</span>
                            <span><b>HD Functional</b></span>
                          </span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-tier th-tooltip-tier-prod">Prod</span>
                            <span><b>HD Productivity</b> — lowest priority</span>
                          </span>
                          <span className="th-tooltip-divider"/>
                          <span className="th-tooltip-note">If no licensed auth objects exist, the value is NA.</span>
                        </span>
                      </span>
                    </span>
                  </th>
                )}
                {show("mismatch") && (
                  <th>
                    <span className="th-with-info">
                      License Mismatch
                      <span className="th-info-wrap" role="tooltip" aria-label="License Mismatch logic">
                        <svg className="th-info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span className="th-tooltip">
                          <span className="th-tooltip-title">License Mismatch Logic</span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-dot th-tooltip-dot-green"/>
                            <span><b>No Change</b> — Actual Assigned License matches Recommended Target License</span>
                          </span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-dot th-tooltip-dot-red"/>
                            <span><b>Mismatched</b> — Actual Assigned License differs from Recommended Target License</span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </th>
                )}
                {show("licenseDivision") && <th>License Division</th>}
                {show("redundant") && <th>Redundant Roles</th>}
                {show("assignmentSource") && (
                  <th>
                    <span className="th-with-info">
                      Assignment Source
                      <span className="th-info-wrap" role="tooltip" aria-label="Assignment Source logic">
                        <svg className="th-info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span className="th-tooltip">
                          <span className="th-tooltip-title">Assignment Source Logic</span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-dot th-tooltip-dot-green"/>
                            <span><b>Direct</b> — Auth object is assigned to the user via a profile</span>
                          </span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-dot th-tooltip-dot-amber"/>
                            <span><b>Indirect</b> — Auth object is assigned to the user via a role</span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </th>
                )}
                {show("role")   && <th onClick={() => toggleSort("roleCount")} className="sortable">Roles <SortIcon active={sort.key === "roleCount"} dir={sort.dir} /></th>}
                {show("roleType") && <th>Role Type</th>}
                {show("auth")   && <th>Auth Objects</th>}
                {show("authDesc") && <th>Auth Description</th>}
                {show("field")  && <th>Auth Field</th>}
                {show("values") && <th>Auth Value</th>}
                {show("fstat")  && <th>Field Status</th>}
                {show("usage") && <th>Auth Usage Count</th>}
                {show("lastUsed") && <th>Last Used Date</th>}
                {show("lic")    && <th>License</th>}
                {/* {show("rec")    && <th>Recommendation</th>} */}
                <th style={{ width: 70 }}>View</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => {
                const userOpen = expandedUsers.has(u.id);
                const c = avatarColor(u.id);
                const initials = (u.firstName === "NA" ? u.lastName : u.firstName[0] + u.lastName[0]).toUpperCase().slice(0, 2);
                const actionableCount = userRecSummary(u);
                const rows = [];
                const userUsage = {
                  used: u.authSummary?.used || 0,
                  total: u.authSummary?.total || 0
                };

                // user row
                rows.push(
                  <tr key={`u-${u.id}`} data-user-row={u.id} className={`row-user ${userOpen ? "expanded" : ""}`} onClick={() => toggleUser(u.id)}>
                    <td className="col-select" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="row-check"
                        checked={selectedUsers.has(u.id)}
                        onChange={() => toggleSelectedUser(u.id)}
                        aria-label={`Select ${u.firstName} ${u.lastName}`}
                      />
                    </td>
                    <td className="col-expand"><ChevDown open={userOpen} /></td>
                    {show("name") && (
                      <td>
                        <div className="user-cell">
                          <span className="avatar" style={{ background: c.bg, color: c.fg }}>{initials}</span>
                          <span>{highlight(u.firstName, query)} {highlight(u.lastName, query)}</span>
                        </div>
                      </td>
                    )}
                    {show("sapId")  && <td className="link mono">{highlight(u.sapId, query)}</td>}
                    {show("email")  && <td className={u.email === "NA" ? "muted" : "link"}>{highlight(u.email, query)}</td>}
                    {show("actual") && <td><LicensePill license={u.license} /></td>}
                    {show("target") && <td><LicensePill license={u.targetLicense} /></td>}
                    {show("mismatch") && <td><LicenseMismatchPill actualLicense={u.license} targetLicense={u.targetLicense} /></td>}
                    {show("licenseDivision") && <td><LicenseDivision counts={u.licenseCounts} /></td>}
                    {show("redundant") && <td onClick={e => e.stopPropagation()}><RedundantRolesPill count={getRedundantRoleCount(u)} onClick={() => { const roles = getRedundantRoles(u); if (roles.length) setRedundantRolesModal({ user: u, roles }); }} /></td>}
                    {show("assignmentSource") && <td></td>}
                    {show("role")   && <td className="num">{u.roleCount} {u.roleCount === 1 ? "role" : "roles"}</td>}
                    {show("roleType") && <td></td>}
                    {show("auth")   && <td className="num">{u.authCount.toLocaleString()} auth objs</td>}
                    {show("authDesc") && <td></td>}
                    {show("field")  && <td></td>}
                    {show("values") && <td></td>}
                    {show("fstat")  && <td></td>}
                    {show("usage") && <td className="num">{userUsage.used.toLocaleString()}</td>}
                    {show("lastUsed") && <td></td>}
                    {show("lic")    && <td></td>}
                    {/* {show("rec")    && <td>
                      {actionableCount > 0
                        ? <span className="rec-summary">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 14.5 7.1 17.2 8 11.7 4 7.8 9.5 7z"/></svg>
                            {actionableCount} role{actionableCount > 1 ? "s" : ""} need attention
                          </span>
                        : <span className="rec-summary rec-summary-clean">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            All roles healthy
                          </span>
                      }
                    </td>} */}
                    <td className="col-action">
                      <button className="view-btn" onClick={(e) => { e.stopPropagation(); window.location.href = `user-details?id=${u.id}`; }}>
                        View
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
                      </button>
                    </td>
                  </tr>
                );

                if (userOpen) {
                  // Auth obj/field/value rows that are attached to the user
                  // without going through a role are "Direct". Role-wrapped
                  // auth is always "Indirect" by definition.
                  const directAuthObjs = u.directAuthObjs || [];
                  const indirectRoles = u.roles;
                  const directGroupKey = `${u.id}::direct`;
                  const indirectGroupKey = `${u.id}::indirect`;
                  const directOpen = expandedAssignments.has(directGroupKey);
                  const indirectOpen = expandedAssignments.has(indirectGroupKey);

                  if (directAuthObjs.length > 0) {
                    const directUsage = authUsageCounts(directAuthObjs);
                    rows.push(
                      <tr key={`g-${u.id}-direct`} className={`row-assignment ${directOpen ? "expanded" : ""}`}>
                        <td></td>
                        <td></td>
                        {show("name")   && <td></td>}
                        {show("sapId")  && <td></td>}
                        {show("email")  && <td></td>}
                        {show("actual") && <td></td>}
                        {show("target") && <td></td>}
                        {show("mismatch") && <td></td>}
                        {show("licenseDivision") && <td></td>}
                        {show("redundant") && <td></td>}
                        {show("assignmentSource") && <td>
                          <button type="button" className="assignment-toggle" onClick={() => toggleAssignment(directGroupKey)}>
                            <ChevDown open={directOpen} />
                            <AssignmentPill value="Directly Assigned" />
                          </button>
                        </td>}
                        {show("role")   && <td></td>}
                        {show("roleType") && <td></td>}
                        {show("auth")   && <td className="num">{directAuthObjs.length.toLocaleString()} auth objs</td>}
                        {show("authDesc") && <td></td>}
                        {show("field")  && <td></td>}
                        {show("values") && <td></td>}
                        {show("fstat")  && <td></td>}
                        {show("usage") && <td className="num">{directUsage.used.toLocaleString()}</td>}
                        {show("lastUsed") && <td></td>}
                        {show("lic")    && <td></td>}
                        <td></td>
                      </tr>
                    );

                    if (directOpen) directAuthObjs.forEach((a, ai) => {
                      rows.push(
                        <tr key={`a-${u.id}-direct-${a.name}-${a.field}-${ai}`} className="row-auth">
                          <td></td>
                          <td></td>
                          {show("name")   && <td></td>}
                          {show("sapId")  && <td></td>}
                          {show("email")  && <td></td>}
                          {show("actual") && <td></td>}
                          {show("target") && <td></td>}
                          {show("mismatch") && <td></td>}
                          {show("licenseDivision") && <td></td>}
                          {show("redundant") && <td></td>}
                          {show("assignmentSource") && <td></td>}
                          {show("role")   && <td></td>}
                          {show("roleType") && <td></td>}
                          {show("auth")   && <td className="link mono">{a.name}</td>}
                          {show("authDesc") && <td className="muted">{a.desc || "-"}</td>}
                          {show("field")  && <td className="mono muted">{a.field}</td>}
                          {show("values") && <td className="mono muted">{a.values}</td>}
                          {show("fstat")  && <td><FieldStatusPill status={a.fieldStatus} /></td>}
                          {show("usage") && <td className="num">{a.fieldStatus === "Unused" ? 0 : 1}</td>}
                          {show("lastUsed") && <td className="mono muted">{a.lastUsed || "NA"}</td>}
                          {show("lic")    && <td><LicensePill license={a.license} /></td>}
                          <td></td>
                        </tr>
                      );
                    });
                  }

                  if (indirectRoles.length > 0) {
                    const indirectAuthRows = indirectRoles.flatMap(role => role.authObjs.map((auth, authIndex) => ({ role, auth, authIndex })));
                    const indirectUsage = authUsageCounts(indirectAuthRows.map(row => row.auth));

                    rows.push(
                      <tr key={`g-${u.id}-indirect`} className={`row-assignment ${indirectOpen ? "expanded" : ""}`}>
                        <td></td>
                        <td></td>
                        {show("name")   && <td></td>}
                        {show("sapId")  && <td></td>}
                        {show("email")  && <td></td>}
                        {show("actual") && <td></td>}
                        {show("target") && <td></td>}
                        {show("mismatch") && <td></td>}
                        {show("licenseDivision") && <td></td>}
                        {show("redundant") && <td></td>}
                        {show("assignmentSource") && <td>
                          <button type="button" className="assignment-toggle" onClick={() => toggleAssignment(indirectGroupKey)}>
                            <ChevDown open={indirectOpen} />
                            <AssignmentPill value="Indirectly Assigned" />
                          </button>
                        </td>}
                        {show("role")   && <td></td>}
                        {show("roleType") && <td></td>}
                        {show("auth")   && <td className="num">{indirectAuthRows.length.toLocaleString()} auth objs</td>}
                        {show("authDesc") && <td></td>}
                        {show("field")  && <td></td>}
                        {show("values") && <td></td>}
                        {show("fstat")  && <td></td>}
                        {show("usage") && <td className="num">{indirectUsage.used.toLocaleString()}</td>}
                        {show("lastUsed") && <td></td>}
                        {show("lic")    && <td></td>}
                        <td></td>
                      </tr>
                    );

                    if (indirectOpen) indirectRoles.forEach((role, roleIndex) => {
                      const rkey = `${u.id}::indirect::${role.name}::${roleIndex}`;
                      const roleOpen = expandedRoles.has(rkey);
                      const roleUsage = authUsageCounts(role.authObjs);

                      rows.push(
                        <tr key={`r-${rkey}`} className={`row-role ${roleOpen ? "expanded" : ""}`} onClick={() => toggleRole(rkey)}>
                          <td></td>
                          <td></td>
                          {show("name")   && <td></td>}
                          {show("sapId")  && <td></td>}
                          {show("email")  && <td></td>}
                          {show("actual") && <td></td>}
                          {show("target") && <td></td>}
                          {show("mismatch") && <td></td>}
                          {show("licenseDivision") && <td></td>}
                          {show("redundant") && <td></td>}
                          {show("assignmentSource") && <td></td>}
                          {show("role")   && <td className="role-cell">
                            <ChevDown open={roleOpen} />
                            <span className="mono role-name">{role.name}</span>
                            <span className="muted role-meta">· {role.authObjs.length} auth objs</span>
                          </td>}
                          {show("roleType") && <td><RoleTypePill value={role.type} /></td>}
                          {show("auth")   && <td></td>}
                          {show("authDesc") && <td></td>}
                          {show("field")  && <td></td>}
                          {show("values") && <td></td>}
                          {show("fstat")  && <td></td>}
                          {show("usage") && <td className="num">{roleUsage.used.toLocaleString()}</td>}
                          {show("lastUsed") && <td></td>}
                          {show("lic")    && <td></td>}
                          <td></td>
                        </tr>
                      );

                      if (roleOpen) {
                        role.authObjs.forEach((a, ai) => {
                          rows.push(
                            <tr key={`a-${rkey}-${ai}`} className="row-auth">
                              <td></td>
                              <td></td>
                              {show("name")   && <td></td>}
                              {show("sapId")  && <td></td>}
                              {show("email")  && <td></td>}
                              {show("actual") && <td></td>}
                              {show("target") && <td></td>}
                              {show("mismatch") && <td></td>}
                              {show("licenseDivision") && <td></td>}
                              {show("redundant") && <td></td>}
                              {show("assignmentSource") && <td></td>}
                              {show("role")   && <td></td>}
                              {show("roleType") && <td></td>}
                              {show("auth")   && <td className="link mono">{a.name}</td>}
                              {show("authDesc") && <td className="muted">{a.desc || "-"}</td>}
                              {show("field")  && <td className="mono muted">{a.field}</td>}
                              {show("values") && <td className="mono muted">{a.values}</td>}
                              {show("fstat")  && <td><FieldStatusPill status={a.fieldStatus} /></td>}
                              {show("usage") && <td className="num">{a.fieldStatus === "Unused" ? 0 : 1}</td>}
                              {show("lastUsed") && <td className="mono muted">{getAuthLastUsedDate(u, role, a, ai)}</td>}
                              {show("lic")    && <td><LicensePill license={a.license} /></td>}
                              <td></td>
                            </tr>
                          );
                        });
                      }
                    });
                  }
                }

                return rows;
              })}
              {visible.length === 0 && (
                <tr><td colSpan={3 + allocColumns.filter(c => !hidden.has(c.key)).length} className="empty-state">No users match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer">
          <div className="muted">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length.toLocaleString()} users
          </div>
          <div className="pager">
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            {pageWindow(page, totalPages).map((p, i) =>
              p === "…"
                ? <span key={`e${i}`} className="muted">…</span>
                : <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            )}
            <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
            <select className="select sm">
              <option>25 / page</option>
              <option>50 / page</option>
              <option>100 / page</option>
            </select>
          </div>
        </div>
      </div>


      <div className="section-divider"><span>ROLE LICENSE DETAILS</span></div>

      {window.RoleClassificationCard ? React.createElement(window.RoleClassificationCard) : null}

      {exportPreviewOpen && (
        <ExportPreviewModal
          columns={allocColumns}
          hidden={hidden}
          filters={buildActiveFilters()}
          rowCount={selectedInFilteredCount > 0 ? selectedInFilteredCount : filtered.length}
          onConfirm={() => { setExportPreviewOpen(false); exportCsv(); }}
          onClose={() => setExportPreviewOpen(false)}
        />
      )}
      {redundantRolesModal && (
        <RedundantRolesModal
          roles={redundantRolesModal.roles}
          userName={`${redundantRolesModal.user.firstName} ${redundantRolesModal.user.lastName}`}
          onClose={() => setRedundantRolesModal(null)}
        />
      )}
    </div>
  );
}

function pageWindow(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out = [1];
  if (page > 3) out.push("…");
  for (let p = Math.max(2, page - 1); p <= Math.min(total - 1, page + 1); p++) out.push(p);
  if (page < total - 2) out.push("…");
  out.push(total);
  return out;
}

window.LicenseOptimizationPage = LicenseOptimizationPage;
