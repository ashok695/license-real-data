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

  return (
    <div className={`top-kpi-card top-kpi-${tone || "blue"}`}>
      <div className="top-kpi-head">
        <div className="top-kpi-icon">{icon}</div>
        <div className="top-kpi-label">{label}</div>
      </div>
      {breakdown ? (
        <div className={`top-kpi-breakdown top-kpi-breakdown-${layout || "tiles"}`}>
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
        <div className="top-kpi-value">{value.toLocaleString()}</div>
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

// License count chip for Pro/Func/Prod columns
function CountCell({ value, kind }) {
  if (!value) return <span className="lic-count lic-count-zero">0</span>;
  return <span className={`lic-count lic-count-${kind}`}>{value.toLocaleString()}</span>;
}
function LicDot({ kind }) { return <span className={`lic-dot lic-dot-${kind}`} />; }

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

function LicenseOptimizationPage() {
  const data = window.LICENSE_DATA;
  const [query, setQuery] = React.useState("");
  const [licenseFilter, setLicenseFilter] = React.useState("All Licenses");
  const [statusFilter, setStatusFilter] = React.useState("All Status");
  const [sort, setSort] = React.useState({ key: "firstName", dir: "asc" });
  const [expandedUsers, setExpandedUsers] = React.useState(new Set());
  const [expandedRoles, setExpandedRoles] = React.useState(new Set());
  const [selectedUsers, setSelectedUsers] = React.useState(new Set());
  const [pageSize] = React.useState(25);
  const [page, setPage] = React.useState(1);
  const [hidden, setHidden] = React.useState(() => new Set(["pro", "func", "prod"]));
  const [chooserOpen, setChooserOpen] = React.useState(false);

  const allocColumns = [
    { key: "name",   label: "Name (First / Last)",            required: true },
    { key: "sapId",  label: "SAP ID" },
    { key: "email",  label: "Email" },
    { key: "pro",    label: "Professional" },
    { key: "func",   label: "Functional" },
    { key: "prod",   label: "Productivity" },
    { key: "target", label: "Target License Classification",  required: true },
    { key: "role",   label: "Role" },
    { key: "auth",   label: "Auth Object" },
    { key: "field",  label: "Field" },
    { key: "values", label: "Values" },
    { key: "fstat",  label: "Field Status" },
    { key: "lic",    label: "License" },
    { key: "rec",    label: "Recommendation" }
  ];
  function show(k) { return !hidden.has(k); }
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
      unusedAuthObjects: 0,
      rolesNeedAttention: 0
    };

    data.users.forEach(user => {
      if (user.status === "Active") totals.activeUsers++;
      else totals.inactiveUsers++;

      if (user.targetLicense === "HD Professional") totals.professional++;
      else if (user.targetLicense === "HD Functional") totals.functional++;
      else if (user.targetLicense === "HD Productivity") totals.productivity++;

      user.roles.forEach(role => {
        if (role.recommendation && role.recommendation.type !== "Retain") {
          totals.rolesNeedAttention++;
        }
        role.authObjs.forEach(authObj => {
          if (authObj.fieldStatus === "Unused") totals.unusedAuthObjects++;
        });
      });
    });

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
    if (licenseFilter !== "All Licenses") list = list.filter(u => u.license === licenseFilter);
    if (statusFilter !== "All Status") list = list.filter(u => u.status === statusFilter);
    list = [...list].sort((a, b) => {
      const k = sort.key, av = a[k], bv = b[k];
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [data.users, query, licenseFilter, statusFilter, sort]);

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
    visible.forEach(x => x.roles.forEach(rl => r.add(`${x.id}::${rl.name}`)));
    setExpandedUsers(u); setExpandedRoles(r);
  }
  function collapseAll() { setExpandedUsers(new Set()); setExpandedRoles(new Set()); }

  // Aggregate user-level rec summary (count of roles needing action)
  function userRecSummary(u) {
    const actionable = u.roles.filter(r => r.recommendation && r.recommendation.type !== "Retain").length;
    return actionable;
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
          else if (c.key === "target") row.push(u.targetLicense);
          else if (c.key === "role") row.push(role.name);
          else if (c.key === "auth") row.push(role.authObjs.length);
          else if (c.key === "field") row.push("");
          else if (c.key === "values") row.push("");
          else if (c.key === "fstat") row.push("");
          else if (c.key === "lic") row.push(role.targetLicense);
          else if (c.key === "rec") row.push(role.recommendation ? `${role.recommendation.type}: ${role.recommendation.action}` : "");
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
          <span className="crumb-home">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>
            </svg>
            Home
          </span>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">License Optimization</span>
        </div>
        <div className="live-indicator"><span className="live-dot" /> Live</div>
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
          sub="By target classification"
          layout="chart"
          breakdown={[
            { label: "Professional", shortLabel: "PROF", value: topKpis.professional, tone: "violet" },
            { label: "Functional", shortLabel: "FUNC", value: topKpis.functional, tone: "cyan" },
            { label: "Productivity", shortLabel: "PROD", value: topKpis.productivity, tone: "blue" }
          ]}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 14l9 5 9-5"/><path d="M3 11l9 5 9-5"/></svg>}
        />
        <TopKpiCard
          tone="rose"
          label="Unused Auth Obj"
          value={topKpis.unusedAuthObjects}
          sub="Authorization objects marked unused"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="m5 7 1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13"/><path d="M9 7V4h6v3"/></svg>}
        />
        <TopKpiCard
          tone="amber"
          label="Total Roles Need Attention"
          value={topKpis.rolesNeedAttention}
          sub="Roles with optimization recommendation"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>}
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

        <div className="card-toolbar">
          <div className="toolbar-left">
            <div className="search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search first name, last name, SAP ID, email…" />
            </div>
            <select className="select" value={licenseFilter} onChange={(e) => { setLicenseFilter(e.target.value); setPage(1); }}>
              <option>All Licenses</option>
              {data.licenses.map(l => <option key={l}>{l}</option>)}
            </select>
            <select className="select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option>All Status</option>
              {data.statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="toolbar-right">
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
            <button className="btn-ghost" onClick={exportCsv}>
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
                {show("pro")    && <th className="th-num"><span className="th-lic"><LicDot kind="pro" />Professional</span></th>}
                {show("func")   && <th className="th-num"><span className="th-lic"><LicDot kind="func" />Functional</span></th>}
                {show("prod")   && <th className="th-num"><span className="th-lic"><LicDot kind="prod" />Productivity</span></th>}
                {show("target") && <th onClick={() => toggleSort("targetLicense")} className="sortable">Target License Classification <SortIcon active={sort.key === "targetLicense"} dir={sort.dir} /></th>}
                {show("role")   && <th onClick={() => toggleSort("roleCount")} className="sortable">Role <SortIcon active={sort.key === "roleCount"} dir={sort.dir} /></th>}
                {show("auth")   && <th>Auth Object</th>}
                {show("field")  && <th>Field</th>}
                {show("values") && <th>Values</th>}
                {show("fstat")  && <th>Field Status</th>}
                {show("lic")    && <th>License</th>}
                {show("rec")    && <th>Recommendation</th>}
                <th style={{ width: 70 }}></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => {
                const userOpen = expandedUsers.has(u.id);
                const c = avatarColor(u.id);
                const initials = (u.firstName === "NA" ? u.lastName : u.firstName[0] + u.lastName[0]).toUpperCase().slice(0, 2);
                const actionableCount = userRecSummary(u);
                const rows = [];

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
                    {show("pro")    && <td className="num"><CountCell value={u.licenseCounts.professional} kind="pro" /></td>}
                    {show("func")   && <td className="num"><CountCell value={u.licenseCounts.functional} kind="func" /></td>}
                    {show("prod")   && <td className="num"><CountCell value={u.licenseCounts.productivity} kind="prod" /></td>}
                    {show("target") && <td><LicensePill license={u.targetLicense} /></td>}
                    {show("role")   && <td className="num">{u.roleCount} {u.roleCount === 1 ? "role" : "roles"}</td>}
                    {show("auth")   && <td className="num">{u.authCount.toLocaleString()} auth objs</td>}
                    {show("field")  && <td></td>}
                    {show("values") && <td></td>}
                    {show("fstat")  && <td></td>}
                    {show("lic")    && <td></td>}
                    {show("rec")    && <td>
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
                    </td>}
                    <td className="col-action">
                      <button className="view-btn" onClick={(e) => { e.stopPropagation(); window.location.href = `User Details.html?id=${u.id}`; }}>
                        View
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
                      </button>
                    </td>
                  </tr>
                );

                if (userOpen) {
                  u.roles.forEach((role) => {
                    const rkey = `${u.id}::${role.name}`;
                    const roleOpen = expandedRoles.has(rkey);

                    rows.push(
                      <tr key={`r-${rkey}`} className={`row-role ${roleOpen ? "expanded" : ""}`} onClick={() => toggleRole(rkey)}>
                        <td></td>
                        <td></td>
                        {show("name")   && <td></td>}
                        {show("sapId")  && <td></td>}
                        {show("email")  && <td></td>}
                        {show("pro")    && <td className="num"><CountCell value={role.licenseCounts.professional} kind="pro" /></td>}
                        {show("func")   && <td className="num"><CountCell value={role.licenseCounts.functional} kind="func" /></td>}
                        {show("prod")   && <td className="num"><CountCell value={role.licenseCounts.productivity} kind="prod" /></td>}
                        {show("target") && <td><LicensePill license={role.targetLicense} /></td>}
                        {show("role")   && <td className="role-cell">
                          <ChevDown open={roleOpen} />
                          <span className="mono role-name">{role.name}</span>
                          <span className="muted role-meta">· {role.authObjs.length} auth objs</span>
                        </td>}
                        {show("auth")   && <td></td>}
                        {show("field")  && <td></td>}
                        {show("values") && <td></td>}
                        {show("fstat")  && <td></td>}
                        {show("lic")    && <td></td>}
                        {show("rec")    && <td><RecommendationCell rec={role.recommendation} /></td>}
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
                            {show("pro")    && <td></td>}
                            {show("func")   && <td></td>}
                            {show("prod")   && <td></td>}
                            {show("target") && <td></td>}
                            {show("role")   && <td></td>}
                            {show("auth")   && <td className="link mono">{a.name}</td>}
                            {show("field")  && <td className="mono muted">{a.field}</td>}
                            {show("values") && <td className="mono muted">{a.values}</td>}
                            {show("fstat")  && <td><FieldStatusPill status={a.fieldStatus} /></td>}
                            {show("lic")    && <td><LicensePill license={a.license} /></td>}
                            {show("rec")    && <td><span className="muted">—</span></td>}
                            <td></td>
                          </tr>
                        );
                      });
                    }
                  });
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
