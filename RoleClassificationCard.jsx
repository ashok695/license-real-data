// Card 2 — Role-Based License Classification
// Aggregated view: Role Name, Description, (Module/Type/Users), Target License Classification

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

  function RoleClassificationCard() {
    const data = window.LICENSE_DATA;

    const [query, setQuery] = React.useState("");
    const [target, setTarget] = React.useState("All");
    const [moduleF, setModuleF] = React.useState("All");
    const [typeF, setTypeF] = React.useState("All");
    const [sort, setSort] = React.useState({ key: "users", dir: "desc" });
    const [page, setPage] = React.useState(1);
    const [pageSize] = React.useState(8);
    const [hidden, setHidden] = React.useState(new Set());
    const [chooserOpen, setChooserOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(new Set());

    function toggleRole(name) {
      setExpanded(s => { const n = new Set(s); n.has(name) ? n.delete(name) : n.add(name); return n; });
    }

    const columns = [
      { key: "name",   label: "Role Name",                    required: true },
      { key: "desc",   label: "Role Description" },
      { key: "type",   label: "Role Type" },
      { key: "users",  label: "Users" },
      { key: "auth",   label: "Auth Objects" },
      { key: "target", label: "Target License Classification", required: true }
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
      list = [...list].sort((a, b) => {
        let av, bv;
        if (sort.key === "auth") { av = a.authObjsTotal; bv = b.authObjsTotal; }
        else if (sort.key === "target") { av = HIER[a.targetLicense] || 0; bv = HIER[b.targetLicense] || 0; }
        else if (sort.key === "desc") { av = a.description; bv = b.description; }
        else { av = a[sort.key]; bv = b[sort.key]; }
        if (av < bv) return sort.dir === "asc" ? -1 : 1;
        if (av > bv) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
      return list;
    }, [data.rolesAggregated, query, target, typeF, sort]);

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
          else if (c.key === "auth") row.push(r.authObjsTotal);
          else if (c.key === "target") row.push(r.targetLicense);
        });
        rows.push(row);
      });
      const csv = rows.map(rr => rr.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "role-license-classification.csv"; a.click();
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
            <p className="card-sub">Each SAP role mapped to its target license classification — surfaces the roles driving higher-tier license allocation.</p>
          </div>
        </div>

        <div className="card-toolbar">
          <div className="toolbar-left">
            <div className="search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search role name or description…" />
            </div>
            <select className="select" value={target} onChange={(e) => { setTarget(e.target.value); setPage(1); }}>
              <option value="All">All Target Licenses</option>
              <option>HD Professional</option>
              <option>HD Functional</option>
              <option>HD Productivity</option>
              <option>NA</option>
            </select>
            <select className="select" value={typeF} onChange={(e) => { setTypeF(e.target.value); setPage(1); }}>
              <option value="All">All Role Types</option>
              <option>Single</option>
              <option>Composite</option>
            </select>
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
                {show("desc") && <th onClick={() => toggleSort("desc")} className="sortable" style={{ minWidth: 320 }}>Role Description <SortIcon active={sort.key === "desc"} dir={sort.dir} /></th>}
                {show("type") && <th style={{ width: 110 }}>Type</th>}
                {show("users") && <th onClick={() => toggleSort("users")} className="sortable num" style={{ width: 90 }}>Users <SortIcon active={sort.key === "users"} dir={sort.dir} /></th>}
                {show("auth") && <th onClick={() => toggleSort("auth")} className="sortable num" style={{ width: 120 }}>Auth Objects <SortIcon active={sort.key === "auth"} dir={sort.dir} /></th>}
                {show("target") && <th onClick={() => toggleSort("target")} className="sortable" style={{ width: 220 }}>Target License Classification <SortIcon active={sort.key === "target"} dir={sort.dir} /></th>}
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
                    {show("desc") && <td className="role-desc-cell">{highlight(r.description, query)}</td>}
                    {show("type") && <td><span className={`type-pill ${r.type === "Composite" ? "type-comp" : "type-single"}`}>{r.type}</span></td>}
                    {show("users") && <td className="num"><span className="users-count">{r.users}</span></td>}
                    {show("auth") && <td className="num">{r.authObjsTotal.toLocaleString()}</td>}
                    {show("target") && <td><TargetBadge license={r.targetLicense} /></td>}
                  </tr>
                );
                if (isOpen && r.authObjs && r.authObjs.length) {
                  const totalCols = 1 + columns.length - hidden.size;
                  rows.push(
                    <tr key={`${r.name}::sub`} className="row-sub-panel">
                      <td colSpan={totalCols} className="sub-panel-cell">
                        <div className="sub-panel">
                          <table className="data-table sub-table">
                            <thead>
                              <tr>
                                <th style={{ width: "22%" }}>Auth Object</th>
                                <th style={{ width: "16%" }}>Field</th>
                                <th style={{ width: "26%" }}>Description</th>
                                <th style={{ width: "20%" }}>Values</th>
                                <th style={{ width: "16%" }}>License</th>
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
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  );
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
      </div>
    );
  }

  window.RoleClassificationCard = RoleClassificationCard;
  window.TargetBadge = TargetBadge;
  window.ColumnChooser = ColumnChooser;
})();
