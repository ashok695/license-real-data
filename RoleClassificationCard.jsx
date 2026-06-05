// Card 2 — Role-Based License Classification
// Aggregated view: Role Name, Description, (Module/Type/Users), Consumed High Privileged License

(function () {
  const HIER = { "HD Professional": 3, "HD Functional": 2, "HD Productivity": 1 };

  function highlight(text, query) {
    if (!query || !text) return text;
    const idx = String(text).toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return text;
    return (<>{String(text).slice(0, idx)}<mark>{String(text).slice(idx, idx + query.length)}</mark>{String(text).slice(idx + query.length)}</>);
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

  function TargetBadge({ license }) {
    if (!license || license === "NA") return <span className="pill pill-slate">NA</span>;
    const map = {
      "HD Productivity": "pill-blue",
      "HD Professional": "pill-violet",
      "HD Functional": "pill-cyan",
      "HD Developer": "pill-amber",
      "HD Platform": "pill-rose",
      "Employee": "pill-slate"
    };
    return <span className={`pill ${map[license] || "pill-blue"}`}>{license}</span>;
  }

  function ColumnChooser({ open, columns, hidden, onToggle, onClose }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (!open) return;
      const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
      document.addEventListener("mousedown", h);
      return () => document.removeEventListener("mousedown", h);
    }, [open, onClose]);
    if (!open) return null;
    return (
      <div className="col-chooser-pop" ref={ref}>
        <div className="col-chooser-head">Show columns</div>
        {columns.map(c => (
          <label key={c.key} className="col-chooser-item">
            <input
              type="checkbox"
              checked={!hidden.has(c.key)}
              disabled={c.required}
              onChange={() => onToggle(c.key)}
            />
            <span>{c.label}</span>
            {c.required ? <em className="col-required">required</em> : null}
          </label>
        ))}
      </div>
    );
  }

  function ModulePill({ m }) {
    const map = {
      FI: "mod-fi", MM: "mod-mm", SD: "mod-sd",
      HR: "mod-hr", BC: "mod-bc", PM: "mod-pm"
    };
    return <span className={`mod-pill ${map[m] || "mod-other"}`}>{m}</span>;
  }

  function ChevDown({ open }) {
    return (
      <svg className={`chev ${open ? "open" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
    );
  }

  function FieldStatusPill({ status }) {
    const map = { "Used": "pill-green", "Unused": "pill-red", "Partial": "pill-amber" };
    return <span className={`pill ${map[status] || "pill-gray"}`}>{status}</span>;
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

  function AuthUsersModal({ authObj, kind, onClose }) {
    // kind: "assigned" | "used" | "unused"
    const [search, setSearch] = React.useState("");
    const baseUsers = kind === "used"
      ? (authObj.usedUserList || [])
      : kind === "unused"
        ? (authObj.unusedUserList || [])
        : (authObj.assignedUserList || []);
    const filtered = search
      ? baseUsers.filter(u =>
          u.sapId.toLowerCase().includes(search.toLowerCase()) ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        )
      : baseUsers;

    function handleBackdrop(e) { if (e.target === e.currentTarget) onClose(); }
    React.useEffect(() => {
      const h = (e) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", h);
      return () => document.removeEventListener("keydown", h);
    }, [onClose]);

    const licenseColors = {
      "HD Productivity": "pill-blue", "HD Professional": "pill-violet",
      "HD Functional": "pill-cyan", "HD Developer": "pill-amber",
      "HD Platform": "pill-rose", "Employee": "pill-slate", "NA": "pill-gray"
    };
    const title = kind === "used" ? "Used By" : kind === "unused" ? "Unused By" : "Assigned To";
    const pillClass = kind === "used" ? "pill-green" : kind === "unused" ? "pill-red" : "pill-blue";

    return (
      <div className="modal-backdrop" onClick={handleBackdrop}>
        <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
          <div className="modal-header">
            <div>
              <h3 className="modal-title" id="auth-modal-title">
                <span className="role-icon" style={{ marginRight: 8 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                {title}{" "}
                <span className="mono" style={{ color: "var(--primary-600)" }}>{authObj.name}</span>
                <span className="mono muted" style={{ fontSize: 12, marginLeft: 6 }}>/ {authObj.field}</span>
              </h3>
              <p className="modal-sub">{filtered.length} of {baseUsers.length} user{baseUsers.length !== 1 ? "s" : ""} shown</p>
            </div>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="modal-search-wrap">
            <div className="search" style={{ width: "100%" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, SAP ID or email…"
                autoFocus
              />
            </div>
          </div>
          <div className="modal-table-wrap">
            <table className="data-table modal-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 120 }}>SAP ID</th>
                  <th style={{ minWidth: 160 }}>Name</th>
                  <th style={{ minWidth: 200 }}>Email</th>
                  <th style={{ width: 140 }}>License</th>
                  <th style={{ width: 90 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="empty-state">No users match your search.</td></tr>
                )}
                {filtered.map((u, i) => (
                  <tr key={i} className="row-user">
                    <td className="mono link">{u.sapId}</td>
                    <td>
                      <div className="user-cell">
                        <span className="avatar" style={{ background: "var(--primary-soft)", color: "var(--primary-600)", fontSize: 10 }}>
                          {u.firstName[0]}{u.lastName[0]}
                        </span>
                        {u.firstName} {u.lastName}
                      </div>
                    </td>
                    <td className="muted">{u.email}</td>
                    <td><span className={`pill ${licenseColors[u.license] || "pill-gray"}`}>{u.license}</span></td>
                    <td>
                      <span className={`pill ${u.status === "Active" ? "pill-green" : "pill-gray"}`}>{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function UsersModal({ role, onClose, statusFilter }) {
    const [search, setSearch] = React.useState("");
    const baseUsers = statusFilter
      ? (role.userList || []).filter(u => u.status === statusFilter)
      : (role.userList || []);
    const filtered = search
      ? baseUsers.filter(u =>
          u.sapId.toLowerCase().includes(search.toLowerCase()) ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        )
      : baseUsers;

    // Close on backdrop click
    function handleBackdrop(e) {
      if (e.target === e.currentTarget) onClose();
    }

    // Close on Escape
    React.useEffect(() => {
      const h = (e) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", h);
      return () => document.removeEventListener("keydown", h);
    }, [onClose]);

    const licenseColors = {
      "HD Productivity": "pill-blue",
      "HD Professional": "pill-violet",
      "HD Functional": "pill-cyan",
      "HD Developer": "pill-amber",
      "HD Platform": "pill-rose",
      "Employee": "pill-slate",
      "NA": "pill-gray"
    };

    return (
      <div className="modal-backdrop" onClick={handleBackdrop}>
        <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-header">
            <div>
              <h3 className="modal-title" id="modal-title">
                <span className="role-icon" style={{ marginRight: 8 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                Users assigned to <span className="mono" style={{ color: "var(--primary-600)" }}>{role.name}</span>
                {statusFilter && (
                  <span className={`pill ${statusFilter === "Active" ? "pill-green" : "pill-gray"}`} style={{ marginLeft: 8, fontSize: 11 }}>{statusFilter}</span>
                )}
              </h3>
              <p className="modal-sub">{filtered.length} of {baseUsers.length} user{baseUsers.length !== 1 ? "s" : ""} shown</p>
            </div>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="modal-search-wrap">
            <div className="search" style={{ width: "100%" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, SAP ID or email…"
                autoFocus
              />
            </div>
          </div>

          <div className="modal-table-wrap">
            <table className="data-table modal-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 120 }}>SAP ID</th>
                  <th style={{ minWidth: 160 }}>Name</th>
                  <th style={{ minWidth: 200 }}>Email</th>
                  <th style={{ width: 140 }}>License</th>
                  <th style={{ width: 90 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="empty-state">No users match your search.</td></tr>
                )}
                {filtered.map((u, i) => (
                  <tr key={i} className="row-user">
                    <td className="mono link">{u.sapId}</td>
                    <td>
                      <div className="user-cell">
                        <span className="avatar" style={{ background: "var(--primary-soft)", color: "var(--primary-600)", fontSize: 10 }}>
                          {u.firstName[0]}{u.lastName[0]}
                        </span>
                        {u.firstName} {u.lastName}
                      </div>
                    </td>
                    <td className="muted">{u.email}</td>
                    <td><span className={`pill ${licenseColors[u.license] || "pill-gray"}`}>{u.license}</span></td>
                    <td>
                      <span className={`pill ${u.status === "Active" ? "pill-green" : "pill-gray"}`}>{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function UtilizationBar({ value }) {
    const pct = value ?? 0;
    const color = pct >= 70 ? "var(--success)" : pct >= 40 ? "var(--warn)" : "var(--danger)";
    const bgColor = pct >= 70 ? "var(--success-soft)" : pct >= 40 ? "var(--warn-soft)" : "var(--danger-soft)";
    return (
      <div className="util-bar-wrap">
        <div className="util-bar-track">
          <div className="util-bar-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
        <span className="util-bar-label" style={{ color }}>{pct}%</span>
      </div>
    );
  }

  function RoleClassificationCard() {
    const data = window.LICENSE_DATA;

    const [query, setQuery] = React.useState("");
    const [target, setTarget] = React.useState("All");
    const [moduleF, setModuleF] = React.useState("All");
    const [typeF, setTypeF] = React.useState("All");
    const [authLicenseF, setAuthLicenseF] = React.useState("All");
    const [authUnusedF, setAuthUnusedF] = React.useState("All");
    const [sort, setSort] = React.useState({ key: "users", dir: "desc" });
    const [page, setPage] = React.useState(1);
    const [pageSize] = React.useState(8);
    const [hidden, setHidden] = React.useState(new Set());
    const [chooserOpen, setChooserOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(new Set());
    const [expandedChild, setExpandedChild] = React.useState(new Set());
    const [usersModal, setUsersModal] = React.useState(null); // { role, statusFilter } or null
    const [authModal, setAuthModal] = React.useState(null);   // { authObj, kind } or null

    function toggleRole(name) {
      setExpanded(s => { const n = new Set(s); n.has(name) ? n.delete(name) : n.add(name); return n; });
    }
    function toggleChild(key) {
      setExpandedChild(s => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
    }

    const columns = [
      { key: "name",            label: "Role Name",                        required: true },
      { key: "target",          label: "Consumed High Privileged License",   required: true },
      { key: "desc",            label: "Role Description" },
      { key: "type",            label: "Role Type" },
      { key: "users",           label: "Users" },
      { key: "activeUsers",     label: "Active Users" },
      { key: "inactiveUsers",   label: "Inactive Users" },
      { key: "utilization",     label: "Role Utilization" },
      { key: "auth",            label: "Auth Objects" },
    ];

    const filtered = React.useMemo(() => {
      let list = data.rolesAggregated;
      if (query) {
        const q = query.toLowerCase();
        list = list.filter(r =>
          r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
        );
      }
      if (target !== "All") list = list.filter(r => r.targetLicense === target);
      if (typeF !== "All") list = list.filter(r => r.type === typeF);
      // Auth License filter — role passes if any auth obj (across itself or child roles) matches
      if (authLicenseF !== "All") {
        list = list.filter(r => {
          const allAuthObjs = r.type === "Composite" && r.childRoles
            ? r.childRoles.flatMap(c => c.authObjs || [])
            : (r.authObjs || []);
          return allAuthObjs.some(a => a.license === authLicenseF);
        });
      }
      // Auth Unused Users filter — "Has Unused" keeps roles where any auth obj has unusedUsers > 0
      //                           "No Unused"  keeps roles where all auth objs have unusedUsers = 0
      if (authUnusedF !== "All") {
        list = list.filter(r => {
          const allAuthObjs = r.type === "Composite" && r.childRoles
            ? r.childRoles.flatMap(c => c.authObjs || [])
            : (r.authObjs || []);
          if (authUnusedF === "Has Unused") return allAuthObjs.some(a => (a.unusedUsers ?? 0) > 0);
          if (authUnusedF === "No Unused")  return allAuthObjs.every(a => (a.unusedUsers ?? 0) === 0);
          return true;
        });
      }
      // Always group Single roles first, then Composite roles. Within each
      // group, apply the user-selected sort.
      const typeRank = (t) => (t === "Single" ? 0 : 1);
      list = [...list].sort((a, b) => {
        const ta = typeRank(a.type), tb = typeRank(b.type);
        if (ta !== tb) return ta - tb;
        let av, bv;
        if (sort.key === "auth") { av = a.authObjsTotal; bv = b.authObjsTotal; }
        else if (sort.key === "target") { av = HIER[a.targetLicense] || 0; bv = HIER[b.targetLicense] || 0; }
        else if (sort.key === "desc") { av = a.description; bv = b.description; }
        else if (sort.key === "activeUsers") {
          av = (a.userList || []).filter(u => u.status === "Active").length;
          bv = (b.userList || []).filter(u => u.status === "Active").length;
        }
        else if (sort.key === "inactiveUsers") {
          av = (a.userList || []).filter(u => u.status === "Inactive").length;
          bv = (b.userList || []).filter(u => u.status === "Inactive").length;
        }
        else if (sort.key === "utilization") { av = a.utilization; bv = b.utilization; }
        else { av = a[sort.key]; bv = b[sort.key]; }
        if (av < bv) return sort.dir === "asc" ? -1 : 1;
        if (av > bv) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
      return list;
    }, [data.rolesAggregated, query, target, typeF, authLicenseF, authUnusedF, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

    function toggleSort(key) { setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }); }
    function toggleColumn(k) { setHidden(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; }); }

    function exportCsv() {
      const cols = columns.filter(c => !hidden.has(c.key));
      const head = cols.map(c => c.label);
      const rows = [head];
      filtered.forEach(r => {
        const row = [];
        cols.forEach(c => {
          if (c.key === "name") row.push(r.name);
          else if (c.key === "desc") row.push(r.description);
          else if (c.key === "type") row.push(r.type);
          else if (c.key === "users") row.push(r.users);
          else if (c.key === "activeUsers") row.push((r.userList || []).filter(u => u.status === "Active").length);
          else if (c.key === "inactiveUsers") row.push((r.userList || []).filter(u => u.status === "Inactive").length);
          else if (c.key === "utilization") row.push(`${r.utilization}%`);
          else if (c.key === "auth") row.push(r.authObjsTotal);
          else if (c.key === "target") row.push(r.targetLicense);
        });
        rows.push(row);
      });
      const csv = rows.map(rr => rr.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const now = new Date();
      const day = now.getDate();
      const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
      const month = now.toLocaleString("en-GB", { month: "long" });
      const year = now.getFullYear();
      const stamp = `${day}${suffix} ${month} ${year}`;
      const a = document.createElement("a"); a.href = url; a.download = `Role Optimization Report - ${stamp}.csv`; a.click();
      URL.revokeObjectURL(url);
    }

    function show(k) { return !hidden.has(k); }

    // Distribution by target license
    const dist = filtered.reduce((acc, r) => {
      acc[r.targetLicense] = (acc[r.targetLicense] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="card">
        <div className="card-head">
          <div>
            <h2 className="card-title">Role-Based License Classification</h2>
            <p className="card-sub">Each SAP role mapped to the highest-privileged license it consumes — surfaces the roles driving higher-tier license allocation.</p>
          </div>
        </div>

        <div className="card-toolbar">
          <div className="toolbar-left">
            <div className="search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search role name or description…" />
            </div>
            <label className="filter-field">
              <span className="filter-label">Role License</span>
              <select className="select" value={target} onChange={(e) => { setTarget(e.target.value); setPage(1); }}>
                <option value="All">All</option>
                <option>HD Professional</option>
                <option>HD Functional</option>
                <option>HD Productivity</option>
                <option>NA</option>
              </select>
            </label>
            <label className="filter-field">
              <span className="filter-label">Role Type</span>
              <select className="select" value={typeF} onChange={(e) => { setTypeF(e.target.value); setPage(1); }}>
                <option value="All">All</option>
                <option>Single</option>
                <option>Composite</option>
              </select>
            </label>
            <label className="filter-field">
              <span className="filter-label">Auth License</span>
              <select className="select" value={authLicenseF} onChange={(e) => { setAuthLicenseF(e.target.value); setPage(1); }}>
                <option value="All">All</option>
                <option>HD Professional</option>
                <option>HD Functional</option>
                <option>HD Productivity</option>
                <option>NA</option>
              </select>
            </label>
            <label className="filter-field">
              <span className="filter-label">Auth Unused Users</span>
              <select className="select" value={authUnusedF} onChange={(e) => { setAuthUnusedF(e.target.value); setPage(1); }}>
                <option value="All">All</option>
                <option value="Has Unused">Has Unused</option>
                <option value="No Unused">No Unused</option>
              </select>
            </label>
          </div>
          <div className="toolbar-right">
            <div className="col-chooser-wrap">
              <button className="btn-ghost" onClick={() => setChooserOpen(o => !o)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
                Columns
                {hidden.size > 0 && <span className="col-chooser-badge">{columns.length - hidden.size}</span>}
              </button>
              <ColumnChooser open={chooserOpen} columns={columns} hidden={hidden} onToggle={toggleColumn} onClose={() => setChooserOpen(false)} />
            </div>
            <button className="btn-ghost" onClick={exportCsv}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            <span className="count-text">{filtered.length} roles</span>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table classification-table tree-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}></th>
                {show("name") && <th onClick={() => toggleSort("name")} className="sortable" style={{ minWidth: 220 }}>Role Name <SortIcon active={sort.key === "name"} dir={sort.dir} /></th>}
                {show("target") && (
                  <th onClick={() => toggleSort("target")} className="sortable" style={{ width: 220 }}>
                    <span className="th-with-info">
                      Consumed High Privileged License
                      <span className="th-info-wrap" role="tooltip" aria-label="Consumed High Privileged License logic" onClick={e => e.stopPropagation()}>
                        <svg className="th-info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span className="th-tooltip">
                          <span className="th-tooltip-title">How is this determined?</span>
                          <span className="th-tooltip-row">
                            <span>This is the <b>highest license tier</b> consumed across all authorization objects assigned to the role.</span>
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
                      <SortIcon active={sort.key === "target"} dir={sort.dir} />
                    </span>
                  </th>
                )}
                {show("desc") && <th onClick={() => toggleSort("desc")} className="sortable" style={{ minWidth: 320 }}>Role Description <SortIcon active={sort.key === "desc"} dir={sort.dir} /></th>}
                {show("type") && <th style={{ width: 110 }}>Type</th>}
                {show("users") && <th onClick={() => toggleSort("users")} className="sortable num" style={{ width: 90 }}>Users <SortIcon active={sort.key === "users"} dir={sort.dir} /></th>}
                {show("activeUsers") && <th onClick={() => toggleSort("activeUsers")} className="sortable num" style={{ width: 110 }}>Active Users <SortIcon active={sort.key === "activeUsers"} dir={sort.dir} /></th>}
                {show("inactiveUsers") && <th onClick={() => toggleSort("inactiveUsers")} className="sortable num" style={{ width: 120 }}>Inactive Users <SortIcon active={sort.key === "inactiveUsers"} dir={sort.dir} /></th>}
                {show("utilization") && (
                  <th onClick={() => toggleSort("utilization")} className="sortable num" style={{ width: 140 }}>
                    <span className="th-with-info">
                      Role Utilization
                      <span className="th-info-wrap" role="tooltip" aria-label="Role Utilization logic" onClick={e => e.stopPropagation()}>
                        <svg className="th-info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span className="th-tooltip">
                          <span className="th-tooltip-title">How is this calculated?</span>
                          <span className="th-tooltip-row">
                            <span>Percentage of assigned users who have <b>actively used</b> this role.</span>
                          </span>
                          <span className="th-tooltip-divider"/>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-tier" style={{ background: "var(--success-soft)", color: "var(--success)" }}>≥70%</span>
                            <span>High utilization</span>
                          </span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-tier" style={{ background: "var(--warn-soft)", color: "var(--warn)" }}>40–69%</span>
                            <span>Moderate utilization</span>
                          </span>
                          <span className="th-tooltip-row">
                            <span className="th-tooltip-tier" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>&lt;40%</span>
                            <span>Low utilization — review recommended</span>
                          </span>
                        </span>
                      </span>
                      <SortIcon active={sort.key === "utilization"} dir={sort.dir} />
                    </span>
                  </th>
                )}
                {show("auth") && <th onClick={() => toggleSort("auth")} className="sortable num" style={{ width: 120 }}>Auth Objects <SortIcon active={sort.key === "auth"} dir={sort.dir} /></th>}
              </tr>
            </thead>
            <tbody>
              {visible.map(r => {
                const isOpen = expanded.has(r.name);
                const rows = [];
                rows.push(
                  <tr key={r.name} className={`row-class row-role ${isOpen ? "expanded" : ""}`} onClick={() => toggleRole(r.name)}>
                    <td className="col-expand"><ChevDown open={isOpen} /></td>
                    {show("name") && (
                      <td>
                        <div className="role-cell-strong">
                          <span className="role-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                          </span>
                          <span className="mono role-name-strong">{highlight(r.name, query)}</span>
                        </div>
                      </td>
                    )}
                    {show("target") && <td><TargetBadge license={r.targetLicense} /></td>}
                    {show("desc") && <td className="role-desc-cell">{highlight(r.description, query)}</td>}
                    {show("type") && <td><span className={`type-pill ${r.type === "Composite" ? "type-comp" : "type-single"}`}>{r.type}</span></td>}
                    {show("users") && <td className="num"><span className="users-count users-count-btn" onClick={e => { e.stopPropagation(); setUsersModal({ role: r, statusFilter: null }); }}>{r.users}</span></td>}
                    {show("activeUsers") && (
                      <td className="num" onClick={e => e.stopPropagation()}>
                        <span className="users-count users-count-btn pill pill-green" onClick={e => { e.stopPropagation(); setUsersModal({ role: r, statusFilter: "Active" }); }}>
                          {(r.userList || []).filter(u => u.status === "Active").length}
                        </span>
                      </td>
                    )}
                    {show("inactiveUsers") && (
                      <td className="num" onClick={e => e.stopPropagation()}>
                        <span className="users-count users-count-btn pill pill-gray" onClick={e => { e.stopPropagation(); setUsersModal({ role: r, statusFilter: "Inactive" }); }}>
                          {(r.userList || []).filter(u => u.status === "Inactive").length}
                        </span>
                      </td>
                    )}
                    {show("utilization") && (
                      <td className="num" onClick={e => e.stopPropagation()}>
                        <UtilizationBar value={r.utilization} />
                      </td>
                    )}
                    {show("auth") && <td className="num">{r.authObjsTotal.toLocaleString()}</td>}
                  </tr>
                );
                if (isOpen) {
                  const totalCols = 1 + columns.length - hidden.size;
                  // Composite role: render child roles tree → each child expands to its auth objects
                  if (r.type === "Composite" && r.childRoles && r.childRoles.length) {
                    rows.push(
                      <tr key={`${r.name}::sub`} className="row-sub-panel">
                        <td colSpan={totalCols} className="sub-panel-cell">
                          <div className="sub-panel">
                            <table className="data-table sub-table tree-table">
                              <thead>
                                <tr>
                                  <th style={{ width: 32 }}></th>
                                  <th style={{ minWidth: 220 }}>Child Role</th>
                                  <th style={{ width: 160 }}>Consumed High Privileged License</th>
                                  <th>Description</th>
                                  <th style={{ width: 90 }}>Type</th>
                                  <th className="num" style={{ width: 110 }}>Auth Objects</th>
                                </tr>
                              </thead>
                              <tbody>
                                {r.childRoles.map((c, ci) => {
                                  const childKey = `${r.name}::${c.name}::${ci}`;
                                  const cOpen = expandedChild.has(childKey);
                                  const childRows = [];
                                  childRows.push(
                                    <tr key={childKey} className={`row-class row-role ${cOpen ? "expanded" : ""}`} onClick={() => toggleChild(childKey)}>
                                      <td className="col-expand"><ChevDown open={cOpen} /></td>
                                      <td>
                                        <div className="role-cell-strong">
                                          <span className="role-icon">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                            </svg>
                                          </span>
                                          <span className="mono role-name-strong">{c.name}</span>
                                        </div>
                                      </td>
                                      <td><TargetBadge license={c.targetLicense} /></td>
                                      <td className="role-desc-cell muted">{c.description || "-"}</td>
                                      <td><span className="type-pill type-single">{c.type}</span></td>
                                      <td className="num">{(c.authObjsTotal || c.authObjs.length).toLocaleString()}</td>
                                    </tr>
                                  );
                                  if (cOpen && c.authObjs && c.authObjs.length) {
                                    childRows.push(
                                      <tr key={`${childKey}::auth`} className="row-sub-panel">
                                        <td colSpan={6} className="sub-panel-cell">
                                          <div className="sub-panel">
                                            <table className="data-table sub-table">
                                              <thead>
                                                <tr>
                                                  <th style={{ width: "18%" }}>Auth Object</th>
                                                  <th style={{ width: "12%" }}>Field</th>
                                                  <th style={{ width: "22%" }}>Description</th>
                                                  <th style={{ width: "16%" }}>Values</th>
                                                  <th style={{ width: "13%" }}>License</th>
                                                  <th className="num" style={{ width: "10%" }}>Assigned Users</th>
                                                  <th className="num" style={{ width: "8%" }}>Used Users</th>
                                                  <th className="num" style={{ width: "8%" }}>Unused Users</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {c.authObjs.map((a, ai) => (
                                                  <tr key={`${childKey}::a${ai}`}>
                                                    <td className="link mono">{a.name}</td>
                                                    <td className="mono muted">{a.field}</td>
                                                    <td className="muted">{a.desc || "-"}</td>
                                                    <td className="mono muted">{a.values}</td>
                                                    <td><LicensePill license={a.license} /></td>
                                                    <td className="num">
                                                      <span
                                                        className="users-count users-count-btn"
                                                        onClick={e => { e.stopPropagation(); setAuthModal({ authObj: a, kind: "assigned" }); }}
                                                      >{a.assignedUsers ?? 0}</span>
                                                    </td>
                                                    <td className="num">
                                                      <span
                                                        className="users-count users-count-btn pill pill-green"
                                                        onClick={e => { e.stopPropagation(); setAuthModal({ authObj: a, kind: "used" }); }}
                                                      >{a.usedUsers ?? 0}</span>
                                                    </td>
                                                    <td className="num">
                                                      <span
                                                        className="users-count users-count-btn pill pill-red"
                                                        onClick={e => { e.stopPropagation(); setAuthModal({ authObj: a, kind: "unused" }); }}
                                                      >{a.unusedUsers ?? 0}</span>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                  return childRows;
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    );
                  } else if (r.authObjs && r.authObjs.length) {
                    // Single role: expand directly to auth objects
                    rows.push(
                      <tr key={`${r.name}::sub`} className="row-sub-panel">
                        <td colSpan={totalCols} className="sub-panel-cell">
                          <div className="sub-panel">
                            <table className="data-table sub-table">
                              <thead>
                                <tr>
                                  <th style={{ width: "18%" }}>Auth Object</th>
                                  <th style={{ width: "12%" }}>Field</th>
                                  <th style={{ width: "22%" }}>Description</th>
                                  <th style={{ width: "16%" }}>Values</th>
                                  <th style={{ width: "13%" }}>License</th>
                                  <th className="num" style={{ width: "10%" }}>Assigned Users</th>
                                  <th className="num" style={{ width: "8%" }}>Used Users</th>
                                  <th className="num" style={{ width: "8%" }}>Unused Users</th>
                                </tr>
                              </thead>
                              <tbody>
                                {r.authObjs.map((a, ai) => (
                                  <tr key={`${r.name}::a${ai}`}>
                                    <td className="link mono">{a.name}</td>
                                    <td className="mono muted">{a.field}</td>
                                    <td className="muted">{a.desc || "-"}</td>
                                    <td className="mono muted">{a.values}</td>
                                    <td><LicensePill license={a.license} /></td>
                                    <td className="num">
                                      <span
                                        className="users-count users-count-btn"
                                        onClick={e => { e.stopPropagation(); setAuthModal({ authObj: a, kind: "assigned" }); }}
                                      >{a.assignedUsers ?? 0}</span>
                                    </td>
                                    <td className="num">
                                      <span
                                        className="users-count users-count-btn pill pill-green"
                                        onClick={e => { e.stopPropagation(); setAuthModal({ authObj: a, kind: "used" }); }}
                                      >{a.usedUsers ?? 0}</span>
                                    </td>
                                    <td className="num">
                                      <span
                                        className="users-count users-count-btn pill pill-red"
                                        onClick={e => { e.stopPropagation(); setAuthModal({ authObj: a, kind: "unused" }); }}
                                      >{a.unusedUsers ?? 0}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                }
                return rows;
              })}
              {visible.length === 0 && (
                <tr><td colSpan={1 + columns.length - hidden.size} className="empty-state">No roles match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer">
          <div className="muted">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} roles
          </div>
          <div className="pager">
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p =>
              <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            )}
            <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
          </div>
        </div>

        {usersModal && <UsersModal role={usersModal.role} statusFilter={usersModal.statusFilter} onClose={() => setUsersModal(null)} />}
        {authModal && <AuthUsersModal authObj={authModal.authObj} kind={authModal.kind} onClose={() => setAuthModal(null)} />}
      </div>
    );
  }

  window.RoleClassificationCard = RoleClassificationCard;
  window.TargetBadge = TargetBadge;
  window.ColumnChooser = ColumnChooser;
})();
