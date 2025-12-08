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

var EMBEDDED_SYS_RP_MD = [
  "| ROL_ID  | PRM_ID | SRP_Scope | SRP_Is_Allowed | SRP_Constraints | SRP_Crt_At | SRP_Crt_By | SRP_Upd_At | SRP_Upd_By |",
  "| ------- | ------ | --------- | -------------- | --------------- | ---------- | ---------- | ---------- | ---------- |",
  "| R-ADMIN | SYS    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | SYS    | CREATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | SYS    | UPDATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | SYS    | DELETE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | SYS    | APPROVE   | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | SYS    | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | SYS    | ADMIN     | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | HR     | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | HR     | CREATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | HR     | UPDATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | HR     | DELETE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | HR     | APPROVE   | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | HR     | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | HR     | ADMIN     | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | FIN    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | FIN    | CREATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | FIN    | UPDATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | FIN    | DELETE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | FIN    | APPROVE   | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | FIN    | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | FIN    | ADMIN     | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | PRJ    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | PRJ    | CREATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | PRJ    | UPDATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | PRJ    | DELETE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | PRJ    | APPROVE   | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | PRJ    | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ADMIN | PRJ    | ADMIN     | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | SYS    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | SYS    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | SYS    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | SYS    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | SYS    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | SYS    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | SYS    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | HR     | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | HR     | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | HR     | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | HR     | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | HR     | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | HR     | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | HR     | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | FIN    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | FIN    | CREATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | FIN    | UPDATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | FIN    | DELETE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | FIN    | APPROVE   | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | FIN    | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | FIN    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | PRJ    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | PRJ    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | PRJ    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | PRJ    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | PRJ    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | PRJ    | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-FIN-M | PRJ    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | SYS    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | SYS    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | SYS    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | SYS    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | SYS    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | SYS    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | SYS    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | HR     | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | HR     | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | HR     | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | HR     | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | HR     | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | HR     | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | HR     | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | FIN    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | FIN    | CREATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | FIN    | UPDATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | FIN    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | FIN    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | FIN    | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | FIN    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | PRJ    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | PRJ    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | PRJ    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | PRJ    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | PRJ    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | PRJ    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-ACC   | PRJ    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | SYS    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | SYS    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | SYS    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | SYS    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | SYS    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | SYS    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | SYS    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | HR     | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | HR     | CREATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | HR     | UPDATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | HR     | DELETE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | HR     | APPROVE   | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | HR     | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | HR     | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | FIN    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | FIN    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | FIN    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | FIN    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | FIN    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | FIN    | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | FIN    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | PRJ    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | PRJ    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | PRJ    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | PRJ    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | PRJ    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | PRJ    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-M  | PRJ    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | SYS    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | SYS    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | SYS    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | SYS    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | SYS    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | SYS    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | SYS    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | HR     | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | HR     | CREATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | HR     | UPDATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | HR     | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | HR     | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | HR     | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | HR     | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | FIN    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | FIN    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | FIN    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | FIN    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | FIN    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | FIN    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | FIN    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | PRJ    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | PRJ    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | PRJ    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | PRJ    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | PRJ    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | PRJ    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-HR-O  | PRJ    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | SYS    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | SYS    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | SYS    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | SYS    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | SYS    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | SYS    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | SYS    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | HR     | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | HR     | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | HR     | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | HR     | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | HR     | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | HR     | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | HR     | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | FIN    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | FIN    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | FIN    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | FIN    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | FIN    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | FIN    | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | FIN    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | PRJ    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | PRJ    | CREATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | PRJ    | UPDATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | PRJ    | DELETE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | PRJ    | APPROVE   | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | PRJ    | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-M | PRJ    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | SYS    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | SYS    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | SYS    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | SYS    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | SYS    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | SYS    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | SYS    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | HR     | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | HR     | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | HR     | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | HR     | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | HR     | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | HR     | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | HR     | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | FIN    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | FIN    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | FIN    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | FIN    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | FIN    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | FIN    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | FIN    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | PRJ    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | PRJ    | CREATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | PRJ    | UPDATE    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | PRJ    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | PRJ    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | PRJ    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-PRJ-O | PRJ    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | SYS    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | SYS    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | SYS    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | SYS    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | SYS    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | SYS    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | SYS    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | HR     | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | HR     | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | HR     | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | HR     | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | HR     | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | HR     | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | HR     | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | FIN    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | FIN    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | FIN    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | FIN    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | FIN    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | FIN    | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | FIN    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | PRJ    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | PRJ    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | PRJ    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | PRJ    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | PRJ    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | PRJ    | EXPORT    | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-AUD   | PRJ    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | SYS    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | SYS    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | SYS    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | SYS    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | SYS    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | SYS    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | SYS    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | HR     | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | HR     | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | HR     | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | HR     | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | HR     | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | HR     | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | HR     | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | FIN    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | FIN    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | FIN    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | FIN    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | FIN    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | FIN    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | FIN    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | PRJ    | READ      | TRUE           | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | PRJ    | CREATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | PRJ    | UPDATE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | PRJ    | DELETE    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | PRJ    | APPROVE   | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | PRJ    | EXPORT    | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |",
  "| R-VIEW  | PRJ    | ADMIN     | FALSE          | Active          | 9/9/2025   | SYSTEM     | 9/9/2025   | SYSTEM     |"
].join("\n");

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
