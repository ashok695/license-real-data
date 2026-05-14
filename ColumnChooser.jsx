// Floating popover that lets users hide/show columns in the License Allocation tree.
// Used by LicenseOptimizationPage; controlled (open / hidden / onToggle / onClose).

function ColumnChooser({ open, columns, hidden, onToggle, onClose }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    function onEsc(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  const visibleCount = columns.filter(c => !hidden.has(c.key)).length;

  return (
    <div className="col-chooser" ref={ref} role="dialog" aria-label="Choose columns">
      <div className="col-chooser-head">
        <span className="col-chooser-title">Show columns</span>
        <span className="col-chooser-count">{visibleCount} / {columns.length}</span>
      </div>
      <div className="col-chooser-body">
        {columns.map(col => {
          const checked = !hidden.has(col.key);
          const disabled = col.required;
          return (
            <label
              key={col.key}
              className={`col-chooser-row ${disabled ? "is-disabled" : ""}`}
              onClick={(e) => {
                if (disabled) return;
                e.preventDefault();
                onToggle(col.key);
              }}
            >
              <span className={`col-chooser-check ${checked ? "is-on" : ""}`}>
                {checked && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </span>
              <span className="col-chooser-label">{col.label}</span>
              {disabled && <span className="col-chooser-locked">required</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}

window.ColumnChooser = ColumnChooser;
