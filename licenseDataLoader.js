// Loads the License Optimization dataset from the user_data/ folder instead of
// the hardcoded generator in data.js.
//
// Browsers cannot list a directory, so we read user_data/manifest.json (an array
// of file names) and fetch each user JSON. Every file already matches the shape
// the License Allocation Tree consumes (see the transform applied to user_data).
//
// Exposes:
//   window.LICENSE_DATA_READY → Promise that resolves to the assembled dataset
//                               and also assigns window.LICENSE_DATA.
(function () {
  const BASE = "user_data";
  const HIER = { "HD Professional": 3, "HD Functional": 2, "HD Productivity": 1 };

  async function fetchJson(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return res.json();
  }

  // Build the rolesAggregated dataset (Role-Based License Classification) so any
  // KPI / card that reads it keeps working.
  function buildRolesAggregated(users) {
    const roleAgg = {};
    users.forEach(u => {
      (u.roles || []).forEach(role => {
        let agg = roleAgg[role.name];
        if (!agg) {
          agg = roleAgg[role.name] = {
            name: role.name,
            description: role.description || "—",
            module: role.module || "—",
            type: role.type || "Single",
            users: 0,
            authObjsTotal: 0,
            counts: { professional: 0, functional: 0, productivity: 0 },
            targetLicense: "NA",
            authObjs: (role.authObjs || []).slice(),
            _highest: 0
          };
        }
        agg.users++;
        agg.authObjsTotal += (role.authObjs || []).length;
        agg.counts.professional += role.licenseCounts ? role.licenseCounts.professional : 0;
        agg.counts.functional += role.licenseCounts ? role.licenseCounts.functional : 0;
        agg.counts.productivity += role.licenseCounts ? role.licenseCounts.productivity : 0;
        const v = HIER[role.targetLicense] || 0;
        if (v > agg._highest) { agg._highest = v; agg.targetLicense = role.targetLicense; }
      });
    });

    const list = Object.values(roleAgg).sort((a, b) => b.users - a.users);
    list.forEach(r => {
      const objs = r.authObjs || [];
      if (objs.length === 0) { r.utilization = 0; return; }
      const usedCount = objs.filter(a => a.fieldStatus === "Used" || a.fieldStatus === "Partial").length;
      r.utilization = Math.round((usedCount / objs.length) * 100);
    });
    return list;
  }

  async function build() {
    const manifest = await fetchJson(`${BASE}/manifest.json`);
    const settled = await Promise.all(
      manifest.map(name => fetchJson(`${BASE}/${name}`).catch(err => {
        console.error(err);
        return null;
      }))
    );

    // Re-index ids by load order so they are unique and contiguous.
    const users = settled.filter(Boolean).map((u, i) => ({ ...u, id: i }));

    const rolesAggregated = buildRolesAggregated(users);
    const totalAuthObjects = users.reduce((sum, u) => {
      const indirect = (u.roles || []).reduce((s, r) => s + (r.authObjs || []).length, 0);
      const direct = (u.directAuthObjs || []).length;
      return sum + indirect + direct;
    }, 0);

    const data = {
      users,
      rolesAggregated,
      totals: {
        users: users.length,
        authObjects: totalAuthObjects,
        roles: rolesAggregated.length
      },
      licenses: ["HD Professional", "HD Functional", "HD Productivity"],
      statuses: ["Active", "Inactive"],
      sapUserTypes: ["Dialog", "System", "Communication", "Service", "Reference"],
      modules: ["FI", "MM", "SD", "HR", "BC", "PM"]
    };

    window.LICENSE_DATA = data;
    return data;
  }

  window.LICENSE_DATA_READY = build();
})();
