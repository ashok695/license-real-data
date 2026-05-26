// User Details page

function avatarColor(i) {
  const palette = [
    { bg: "#EAF2FF", fg: "#2A5BBF" },
    { bg: "#FFEFE6", fg: "#C4561E" },
    { bg: "#E8F4EE", fg: "#1F8A5B" },
    { bg: "#F2EBFF", fg: "#6B3EC9" },
    { bg: "#FFF6DA", fg: "#9C6B00" }
  ];
  return palette[i % palette.length];
}

function initials(fn, ln) { return (fn[0] || "") + (ln[0] || ""); }

function userDisplayName(user) {
  return `${user.firstName} ${user.lastName}`.replace(/^NA\s+/, "").trim();
}

function getQueryUserId() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id") || "0", 10);
  return Number.isFinite(id) ? id : 0;
}

function ChevDown({ open }) {
  return (
    <svg className={`chev ${open ? "open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function StatusPill({ status }) {
  const map = {
    "Active": { bg: "#e8f4ee", fg: "#1F8A5B", border: "#cfe9d9" },
    "Inactive": { bg: "#fde9e9", fg: "#b42318", border: "#fbcfcf" },
    "Locked": { bg: "#f2efe7", fg: "#7a5a1c", border: "#dfd4be" },
    "Expired": { bg: "#fff5e0", fg: "#9a6700", border: "#f3d69a" },
    "Deleted": { bg: "#eeeeee", fg: "#555", border: "#d9d9d9" }
  };
  const s = map[status] || map["Active"];
  return <span className="ud-status-pill" style={{ background: s.bg, color: s.fg, borderColor: s.border }}>{status}</span>;
}

function UsageFrequencyBadge({ active }) {
  const value = active >= 75 ? "High" : active >= 55 ? "Medium" : "Low";
  const map = {
    Low: "pill-gray",
    Medium: "pill-amber",
    High: "pill-green"
  };
  return <span className={`pill ud-frequency-badge ${map[value]}`}>{value} Frequency</span>;
}

function LoginFrequencyBadge({ loginCounts }) {
  const last30 = loginCounts?.last30 || 0;
  const value = last30 >= 20 ? "High" : last30 >= 10 ? "Medium" : "Low";
  const map = {
    Low: "pill-gray",
    Medium: "pill-amber",
    High: "pill-green"
  };
  return <span className={`pill ud-frequency-badge ${map[value]}`}>{value}</span>;
}

function SapUserTypePill({ value }) {
  const map = {
    Dialog: "pill-blue",
    System: "pill-violet",
    Communication: "pill-cyan",
    Service: "pill-amber",
    Reference: "pill-slate"
  };
  return <span className={`pill ud-sap-user-type ${map[value] || "pill-gray"}`}>{value || "NA"}</span>;
}

function LicensePill({ value }) {
  if (value === "NA" || !value) return <span className="pill pill-slate">NA</span>;
  const map = {
    "HD Productivity": "pill-blue",
    "HD Professional": "pill-violet",
    "HD Functional": "pill-cyan",
    "HD Developer": "pill-amber",
    "HD Platform": "pill-rose",
    "Employee": "pill-slate"
  };
  return <span className={`pill ${map[value] || "pill-blue"}`}>{value}</span>;
}

function SummaryList({ rows }) {
  return (
    <div className="ud-summary-list">
      {rows.map((row) => (
        <div className="ud-summary-row" key={row.label}>
          <span className="ud-summary-label">{row.label}</span>
          <span className="ud-summary-value">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function FieldUsagePill({ status }) {
  const usage = status === "Unused" ? "Unused" : "Used";
  return <span className={`field-status status-${usage.toLowerCase()}`}>{usage}</span>;
}

function RoleAssignmentPill({ value }) {
  const indirect = value === "Indirectly Assigned";
  return <span className={`pill ${indirect ? "pill-amber" : "pill-green"}`}>{indirect ? "Indirect" : "Direct"}</span>;
}

function getUsedAuthObjectCount(auth) {
  return auth.fieldStatus === "Unused" ? 0 : 1;
}

function getRoleUsedAuthObjectCount(role) {
  return role.authObjs.reduce((sum, auth) => sum + getUsedAuthObjectCount(auth), 0);
}

function getAuthLastUsedOn(user, role, auth, index) {
  if (auth.lastUsed) return auth.lastUsed;
  if (!getUsedAuthObjectCount(auth)) return "NA";

  const seed = `${user.id}|${role.name}|${auth.name}|${auth.field}|${index}`;
  const hash = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const date = new Date();
  date.setDate(date.getDate() - (1 + (hash % 180)));
  return date.toISOString().slice(0, 10);
}

function TcodeAssignmentSourcePill({ value }) {
  const indirect = value === "Indirect";
  return <span className={`pill ${indirect ? "pill-amber" : "pill-green"}`}>{indirect ? "Indirect" : "Direct"}</span>;
}

function TcodeUsagePill({ executions }) {
  const used = executions > 0;
  return <span className={`field-status status-${used ? "used" : "unused"}`}>{used ? "Used" : "Unused"}</span>;
}

function RedundantRolesBadge({ count, onClick }) {
  const hasRedundantRoles = count > 0;
  if (!hasRedundantRoles) {
    return <span className="pill pill-green">No</span>;
  }

  return (
    <button type="button" className="pill pill-red ud-clickable-pill" onClick={onClick}>
      Yes ({count})
    </button>
  );
}

function getRedundantRoles(user) {
  const roleNameCounts = {};
  const authObjectRoleNames = {};

  user.roles.forEach(role => {
    roleNameCounts[role.name] = (roleNameCounts[role.name] || 0) + 1;

    const uniqueAuthObjects = new Set(role.authObjs.map(auth => auth.name));
    uniqueAuthObjects.forEach(authName => {
      if (!authObjectRoleNames[authName]) authObjectRoleNames[authName] = new Set();
      authObjectRoleNames[authName].add(role.name);
    });
  });

  return user.roles.map(role => {
    const sameRoleAssigned = roleNameCounts[role.name] > 1;
    const sharedWithDifferentRole = role.authObjs.some(auth => {
      const roleNames = authObjectRoleNames[auth.name];
      return roleNames && roleNames.size > 1;
    });
    const sharedAuthObjects = role.authObjs
      .filter(auth => {
        const roleNames = authObjectRoleNames[auth.name];
        return roleNames && roleNames.size > 1;
      })
      .map(auth => auth.name);

    return {
      ...role,
      redundancyReason: sameRoleAssigned ? "Duplicate role assignment" : "Shared authorization objects",
      sharedAuthObjects: Array.from(new Set(sharedAuthObjects))
    };
  }).filter(role => roleNameCounts[role.name] > 1 || role.sharedAuthObjects.length > 0);
}

function RedundantRolesModal({ roles, onClose }) {
  if (!roles.length) return null;

  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  function handleBackdrop(e) { if (e.target === e.currentTarget) onClose(); }

  return (
    <div className="modal-backdrop" role="presentation" onClick={handleBackdrop}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="redundant-roles-title" style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title" id="redundant-roles-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: "middle" }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Redundant Roles
            </h3>
            <p className="modal-sub">{roles.length} role{roles.length === 1 ? "" : "s"} flagged for review</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close redundant roles modal">
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
              {roles.map((role, index) => (
                <tr key={`${role.name}-${index}`}>
                  <td className="mono link" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{role.name}</td>
                  <td><span className={`type-pill ${role.type === "Composite" ? "type-comp" : "type-single"}`}>{role.type || "Single"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-footer" style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function UsageProgress({ active }) {
  const colors = {
    active: "#5FBF90"
  };
  return (
    <div className="ud-usage-progress">
      <div className="ud-usage-head">
        <div>
          <div className="ud-usage-label">Used Activities</div>
          <div className="ud-usage-sub">Measured from recent transaction activity</div>
        </div>
        <div className="ud-usage-value">{active}%</div>
      </div>
      <div className="ud-progress-track" aria-label={`Used activities ${active}%`}>
        <div className="ud-progress-fill" style={{ width: `${active}%`, background: colors.active }}></div>
      </div>
      <div className="ud-progress-breakdown">
        <div className="ud-progress-row">
          <span><span className="dot" style={{ background: colors.active }}></span>Used</span>
          <b>{active}%</b>
        </div>
      </div>
    </div>
  );
}

function UsageTrendChart({ data }) {
  const maxCount = Math.max(...data.map(row => row.count), 1);
  const minCount = Math.min(...data.map(row => row.count), 0);
  const range = Math.max(maxCount - minCount, 1);
  const totalCount = data.reduce((sum, row) => sum + row.count, 0);
  const width = 640;
  const height = 180;
  const padX = 34;
  const padY = 22;
  const chartWidth = width - padX * 2;
  const chartHeight = height - padY * 2;
  const points = data.map((row, index) => {
    const x = data.length === 1 ? width / 2 : padX + (index / (data.length - 1)) * chartWidth;
    const y = padY + ((maxCount - row.count) / range) * chartHeight;
    return { ...row, x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`
    : "";

  return (
    <div className="ud-trend">
      <div className="ud-trend-summary">
        <div>
          <div className="ud-trend-label">Monthly Usage Count</div>
          <div className="ud-trend-sub">Last 6 months transaction activity</div>
        </div>
        <div className="ud-trend-total">{totalCount.toLocaleString()}</div>
      </div>
      <div className="ud-trend-line-wrap" aria-label="Monthly usage trend">
        <svg className="ud-trend-line-chart" viewBox={`0 0 ${width} ${height}`} role="img">
          <path className="ud-trend-area" d={areaPath}></path>
          <path className="ud-trend-line" d={linePath}></path>
          {points.map(point => (
            <g key={point.month}>
              <circle className="ud-trend-point" cx={point.x} cy={point.y} r="4.5"></circle>
              <text className="ud-trend-point-value" x={point.x} y={point.y - 10} textAnchor="middle">{point.count.toLocaleString()}</text>
              <text className="ud-trend-point-month" x={point.x} y={height - 4} textAnchor="middle">{point.month}</text>
            </g>
          ))}
        </svg>
        <div className="ud-trend-line-list">
          {data.map(row => (
            <div className="ud-trend-line-item" key={row.month}>
              <span>{row.month}</span>
              <b>{row.count.toLocaleString()}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardHeader({ title }) {
  return (
    <div className="ud-card-header">
      <span className="ud-card-title">{title}</span>
    </div>
  );
}

function UserSwitcher({ users, currentUser, onSelect }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState(userDisplayName(currentUser));
  const ref = React.useRef(null);

  React.useEffect(() => {
    setQuery(userDisplayName(currentUser));
  }, [currentUser.id]);

  React.useEffect(() => {
    if (!open) return;
    const handle = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
        setQuery(userDisplayName(currentUser));
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, currentUser]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = !q
      ? users
      : users.filter(u => {
          const haystack = [
            userDisplayName(u),
            u.sapId,
            u.email,
            u.sapUserType,
            u.referenceUser
          ].join(" ").toLowerCase();
          return haystack.includes(q);
        });
    return list.slice(0, 10);
  }, [users, query]);

  const choose = (user) => {
    setOpen(false);
    setQuery(userDisplayName(user));
    onSelect(user.id);
  };

  return (
    <div className="ud-user-switcher" ref={ref}>
      <div className="ud-user-switcher-label">Switch User</div>
      <div className="ud-user-combobox">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search users"
          aria-label="Search and switch user"
        />
        <button type="button" className="ud-user-combobox-btn" onClick={() => setOpen(o => !o)} aria-label="Toggle user list">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>
      {open && (
        <div className="ud-user-menu">
          {filtered.map(u => {
            const ac = avatarColor(u.id);
            const active = u.id === currentUser.id;
            return (
              <button type="button" key={u.id} className={`ud-user-option ${active ? "active" : ""}`} onClick={() => choose(u)}>
                <span className="ud-user-option-avatar" style={{ background: ac.bg, color: ac.fg }}>{initials(u.firstName, u.lastName)}</span>
                <span className="ud-user-option-main">
                  <span className="ud-user-option-name">{userDisplayName(u)}</span>
                  <span className="ud-user-option-meta">{u.sapId} · {u.email}</span>
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && <div className="ud-user-empty">No users found.</div>}
        </div>
      )}
    </div>
  );
}

function UserDetails() {
  const data = window.LICENSE_DATA;
  const [selectedId, setSelectedId] = React.useState(getQueryUserId());
  const user = data.users.find(u => u.id === selectedId) || data.users[0];

  const [tcodeFilter, setTcodeFilter] = React.useState("");
  const [tcodeAssignmentFilter, setTcodeAssignmentFilter] = React.useState("All");
  const [tcodeUsageFilter, setTcodeUsageFilter] = React.useState("All");
  const [tcodeLicenseFilter, setTcodeLicenseFilter] = React.useState("All");
  const [expandedAuthSources, setExpandedAuthSources] = React.useState(new Set());
  const [expandedAuthRoles, setExpandedAuthRoles] = React.useState(new Set());
  const [redundantRolesOpen, setRedundantRolesOpen] = React.useState(false);

  React.useEffect(() => {
    const handlePopState = () => setSelectedId(getQueryUserId());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  React.useEffect(() => {
    setExpandedAuthSources(new Set());
    setExpandedAuthRoles(new Set());
    setTcodeFilter("");
    setTcodeAssignmentFilter("All");
    setTcodeUsageFilter("All");
    setTcodeLicenseFilter("All");
    setRedundantRolesOpen(false);
  }, [user.id]);

  React.useEffect(() => {
    if (!redundantRolesOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setRedundantRolesOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [redundantRolesOpen]);

  const ac = avatarColor(user.id);
  const filteredTcodes = user.topTcodes.filter((t) => {
    const usageStatus = t.executions > 0 ? "Used" : "Unused";
    const matchesSearch = !tcodeFilter ||
      t.code.toLowerCase().includes(tcodeFilter.toLowerCase()) ||
      t.desc.toLowerCase().includes(tcodeFilter.toLowerCase());
    const matchesAssignment = tcodeAssignmentFilter === "All" || t.assignmentSource === tcodeAssignmentFilter;
    const matchesUsage = tcodeUsageFilter === "All" || usageStatus === tcodeUsageFilter;
    const matchesLicense = tcodeLicenseFilter === "All" || t.classification === tcodeLicenseFilter;
    return matchesSearch && matchesAssignment && matchesUsage && matchesLicense;
  });
  const assignedProfiles = user.roles.length;
  const authorizationFields = new Set(user.roles.flatMap(role => role.authObjs.map(a => a.field))).size;
  const authorizedTransactions = user.topTcodes.length;
  const totalActivities = user.topTcodes.reduce((sum, t) => sum + t.executions, 0);
  const usedActivities = Math.round(totalActivities * (user.usageDonut.active / 100));
  const redundantRoles = getRedundantRoles(user);
  const redundantRoleCount = redundantRoles.length;

  const toggleAuthSource = (sourceKey) => {
    setExpandedAuthSources(s => {
      const n = new Set(s);
      n.has(sourceKey) ? n.delete(sourceKey) : n.add(sourceKey);
      return n;
    });
  };

  const toggleAuthRole = (roleName) => {
    setExpandedAuthRoles(s => {
      const n = new Set(s);
      n.has(roleName) ? n.delete(roleName) : n.add(roleName);
      return n;
    });
  };

  const switchUser = (userId) => {
    setSelectedId(userId);
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("id", userId);
    window.history.pushState({}, "", nextUrl);
  };

  const goBack = () => { window.location.href = "index.html"; };

  return (
    <div className="lo-page ud-page">
      {/* Top page header */}
      <div className="ud-top">
        <button className="ud-back" onClick={goBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Back to list
        </button>
        <div className="ud-breadcrumb">
          <a className="bc-link" href="runs.html">Home</a>
          <span className="bc-sep">/</span>
          <a className="bc-link" href="runs.html">Analysis Runs</a>
          <span className="bc-sep">/</span>
          <span className="bc-link" onClick={goBack} style={{ cursor: "pointer" }}>License Optimization</span>
          <span className="bc-sep">/</span>
          <span>User Details</span>
        </div>
        <div className="ud-actions">
          <UserSwitcher users={data.users} currentUser={user} onSelect={switchUser} />
          {/* <button className="btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
            Refresh
          </button>
          <button className="btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export
          </button>
          <button className="btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            Run Optimization
          </button> */}
        </div>
      </div>

      {/* User identity strip */}
      <div className="ud-identity">
        <div className="ud-identity-hero">
          <div className="ud-avatar-wrap">
            <div className="ud-avatar-lg" style={{ background: ac.bg, color: ac.fg }}>{initials(user.firstName, user.lastName)}</div>
            <span className={`ud-avatar-status ud-avatar-status-${(user.status || "active").toLowerCase()}`} aria-hidden="true" title={user.status}></span>
          </div>
          <div className="ud-identity-hero-main">
            <div className="ud-identity-name-row">
              <h1 className="ud-name" title={`${user.firstName} ${user.lastName}`}>{user.firstName} {user.lastName}</h1>
              <StatusPill status={user.status} />
            </div>
            <div className="ud-identity-sub">
              <span className="ud-identity-sub-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 10h18"></path><path d="M8 4v4"></path></svg>
                <span className="ud-identity-sub-label">SAP ID</span>
                <span className="ud-identity-sub-value">{user.sapId}</span>
              </span>
              <span className="ud-identity-sub-sep" aria-hidden="true"></span>
              <span className="ud-identity-sub-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span className="ud-identity-sub-value ud-identity-sub-email" title={user.email}>{user.email}</span>
              </span>
              <span className="ud-identity-sub-sep" aria-hidden="true"></span>
              <span className="ud-identity-sub-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z"></path><path d="M9 7V5h6v2"></path></svg>
                <span className="ud-identity-sub-value">{user.sapUserType || "NA"}</span>
              </span>
              <span className="ud-identity-sub-sep" aria-hidden="true"></span>
              <span className="ud-identity-sub-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                <span className="ud-identity-sub-label">Login Frequency</span>
                <LoginFrequencyBadge loginCounts={user.loginCounts} />
              </span>
            </div>
          </div>
        </div>
        <div className="ud-identity-rail">
          <div className="ud-rail-item">
            <div className="ud-rail-label">Validity</div>
            <div className="ud-rail-value ud-rail-validity">
              <span>{user.validFrom}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              <span>{user.validTo}</span>
            </div>
          </div>
          <div className="ud-rail-item">
            <div className="ud-rail-label">Last Login</div>
            <div className="ud-rail-value">{user.lastLogin}</div>
          </div>
          <div className="ud-rail-item">
            <div className="ud-rail-label">Login Count</div>
            <div className="ud-rail-counts">
              <span><b>{user.loginCounts.last30}</b><small>30D</small></span>
              <span className="ud-rail-counts-sep" aria-hidden="true"></span>
              <span><b>{user.loginCounts.last60}</b><small>60D</small></span>
              <span className="ud-rail-counts-sep" aria-hidden="true"></span>
              <span><b>{user.loginCounts.last90}</b><small>90D</small></span>
            </div>
          </div>
          <div className="ud-rail-item">
            <div className="ud-rail-label">Actual Assigned License</div>
            <div className="ud-rail-value"><LicensePill value={user.inferredLicense} /></div>
          </div>
          <div className="ud-rail-item">
            <div className="ud-rail-label">Recommended Target License</div>
            <div className="ud-rail-value"><LicensePill value={user.targetLicense} /></div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="ud-kpi-grid">
        <div className="ud-card">
          <CardHeader title="Authorization Summary" />
          <div className="ud-card-body ud-summary-body">
            <SummaryList rows={[
              { label: "Total Profiles:", value: assignedProfiles.toLocaleString() },
              { label: "Total Authorization Objects:", value: user.authSummary.total.toLocaleString() },
              { label: "Total Authorization Fields:", value: authorizationFields.toLocaleString() },
              { label: "Total Authorized Transactions:", value: authorizedTransactions.toLocaleString() }
            ]} />
          </div>
        </div>

        <div className="ud-card">
          <CardHeader title="Role Activity Overview" />
          <div className="ud-card-body ud-summary-body">
            <SummaryList rows={[
              { label: "Total Roles:", value: user.roleActivity.total.toLocaleString() },
              { label: "Active Roles:", value: user.roleActivity.active.toLocaleString() },
              { label: "Redundant Roles:", value: <RedundantRolesBadge count={redundantRoleCount} onClick={() => setRedundantRolesOpen(true)} /> },
              { label: "Total Activities:", value: totalActivities.toLocaleString() },
              { label: "Used Activities:", value: usedActivities.toLocaleString() }
            ]} />
          </div>
        </div>

        <div className="ud-card">
          <CardHeader title="Usage Statistics" />
          <div className="ud-card-body ud-usage-body">
            <UsageProgress {...user.usageDonut} />
          </div>
        </div>
      </div>

      <div className="ud-trend-license-row ud-section">
        <div className="ud-card ud-trend-card">
          <div className="ud-card-head-block">
            <div className="ud-card-heading">Usage Trend</div>
            <div className="ud-card-subtitle">Monthly usage count for this user</div>
          </div>
          <div className="ud-card-body">
            <UsageTrendChart data={user.monthlyUsage || []} />
          </div>
        </div>
      </div>

      {/* Role Authorization Breakdown */}
      <div className="ud-card ud-section">
        <div className="ud-card-head-block">
          <div className="ud-card-heading">Authorization Breakdown</div>
          <div className="ud-card-subtitle">Authorization object rows aligned to the license data structure</div>
        </div>
        <div className="ud-card-body ud-no-pad">
          <div className="table-wrap">
            <table className="data-table ud-auth-table">
              <colgroup>
                <col style={{ width: "13%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "8%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Assignment Source</th>
                  <th>Role</th>
                  <th>Auth Object</th>
                  <th>Auth Obj Description</th>
                  <th>Field Name</th>
                  <th>Field Value</th>
                  <th>Field Status</th>
                  <th>Auth Usage Count</th>
                  <th>Last Used On</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    key: "direct",
                    assignmentType: "Directly Assigned",
                    // Standalone auth obj/field/value rows assigned to the user
                    // without going through any role. None modeled today.
                    directAuthObjs: user.directAuthObjs || [],
                    roles: []
                  },
                  {
                    key: "indirect",
                    assignmentType: "Indirectly Assigned",
                    directAuthObjs: [],
                    // All role-delivered auth is indirect by definition.
                    roles: user.roles
                  }
                ].filter(group => group.roles.length || group.directAuthObjs.length).map(group => {
                  const sourceOpen = expandedAuthSources.has(group.key);
                  const groupAuthObjs = group.key === "direct"
                    ? group.directAuthObjs
                    : group.roles.flatMap(role => role.authObjs);
                  const groupUsedAuthCount = groupAuthObjs.reduce((sum, auth) => sum + getUsedAuthObjectCount(auth), 0);
                  const headLabel = group.key === "direct"
                    ? `${group.directAuthObjs.length.toLocaleString()} auth obj${group.directAuthObjs.length === 1 ? "" : "s"}`
                    : `${group.roles.length.toLocaleString()} role${group.roles.length === 1 ? "" : "s"}`;
                  const rows = [
                    <tr key={`auth-source-${group.key}`} className="ud-auth-source-row" onClick={() => toggleAuthSource(group.key)}>
                      <td>
                        <div className="ud-auth-role-cell">
                          <ChevDown open={sourceOpen} />
                          <RoleAssignmentPill value={group.assignmentType} />
                        </div>
                      </td>
                      <td className="muted">{headLabel}</td>
                      <td className="muted">{groupAuthObjs.length.toLocaleString()} auth fields</td>
                      <td className="muted">-</td>
                      <td className="muted">-</td>
                      <td className="muted">-</td>
                      <td className="muted">-</td>
                      <td className="num">{groupUsedAuthCount.toLocaleString()}</td>
                      <td className="muted">-</td>
                    </tr>
                  ];

                  if (!sourceOpen) return rows;

                  if (group.key === "direct") {
                    group.directAuthObjs.forEach((auth, index) => {
                      rows.push(
                        <tr key={`auth-direct-${auth.name}-${auth.field}-${index}`} className="ud-auth-field-row">
                          <td></td>
                          <td></td>
                          <td className="link">{auth.name}</td>
                          <td className="muted">{auth.desc || "-"}</td>
                          <td>{auth.field}</td>
                          <td>{auth.values}</td>
                          <td><FieldUsagePill status={auth.fieldStatus} /></td>
                          <td className="num">{getUsedAuthObjectCount(auth).toLocaleString()}</td>
                          <td className="mono muted">{auth.lastUsed || "NA"}</td>
                        </tr>
                      );
                    });
                  } else {
                    group.roles.forEach(role => {
                      const open = expandedAuthRoles.has(role.name);
                      const usedAuthCount = getRoleUsedAuthObjectCount(role);
                      rows.push(
                        <tr key={`auth-role-${group.key}-${role.name}`} className="ud-auth-role-row" onClick={() => toggleAuthRole(role.name)}>
                          <td></td>
                          <td>
                            <div className="ud-auth-role-cell">
                              <ChevDown open={open} />
                              <span>{role.name}</span>
                            </div>
                          </td>
                          <td className="muted">{role.authObjs.length.toLocaleString()} auth fields</td>
                          <td className="muted">-</td>
                          <td className="muted">-</td>
                          <td className="muted">-</td>
                          <td className="muted">-</td>
                          <td className="num">{usedAuthCount.toLocaleString()}</td>
                          <td className="muted">-</td>
                        </tr>
                      );

                      if (open) {
                        role.authObjs.forEach((auth, index) => {
                          rows.push(
                            <tr key={`auth-${group.key}-${role.name}-${index}`} className="ud-auth-field-row">
                              <td></td>
                              <td></td>
                              <td className="link">{auth.name}</td>
                              <td className="muted">{auth.desc || "-"}</td>
                              <td>{auth.field}</td>
                              <td>{auth.values}</td>
                              <td><FieldUsagePill status={auth.fieldStatus} /></td>
                              <td className="num">{getUsedAuthObjectCount(auth).toLocaleString()}</td>
                              <td className="mono muted">{getAuthLastUsedOn(user, role, auth, index)}</td>
                            </tr>
                          );
                        });
                      }
                    });
                  }

                  return rows;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Transaction Codes */}
      <div className="ud-card ud-section">
        <div className="ud-card-header ud-card-header-row">
          <span className="ud-card-title">Transaction Codes</span>
          <div className="ud-card-toolbar">
            <div className="search-box small">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input value={tcodeFilter} onChange={e => setTcodeFilter(e.target.value)} placeholder="Search T-Code or description" />
            </div>
            <select
              className="ud-filter-select"
              value={tcodeAssignmentFilter}
              onChange={e => setTcodeAssignmentFilter(e.target.value)}
              aria-label="Filter by assignment source"
            >
              <option value="All">Assignment Source: All</option>
              <option value="Direct">Direct</option>
              <option value="Role">Indirect</option>
            </select>
            <select
              className="ud-filter-select"
              value={tcodeUsageFilter}
              onChange={e => setTcodeUsageFilter(e.target.value)}
              aria-label="Filter by usage status"
            >
              <option value="All">Usage Status: All</option>
              <option value="Used">Used</option>
              <option value="Unused">Unused</option>
            </select>
            <select
              className="ud-filter-select"
              value={tcodeLicenseFilter}
              onChange={e => setTcodeLicenseFilter(e.target.value)}
              aria-label="Filter by recommended license type"
            >
              <option value="All">License Type: All</option>
              {data.licenses.filter(l => l !== "NA").map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="ud-card-body ud-no-pad">
          <div className="table-wrap">
            <table className="data-table ud-tcode-table">
              <colgroup>
                <col style={{ width: 150 }} />
                <col style={{ width: 170 }} />
                <col style={{ width: 150 }} />
                <col style={{ width: 170 }} />
                <col style={{ width: 190 }} />
                <col style={{ width: 170 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>T-Codes</th>
                  <th>Assignment Source</th>
                  <th className="th-num">Execution Count</th>
                  <th className="th-center">Last Activity Date</th>
                  <th>Used / Unused Classification</th>
                  <th>Recommended Target License</th>
                </tr>
              </thead>
              <tbody>
                {filteredTcodes.map((t, i) => (
                  <tr key={t.code}>
                    <td className="mono" title={t.desc}><b>{t.code}</b></td>
                    <td><TcodeAssignmentSourcePill value={t.assignmentSource} /></td>
                    <td className="num">{t.executions.toLocaleString()}</td>
                    <td className="col-date">{t.lastUsed}</td>
                    <td><TcodeUsagePill executions={t.executions} /></td>
                    <td><LicensePill value={t.classification} /></td>
                  </tr>
                ))}
                {filteredTcodes.length === 0 && (
                  <tr><td colSpan={6} className="empty-state">No transactions match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {redundantRolesOpen && (
        <RedundantRolesModal roles={redundantRoles} onClose={() => setRedundantRolesOpen(false)} />
      )}
    </div>
  );
}

function App() {
  const Sidebar = window.Sidebar;
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className={`app ${collapsed ? "sidebar-collapsed" : ""}`} data-screen-label="User Details">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} active="License Optimization" />
      <main className="main">
        <UserDetails />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
