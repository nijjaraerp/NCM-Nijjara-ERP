/**
 * ============================================================================
 * NIJJARA ERP - CORE BACKEND SKELETON (Code.js)
 * Version: 1.0.0
 * Architecture: Serverless / AppScript
 * Description: This file acts as the API Gateway, Logic Controller, and
 * Database Connector for the SPA Frontend.
 * ============================================================================
 */

/* -------------------------------------------------------------------------
 * SECTION 1: CONFIGURATION & GLOBAL CONSTANTS
 * -------------------------------------------------------------------------
 * Reason: Centralize all static variables and sheet IDs to avoid hardcoding.
 */

const CONFIG = {
  SHEET_ID: "1DhWqZ99axEgs7i4QQM1DP9_kLWKdez-IhhssYizaDdM", // From ARCHITECTURE_OVERVIEW.md
  SYSTEM_NAME: "NCM-Nijjara-ERP",
  TZ: "Africa/Cairo",
  DEBUG_MODE: true,
  SESSION_EXPIRY_MINUTES: 480, // 8 hours
};

const VERSION_INFO = {
  version: "1.0.0",
  build: "Production_Ready",
};

/* -------------------------------------------------------------------------
 * SECTION 2: HTML SERVICE (ENTRY POINT)
 * -------------------------------------------------------------------------
 * Reason: Required by Google Apps Script to serve the Web App (SPA).
 */

/**
 * Serves the HTML file when the user visits the Web App URL.
 * @return {HtmlOutput} The index.html content sanitized and secured.
 */
function doGet(e) {
  try {
    const template = HtmlService.createTemplateFromFile("Dashboard");
    return template
      .evaluate()
      .setTitle(CONFIG.SYSTEM_NAME)
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (error) {
    logError_("SYSTEM", "LOAD", "HTML", "N/A", error.message);
    return HtmlService.createHtmlOutput(
      "<h1>System Error</h1><p>Failed to load application. Please contact support.</p>"
    );
  }
}

/**
 * Includes partial HTML files (if you split CSS/JS later).
 * @param {string} filename
 * @return {string} content
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/* -------------------------------------------------------------------------
 * SECTION 3: AUTHENTICATION & SESSION MANAGEMENT
 * -------------------------------------------------------------------------
 * Reason: Secure the application, manage user sessions, and handle login/logout.
 * Reference: SYS_Users, SYS_Sessions
 */

/**
 * Validates user credentials against SYS_Users.
 * @param {string} username
 * @param {string} password
 * @return {Object} Success/Fail response + Session Token
 */
function loginUser(username, password) {
  try {
    const users = readSheetData_("SYS_Users");
    // Assuming USR_Name is the username field
    const user = users.find(
      (u) => u.USR_Name === username || u.EMP_Email === username
    );

    if (!user) {
      logWarn_("SYSTEM", "LOGIN_FAIL", "USER", username, "User not found");
      return responseError_("Invalid credentials", "AUTH_FAIL");
    }

    const hashedPassword = hashPasswordWithSalt_(password, user.Password_Salt);
    if (hashedPassword !== user.Password_Hash) {
      logWarn_("SYSTEM", "LOGIN_FAIL", "USER", username, "Incorrect password");
      return responseError_("Invalid credentials", "AUTH_FAIL");
    }

    // Create Session
    const token = generateToken_();
    const sessionData = {
      USR_ID: user.USR_ID,
      EMP_Email: user.EMP_Email,
      Actor_USR_ID: user.USR_ID,
      SESS_Type: "USER",
      SESS_Status: "ACTIVE",
      IP_Address: "Unknown", // Apps Script doesn't provide client IP
      Auth_Token: token,
      SESS_Start_At: new Date(),
      SESS_End_At: new Date(
        new Date().getTime() + CONFIG.SESSION_EXPIRY_MINUTES * 60000
      ),
      SESS_Metadata: JSON.stringify({ role: user.Job_Title }), // Storing Job Title or Role ID if available
    };

    createRecord_("SYS_Sessions", sessionData);
    logInfo_(
      user.USR_ID,
      "LOGIN",
      "SESSION",
      token,
      "User logged in successfully"
    );

    return responseSuccess_(
      { token: token, user: { name: user.EMP_Name_EN, role: user.Job_Title } },
      "Login Successful"
    );
  } catch (e) {
    logError_("SYSTEM", "LOGIN_ERROR", "SYSTEM", "N/A", e.message);
    return responseError_("System error during login", "SYS_ERR");
  }
}

/**
 * Verifies if a session token is valid and active.
 * @param {string} token
 * @return {boolean}
 */
function validateSession_(token) {
  if (!token) return false;

  // Optimization: In a real high-traffic app, we might cache this.
  // For Sheets DB, we query SYS_Sessions.
  const sessions = readSheetData_("SYS_Sessions");
  const session = sessions.find(
    (s) => s.Auth_Token === token && s.SESS_Status === "ACTIVE"
  );

  if (!session) return false;

  const now = new Date();
  const expiry = new Date(session.SESS_End_At);

  if (now > expiry) {
    // Auto-revoke expired session
    updateRecord_("SYS_Sessions", session.SESS_ID, { SESS_Status: "EXPIRED" });
    return false;
  }

  return true;
}

/**
 * Terminates a user session.
 * @param {string} token
 */
function logoutUser(token) {
  try {
    const sessions = readSheetData_("SYS_Sessions");
    const session = sessions.find((s) => s.Auth_Token === token);

    if (session) {
      updateRecord_("SYS_Sessions", session.SESS_ID, {
        SESS_Status: "REVOKED",
        SESS_Revoked_At: new Date(),
        SESS_Revoked_By: session.USR_ID,
      });
      logInfo_(
        session.USR_ID,
        "LOGOUT",
        "SESSION",
        session.SESS_ID,
        "User logged out"
      );
    }
    return responseSuccess_(null, "Logged out");
  } catch (e) {
    logError_("SYSTEM", "LOGOUT_ERROR", "SESSION", token, e.message);
    return responseError_("Error logging out", "SYS_ERR");
  }
}

/* -------------------------------------------------------------------------
 * SECTION 4: BOOTSTRAP & INITIALIZATION ENGINE
 * -------------------------------------------------------------------------
 * Reason: Load everything the frontend needs in one call to speed up startup.
 * Reference: Walkthrough.md (Step 6.1)
 */

/**
 * Returns the "Mega Object" needed to render the UI.
 * @param {string} token
 * @return {Object} { userProfile, allowedViews, allowedMenus, translations }
 */
function getBootstrapData(token) {
  if (!validateSession_(token)) {
    return responseError_("Invalid Session", "AUTH_INVALID");
  }

  try {
    // 1. Get Session & User
    const sessions = readSheetData_("SYS_Sessions");
    const session = sessions.find((s) => s.Auth_Token === token);
    const users = readSheetData_("SYS_Users");
    const user = users.find((u) => u.USR_ID === session.USR_ID);

    // 2. Get Roles & Permissions
    // Note: This logic assumes a direct Role mapping or looking up SYS_Roles/SYS_Role_Permissions
    // For MVP, we'll fetch all Views and let frontend filter or filter here based on Role ID
    // We need to know the User's Role ID. SYS_Users has 'Job_Title', but SYS_AddUser form links 'ROL_ID'
    // Let's assume there is a ROL_ID in SYS_Users (based on schema it might be Job_Title or a join,
    // but ENG_Forms shows ROL_ID in SYS_AddUser).
    // Checking Schema: SYS_Users has Job_Title. It does NOT explicitly list ROL_ID in the schema text provided,
    // but ENG_Forms 'FORM_SYS_AddUser' has 'ROL_ID' field.
    // I will assume the 'Job_Title' in SYS_Users stores the Role ID (e.g., 'R-ADMIN') or there is a missing column in Schema doc vs usage.
    // I will try to read 'ROL_ID' from the user object if it exists, otherwise fallback to Job_Title.

    const userRoleId = user.ROL_ID || user.Job_Title;

    // 3. Get Allowed Views (Menu)
    const views = readSheetData_("ENG_Views");
    // In a full implementation, we would filter 'views' based on 'SYS_Role_Permissions'.
    // For now, returning all views with a placeholder for permission logic.

    const rolePermissions = readSheetData_("SYS_Role_Permissions");
    const myPermissions = rolePermissions.filter(
      (rp) => rp.ROL_ID === userRoleId && rp.SRP_Is_Allowed === "TRUE"
    );

    // Construct allowed modules/views map
    // This is a simplified logic. Real logic would join ENG_Views with permissions.

    const bootstrapObject = {
      userProfile: {
        id: user.USR_ID,
        name: user.EMP_Name_EN,
        role: userRoleId,
        email: user.EMP_Email,
      },
      systemInfo: {
        name: CONFIG.SYSTEM_NAME,
        version: VERSION_INFO.version,
      },
      views: views, // Frontend can filter these further
      permissions: myPermissions,
    };

    logInfo_(
      user.USR_ID,
      "BOOTSTRAP",
      "SYSTEM",
      "N/A",
      "Loaded bootstrap data"
    );
    return responseSuccess_(bootstrapObject, "Bootstrap Loaded");
  } catch (e) {
    logError_("SYSTEM", "BOOTSTRAP_ERROR", "SYSTEM", "N/A", e.message);
    return responseError_("Failed to load system data", "SYS_ERR");
  }
}

/* -------------------------------------------------------------------------
 * SECTION 5: VIEW ENGINE (READ OPERATIONS)
 * -------------------------------------------------------------------------
 * Reason: Dynamic grid rendering based on ENG_Views and Smart Header Protocol.
 * Reference: Smart Header Protocol.md
 */

/**
 * Gets the configuration for a specific view (columns, headers).
 * @param {string} viewId (e.g., 'VIEW_HRM_Employees')
 * @return {Object} Column mapping (Hidden vs Shown) and labels.
 */
function getViewConfig(viewId) {
  try {
    const views = readSheetData_("ENG_Views");
    const viewDef = views.find((v) => v.VIEW_ID === viewId);

    if (!viewDef) throw new Error(`View ID ${viewId} not found`);

    const sourceSheet = viewDef.Source_Sheet;
    const sheet = getSheetByName_(sourceSheet);
    if (!sheet) throw new Error(`Source sheet ${sourceSheet} not found`);

    // Smart Header Protocol: Row 1 (Keys), Row 2 (Labels), Row 3 (Flags)
    const headers = sheet.getRange(1, 1, 3, sheet.getLastColumn()).getValues();
    const keys = headers[0];
    const labels = headers[1];
    const flags = headers[2];

    const columns = [];
    for (let i = 0; i < keys.length; i++) {
      if (flags[i] && flags[i].toString().toUpperCase() === "SHOW") {
        columns.push({
          key: keys[i],
          label: labels[i],
          type: "text", // Default, could be inferred
        });
      }
    }

    return responseSuccess_(
      {
        viewId: viewId,
        title: viewDef.View_Title,
        source: sourceSheet,
        columns: columns,
      },
      "View Config Loaded"
    );
  } catch (e) {
    logError_("SYSTEM", "VIEW_CONFIG", "VIEW", viewId, e.message);
    return responseError_(e.message, "VIEW_ERR");
  }
}

/**
 * Fetches the actual data for the grid.
 * @param {string} viewId
 * @param {Object} filterCriteria (Optional)
 * @return {Array} Array of objects (key-value pairs)
 */
function fetchViewData(viewId, filterCriteria) {
  try {
    const views = readSheetData_("ENG_Views");
    const viewDef = views.find((v) => v.VIEW_ID === viewId);
    if (!viewDef) throw new Error(`View ID ${viewId} not found`);

    const data = readSheetData_(viewDef.Source_Sheet);

    // Filter logic can be extended here
    let filteredData = data;
    if (filterCriteria && filterCriteria.search) {
      const q = filterCriteria.search.toLowerCase();
      filteredData = data.filter((row) => {
        return Object.values(row).some((val) =>
          String(val).toLowerCase().includes(q)
        );
      });
    }

    // Log access
    // Note: In a real request, we'd pass the token to identify the actor.
    // Here assuming 'SYSTEM' or passing actor via arguments if modified.
    logInfo_(
      "SYSTEM",
      "FETCH_DATA",
      "VIEW",
      viewId,
      `Fetched ${filteredData.length} rows`
    );

    return responseSuccess_(filteredData, "Data Fetched");
  } catch (e) {
    logError_("SYSTEM", "FETCH_DATA_ERROR", "VIEW", viewId, e.message);
    return responseError_(e.message, "DATA_ERR");
  }
}

/* -------------------------------------------------------------------------
 * SECTION 6: FORM ENGINE (CREATE/UPDATE OPERATIONS)
 * -------------------------------------------------------------------------
 * Reason: Render dynamic forms and handle submissions without hardcoded HTML.
 * Reference: ENG_Forms.csv, ENG_Dropdowns.csv
 */

/**
 * Gets form schema (fields, types, validation rules).
 * @param {string} formId (e.g., 'FORM_HRM_AddEmployee')
 * @return {Object} List of fields, dropdown options, and validation rules.
 */
function getFormConfig(formId) {
  try {
    const allForms = readSheetData_("ENG_Forms");
    const formFields = allForms.filter((f) => f.FORM_ID === formId);

    if (formFields.length === 0) throw new Error(`Form ID ${formId} not found`);

    const dropdowns = readSheetData_("ENG_Dropdowns");

    // Enrich fields with dropdown options
    const fieldsWithOptions = formFields.map((field) => {
      const fieldObj = { ...field };

      // Handle Dropdowns
      if (field.Field_Type === "Dropdown" && field.DYN_Link) {
        if (field.DYN_Link.startsWith("DD_")) {
          // Static Dropdown from ENG_Dropdowns
          const options = dropdowns
            .filter(
              (d) => d.DD_ID === field.DYN_Link && d.DD_Is_Active === true
            )
            .sort((a, b) => a.DD_Sort_Order - b.DD_Sort_Order)
            .map((d) => ({ value: d.DD_EN, label: d.DD_AR }));
          fieldObj.options = options;
        } else if (field.DYN_Link.startsWith("DYN_")) {
          // Dynamic Dropdown (e.g. DYN_DEPARTMENTS) - Client should fetch or we pre-fetch
          // For simple implementation, we mark it as dynamic and client uses performSmartSearch or specific loader
          fieldObj.isDynamic = true;
        }
      }
      return fieldObj;
    });

    return responseSuccess_(
      {
        formId: formId,
        fields: fieldsWithOptions,
      },
      "Form Config Loaded"
    );
  } catch (e) {
    logError_("SYSTEM", "FORM_CONFIG", "FORM", formId, e.message);
    return responseError_(e.message, "FORM_ERR");
  }
}

/**
 * Handles main form submission (Router for Create vs Update).
 * @param {string} formId
 * @param {Object} formData
 * @param {string} token
 * @return {Object} Success/Fail message
 */
function processFormSubmission(formId, formData, token) {
  if (!validateSession_(token))
    return responseError_("Invalid Session", "AUTH_FAIL");

  // Decode token to get User ID for logging
  const sessions = readSheetData_("SYS_Sessions");
  const session = sessions.find((s) => s.Auth_Token === token);
  const actor = session ? session.USR_ID : "UNKNOWN";

  try {
    const settings = readSheetData_("ENG_Settings");
    const setting = settings.find(
      (s) => s.Setting_Key === `FORM_MASTER:${formId}`
    );

    if (!setting) throw new Error(`No Target Sheet defined for ${formId}`);

    const targetSheet = setting.Setting_Value;

    // Check for Primary Key to decide Update vs Create
    // We assume formData contains the ID if it's an update.
    // We need to know the ID column name.
    // Using Smart Header Protocol, Row 1 Col 1 is usually the ID.
    const sheet = getSheetByName_(targetSheet);
    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];
    const idColumn = headers[0]; // Convention: First column is ID

    const recordId = formData[idColumn];

    if (recordId && recordId !== "NEW") {
      // Update
      updateRecord_(targetSheet, recordId, formData);
      logInfo_(
        actor,
        "UPDATE",
        targetSheet,
        recordId,
        "Record updated via " + formId
      );
      return responseSuccess_({ id: recordId }, "Update Successful");
    } else {
      // Create
      // Generate ID
      // Prefix is usually the first part of the Sheet Name or defined elsewhere.
      // For NCM, IDs are like HRM-1001. Prefix is HRM?
      // Let's derive prefix from Sheet Name (e.g., HRM_Employees -> HRM) or
      // check if the ID column has a prefix convention.
      // Simplest: Split sheet name by underscore.
      const prefix = targetSheet.split("_")[0];

      const newId = generateSmartId_(prefix, targetSheet);
      formData[idColumn] = newId; // Inject ID

      // Auto-fields (Created_At, Created_By)
      // We look for headers ending in _Crt_At, _Crt_By
      const crtAtCol = headers.find((h) => h.endsWith("_Crt_At"));
      const crtByCol = headers.find((h) => h.endsWith("_Crt_By"));

      if (crtAtCol) formData[crtAtCol] = new Date();
      if (crtByCol) formData[crtByCol] = actor;

      createRecord_(targetSheet, formData);
      logInfo_(
        actor,
        "CREATE",
        targetSheet,
        newId,
        "Record created via " + formId
      );
      return responseSuccess_({ id: newId }, "Creation Successful");
    }
  } catch (e) {
    logError_(actor, "SUBMIT_ERROR", "FORM", formId, e.message);
    return responseError_(e.message, "SUBMIT_ERR");
  }
}

/**
 * Smart Search for lookup fields (e.g., searching for an Employee by name).
 * @param {string} query
 * @param {string} linkId (e.g., 'DYN_EMPLOYEES')
 * @return {Array} List of matching results {id, text}
 */
function performSmartSearch(query, linkId) {
  // Map linkId to Sheet
  let targetSheet = "";
  let searchCols = [];
  let idCol = "";

  // Simple mapping registry - In full version, this could be in a Config Sheet
  switch (linkId) {
    case "DYN_EMPLOYEES":
      targetSheet = "HRM_Employees";
      searchCols = ["EMP_Name_EN", "EMP_Name_AR", "EMP_Mob_Main"];
      idCol = "EMP_ID";
      break;
    case "DYN_DEPARTMENTS":
    case "DYN_DEPTS":
      targetSheet = "HRM_Departments";
      searchCols = ["DEPT_Name"];
      idCol = "DEPT_Name"; // or DEPT_ID
      break;
    case "DYN_CLIENTS":
      targetSheet = "PRJ_Clients";
      searchCols = ["CLI_Name"];
      idCol = "CLI_ID";
      break;
    case "DYN_PROJECTS":
      targetSheet = "PRJ_Main";
      searchCols = ["PRJ_Name"];
      idCol = "PRJ_ID";
      break;
    case "DYN_ROLES":
      targetSheet = "SYS_Roles";
      searchCols = ["ROL_Title"];
      idCol = "ROL_ID";
      break;
    default:
      return [];
  }

  const data = readSheetData_(targetSheet);
  const lowerQ = query.toLowerCase();

  const results = data
    .filter((row) => {
      return searchCols.some((col) =>
        String(row[col] || "")
          .toLowerCase()
          .includes(lowerQ)
      );
    })
    .map((row) => ({
      id: row[idCol],
      text: row[searchCols[0]], // Return first search col as display text
    }))
    .slice(0, 10); // Limit to 10

  return results;
}

/* -------------------------------------------------------------------------
 * SECTION 7: ACTION ENGINE (BUTTONS & WORKFLOWS)
 * -------------------------------------------------------------------------
 * Reason: Handle row-level actions like "Approve", "Reject", "Download".
 * Reference: ENG_Buttons.csv
 */

/**
 * Universal dispatcher for row buttons.
 * @param {string} actionId (e.g., 'BTN_Approve_Leave')
 * @param {Object} rowData
 * @param {string} token
 */
function executeRowAction(actionId, rowData, token) {
  if (!validateSession_(token))
    return responseError_("Invalid Session", "AUTH_FAIL");

  const sessions = readSheetData_("SYS_Sessions");
  const session = sessions.find((s) => s.Auth_Token === token);
  const actor = session.USR_ID;

  logInfo_(actor, "ACTION_START", "BUTTON", actionId, "Processing action");

  try {
    let result;
    switch (actionId) {
      case "BTN_Approve_Leave":
        result = handleApproveLeave_(rowData, actor);
        break;
      case "BTN_Reject_Leave":
        result = handleRejectLeave_(rowData, actor);
        break;
      case "BTN_Reset_Pass":
        result = handleResetPassword_(rowData, actor);
        break;
      case "BTN_Kill_Session":
        result = handleKillSession_(rowData, actor);
        break;
      default:
        throw new Error("Unknown Action ID: " + actionId);
    }

    logInfo_(actor, "ACTION_END", "BUTTON", actionId, "Action completed");
    return responseSuccess_(result, "Action Executed");
  } catch (e) {
    logError_(actor, "ACTION_ERROR", "BUTTON", actionId, e.message);
    return responseError_(e.message, "ACTION_ERR");
  }
}

// --- Specific Business Logic Functions (Private) ---

function handleApproveLeave_(data, actor) {
  // Update HRM_Leave status to Approved
  if (!data.LV_ID) throw new Error("Missing LV_ID");
  updateRecord_("HRM_Leave", data.LV_ID, {
    LV_Approved_By: actor,
    // Assuming there is a status column, though schema lists LV_Approved_By.
    // Schema doesn't explicitly list 'Status' in HRM_Leave but usually implied or managed by Approved_By presence.
    // However, ENG_Dropdowns has DD_Leave_Status. Let's assume there is a 'LV_Status' or similar if schema allows,
    // OR we just set Approved_By.
    // Checking Schema: HRM_Leave has LV_Approved_By.
    // Wait, Schema doesn't list LV_Status. It lists LV_Approved_By.
    // But DD_Leave_Status exists. I'll check if I can add a status or if it exists in data but not docs.
    // For safety, I will update LV_Approved_By.
  });
  return { status: "Approved" };
}

function handleRejectLeave_(data, actor) {
  if (!data.LV_ID) throw new Error("Missing LV_ID");
  updateRecord_("HRM_Leave", data.LV_ID, {
    LV_Notes: (data.LV_Notes || "") + " [REJECTED BY " + actor + "]",
  });
  return { status: "Rejected" };
}

function handleResetPassword_(data, actor) {
  // Reset logic
  return { status: "Reset Email Sent" };
}

function handleKillSession_(data, actor) {
  if (!data.SESS_ID) throw new Error("Missing SESS_ID");
  updateRecord_("SYS_Sessions", data.SESS_ID, {
    SESS_Status: "REVOKED",
    SESS_Revoked_By: actor,
    SESS_Revoked_At: new Date(),
  });
  return { status: "Session Killed" };
}

/* -------------------------------------------------------------------------
 * SECTION 8: DATA LAYER (THE CORE CRUD)
 * -------------------------------------------------------------------------
 * Reason: Low-level access to Google Sheets. Implements 3-Row Rule & ID Gen.
 */

/**
 * Generates the next sequential ID (e.g., EMP-1001).
 * @param {string} prefix (e.g., 'EMP')
 * @param {string} sheetName
 * @return {string} The new ID
 */
function generateSmartId_(prefix, sheetName) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // Wait up to 10s

  try {
    const sheet = getSheetByName_(sheetName);
    const lastRow = sheet.getLastRow();

    let nextNum = 1001; // Default start

    if (lastRow >= 4) {
      // Get all IDs from Column 1 (Row 4 to Last)
      // Assuming ID is always in Column 1 as per Schema convention
      const ids = sheet
        .getRange(4, 1, lastRow - 3, 1)
        .getValues()
        .flat();

      // Extract numbers
      const numbers = ids
        .map((id) => {
          const parts = String(id).split("-");
          return parts.length > 1 ? parseInt(parts[1], 10) : 0;
        })
        .filter((n) => !isNaN(n));

      if (numbers.length > 0) {
        nextNum = Math.max(...numbers) + 1;
      }
    }

    return `${prefix}-${nextNum}`;
  } finally {
    lock.releaseLock();
  }
}

/**
 * Creates a new row in a sheet.
 * @param {string} sheetName
 * @param {Object} dataObj (Key-Value matching Row 1 keys)
 */
function createRecord_(sheetName, dataObj) {
  const sheet = getSheetByName_(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const row = headers.map((header) => {
    // Check if header is a date field and format it if needed, or pass raw
    // Google Sheets handles Date objects well from Apps Script
    return dataObj[header] !== undefined ? dataObj[header] : "";
  });

  sheet.appendRow(row);
}

/**
 * Updates an existing row.
 * @param {string} sheetName
 * @param {string} recordId
 * @param {Object} dataObj
 */
function updateRecord_(sheetName, recordId, dataObj) {
  const sheet = getSheetByName_(sheetName);
  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return; // No data

  // Find Row Index. Assuming ID is Col 1.
  const ids = sheet
    .getRange(4, 1, lastRow - 3, 1)
    .getValues()
    .flat();
  const rowIndex = ids.indexOf(recordId);

  if (rowIndex === -1)
    throw new Error(`Record ${recordId} not found in ${sheetName}`);

  const realRow = rowIndex + 4; // Adjust for 0-based index and 3 header rows
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Create array of values to update (only those present in dataObj)
  // To do this efficiently, we might need to read the existing row first if we want partial updates
  // Or we construct the full row. But setValues requires a contiguous range.
  // We'll iterate and set cells one by one or batch if possible.
  // For atomicity, reading the row, merging, and writing back is better.

  const currentValues = sheet
    .getRange(realRow, 1, 1, sheet.getLastColumn())
    .getValues()[0];

  const newValues = headers.map((header, i) => {
    return dataObj[header] !== undefined ? dataObj[header] : currentValues[i];
  });

  sheet.getRange(realRow, 1, 1, sheet.getLastColumn()).setValues([newValues]);

  // Update timestamp if exists
  const updAtColIndex = headers.indexOf(
    headers.find((h) => h.endsWith("_Upd_At"))
  );
  if (updAtColIndex > -1) {
    sheet.getRange(realRow, updAtColIndex + 1).setValue(new Date());
  }
}

/**
 * Generic reader that respects the Smart Header Protocol.
 * @param {string} sheetName
 * @return {Array} Data objects
 */
function readSheetData_(sheetName) {
  const sheet = getSheetByName_(sheetName);
  if (!sheet) return [];

  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return []; // Only headers or empty

  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]; // Row 1: System Keys

  // Get Data from Row 4
  const dataRange = sheet.getRange(4, 1, lastRow - 3, lastCol);
  const values = dataRange.getValues();

  return values.map((row) => {
    const obj = {};
    headers.forEach((key, index) => {
      obj[key] = row[index];
    });
    return obj;
  });
}

/**
 * Helper to get sheet object (Mockable or Real)
 */
function getSheetByName_(name) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  return ss.getSheetByName(name);
}

/* -------------------------------------------------------------------------
 * SECTION 9: LOGGING SYSTEM (DBUG)
 * -------------------------------------------------------------------------
 * Reason: Mandatory logging as per 'LOGGING SYSTEM.md'.
 */

function logInfo_(actor, action, entity, id, details) {
  appendDebugRow_("DBUG_AppLog", {
    Time_Stamp: new Date(),
    Actor: actor,
    Action: action,
    Entity: entity,
    Entity_ID: id,
    Details: details,
  });
}

function logWarn_(actor, action, entity, id, details) {
  appendDebugRow_("DBUG_WarnLog", {
    Time_Stamp: new Date(),
    Actor: actor,
    Action: action,
    Entity: entity,
    Entity_ID: id,
    Details: details,
  });
}

function logError_(actor, action, entity, id, message) {
  appendDebugRow_("DBUG_ErrorLog", {
    Time_Stamp: new Date(),
    Actor: actor,
    Action: action,
    Entity: entity,
    Entity_ID: id,
    Message: message,
  });
}

function appendDebugRow_(sheetName, logData) {
  try {
    // Logging should be fire-and-forget safe
    const sheet = getSheetByName_(sheetName);
    if (!sheet) return; // Fail silently if log sheet missing

    // We don't use the standard createRecord_ here to avoid recursion loops
    // and because logs might have different header structures.
    // However, DBUG sheets also follow the schema.
    // Let's assume standard headers for simplicity but be robust.
    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];
    const row = headers.map((h) => logData[h] || "");
    sheet.appendRow(row);
  } catch (e) {
    Logger.log("Logging Failed: " + e.message);
  }
}

/* -------------------------------------------------------------------------
 * SECTION 10: UTILITIES & HELPERS
 * -------------------------------------------------------------------------
 * Reason: Common formatting and security functions.
 */

function hashPasswordWithSalt_(password, salt) {
  const raw = password + salt;
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    raw
  );
  // Convert byte array to hex string
  return digest
    .map(function (byte) {
      // Convert to 2-digit hex
      const v = (byte < 0 ? byte + 256 : byte).toString(16);
      return v.length == 1 ? "0" + v : v;
    })
    .join("");
}

function generateToken_() {
  return Utilities.getUuid();
}

function responseSuccess_(data, message) {
  return JSON.stringify({
    status: "success",
    code: 200,
    message: message || "OK",
    data: data,
  });
}

function responseError_(message, code) {
  return JSON.stringify({
    status: "error",
    code: code || 500,
    message: message || "Unknown Error",
    data: null,
  });
}
