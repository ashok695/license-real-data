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
  const [expandedAuthRoles, setExpandedAuthRoles] = React.useState(new Set([user.roles[0]?.name].filter(Boolean)));

  React.useEffect(() => {
    const handlePopState = () => setSelectedId(getQueryUserId());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  React.useEffect(() => {
    setExpandedAuthRoles(new Set([user.roles[0]?.name].filter(Boolean)));
    setTcodeFilter("");
  }, [user.id]);

  const ac = avatarColor(user.id);
  const filteredTcodes = user.topTcodes.filter(t =>
    !tcodeFilter ||
    t.code.toLowerCase().includes(tcodeFilter.toLowerCase()) ||
    t.desc.toLowerCase().includes(tcodeFilter.toLowerCase())
  );
  const assignedProfiles = user.roles.length;
  const authorizationFields = new Set(user.roles.flatMap(role => role.authObjs.map(a => a.field))).size;
  const authorizedTransactions = user.topTcodes.length;
  const totalActivities = user.topTcodes.reduce((sum, t) => sum + t.executions, 0);
  const usedActivities = Math.round(totalActivities * (user.usageDonut.active / 100));

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

  const goBack = () => { window.location.href = "License Optimization.html"; };

  return (
    <div className="lo-page ud-page">
      {/* Top page header */}
      <div className="ud-top">
        <button className="ud-back" onClick={goBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Back to list
        </button>
        <div className="ud-breadcrumb">
          <span className="bc-link" onClick={goBack}>License Optimization</span>
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
        <div className="ud-avatar-lg" style={{ background: ac.bg, color: ac.fg }}>{initials(user.firstName, user.lastName)}</div>
        <div className="ud-id-main">
          <div className="ud-eyebrow">User Profile</div>
          <div className="ud-id-name-row">
            <h1 className="ud-name">{user.firstName} {user.lastName}</h1>
            <StatusPill status={user.status} />
          </div>
          <div className="ud-id-meta">
            <div><span className="meta-l">SAP ID</span><span className="meta-v">{user.sapId}</span></div>
            <div><span className="meta-l">Email</span><span className="meta-v">{user.email}</span></div>
            <div><span className="meta-l">Reference User</span><span className="meta-v">{user.referenceUser}</span></div>
          </div>
        </div>
        <div className="ud-id-side">
          <div className="ud-side-tile">
            <div className="ud-side-l">Last Login</div>
            <div className="ud-side-v">{user.lastLogin}</div>
          </div>
          <div className="ud-side-tile">
            <div className="ud-side-l">Inferred License</div>
            <div className="ud-side-v"><LicensePill value={user.inferredLicense} /></div>
          </div>
          <div className="ud-side-tile">
            <div className="ud-side-l">FUE Value</div>
            <div className="ud-side-v ud-fue">{user.fue}</div>
          </div>
        </div>
      </div>

      {/* 3 KPI cards */}
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

      {/* Role Authorization Breakdown */}
      <div className="ud-card ud-section">
        <div className="ud-card-head-block">
          <div className="ud-card-heading">Role Authorization Breakdown</div>
          <div className="ud-card-subtitle">Nested role and authorization object rows aligned to the license data structure</div>
        </div>
        <div className="ud-card-body ud-no-pad">
          <div className="table-wrap">
            <table className="data-table ud-auth-table">
              <colgroup>
                <col style={{ width: "20%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "21%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "13%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Auth Object</th>
                  <th>Field Name</th>
                  <th>Value</th>
                  <th>Field Usage</th>
                  <th>License Type</th>
                </tr>
              </thead>
              <tbody>
                {user.roles.map((role) => {
                  const open = expandedAuthRoles.has(role.name);
                  const rows = [
                    <tr key={`auth-role-${role.name}`} className="ud-auth-role-row" onClick={() => toggleAuthRole(role.name)}>
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
                    </tr>
                  ];

                  if (open) {
                    let lastObject = null;
                    role.authObjs.forEach((auth, index) => {
                      const showObject = auth.name !== lastObject;
                      lastObject = auth.name;
                      rows.push(
                        <tr key={`auth-${role.name}-${index}`} className="ud-auth-field-row">
                          <td></td>
                          <td className="link">{showObject ? auth.name : ""}</td>
                          <td>{auth.field}</td>
                          <td>{auth.values}</td>
                          <td><FieldUsagePill status={auth.fieldStatus} /></td>
                          <td><LicensePill value={auth.license} /></td>
                        </tr>
                      );
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
          <span className="ud-card-title">Top Transaction Codes</span>
          <div className="ud-card-toolbar">
            <div className="search-box small">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input value={tcodeFilter} onChange={e => setTcodeFilter(e.target.value)} placeholder="Search T-Code or description" />
            </div>
          </div>
        </div>
        <div className="ud-card-body ud-no-pad">
          <div className="table-wrap">
            <table className="data-table ud-tcode-table">
              <colgroup>
                <col style={{ width: 72 }} />
                <col style={{ width: 150 }} />
                <col />
                <col style={{ width: 150 }} />
                <col style={{ width: 170 }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="th-center">#</th>
                  <th>T-Code</th>
                  <th>Activity</th>
                  <th className="th-num">Executions</th>
                  <th className="th-center">Last Used</th>
                </tr>
              </thead>
              <tbody>
                {filteredTcodes.map((t, i) => (
                  <tr key={t.code}>
                    <td className="muted col-rank">{i + 1}</td>
                    <td className="mono"><b>{t.code}</b></td>
                    <td className="col-description">{t.desc}</td>
                    <td className="num">{t.executions.toLocaleString()}</td>
                    <td className="col-date">{t.lastUsed}</td>
                  </tr>
                ))}
                {filteredTcodes.length === 0 && (
                  <tr><td colSpan={5} className="empty-state">No transactions match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
