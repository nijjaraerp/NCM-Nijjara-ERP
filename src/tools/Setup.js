function toHex(bytes) {
  return bytes
    .map(function (b) {
      return ("0" + (b & 0xff).toString(16)).slice(-2);
    })
    .join("");
}

function ensureSheet(ss, name, headers) {
  var s = ss.getSheetByName(name);
  if (!s) s = ss.insertSheet(name);
  if (headers && headers.length) {
    s.clear();
    s.getRange(1, 1, 1, headers.length).setValues([headers]);
    s.setFrozenRows(1);
  }
  return s;
}

function writeDetailedLog(ss, entries) {
  var s = ss.getSheetByName("SETUP_LOGS_DETAILED");
  if (!s) s = ss.insertSheet("SETUP_LOGS_DETAILED");
  if (s.getLastRow() === 0) {
    s.appendRow([
      "Timestamp",
      "Actor",
      "Action",
      "Step",
      "Status",
      "Details",
      "Duration_ms",
      "Sheet",
      "Rows",
      "Cols",
      "Count_Success",
      "Count_Failed",
      "Func",
      "Batch_ID",
    ]);
    s.setFrozenRows(1);
  }
  var rows = entries.map(function (e) {
    return [
      e.ts,
      e.actor,
      e.action,
      e.step,
      e.status,
      e.details,
      e.dur,
      e.sheet || "",
      e.rows || "",
      e.cols || "",
      e.ok || 0,
      e.fail || 0,
      e.fn || "",
      e.batch || "",
    ];
  });
  if (rows.length) s.getRange(s.getLastRow() + 1, 1, rows.length, 14).setValues(rows);
}

function parseMarkdownTable(md) {
  var lines = md.split(/\r?\n/).filter(function (l) {
    return l.trim().startsWith("|");
  });
  if (lines.length < 3) return { headers: [], rows: [] };
  var headerLine = lines[0];
  var headers = headerLine
    .split("|")
    .map(function (c) {
      return c.trim();
    })
    .filter(function (c) {
      return c.length > 0;
    });
  var rows = [];
  for (var i = 2; i < lines.length; i++) {
    var parts = lines[i].split("|").map(function (c) {
      return c.trim();
    });
    var cells = parts.filter(function (c) {
      return c.length > 0;
    });
    if (cells.length === headers.length) rows.push(cells);
  }
  return { headers: headers, rows: rows };
}

var EMBEDDED_SYS_RP_MD = (function () {
  return HtmlService.createHtmlOutputFromFile("docs/SYS_Role_Permissions_md_embed").getContent();
})();

function seedRolePermissionsFromEmbedded(ss, log, batchId) {
  var t0 = new Date().getTime();
  var parsed = parseMarkdownTable(EMBEDDED_SYS_RP_MD);
  var headers = parsed.headers;
  var rows = parsed.rows;
  var s = ensureSheet(ss, "SYS_Role_Permissions", headers);
  if (rows.length) s.getRange(2, 1, rows.length, headers.length).setValues(rows);
  var t1 = new Date().getTime();
  log.push({
    ts: new Date().toISOString(),
    actor: Session.getActiveUser().getEmail(),
    action: "SEED",
    step: "SYS_Role_Permissions",
    status: "OK",
    details: "Seeded from embedded markdown",
    dur: t1 - t0,
    sheet: "SYS_Role_Permissions",
    rows: rows.length + 1,
    cols: headers.length,
    ok: rows.length,
    fail: 0,
    fn: "seedRolePermissionsFromEmbedded",
    batch: batchId,
  });
  return rows;
}

function deriveAndSeedRoles(ss, rpRows, log, batchId) {
  var t0 = new Date().getTime();
  var roles = {};
  for (var i = 0; i < rpRows.length; i++) roles[rpRows[i][0]] = true;
  var map = {
    "R-ADMIN": "Full Admin",
    "R-FIN-M": "Finance Manager",
    "R-ACC": "Accountant",
    "R-HR-M": "HR Manager",
    "R-HR-O": "HR Officer",
    "R-PRJ-M": "Project Manager",
    "R-PRJ-O": "Project Officer",
    "R-AUD": "Auditor",
    "R-VIEW": "Viewer",
  };
  var headers = ["ROL_ID", "ROL_Title", "ROL_Notes", "ROL_Is_Admin", "ROL_Crt_At", "ROL_Crt_By", "ROL_Upd_At", "ROL_Upd_By"];
  var rows = Object.keys(roles).map(function (id) {
    return [
      id,
      map[id] || "General Role",
      "",
      id === "R-ADMIN" ? "TRUE" : "FALSE",
      new Date(),
      "System",
      "",
      "",
    ];
  });
  var s = ensureSheet(ss, "SYS_Roles", headers);
  if (rows.length) s.getRange(2, 1, rows.length, headers.length).setValues(rows);
  var t1 = new Date().getTime();
  log.push({
    ts: new Date().toISOString(),
    actor: Session.getActiveUser().getEmail(),
    action: "SEED",
    step: "SYS_Roles",
    status: "OK",
    details: "Derived from role-permissions",
    dur: t1 - t0,
    sheet: "SYS_Roles",
    rows: rows.length + 1,
    cols: headers.length,
    ok: rows.length,
    fail: 0,
    fn: "deriveAndSeedRoles",
    batch: batchId,
  });
}

function deriveAndSeedPermissions(ss, rpRows, log, batchId) {
  var t0 = new Date().getTime();
  var perms = {};
  for (var i = 0; i < rpRows.length; i++) perms[rpRows[i][1]] = true;
  var headers = ["PRM_ID", "PRM_Title", "PRM_Notes", "PRM_Catg", "PRM_Crt_At", "PRM_Crt_By", "PRM_Upd_At", "PRM_Upd_By"];
  var rows = Object.keys(perms).map(function (id) {
    return [id, id, "", "Module Access", new Date(), "System", "", ""];
  });
  var s = ensureSheet(ss, "SYS_Permissions", headers);
  if (rows.length) s.getRange(2, 1, rows.length, headers.length).setValues(rows);
  var t1 = new Date().getTime();
  log.push({
    ts: new Date().toISOString(),
    actor: Session.getActiveUser().getEmail(),
    action: "SEED",
    step: "SYS_Permissions",
    status: "OK",
    details: "Derived from role-permissions",
    dur: t1 - t0,
    sheet: "SYS_Permissions",
    rows: rows.length + 1,
    cols: headers.length,
    ok: rows.length,
    fail: 0,
    fn: "deriveAndSeedPermissions",
    batch: batchId,
  });
}

function seedAdminUser(ss, log, batchId) {
  var t0 = new Date().getTime();
  var headers = [
    "USR_ID",
    "USR_Name_EN",
    "USR_Username",
    "USR_Email",
    "Job_Title",
    "Dept",
    "Password_Hash",
    "Salt",
    "Notes",
    "Created_At",
    "Created_By",
    "Updated_At",
    "Updated_By",
  ];
  var s = ensureSheet(ss, "SYS_Users", headers);
  var name_en = "Mohamed Sherif Elkhoraiby";
  var email = "melkhoraiby@gmail.com";
  var username = "mkhoraiby";
  var pass_raw = "210388";
  var salt = "NCM_V2_SECRET_SALT";
  var hashBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, pass_raw + salt);
  var hash = toHex(hashBytes);
  var row = [
    "USR_001",
    name_en,
    username,
    email,
    "Full Admin",
    "Board of Directors",
    hash,
    salt,
    "",
    new Date(),
    "System",
    "",
    "",
  ];
  s.getRange(2, 1, 1, headers.length).setValues([row]);
  var t1 = new Date().getTime();
  log.push({
    ts: new Date().toISOString(),
    actor: Session.getActiveUser().getEmail(),
    action: "SEED",
    step: "SYS_Users:Admin",
    status: "OK",
    details: "Admin user created",
    dur: t1 - t0,
    sheet: "SYS_Users",
    rows: 2,
    cols: headers.length,
    ok: 1,
    fail: 0,
    fn: "seedAdminUser",
    batch: batchId,
  });
}

function runStandaloneSeeding() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var batchId = Utilities.getUuid();
  var logs = [];
  var tStart = new Date().getTime();
  logs.push({
    ts: new Date().toISOString(),
    actor: Session.getActiveUser().getEmail(),
    action: "START",
    step: "Batch",
    status: "INIT",
    details: "Standalone seeding started",
    dur: 0,
    sheet: "",
    rows: "",
    cols: "",
    ok: 0,
    fail: 0,
    fn: "runStandaloneSeeding",
    batch: batchId,
  });
  var rpRows = seedRolePermissionsFromEmbedded(ss, logs, batchId);
  deriveAndSeedRoles(ss, rpRows, logs, batchId);
  deriveAndSeedPermissions(ss, rpRows, logs, batchId);
  seedAdminUser(ss, logs, batchId);
  var tEnd = new Date().getTime();
  logs.push({
    ts: new Date().toISOString(),
    actor: Session.getActiveUser().getEmail(),
    action: "END",
    step: "Batch",
    status: "DONE",
    details: "Standalone seeding completed",
    dur: tEnd - tStart,
    sheet: "",
    rows: "",
    cols: "",
    ok: 0,
    fail: 0,
    fn: "runStandaloneSeeding",
    batch: batchId,
  });
  writeDetailedLog(ss, logs);
  return {
    success: true,
    batchId: batchId,
    seeded: ["SYS_Role_Permissions", "SYS_Roles", "SYS_Permissions", "SYS_Users"],
  };
}
