// Sidebar — KTern-style left navigation
const sidebarItems = [
  { id: "bookmarks", label: "Bookmarks", icon: "star" },
  { id: "workspace", label: "My Workspace", icon: "home" },
  { id: "transformation", label: "Transformation Hub", icon: "grid", chevron: true },
  { id: "maps", label: "Digital Maps", icon: "map", chevron: true },
  { id: "projects", label: "Digital Projects", icon: "folder", chevron: true },
  { id: "process", label: "Digital Process", icon: "swap", chevron: true },
  { id: "labs", label: "Digital Labs", icon: "lab", chevron: true },
  { id: "mines", label: "Digital Mines", icon: "mine", chevron: true },
  { id: "landscape", label: "Landscape Manage…", icon: "landscape" },
  { id: "cleancore", label: "Digital Clean Core", icon: "core", chevron: true, active: true },
];

function SidebarIcon({ name }) {
  const stroke = "currentColor";
  const sw = 1.6;
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "star":
      return <svg {...common}><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2"/></svg>;
    case "home":
      return <svg {...common}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>;
    case "grid":
      return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "map":
      return <svg {...common}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case "folder":
      return <svg {...common}><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/></svg>;
    case "swap":
      return <svg {...common}><path d="M3 7h13l-3-3"/><path d="M21 17H8l3 3"/></svg>;
    case "lab":
      return <svg {...common}><path d="M9 3h6"/><path d="M10 3v7l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/></svg>;
    case "mine":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case "landscape":
      return <svg {...common}><path d="M3 19l5-7 4 5 3-4 6 6"/><circle cx="17" cy="7" r="2"/></svg>;
    case "core":
      return <svg {...common}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>;
    case "more":
      return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17.5h7M17.5 14v7"/></svg>;
    default:
      return null;
  }
}

function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        <span className="sidebar-logo-text">{collapsed ? "K" : "KTern.AI"}</span>
        <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {sidebarItems.map((it) => (
          <a
            key={it.id}
            className={`sidebar-item ${it.active ? "active" : ""}`}
            href="#"
            onClick={(e) => e.preventDefault()}
            title={collapsed ? it.label : undefined}
          >
            <span className="sidebar-item-icon"><SidebarIcon name={it.icon} /></span>
            {!collapsed && <span className="sidebar-item-label">{it.label}</span>}
            {!collapsed && it.chevron && (
              <svg className="sidebar-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9aa3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18"/>
              </svg>
            )}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <a className="sidebar-item" href="#" onClick={(e) => e.preventDefault()}>
          <span className="sidebar-item-icon"><SidebarIcon name="more" /></span>
          {!collapsed && <span className="sidebar-item-label">More Streams</span>}
        </a>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">CS</div>
          {!collapsed && (
            <div className="sidebar-user-meta">
              <div className="sidebar-user-name">Customer Success</div>
              <div className="sidebar-user-role">KTern.AI Admin</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
