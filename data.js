// Mock data for License Optimization
window.LICENSE_DATA = (function () {
  const firstNames = [
    "Aaron", "Abetunji", "Abhishek", "Alexis", "NA", "NA", "Elliott", "Ashleigh",
    "Brianna", "Carlos", "Daria", "Evelyn", "Farouk", "Gabriela", "Hassan", "Ingrid",
    "Jamal", "Kenji", "Lakshmi", "Mateo", "Nadia", "Olivier", "Priya", "Quentin",
    "Rohan", "Sofia", "Tomasz", "Uma", "Viktor", "Wei", "Xavier", "Yelena",
    "Zane", "Anika", "Bashir", "Camille", "Dmitri", "Emeka", "Fatima", "Giovanni"
  ];
  const lastNames = [
    "Smith", "Balogun", "Chanders", "Courville", "ADAPTER.Q", "ADS_AGENT", "Allison", "Faia",
    "Okafor", "Ramirez", "Volkov", "Andersen", "Khalil", "Santos", "Reyes", "Bjornsen",
    "Washington", "Tanaka", "Iyer", "Garcia", "Haddad", "Lemoine", "Patel", "Dubois",
    "Mehta", "Rossi", "Kowalski", "Krishnan", "Petrov", "Chen", "Marin", "Sokolova",
    "Holland", "Sharma", "Mansour", "Lefevre", "Ivanov", "Achebe", "Nasser", "Conti"
  ];
  const licenses = ["HD Productivity", "HD Professional", "HD Functional", "HD Developer", "HD Platform", "Employee", "NA"];
  const fieldStatuses = ["Used", "Unused", "Partial"];
  const statuses = ["Active", "Inactive", "Locked", "Expired"];
  const sapUserTypes = ["Dialog", "System", "Communication", "Service", "Reference"];
  const domains = ["lottechem.com", "westlake.com", "bs.nttdata.com", "lottechem.us", "kaartech.com"];

  const sampleRoles = [
    "ZL_BR_PM_PURCHASING", "SAP_BC_USER", "SAP_FI_GL_DISPLAY", "SAP_FI_AP_PROCESS",
    "SAP_MM_PURCHASING", "SAP_SD_ORDER_ENTRY", "SAP_HR_EMPLOYEE", "Z_FIN_APPROVAL",
    "Z_BUYER_LIMITED", "SAP_BC_TRANSPORT", "Z_VENDOR_MAINT", "SAP_PM_MAINTENANCE"
  ];

  const roleDescriptions = {
    "ZL_BR_PM_PURCHASING": { desc: "Brazil Plant Maintenance — Purchasing operations", module: "MM" },
    "SAP_BC_USER":         { desc: "Basis user administration & profile management",       module: "BC" },
    "SAP_FI_GL_DISPLAY":   { desc: "Finance — General Ledger display only",                 module: "FI" },
    "SAP_FI_AP_PROCESS":   { desc: "Finance — Accounts Payable process & posting",          module: "FI" },
    "SAP_MM_PURCHASING":   { desc: "Materials Management — Purchasing & vendor master",     module: "MM" },
    "SAP_SD_ORDER_ENTRY":  { desc: "Sales & Distribution — Sales order entry",              module: "SD" },
    "SAP_HR_EMPLOYEE":     { desc: "Human Resources — Employee self-service",               module: "HR" },
    "Z_FIN_APPROVAL":      { desc: "Custom — Financial approval workflows",                 module: "FI" },
    "Z_BUYER_LIMITED":     { desc: "Custom — Limited buyer access (PR creation only)",      module: "MM" },
    "SAP_BC_TRANSPORT":    { desc: "Basis — Transport management & change requests",        module: "BC" },
    "Z_VENDOR_MAINT":      { desc: "Custom — Vendor master maintenance",                    module: "MM" },
    "SAP_PM_MAINTENANCE":  { desc: "Plant Maintenance — Work orders & notifications",       module: "PM" }
  };

  const sampleAuthObjects = [
    { name: "/SRMSMC/BO", field: "/BOFU/BO", values: "/SRMSMC/MO_PUC", desc: "SRM business object access scope" },
    { name: "/SRMSMC/BO", field: "ACTVT", values: "F4", desc: "Permitted SRM object activity" },
    { name: "A_S_ANLKL", field: "ACTVT", values: "F4", desc: "Asset class activity permission" },
    { name: "A_S_ANLKL", field: "ANLKL", values: "*", desc: "Authorized asset class range" },
    { name: "A_S_ANLKL", field: "BUKRS", values: "$BUKRS", desc: "Company code authorization variable" },
    { name: "B_BUP_PCPT", field: "ACTVT", values: "03", desc: "Business partner display activity" },
    { name: "B_BUPA_GRP", field: "ACTVT", values: "03", desc: "Business partner group display activity" },
    { name: "B_BUPA_GRP", field: "ACTVT", values: "F4", desc: "Business partner group value help activity" },
    { name: "B_BUPA_GRP", field: "BEGRU", values: "*", desc: "Business partner authorization group" },
    { name: "B_BUPA_RLT", field: "ACTVT", values: "F4", desc: "Business partner role value help activity" },
    { name: "B_BUPA_RLT", field: "RLTYP", values: "*", desc: "Business partner role category" },
    { name: "F_BKPF_BUK", field: "BUKRS", values: "1000, 2000", desc: "Accounting document company code" },
    { name: "M_BEST_BSA", field: "BSART", values: "NB, FO", desc: "Purchasing document type authorization" },
    { name: "V_VBAK_AAT", field: "AUART", values: "OR, RE", desc: "Sales document type authorization" }
  ];

  function pick(arr, i) { return arr[i % arr.length]; }
  function rand(seed) { const x = Math.sin(seed) * 10000; return x - Math.floor(x); }

  function genUser(i) {
    const fn = pick(firstNames, i);
    const ln = pick(lastNames, i * 3 + 1);
    const sap = (fn === "NA" ? ln : (fn[0] + ln)).toUpperCase().replace(/[^A-Z0-9_.]/g, "");
    const r = rand(i + 1);
    const r2 = rand(i + 7);
    const r3 = rand(i + 13);
    const roleCount = Math.floor(r * 60);
    const authCount = Math.floor(r2 * 12000) + (roleCount * 30);
    const hasEmail = r3 > 0.15;
    const domain = pick(domains, i + 2);
    const email = hasEmail
      ? `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z0-9]/g, "")}@${domain}`
      : "NA";
    const license = pick(licenses, i + Math.floor(r * licenses.length));
    const status = pick(statuses, i + Math.floor(r2 * 4));
    let sapUserType = pick(sapUserTypes, i + Math.floor(r3 * sapUserTypes.length));
    if (/ADAPTER|AGENT/.test(sap)) sapUserType = "System";
    else if (!hasEmail) sapUserType = "Service";

    const numRoles = Math.min(Math.max(roleCount, 1), 5);
    const roles = [];
    for (let j = 0; j < numRoles; j++) {
      const roleName = j === 0 && i === 0 ? "ZL_BR_PM_PURCHASING" : pick(sampleRoles, i + j * 2);
      const numAuth = 6 + Math.floor(rand(i * 17 + j) * 9);
      const authObjs = [];
      for (let k = 0; k < numAuth; k++) {
        const a = pick(sampleAuthObjects, i + j * 3 + k);
        const fs = pick(fieldStatuses, j + k);
        const lic = rand(i + j * 11 + k * 7) > 0.55
          ? "HD Productivity"
          : (rand(i + j * 13 + k * 5) > 0.5 ? "NA" : pick(licenses, i + k));
        authObjs.push({ name: a.name, desc: a.desc, field: a.field, values: a.values, fieldStatus: fs, license: lic });
      }
      const assignmentType = (j === 0 || rand(i * 29 + j * 31) > 0.35) ? "Directly Assigned" : "Indirectly Assigned";
      roles.push({ name: roleName, type: j % 3 === 0 ? "Composite" : "Single", assignmentType, authObjs });
    }

    // Target License Classification
    const HIER = { "HD Professional": 3, "HD Functional": 2, "HD Productivity": 1 };
    let highest = 0, highestName = "NA";
    roles.forEach(r => r.authObjs.forEach(a => {
      const v = HIER[a.license] || 0;
      if (v > highest) { highest = v; highestName = a.license; }
    }));
    const targetLicense = highestName;

    // Per-role recommendation
    const objToRoles = {};
    roles.forEach(role => role.authObjs.forEach(a => {
      const k = `${a.name}|${a.field}`;
      (objToRoles[k] = objToRoles[k] || []).push(role.name);
    }));

    roles.forEach(role => {
      const usedObjs = role.authObjs.filter(a => a.fieldStatus !== "Unused");
      const proUnused = role.authObjs.filter(a => a.license === "HD Professional" && a.fieldStatus === "Unused");
      const allUnused = role.authObjs.length > 0 && role.authObjs.every(a => a.fieldStatus === "Unused");
      const allDup = usedObjs.length > 0 && usedObjs.every(a => (objToRoles[`${a.name}|${a.field}`] || []).length > 1);

      // Priority: Role-Based (allUnused) > Authorization-Based (redundant) > Object-Level (proUnused) > Retain
      let rec = null;
      if (allUnused) {
        rec = {
          type: "Role-Based Cleaning",
          action: "Remove role assignment",
          severity: "medium",
          justification: `All ${role.authObjs.length} authorisation objects in this role are unused.`
        };
      } else if (allDup) {
        rec = {
          type: "Authorization-Based Optimization",
          action: "Remove redundant role",
          severity: "medium",
          justification: "All used objects in this role are duplicated in another assigned role."
        };
      } else if (proUnused.length > 0) {
        rec = {
          type: "Object-Level Cleaning",
          action: `Downgrade ${proUnused.length} Professional obj${proUnused.length > 1 ? "s" : ""}`,
          severity: "high",
          justification: `${proUnused.length} unused Professional-license objects can be downgraded.`
        };
      } else {
        rec = {
          type: "Retain",
          action: "No change",
          severity: "low",
          justification: "Role usage is healthy — keep as-is."
        };
      }
      role.recommendation = rec;
    });

    // Per-role license counts + per-role target classification + description/module
    roles.forEach(role => {
      const counts = { professional: 0, functional: 0, productivity: 0 };
      let rHighest = 0, rTarget = "NA";
      role.authObjs.forEach(a => {
        if (a.license === "HD Professional") counts.professional++;
        else if (a.license === "HD Functional") counts.functional++;
        else if (a.license === "HD Productivity") counts.productivity++;
        const v = HIER[a.license] || 0;
        if (v > rHighest) { rHighest = v; rTarget = a.license; }
      });
      role.licenseCounts = counts;
      role.targetLicense = rTarget;
      const meta = roleDescriptions[role.name] || { desc: "—", module: "—" };
      role.description = meta.desc;
      role.module = meta.module;
    });

    // User-level license counts (sum across all roles' auth objs)
    const userCounts = { professional: 0, functional: 0, productivity: 0 };
    roles.forEach(role => {
      userCounts.professional += role.licenseCounts.professional;
      userCounts.functional += role.licenseCounts.functional;
      userCounts.productivity += role.licenseCounts.productivity;
    });

    return {
      id: i, firstName: fn, lastName: ln, sapId: sap, email,
      roleCount, authCount, license, status, sapUserType, roles, targetLicense, licenseCounts: userCounts
    };
  }

  const users = [];
  for (let i = 0; i < 559; i++) users.push(genUser(i));

  // ---- User-detail enrichment: per-user activity, KPIs, top transaction codes
  function lcg(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 0x100000000; }
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const tcodePool = [
    { code: "ME21N", desc: "Create Purchase Order", module: "MM" },
    { code: "ME22N", desc: "Change Purchase Order", module: "MM" },
    { code: "ME23N", desc: "Display Purchase Order", module: "MM" },
    { code: "MIGO",  desc: "Goods Movement", module: "MM" },
    { code: "MIRO",  desc: "Enter Incoming Invoice", module: "MM" },
    { code: "MM01",  desc: "Create Material", module: "MM" },
    { code: "MM02",  desc: "Change Material", module: "MM" },
    { code: "MM03",  desc: "Display Material", module: "MM" },
    { code: "VA01",  desc: "Create Sales Order", module: "SD" },
    { code: "VA02",  desc: "Change Sales Order", module: "SD" },
    { code: "VA03",  desc: "Display Sales Order", module: "SD" },
    { code: "VL01N", desc: "Create Outbound Delivery", module: "SD" },
    { code: "VF01",  desc: "Create Billing Document", module: "SD" },
    { code: "FB01",  desc: "Post Document", module: "FI" },
    { code: "FB03",  desc: "Display Document", module: "FI" },
    { code: "FB60",  desc: "Enter Incoming Invoices", module: "FI" },
    { code: "F-02",  desc: "Enter G/L Account Posting", module: "FI" },
    { code: "FBL3N", desc: "Display G/L Line Items", module: "FI" },
    { code: "FK01",  desc: "Create Vendor", module: "FI" },
    { code: "XK02",  desc: "Change Vendor (Centrally)", module: "FI" },
    { code: "XD01",  desc: "Create Customer (Centrally)", module: "SD" },
    { code: "PA20",  desc: "Display HR Master Data", module: "HR" },
    { code: "PA30",  desc: "Maintain HR Master Data", module: "HR" },
    { code: "PA40",  desc: "Personnel Actions", module: "HR" },
    { code: "SU01",  desc: "User Maintenance", module: "BC" },
    { code: "PFCG",  desc: "Role Maintenance", module: "BC" },
    { code: "SE16N", desc: "Table Display", module: "BC" },
    { code: "IW21",  desc: "Create Notification", module: "PM" },
    { code: "IW31",  desc: "Create Order", module: "PM" },
    { code: "IW32",  desc: "Change Order", module: "PM" },
    { code: "IK11",  desc: "Create Measurement Document", module: "PM" }
  ];

  users.forEach((u, idx) => {
    const r = lcg(u.id + 7);
    const lastLoginDays = Math.floor(r() * 90);
    const lastLogin = new Date(Date.now() - lastLoginDays * 86400000);
    const validityStartDays = 180 + Math.floor(r() * 900);
    const validityEndDays = u.status === "Expired"
      ? -(1 + Math.floor(r() * 180))
      : 30 + Math.floor(r() * 720);
    const validFrom = new Date(Date.now() - validityStartDays * 86400000);
    const validTo = new Date(Date.now() + validityEndDays * 86400000);
    u.lastLogin = lastLogin.toISOString().slice(0, 10);
    u.validFrom = validFrom.toISOString().slice(0, 10);
    u.validTo = validTo.toISOString().slice(0, 10);
    u.fue = +(0.4 + r() * 4.6).toFixed(2);
    u.referenceUser = "REF_" + String(1000 + Math.floor(r() * 8999));
    u.inferredLicense = u.targetLicense;

    // Auth Summary card
    const totalAuth = u.authCount;
    const usedAuth = Math.floor(totalAuth * (0.45 + r() * 0.4));
    const unusedAuth = totalAuth - usedAuth;
    const criticalAuth = Math.floor(totalAuth * (0.05 + r() * 0.1));
    u.authSummary = {
      total: totalAuth,
      used: usedAuth,
      unused: unusedAuth,
      critical: criticalAuth,
      duplicates: Math.floor(totalAuth * (0.06 + r() * 0.08)),
      cleansable: Math.floor(totalAuth * (0.12 + r() * 0.18))
    };

    // Role activity overview
    const totalRoles = u.roleCount;
    const activeRoles = Math.floor(totalRoles * (0.5 + r() * 0.4));
    const inactiveRoles = totalRoles - activeRoles;
    u.roleActivity = {
      total: totalRoles,
      active: activeRoles,
      inactive: inactiveRoles,
      composite: Math.floor(totalRoles * (0.15 + r() * 0.25)),
      single: totalRoles - Math.floor(totalRoles * (0.15 + r() * 0.25))
    };

    // Usage statistics donut: Active / Idle / Critical
    const usagePct = Math.floor(40 + r() * 50);
    const idlePct = Math.floor((100 - usagePct) * 0.6);
    const criticalPct = 100 - usagePct - idlePct;
    u.usageDonut = { active: usagePct, idle: idlePct, critical: criticalPct };
    const login30 = Math.max(0, Math.floor((usagePct / 100) * (8 + r() * 24)));
    const login60 = login30 + Math.floor((usagePct / 100) * (5 + r() * 18));
    const login90 = login60 + Math.floor((usagePct / 100) * (4 + r() * 16));
    u.loginCounts = { last30: login30, last60: login60, last90: login90 };

    // Top transaction codes (subset, ranked by execution count)
    const shuffled = tcodePool.slice().sort(() => r() - 0.5).slice(0, 12);
    u.topTcodes = shuffled.map((t, i) => ({
      ...t,
      executions: Math.floor((1200 - i * 80) * (0.6 + r() * 0.8)),
      lastUsed: new Date(Date.now() - Math.floor(r() * 60) * 86400000).toISOString().slice(0, 10),
      classification: ["HD Professional", "HD Functional", "HD Productivity"][Math.floor(r() * 3)]
    })).sort((a, b) => b.executions - a.executions);

    const monthlyBase = Math.max(30, Math.round(u.topTcodes.reduce((sum, t) => sum + t.executions, 0) / 12));
    u.monthlyUsage = Array.from({ length: 6 }, (_, monthIndex) => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - (5 - monthIndex));
      const trendLift = 0.82 + (monthIndex * 0.06);
      const variation = 0.78 + r() * 0.48;
      return {
        month: `${monthNames[date.getMonth()]} '${String(date.getFullYear()).slice(2)}`,
        count: Math.max(0, Math.round(monthlyBase * trendLift * variation))
      };
    });
  });

  // ---- Aggregated roles dataset for Card 2 (Role-Based License Classification)
  const HIER2 = { "HD Professional": 3, "HD Functional": 2, "HD Productivity": 1 };
  const roleAgg = {};
  users.forEach(u => {
    u.roles.forEach(role => {
      let agg = roleAgg[role.name];
      if (!agg) {
        agg = roleAgg[role.name] = {
          name: role.name,
          description: role.description,
          module: role.module,
          type: role.type,
          users: 0,
          authObjsTotal: 0,
          counts: { professional: 0, functional: 0, productivity: 0 },
          targetLicense: "NA",
          authObjs: role.authObjs.slice(),
          _highest: 0
        };
      }
      agg.users++;
      agg.authObjsTotal += role.authObjs.length;
      agg.counts.professional += role.licenseCounts.professional;
      agg.counts.functional += role.licenseCounts.functional;
      agg.counts.productivity += role.licenseCounts.productivity;
      const v = HIER2[role.targetLicense] || 0;
      if (v > agg._highest) { agg._highest = v; agg.targetLicense = role.targetLicense; }
    });
  });
  const rolesAggregated = Object.values(roleAgg).sort((a, b) => b.users - a.users);

  return {
    users,
    rolesAggregated,
    totals: { users: 559, authObjects: 408834, roles: 450 },
    licenses,
    statuses,
    sapUserTypes,
    modules: ["FI", "MM", "SD", "HR", "BC", "PM"]
  };
})();
