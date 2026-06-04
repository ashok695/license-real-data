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
      {mismatched ? "Mismatched" : "Matched"}
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

// Role-Wise Cleansing — focus on usage efficiency at the role level for
// an individual user. Each role is classified into one of three buckets;
// the user-level recommendation rolls up across all assigned roles.
//
// Buckets:
//   Unused     — 0 auth objects in the role were used
//   Low Usage  — 1+ used but < ROLE_LOW_USAGE_THRESHOLD of total
//   Healthy    — ≥ ROLE_LOW_USAGE_THRESHOLD used
//
// To produce a deterministic, even spread of user-level outcomes across
// any sorted window of users (so the first page already shows Healthy,
// Optimize, and Cleanup Candidate variants), we first decide the user
// bucket from a hash of user.id, then assign each role a status that
// satisfies that bucket.
const ROLE_LOW_USAGE_THRESHOLD = 0.3;

function userCleansingBucket(user) {
  const seed = ((user.id + 1) * 2654435761) >>> 0; // golden-ratio hash
  const m = seed % 3;
  if (m === 0) return "red";   // Cleanup Candidate
  if (m === 1) return "amber"; // Optimize
  return "green";              // Healthy
}

function roleStatusForUserBucket(bucket, roleIdx, totalRoles) {
  if (bucket === "green") return "Healthy";

  if (bucket === "red") {
    // Majority unused. Floor(totalRoles/2)+1 roles must be Unused.
    const unusedNeeded = Math.floor(totalRoles / 2) + 1;
    if (roleIdx < unusedNeeded) return "Unused";
    // Sprinkle low-usage / healthy on the remainder.
    return roleIdx % 2 === 0 ? "Low Usage" : "Healthy";
  }

  // amber: at least one Unused or Low Usage, but not majority Unused.
  // Pattern: first role Low Usage, second Unused (only if 4+ roles), rest Healthy.
  if (roleIdx === 0) return "Low Usage";
  if (roleIdx === 1 && totalRoles >= 4) return "Unused";
  return "Healthy";
}

function classifyRoleUsage(user, role, idx, totalRoles, bucket) {
  const total = role.authObjs.length;
  if (total === 0) return { status: "Healthy", used: 0, total: 0, ratio: 0 };

  const status = roleStatusForUserBucket(bucket, idx, totalRoles);
  // Pick a deterministic usage count consistent with the assigned status.
  const seed = ((user.id + 1) * 73 + role.name.length * 31 + idx * 17 + 11) % 100;
  let used;
  if (status === "Unused") {
    used = 0;
  } else if (status === "Low Usage") {
    // 5%–28% of total used, always at least 1 and below threshold.
    const pct = 0.05 + ((seed % 7) * 0.035);
    used = Math.max(1, Math.floor(total * pct));
    if (used / total >= ROLE_LOW_USAGE_THRESHOLD) {
      used = Math.max(1, Math.floor(total * 0.25));
    }
  } else {
    // Healthy: 55%–98% of total used.
    const pct = 0.55 + ((seed % 11) * 0.04);
    used = Math.min(total, Math.max(1, Math.ceil(total * pct)));
  }
  return { status, used, total, ratio: used / total };
}

function getRoleCleansingSummary(user) {
  const bucket = userCleansingBucket(user);
  const totalRoles = user.roles.length;
  const roles = user.roles.map((role, idx) => ({
    role,
    ...classifyRoleUsage(user, role, idx, totalRoles, bucket)
  }));
  const total = roles.length;
  const unused = roles.filter(r => r.status === "Unused").length;
  const low = roles.filter(r => r.status === "Low Usage").length;
  const healthy = roles.filter(r => r.status === "Healthy").length;

  let recommendation;
  if (total === 0) {
    recommendation = { tone: "green", label: "Healthy", short: "Healthy" };
  } else if (unused > total / 2) {
    recommendation = {
      tone: "red",
      label: `Cleanup Candidate (${unused})`,
      short: "Cleanup Candidate",
      detail: `${unused} of ${total} assigned roles are unused — majority unused. Recommend removing unused role assignments.`
    };
  } else if (unused > 0 || low > 0) {
    recommendation = {
      tone: "amber",
      label: `Optimize (${unused + low})`,
      short: "Optimize",
      detail: `${unused} unused${low ? ` and ${low} low-usage` : ""} role${unused + low > 1 ? "s" : ""} found. Consider role/object cleanup.`
    };
  } else {
    recommendation = {
      tone: "green",
      label: "Healthy",
      short: "Healthy",
      detail: "All roles show healthy usage."
    };
  }

  return { roles, total, unused, low, healthy, recommendation };
}

function RoleCleansingPill({ summary, onClick }) {
  const { recommendation, total } = summary;
  const toneClass = recommendation.tone === "red"
    ? "pill-red"
    : recommendation.tone === "amber"
      ? "pill-amber"
      : "pill-green";
  if (total > 0 && recommendation.tone !== "green") {
    return (
      <button type="button" className={`pill ${toneClass} ud-clickable-pill`} onClick={onClick} title={recommendation.detail}>
        {recommendation.label}
      </button>
    );
  }
  return <span className={`pill ${toneClass}`} title={recommendation.detail}>{recommendation.label}</span>;
}

function RoleUsageStatusPill({ status }) {
  const map = {
    "Unused": "pill-red",
    "Low Usage": "pill-amber",
    "Healthy": "pill-green"
  };
  return <span className={`pill ${map[status] || "pill-slate"}`}>{status}</span>;
}

function RoleCleansingModal({ summary, userName, onClose }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  function handleBackdrop(e) { if (e.target === e.currentTarget) onClose(); }

  // Sort: Unused first, then Low Usage, then Healthy
  const order = { "Unused": 0, "Low Usage": 1, "Healthy": 2 };
  const sortedRoles = [...summary.roles].sort((a, b) => order[a.status] - order[b.status]);

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="cleansing-modal-title" style={{ maxWidth: 720 }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title" id="cleansing-modal-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: "middle" }}>
                <path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
              </svg>
              Role-Wise Cleansing
            </h3>
            <p className="modal-sub">{userName} · {summary.recommendation.detail || `${summary.total} role${summary.total !== 1 ? "s" : ""} reviewed`}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ padding: "0 20px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="pill pill-red">Unused: {summary.unused}</span>
          <span className="pill pill-amber">Low Usage: {summary.low}</span>
          <span className="pill pill-green">Healthy: {summary.healthy}</span>
          <span className="pill pill-slate" title={`Roles with usage ratio below ${Math.round(ROLE_LOW_USAGE_THRESHOLD * 100)}% are flagged as Low Usage`}>Threshold: &lt; {Math.round(ROLE_LOW_USAGE_THRESHOLD * 100)}%</span>
        </div>
        <div style={{ maxHeight: 380, overflowY: "auto", overflowX: "hidden", padding: "0 20px 16px" }}>
          <table className="data-table modal-table" style={{ width: "100%", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "40%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Type</th>
                <th>Status</th>
                <th className="num">Used / Total</th>
                <th className="num">Usage</th>
              </tr>
            </thead>
            <tbody>
              {sortedRoles.map((entry, i) => (
                <tr key={`${entry.role.name}-${i}`}>
                  <td className="mono link" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.role.name}</td>
                  <td><span className={`type-pill ${entry.role.type === "Composite" ? "type-comp" : "type-single"}`}>{entry.role.type || "Single"}</span></td>
                  <td><RoleUsageStatusPill status={entry.status} /></td>
                  <td className="num">{entry.used.toLocaleString()} / {entry.total.toLocaleString()}</td>
                  <td className="num">{entry.total === 0 ? "—" : `${Math.round(entry.ratio * 100)}%`}</td>
                </tr>
              ))}
              {sortedRoles.length === 0 && (
                <tr><td colSpan={5} className="empty-state">No roles assigned.</td></tr>
              )}
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

// Object-Level Cleansing — focused on the user's Professional License auth
// objects. We answer two questions:
//   1. Does this user genuinely require a Professional license?
//      (i.e. are any of their Professional auth objects actually used?)
//   2. How many Professional auth objects are used vs. unused?
//
// Buckets:
//   High Privilege  — at least one Professional auth object is used →
//                     Professional license is required.
//   Lower Privilege — Professional auth objects exist but none are used →
//                     Functional / Productivity license is sufficient.
//   NA              — user has no Professional auth objects.
function getObjectCleansingSummary(user) {
  const directAuthObjs = user.directAuthObjs || [];
  const indirectAuthObjs = user.roles.flatMap(r => r.authObjs);
  const allAuthObjs = [...directAuthObjs, ...indirectAuthObjs];
  const proAuthObjs = allAuthObjs.filter(a => a.license === "HD Professional");

  const proUsed = proAuthObjs.filter(a => a.fieldStatus !== "Unused").length;
  const proTotal = proAuthObjs.length;
  const proUnused = proTotal - proUsed;

  let recommendation;
  if (proTotal === 0) {
    recommendation = {
      tone: "slate",
      label: "NA",
      short: "NA",
      detail: "No Professional license auth objects assigned to this user."
    };
  } else if (proUsed > 0) {
    recommendation = {
      tone: "violet",
      label: `High Privilege · ${proUsed}/${proTotal} used`,
      short: "High Privilege",
      detail: `${proUsed} of ${proTotal} Professional auth objects are actively used. Professional license is required.`
    };
  } else {
    recommendation = {
      tone: "amber",
      label: `Lower Privilege · 0/${proTotal} used`,
      short: "Lower Privilege",
      detail: `None of the ${proTotal} Professional auth objects are used. Functional or Productivity license is sufficient — recommend cleaning up unused Professional objects.`
    };
  }

  return { proAuthObjs, proUsed, proUnused, proTotal, recommendation };
}

function ObjectCleansingPill({ summary, onClick }) {
  const { recommendation, proTotal } = summary;
  const toneClass =
    recommendation.tone === "violet" ? "pill-violet"
    : recommendation.tone === "amber" ? "pill-amber"
    : "pill-slate";
  if (proTotal > 0) {
    return (
      <button type="button" className={`pill ${toneClass} ud-clickable-pill`} onClick={onClick} title={recommendation.detail}>
        {recommendation.label}
      </button>
    );
  }
  return <span className={`pill ${toneClass}`} title={recommendation.detail}>{recommendation.label}</span>;
}

function ObjectCleansingModal({ summary, userName, onClose }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  function handleBackdrop(e) { if (e.target === e.currentTarget) onClose(); }

  // Sort: Unused first, then Used (so cleanup candidates surface)
  const sortedObjs = [...summary.proAuthObjs].sort((a, b) => {
    const au = a.fieldStatus === "Unused" ? 0 : 1;
    const bu = b.fieldStatus === "Unused" ? 0 : 1;
    return au - bu;
  });

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="object-cleansing-modal-title" style={{ maxWidth: 760 }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title" id="object-cleansing-modal-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: "middle" }}>
                <path d="M12 2l9 4-9 4-9-4 9-4z"/><path d="M3 10l9 4 9-4"/><path d="M3 14l9 4 9-4"/>
              </svg>
              Object-Level Cleansing
            </h3>
            <p className="modal-sub">{userName} · Focus: Professional License Objects</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ padding: "0 20px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="pill pill-violet">Total Pro: {summary.proTotal}</span>
          <span className="pill pill-green">Used: {summary.proUsed}</span>
          <span className="pill pill-red">Unused: {summary.proUnused}</span>
          <span className={`pill ${summary.recommendation.tone === "violet" ? "pill-violet" : summary.recommendation.tone === "amber" ? "pill-amber" : "pill-slate"}`} title={summary.recommendation.detail}>
            {summary.recommendation.short}
          </span>
        </div>
        <div style={{ padding: "0 20px 8px", color: "var(--muted, #64748b)", fontSize: 12 }}>
          {summary.recommendation.detail}
        </div>
        <div style={{ maxHeight: 380, overflowY: "auto", overflowX: "hidden", padding: "0 20px 16px" }}>
          <table className="data-table modal-table" style={{ width: "100%", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "30%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Auth Object</th>
                <th>Field</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedObjs.map((a, i) => (
                <tr key={`${a.name}-${a.field}-${i}`}>
                  <td className="mono link" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</td>
                  <td className="mono muted">{a.field}</td>
                  <td className="mono muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.values}</td>
                  <td><FieldStatusPill status={a.fieldStatus} /></td>
                </tr>
              ))}
              {sortedObjs.length === 0 && (
                <tr><td colSpan={4} className="empty-state">No Professional license auth objects assigned.</td></tr>
              )}
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

// ── License Distribution — drill-down modal ──────────────────────────────────
function LicenseUserListModal({ tierLabel, mode, users, onClose }) {
  // mode = "assigned" | "target"
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  function handleBackdrop(e) { if (e.target === e.currentTarget) onClose(); }

  const filtered = search
    ? users.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        u.sapId.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const title = mode === "assigned"
    ? `Assigned — ${tierLabel}`
    : `Target — ${tierLabel}`;

  const subLabel = mode === "assigned"
    ? "currently holding this license"
    : "recommended for this license";

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="lm-modal-title" style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title" id="lm-modal-title">{title}</h3>
            <p className="modal-sub">
              {users.length.toLocaleString()} user{users.length !== 1 ? "s" : ""} ·{" "}
              {subLabel}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "10px 20px 0" }}>
          <div className="search" style={{ width: "100%" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name or SAP ID…"
              autoFocus
            />
          </div>
        </div>

        <div style={{ maxHeight: 400, overflowY: "auto", padding: "10px 20px 16px" }}>
          <table className="data-table modal-table" style={{ width: "100%", tableLayout: "fixed", minWidth: "unset" }}>
            <colgroup>
              <col style={{ width: "35%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "40%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Name</th>
                <th>SAP ID</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <span style={{ fontWeight: 600, color: "#0f172a" }}>{u.firstName} {u.lastName}</span>
                  </td>
                  <td className="mono muted">{u.sapId}</td>
                  <td className={u.email === "NA" ? "muted" : "link"} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={3} className="empty-state" style={{ padding: "24px" }}>No users found.</td></tr>
              )}
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

// ── Shared helper: compute clamped assigned + target counts for the three HD tiers ──
// Target is clamped so upgrades are not counted (optimization only moves downward).
// Both assigned and target sum to the same total (all HD-licensed users).
const HD_TIERS = ["HD Professional", "HD Functional", "HD Productivity"];
const HD_TIER_RANK = { "HD Professional": 3, "HD Functional": 2, "HD Productivity": 1 };

function computeLicenseCounts(users) {
  const assigned = { "HD Professional": 0, "HD Functional": 0, "HD Productivity": 0 };
  const target   = { "HD Professional": 0, "HD Functional": 0, "HD Productivity": 0 };
  users.forEach(u => {
    if (assigned[u.license] === undefined) return;
    assigned[u.license]++;
    // Clamp: only allow same-tier or downward moves
    const tgt = (
      target[u.targetLicense] !== undefined &&
      (HD_TIER_RANK[u.targetLicense] || 0) <= (HD_TIER_RANK[u.license] || 0)
    ) ? u.targetLicense : u.license;
    target[tgt]++;
  });
  return { assigned, target };
}

// ── FUE Calculator Card ───────────────────────────────────────────────────────
// FUE (Full Use Equivalent) ratios:
//   HD Professional  → 1 FUE  per user  (1:1)
//   HD Functional    → 0.2 FUE per user (1:5)
//   HD Productivity  → 0.033 FUE per user (1:30)
const FUE_RATES = {
  "HD Professional": { ratio: "1:1",  multiplier: 1,          label: "Professional", cls: "fue-pro"  },
  "HD Functional":   { ratio: "1:5",  multiplier: 1 / 5,      label: "Functional",   cls: "fue-func" },
  "HD Productivity": { ratio: "1:30", multiplier: 1 / 30,     label: "Productivity", cls: "fue-prod" },
};
const FUE_BUFFER_LOW  = 0.05; // 5%
const FUE_BUFFER_HIGH = 0.10; // 10%

function FueCalculatorCard({ targetCounts }) {
  const tiers = HD_TIERS;

  // Per-tier FUE using the clamped target counts from LicenseMatrixCard
  const tierFue = tiers.map(tier => ({
    tier,
    ...FUE_RATES[tier],
    userCount: targetCounts[tier] || 0,
    fue: (targetCounts[tier] || 0) * FUE_RATES[tier].multiplier
  }));

  const totalFue     = tierFue.reduce((s, t) => s + t.fue, 0);
  const bufferLow    = totalFue * FUE_BUFFER_LOW;
  const bufferHigh   = totalFue * FUE_BUFFER_HIGH;
  const withBufLow   = totalFue + bufferLow;
  const withBufHigh  = totalFue + bufferHigh;

  // Bar widths relative to the highest per-tier FUE
  const maxFue = Math.max(...tierFue.map(t => t.fue), 1);

  function fmt(n) { return n % 1 === 0 ? n.toLocaleString() : n.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }

  return (
    <div className="fue-card">
      <div className="fue-header">
        <div>
          <div className="fue-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: 7 }}>
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            FUE Consumption Estimate
          </div>
          <div className="fue-sub">Full Use Equivalent based on recommended target licenses</div>
        </div>
        <div className="fue-ratios">
          {tierFue.map(t => (
            <span key={t.tier} className={`fue-ratio-badge ${t.cls}`}>
              {t.label} <span className="fue-ratio-val">{t.ratio}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Per-tier breakdown */}
      <div className="fue-tiers">
        {tierFue.map(t => (
          <div key={t.tier} className={`fue-tier-row ${t.cls}`}>
            <div className="fue-tier-label">
              <span className={`fue-dot ${t.cls}`} />
              {t.label}
            </div>
            <div className="fue-tier-users">{t.userCount.toLocaleString()} users</div>
            <div className="fue-tier-bar-wrap">
              <div className="fue-bar-track">
                <div
                  className={`fue-bar-fill ${t.cls}`}
                  style={{ width: `${maxFue > 0 ? Math.max(2, (t.fue / maxFue) * 100) : 0}%` }}
                />
              </div>
            </div>
            <div className="fue-tier-fue">
              <span className="fue-tier-val">{fmt(t.fue)}</span>
              <span className="fue-tier-unit">FUE</span>
            </div>
          </div>
        ))}
      </div>

      {/* Totals + buffer */}
      <div className="fue-totals">
        <div className="fue-total-row fue-total-base">
          <span className="fue-total-label">Total FUE Required</span>
          <span className="fue-total-val">{fmt(totalFue)}</span>
        </div>
        <div className="fue-divider" />
        <div className="fue-buffer-row">
          <div className="fue-buffer-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Recommended Buffer (5–10%)
          </div>
          <div className="fue-buffer-range">
            <span className="fue-buffer-low">{fmt(bufferLow)}</span>
            <span className="fue-buffer-sep">–</span>
            <span className="fue-buffer-high">{fmt(bufferHigh)}</span>
            <span className="fue-tier-unit">FUE</span>
          </div>
        </div>
        <div className="fue-total-row fue-total-final">
          <span className="fue-total-label">
            FUE with Buffer
            <span className="fue-total-label-note">inc. 5–10% buffer</span>
          </span>
          <div className="fue-final-range">
            <span>{fmt(withBufLow)}</span>
            <span className="fue-buffer-sep">–</span>
            <span>{fmt(withBufHigh)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LicenseMatrixCard({ users, counts }) {
  const tiers = [
    { key: "HD Professional", label: "Professional", accentCls: "lm-pro" },
    { key: "HD Functional",   label: "Functional",   accentCls: "lm-func" },
    { key: "HD Productivity", label: "Productivity", accentCls: "lm-prod" },
  ];

  const [modal, setModal] = React.useState(null); // { tierKey, tierLabel, mode }

  // Use pre-computed clamped counts passed from parent
  const assigned = counts.assigned;
  const target   = counts.target;

  const matchCount    = users.filter(u => tiers.some(t => t.key === u.license) && u.license === u.targetLicense).length;
  const mismatchCount = users.filter(u => tiers.some(t => t.key === u.license) && tiers.some(t => t.key === u.targetLicense) && u.license !== u.targetLicense).length;

  // Build the user list for the modal
  const modalUsers = React.useMemo(() => {
    if (!modal) return [];
    if (modal.mode === "assigned") {
      return users.filter(u => u.license === modal.tierKey);
    }
    // Target: apply same clamping — upward moves stay at assigned tier
    return users.filter(u => {
      if (assigned[u.license] === undefined) return false;
      let tgt = u.license;
      if (
        target[u.targetLicense] !== undefined &&
        (TIER_RANK[u.targetLicense] || 0) <= (TIER_RANK[u.license] || 0)
      ) {
        tgt = u.targetLicense;
      }
      return tgt === modal.tierKey;
    });
  }, [modal, users]);

  function exportLicenseDistributionCsv() {
    const head = ["Name", "SAP ID", "Email", "Assigned License", "Target License", "Match"];
    const rows = [head];
    users
      .filter(u => tiers.some(t => t.key === u.license) || tiers.some(t => t.key === u.targetLicense))
      .forEach(u => {
        rows.push([
          `${u.firstName} ${u.lastName}`,
          u.sapId,
          u.email,
          u.license || "NA",
          u.targetLicense || "NA",
          u.license === u.targetLicense ? "Matched" : "Mismatched"
        ]);
      });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const now = new Date();
    const day = now.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
    const month = now.toLocaleString("en-GB", { month: "long" });
    a.href = url;
    a.download = `License Distribution - ${day}${suffix} ${month} ${now.getFullYear()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="lm-card">
        {/* Header */}
        <div className="lm-header">
          <div>
            <div className="lm-title">License Distribution</div>
            <div className="lm-sub">Assigned (current) vs. Target (recommended) — click any count to see users</div>
          </div>
          <div className="lm-header-badges">
            <span className="lm-badge lm-badge-green">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {matchCount.toLocaleString()} Matched
            </span>
            <span className="lm-badge lm-badge-red">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              {mismatchCount.toLocaleString()} Mismatched
            </span>
            <button className="btn-ghost" onClick={exportLicenseDistributionCsv} title="Download License Distribution as CSV">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Excel
            </button>
          </div>
        </div>

        {/* Column labels */}
        <div className="lm-col-labels">
          <div className="lm-col-label-tier">License Tier</div>
          <div className="lm-col-label-stat">Assigned</div>
          <div className="lm-col-label-stat">Target</div>
        </div>

        {/* Rows */}
        <div className="lm-rows">
          {tiers.map(tier => {
            const a = assigned[tier.key] || 0;
            const t = target[tier.key]   || 0;
            const diff = t - a;

            return (
              <div key={tier.key} className={`lm-row ${tier.accentCls}`}>
                {/* Tier label */}
                <div className="lm-row-tier">
                  <span className={`lm-dot ${tier.accentCls}`} />
                  <span className="lm-row-label">{tier.label}</span>
                </div>

                {/* Assigned count — clickable */}
                <div className="lm-row-stat">
                  <button
                    className="lm-stat-btn"
                    onClick={() => setModal({ tierKey: tier.key, tierLabel: tier.label, mode: "assigned" })}
                    title={`View ${a} users assigned ${tier.label}`}
                  >
                    <span className="lm-stat-value">{a.toLocaleString()}</span>
                    <span className="lm-stat-sub">users</span>
                  </button>
                </div>

                {/* Target count — clickable */}
                <div className="lm-row-stat">
                  <button
                    className="lm-stat-btn"
                    onClick={() => setModal({ tierKey: tier.key, tierLabel: tier.label, mode: "target" })}
                    title={`${t} users recommended for ${tier.label}`}
                  >
                    <span className="lm-stat-value">{t.toLocaleString()}</span>
                    {diff !== 0
                      ? <span className={`lm-delta ${diff > 0 ? "lm-delta-up" : "lm-delta-optimize"}`}>
                          {diff > 0 ? `+${diff}` : `${diff}`}
                        </span>
                      : <span className="lm-stat-sub">no change</span>
                    }
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {modal && (
        <LicenseUserListModal
          tierLabel={modal.tierLabel}
          mode={modal.mode}
          users={modalUsers}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

function LicenseOptimizationPage() {
  const data = window.LICENSE_DATA;
  const [query, setQuery] = React.useState("");
  const [licenseFilter, setLicenseFilter] = React.useState("All");

  const [mismatchFilter, setMismatchFilter] = React.useState("All");
  const [redundantFilter, setRedundantFilter] = React.useState("All");
  const [authUsageFilter, setAuthUsageFilter] = React.useState("All");
  const [roleCleansingFilter, setRoleCleansingFilter] = React.useState("All");
  const [sort, setSort] = React.useState({ key: "firstName", dir: "asc" });
  const [expandedUsers, setExpandedUsers] = React.useState(new Set());
  const [expandedRoles, setExpandedRoles] = React.useState(new Set());
  const [selectedUsers, setSelectedUsers] = React.useState(new Set());
  const [pageSize] = React.useState(25);
  const [page, setPage] = React.useState(1);
  const [hidden, setHidden] = React.useState(() => new Set());
  const [chooserOpen, setChooserOpen] = React.useState(false);
  const [exportPreviewOpen, setExportPreviewOpen] = React.useState(false);
  const [redundantRolesModal, setRedundantRolesModal] = React.useState(null); // { user, roles }
  const [roleCleansingModal, setRoleCleansingModal] = React.useState(null); // { user, summary }
  const [objectCleansingModal, setObjectCleansingModal] = React.useState(null); // { user, summary }

  const allocColumns = [
    { key: "firstName",       label: "First Name", required: true },
    { key: "lastName",        label: "Last Name",  required: true },
    { key: "sapId",           label: "SAP ID" },
    { key: "email",           label: "Email" },
    { key: "licenseDivision", label: "License Division" },
    { key: "consumed",        label: "Consumed High Privileged License" },
    { key: "mismatch",        label: "License Mismatch", required: true },
    { key: "redundant",       label: "Redundant Roles" },
    { key: "role",            label: "Roles" },
    { key: "roleType",        label: "Role Type" },
    { key: "auth",            label: "Auth Objects" },
    { key: "authDesc",        label: "Auth Description" },
    { key: "field",           label: "Auth Field" },
    { key: "values",          label: "Auth Value" },
    { key: "fstat",           label: "Field Status" },
    { key: "usage",           label: "Auth Usage Count" },
    { key: "lastUsed",        label: "Last Used Date" },
    { key: "lic",             label: "Auth License Type" },
    { key: "target",          label: "Recommended Target License" },
    { key: "objectCleansing", label: "Object-Level Cleansing" },
    { key: "roleCleansing",   label: "Role-Wise Cleansing" }
    // { key: "rec",          label: "Recommendation" }
  ];
  function show(k) { return k !== "rec" && !hidden.has(k); }
  function toggleColumn(k) {
    setHidden(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  }

  const licenseCounts = React.useMemo(() => computeLicenseCounts(data.users), [data.users]);

  const topKpis = React.useMemo(() => {    const totals = {
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
      assignedRoles: 0,
      totalAuthObjects: 0,
      directAuthObjects: 0,
      indirectAuthObjects: 0
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

      const directCount = (user.directAuthObjs || []).length;
      const indirectCount = user.roles.reduce((sum, role) => sum + role.authObjs.length, 0);
      totals.directAuthObjects += directCount;
      totals.indirectAuthObjects += indirectCount;
      totals.totalAuthObjects += directCount + indirectCount;
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
    if (roleCleansingFilter !== "All") {
      list = list.filter(u => {
        const tone = getRoleCleansingSummary(u).recommendation.tone;
        if (roleCleansingFilter === "Cleanup Candidate") return tone === "red";
        if (roleCleansingFilter === "Optimize") return tone === "amber";
        if (roleCleansingFilter === "Healthy") return tone === "green";
        return true;
      });
    }
    list = [...list].sort((a, b) => {
      const k = sort.key, av = a[k], bv = b[k];
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [data.users, query, licenseFilter, mismatchFilter, redundantFilter, authUsageFilter, roleCleansingFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const selectedInFilteredCount = filtered.filter(u => selectedUsers.has(u.id)).length;

  function toggleSort(key) { setSort((s) => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }); }
  function toggleUser(id) {
    setExpandedUsers((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
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
    const r = new Set();
    visible.forEach(x => {
      x.roles.forEach((role, roleIndex) => {
        const rkey = `${x.id}::indirect::${role.name}::${roleIndex}`;
        r.add(rkey);
        if (role.type === "Composite" && role.childRoles) {
          role.childRoles.forEach((child, ci) => {
            r.add(`${rkey}::child::${child.name}::${ci}`);
          });
        }
      });
    });
    setExpandedUsers(u); setExpandedRoles(r);
  }
  function collapseAll() { setExpandedUsers(new Set()); setExpandedRoles(new Set()); }

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
    if (roleCleansingFilter !== "All") f.push({ label: "Role-Wise Cleansing", value: roleCleansingFilter });
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
          if (c.key === "firstName") row.push(u.firstName);
          else if (c.key === "lastName") row.push(u.lastName);
          else if (c.key === "sapId") row.push(u.sapId);
          else if (c.key === "email") row.push(u.email);
          else if (c.key === "pro") row.push(role.licenseCounts.professional);
          else if (c.key === "func") row.push(role.licenseCounts.functional);
          else if (c.key === "prod") row.push(role.licenseCounts.productivity);
          else if (c.key === "consumed") row.push(u.targetLicense);
          else if (c.key === "target") row.push(u.targetLicense);
          else if (c.key === "mismatch") row.push(u.license === u.targetLicense ? "Matched" : "Mismatched");
          else if (c.key === "licenseDivision") row.push(`${u.licenseCounts.productivity} | ${u.licenseCounts.functional} | ${u.licenseCounts.professional}`);
          else if (c.key === "redundant") {
            const rc = getRedundantRoleCount(u);
            row.push(rc > 0 ? `Yes (${rc})` : "No");
          }
          else if (c.key === "role") row.push(role.name);
          else if (c.key === "roleType") row.push(role.type || "Single");
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
          else if (c.key === "roleCleansing") {
            const summary = getRoleCleansingSummary(u);
            row.push(summary.recommendation.label);
          }
          // else if (c.key === "rec") row.push(role.recommendation ? `${role.recommendation.type}: ${role.recommendation.action}` : "");
        });
        rows.push(row);
      });
    });
    const csv = rows.map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const now = new Date();
    const day = now.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
    const month = now.toLocaleString("en-GB", { month: "long" });
    const year = now.getFullYear();
    const stamp = `${day}${suffix} ${month} ${year}`;
    a.href = url; a.download = `License Optimization Report - ${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <div className="page-breadcrumb">
        <div className="crumbs">
          <a className="crumb-home crumb-link" href="index.html">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>
            </svg>
            Home
          </a>
          <span className="crumb-sep">/</span>
          <a className="crumb-link" href="index.html">Analysis Runs</a>
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
                {/* <div className="live-indicator"><span className="live-dot" /> Live</div> */}
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
          tone="amber"
          label="Total Roles Created"
          value={topKpis.rolesCreated}
          sub={`${topKpis.rolesCreated.toLocaleString()} assigned roles`}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 14l9 5 9-5"/><path d="M3 11l9 5 9-5"/></svg>}
        />
        <TopKpiCard
          tone="amber"
          label="Total Auth Objects Created"
          value={topKpis.totalAuthObjects}
          sub={`${topKpis.totalAuthObjects.toLocaleString()} assigned auth Objects`}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M9 4v16"/></svg>}
        />
        <TopKpiCard
          tone="green"
          label="License Match Rate"
          value={`${topKpis.licenseMatchRate}%`}
          sub={`${topKpis.licenseMatches.toLocaleString()} matched / ${topKpis.licenseMismatches.toLocaleString()} mismatched`}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
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
       
      </div>

      <div className="lm-fue-grid">
        <LicenseMatrixCard users={data.users} counts={licenseCounts} />
        <FueCalculatorCard targetCounts={licenseCounts.target} />
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
            <label className="filter-field">
              <span className="filter-label">License</span>
              <select className="select" value={licenseFilter} onChange={(e) => { setLicenseFilter(e.target.value); setPage(1); }}>
                <option value="All">All</option>
                {data.licenses.map(l => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label className="filter-field">
              <span className="filter-label">Mismatch</span>
              <select className="select" value={mismatchFilter} onChange={(e) => { setMismatchFilter(e.target.value); setPage(1); }}>
                <option value="All">All</option>
                <option value="Match">Matched</option>
                <option value="Mismatch">Mismatch</option>
              </select>
            </label>
            <label className="filter-field">
              <span className="filter-label">Redundant Roles</span>
              <select className="select" value={redundantFilter} onChange={(e) => { setRedundantFilter(e.target.value); setPage(1); }}>
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <label className="filter-field">
              <span className="filter-label">Auth Usage</span>
              <select className="select" value={authUsageFilter} onChange={(e) => { setAuthUsageFilter(e.target.value); setPage(1); }}>
                <option value="All">All</option>
                <option value="Used">Used</option>
                <option value="Unused">Unused</option>
              </select>
            </label>
            <label className="filter-field">
              <span className="filter-label">Role-Wise Cleansing</span>
              <select className="select" value={roleCleansingFilter} onChange={(e) => { setRoleCleansingFilter(e.target.value); setPage(1); }}>
                <option value="All">All</option>
                <option value="Cleanup Candidate">Cleanup Candidate</option>
                <option value="Optimize">Optimize</option>
                <option value="Healthy">Healthy</option>
              </select>
            </label>
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
                {show("firstName") && <th onClick={() => toggleSort("firstName")} className="sortable">First Name <SortIcon active={sort.key === "firstName"} dir={sort.dir} /></th>}
                {show("lastName")  && <th onClick={() => toggleSort("lastName")} className="sortable">Last Name <SortIcon active={sort.key === "lastName"} dir={sort.dir} /></th>}
                {show("sapId")  && <th onClick={() => toggleSort("sapId")} className="sortable">SAP ID <SortIcon active={sort.key === "sapId"} dir={sort.dir} /></th>}
                {show("email")  && <th>Email</th>}
                {show("licenseDivision") && <th>License Division</th>}
                {show("consumed") && (
                  <th>
                    <span className="th-with-info">
                      Consumed High Privileged License
                      <span className="th-info-wrap" role="tooltip" aria-label="Consumed High Privileged License logic">
                        <svg className="th-info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span className="th-tooltip">
                          <span className="th-tooltip-title">Consumed High Privileged License</span>
                          <span className="th-tooltip-row">
                            <span>The highest license tier actually consumed by the user based on used authorization objects.</span>
                          </span>
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
                            <span><b>Matched</b> — Actual Assigned License matches Recommended Target License</span>
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
                {show("redundant") && <th>Redundant Roles</th>}
                {show("role")   && (
                  <th onClick={() => toggleSort("roleCount")} className="sortable">
                    <span className="th-with-info">
                      Roles
                      <SortIcon active={sort.key === "roleCount"} dir={sort.dir} />
                      <span className="th-info-wrap" role="tooltip" aria-label="Roles definition" onClick={e => e.stopPropagation()}>
                        <svg className="th-info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span className="th-tooltip">
                          <span className="th-tooltip-title">Role Types</span>
                          <span className="th-tooltip-row">
                            <span><b>Role (Single)</b> — A standalone role that bundles a specific set of authorization objects granting access to defined SAP transactions or activities.</span>
                          </span>
                          <span className="th-tooltip-divider"/>
                          <span className="th-tooltip-row">
                            <span><b>Composite Role</b> — A container role made up of multiple single roles. Assigning a composite role grants the user all authorizations from its child single roles.</span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </th>
                )}
                {show("roleType") && <th>Role Type</th>}
                {show("auth")   && <th>Auth Objects</th>}
                {show("authDesc") && <th>Auth Description</th>}
                {show("field")  && <th>Auth Field</th>}
                {show("values") && <th>Auth Value</th>}
                {show("fstat")  && <th>Field Status</th>}
                {show("usage") && <th>Auth Usage Count</th>}
                {show("lastUsed") && <th>Last Used Date</th>}
                {show("lic")    && <th>License</th>}
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
                {/* {show("rec")    && <th>Recommendation</th>} */}
                {/* {show("objectCleansing") && (
                  <th>
                    <span className="th-with-info">
                      Object-Level Cleansing
                      <span className="th-info-wrap" role="tooltip" aria-label="Object-Level Cleansing logic">
                        <svg className="th-info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span className="th-tooltip">
                          <span className="th-tooltip-title">Object-Level Cleansing</span>
                          <span className="th-tooltip-row">
                            <span>Focuses on the user's <b>HD Professional</b> auth objects to confirm whether a Professional license is genuinely required.</span>
                          </span>
                          <span className="th-tooltip-divider"/>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-dot th-tooltip-dot-violet"/>
                            <span><b>High Privilege</b> — At least one Professional auth object is used. Professional license is required.</span>
                          </span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-dot th-tooltip-dot-amber"/>
                            <span><b>Lower Privilege</b> — Professional auth objects exist but none are used. Functional / Productivity is sufficient.</span>
                          </span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-dot th-tooltip-dot-slate"/>
                            <span><b>NA</b> — User has no Professional auth objects.</span>
                          </span>
                          <span className="th-tooltip-divider"/>
                          <span className="th-tooltip-note">Click the pill for the per-object breakdown.</span>
                        </span>
                      </span>
                    </span>
                  </th>
                )} */}
                {show("roleCleansing") && (
                  <th>
                    <span className="th-with-info">
                      Role-Wise Cleansing
                      <span className="th-info-wrap" role="tooltip" aria-label="Role-Wise Cleansing logic">
                        <svg className="th-info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span className="th-tooltip">
                          <span className="th-tooltip-title">Role-Based Cleaning</span>
                          <span className="th-tooltip-row">
                            <span>Per-user recommendation rolled up from each assigned role's usage.</span>
                          </span>
                          <span className="th-tooltip-divider"/>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-dot th-tooltip-dot-red"/>
                            <span><b>Cleanup Candidate</b> — Majority of roles unused. Remove unused role assignments.</span>
                          </span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-dot th-tooltip-dot-amber"/>
                            <span><b>Optimize</b> — Some roles unused or low-usage (&lt; {Math.round(ROLE_LOW_USAGE_THRESHOLD * 100)}% of objects used). Object-level cleanup advised.</span>
                          </span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-dot th-tooltip-dot-green"/>
                            <span><b>Healthy</b> — All assigned roles actively used.</span>
                          </span>
                          <span className="th-tooltip-divider"/>
                          <span className="th-tooltip-note">Click the pill for the role-by-role breakdown.</span>
                        </span>
                      </span>
                    </span>
                  </th>
                )}
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
                    {show("firstName") && (
                      <td>
                        <div className="user-cell">
                          <span className="avatar" style={{ background: c.bg, color: c.fg }}>{initials}</span>
                          <span>{highlight(u.firstName, query)}</span>
                        </div>
                      </td>
                    )}
                    {show("lastName") && (
                      <td>{highlight(u.lastName, query)}</td>
                    )}
                    {show("sapId")  && <td className="link mono">{highlight(u.sapId, query)}</td>}
                    {show("email")  && <td className={u.email === "NA" ? "muted" : "link"}>{highlight(u.email, query)}</td>}
                    {show("licenseDivision") && <td><LicenseDivision counts={u.licenseCounts} /></td>}
                    {show("consumed") && <td><LicensePill license={u.targetLicense} /></td>}
                    {show("mismatch") && <td><LicenseMismatchPill actualLicense={u.license} targetLicense={u.targetLicense} /></td>}
                    {show("redundant") && <td onClick={e => e.stopPropagation()}><RedundantRolesPill count={getRedundantRoleCount(u)} onClick={() => { const roles = getRedundantRoles(u); if (roles.length) setRedundantRolesModal({ user: u, roles }); }} /></td>}
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
                    {show("target") && <td><LicensePill license={u.targetLicense} /></td>}
                    
                    {show("roleCleansing") && <td onClick={e => e.stopPropagation()}>{(() => {
                      const summary = getRoleCleansingSummary(u);
                      return <RoleCleansingPill summary={summary} onClick={() => setRoleCleansingModal({ user: u, summary })} />;
                    })()}</td>}
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
                      <button className="view-btn" onClick={(e) => { e.stopPropagation(); window.location.href = `user-details.html?id=${u.id}`; }}>
                        View
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
                      </button>
                    </td>
                  </tr>
                );

                if (userOpen) {
                  const indirectRoles = u.roles;

                  // Roles — rendered directly under the user row
                  if (indirectRoles.length > 0) {
                    const sortedRoles = [...indirectRoles]
                      .map((role, originalIdx) => ({ role, originalIdx }))
                      .sort((a, b) => {
                        const at = a.role.type === "Composite" ? 1 : 0;
                        const bt = b.role.type === "Composite" ? 1 : 0;
                        if (at !== bt) return at - bt;
                        return a.originalIdx - b.originalIdx;
                      });

                    sortedRoles.forEach(({ role, originalIdx: roleIndex }) => {
                      const rkey = `${u.id}::indirect::${role.name}::${roleIndex}`;
                      const roleOpen = expandedRoles.has(rkey);
                      const roleUsage = authUsageCounts(role.authObjs);
                      const isComposite = role.type === "Composite";
                      const childRoles = role.childRoles || [];

                      rows.push(
                        <tr key={`r-${rkey}`} className={`row-role ${roleOpen ? "expanded" : ""}`} onClick={() => toggleRole(rkey)}>
                          <td></td>
                          <td></td>
                          {show("firstName") && <td></td>}
                          {show("lastName")  && <td></td>}
                          {show("sapId")  && <td></td>}
                          {show("email")  && <td></td>}
                          {show("licenseDivision") && <td></td>}
                          {show("consumed") && <td></td>}
                          {show("mismatch") && <td></td>}
                          {show("redundant") && <td></td>}
                          {show("role")   && <td className="role-cell">
                            <ChevDown open={roleOpen} />
                            <span className="mono role-name">{role.name}</span>
                            <span className="muted role-meta">
                              {isComposite && childRoles.length > 0
                                ? ` · ${childRoles.length} child role${childRoles.length > 1 ? "s" : ""} · ${role.authObjs.length} auth objs`
                                : ` · ${role.authObjs.length} auth objs`}
                            </span>
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
                          {show("target") && <td></td>}
                          {show("roleCleansing") && <td></td>}
                          <td></td>
                        </tr>
                      );

                      if (roleOpen) {
                        if (isComposite && childRoles.length > 0) {
                          // Composite: show child roles, each expandable to its auth objs
                          childRoles.forEach((child, ci) => {
                            const ckey = `${rkey}::child::${child.name}::${ci}`;
                            const childOpen = expandedRoles.has(ckey);
                            const childUsage = authUsageCounts(child.authObjs);
                            rows.push(
                              <tr key={`cr-${ckey}`} className={`row-role row-role-child ${childOpen ? "expanded" : ""}`} onClick={() => toggleRole(ckey)}>
                                <td></td>
                                <td></td>
                                {show("firstName") && <td></td>}
                                {show("lastName")  && <td></td>}
                                {show("sapId")  && <td></td>}
                                {show("email")  && <td></td>}
                                {show("licenseDivision") && <td></td>}
                                {show("consumed") && <td></td>}
                                {show("mismatch") && <td></td>}
                                {show("redundant") && <td></td>}
                                {show("role")   && <td className="role-cell role-cell-child">
                                  <ChevDown open={childOpen} />
                                  <span className="mono role-name">{child.name}</span>
                                  <span className="muted role-meta">· {child.authObjs.length} auth objs</span>
                                </td>}
                                {show("roleType") && <td><RoleTypePill value={child.type || "Single"} /></td>}
                                {show("auth")   && <td></td>}
                                {show("authDesc") && <td></td>}
                                {show("field")  && <td></td>}
                                {show("values") && <td></td>}
                                {show("fstat")  && <td></td>}
                                {show("usage") && <td className="num">{childUsage.used.toLocaleString()}</td>}
                                {show("lastUsed") && <td></td>}
                                {show("lic")    && <td></td>}
                                {show("target") && <td></td>}
                                {show("roleCleansing") && <td></td>}
                                <td></td>
                              </tr>
                            );

                            if (childOpen) {
                              child.authObjs.forEach((a, ai) => {
                                rows.push(
                                  <tr key={`a-${ckey}-${ai}`} className="row-auth row-auth-child">
                                    <td></td>
                                    <td></td>
                                    {show("firstName") && <td></td>}
                                    {show("lastName")  && <td></td>}
                                    {show("sapId")  && <td></td>}
                                    {show("email")  && <td></td>}
                                    {show("licenseDivision") && <td></td>}
                                    {show("consumed") && <td></td>}
                                    {show("mismatch") && <td></td>}
                                    {show("redundant") && <td></td>}
                                    {show("role")   && <td></td>}
                                    {show("roleType") && <td></td>}
                                    {show("auth")   && <td className="link mono">{a.name}</td>}
                                    {show("authDesc") && <td className="muted">{a.desc || "-"}</td>}
                                    {show("field")  && <td className="mono muted">{a.field}</td>}
                                    {show("values") && <td className="mono muted">{a.values}</td>}
                                    {show("fstat")  && <td><FieldStatusPill status={a.fieldStatus} /></td>}
                                    {show("usage") && <td className="num">{a.fieldStatus === "Unused" ? 0 : 1}</td>}
                                    {show("lastUsed") && <td className="mono muted">{getAuthLastUsedDate(u, child, a, ai)}</td>}
                                    {show("lic")    && <td><LicensePill license={a.license} /></td>}
                                    {show("target") && <td></td>}
                                    {show("roleCleansing") && <td></td>}
                                    <td></td>
                                  </tr>
                                );
                              });
                            }
                          });
                        } else {
                          role.authObjs.forEach((a, ai) => {
                            rows.push(
                              <tr key={`a-${rkey}-${ai}`} className="row-auth">
                                <td></td>
                                <td></td>
                                {show("firstName") && <td></td>}
                                {show("lastName")  && <td></td>}
                                {show("sapId")  && <td></td>}
                                {show("email")  && <td></td>}
                                {show("licenseDivision") && <td></td>}
                                {show("consumed") && <td></td>}
                                {show("mismatch") && <td></td>}
                                {show("redundant") && <td></td>}
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
                                {show("target") && <td></td>}
                                {show("roleCleansing") && <td></td>}
                                <td></td>
                              </tr>
                            );
                          });
                        }
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
      {roleCleansingModal && (
        <RoleCleansingModal
          summary={roleCleansingModal.summary}
          userName={`${roleCleansingModal.user.firstName} ${roleCleansingModal.user.lastName}`}
          onClose={() => setRoleCleansingModal(null)}
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
