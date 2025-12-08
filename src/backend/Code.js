/**
 * NCM-Nijjara-ERP Code.js
 * Main Backend Core for Google Apps Script
 *
 * @version 1.0.0
 * @date 2025-12-07
 * @system NCM-Nijjara-ERP
 * @description Main backend entry point for the Nijjara ERP system
 */

/**
 * =============================================================================
 * SECTION 1: IMPORT SETUP FUNCTIONS
 * =============================================================================
 * Note: In Google Apps Script, we need to include the Setup.js functions
 * by copying them here or using the include() function
 */

/**
 * =============================================================================
 * SECTION 2: MAIN MENU CREATION
 * =============================================================================
 */

/**
 * Create custom menu when spreadsheet opens
 * This function is automatically triggered by Google Sheets
 */

/**
 * =============================================================================
 * SECTION 3: SETUP FUNCTIONS (SIMPLIFIED)
 * =============================================================================
 */

/**
 * Show the setup sidebar
 */

/**
 * =============================================================================
 * SECTION 4: DATABASE OPERATIONS
 * =============================================================================
 */

/**
 * Build complete database schema
 */

/**
 * Seed initial data
 */

/**
 * Create backup
 */
function createBackup() {
  try {
    logEvent("INFO", "SYSTEM", "FUNC_START", "createBackup", "Creating backup");

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const backupName = `BACKUP_${
      new Date().toISOString().split("T")[0]
    }_${Utilities.getUuid().substring(0, 8)}`;

    const backupSpreadsheet = SpreadsheetApp.create(backupName);

    // Copy all sheets to backup
    const sheets = spreadsheet.getSheets();
    sheets.forEach((sheet) => {
      const backupSheet = backupSpreadsheet.insertSheet(sheet.getName());
      const data = sheet.getDataRange().getValues();
      if (data.length > 0) {
        backupSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
      }
    });

    logEvent(
      "INFO",
      "SYSTEM",
      "FUNC_END",
      "createBackup",
      `Backup created: ${backupName}`
    );

    return backupName;
  } catch (error) {
    logEvent(
      "ERROR",
      "SYSTEM",
      "BACKUP_FAILED",
      "createBackup",
      `Backup failed: ${error.message}`
    );
    throw error;
  }
}

/**
 * Validate data integrity
 */
function validateDataIntegrity() {
  try {
    logEvent(
      "INFO",
      "SYSTEM",
      "FUNC_START",
      "validateDataIntegrity",
      "Validating data integrity"
    );

    const results = {
      valid: [],
      invalid: [],
      warnings: [],
      timestamp: new Date().toISOString(),
    };

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();

    sheets.forEach((sheet) => {
      const sheetName = sheet.getName();
      if (sheetName.includes("_")) {
        try {
          const data = sheet.getDataRange().getValues();

          // Basic validation: check for proper headers
          if (data.length >= 3) {
            const hasIdColumn = data[0].some((cell) =>
              cell.toString().includes("_ID")
            );
            const hasCreatedAt = data[0].includes("Created_At");

            if (hasIdColumn && hasCreatedAt) {
              results.valid.push(sheetName);
            } else {
              results.invalid.push({
                sheet: sheetName,
                issue: "Missing required columns",
              });
            }
          } else {
            results.warnings.push({
              sheet: sheetName,
              issue: "Insufficient data rows",
            });
          }
        } catch (error) {
          results.invalid.push({ sheet: sheetName, issue: error.message });
        }
      }
    });

    logEvent(
      "INFO",
      "SYSTEM",
      "FUNC_END",
      "validateDataIntegrity",
      `Validation completed. Valid: ${results.valid.length}, Invalid: ${results.invalid.length}`
    );

    return results;
  } catch (error) {
    logEvent(
      "ERROR",
      "SYSTEM",
      "VALIDATION_FAILED",
      "validateDataIntegrity",
      `Validation failed: ${error.message}`
    );
    throw error;
  }
}

/**
 * Generate system report
 */
function generateSystemReport() {
  try {
    logEvent(
      "INFO",
      "SYSTEM",
      "FUNC_START",
      "generateSystemReport",
      "Generating system report"
    );

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const report = {
      timestamp: new Date().toISOString(),
      spreadsheet: {
        name: spreadsheet.getName(),
        id: spreadsheet.getId(),
        url: spreadsheet.getUrl(),
      },
      sheets: [],
      statistics: {
        totalSheets: 0,
        totalRows: 0,
        moduleBreakdown: {},
      },
    };

    const sheets = spreadsheet.getSheets();
    report.statistics.totalSheets = sheets.length;

    sheets.forEach((sheet) => {
      const dataRange = sheet.getDataRange();
      const numRows = dataRange.getNumRows();
      const numColumns = dataRange.getNumColumns();

      report.sheets.push({
        name: sheet.getName(),
        rows: numRows,
        columns: numColumns,
        dataRows: Math.max(0, numRows - 3), // Exclude header rows
        module: getModuleFromSheetName(sheet.getName()),
      });

      report.statistics.totalRows += numRows;

      // Module breakdown
      const module = getModuleFromSheetName(sheet.getName());
      if (module) {
        if (!report.statistics.moduleBreakdown[module]) {
          report.statistics.moduleBreakdown[module] = {
            sheets: 0,
            rows: 0,
            dataRows: 0,
          };
        }
        report.statistics.moduleBreakdown[module].sheets++;
        report.statistics.moduleBreakdown[module].rows += numRows;
        report.statistics.moduleBreakdown[module].dataRows += Math.max(
          0,
          numRows - 3
        );
      }
    });

    logEvent(
      "INFO",
      "SYSTEM",
      "FUNC_END",
      "generateSystemReport",
      "System report generated successfully"
    );

    return report;
  } catch (error) {
    logEvent(
      "ERROR",
      "SYSTEM",
      "REPORT_FAILED",
      "generateSystemReport",
      `Report generation failed: ${error.message}`
    );
    throw error;
  }
}

/**
 * Build schema for a single module prefix (SYS/HRM/PRJ/FIN/ENG/DBUG)
 */

/**
 * =============================================================================
 * SECTION 5: UTILITY FUNCTIONS
 * =============================================================================
 */

/**
 * Get module from sheet name
 */
function getModuleFromSheetName(sheetName) {
  const match = sheetName.match(/^([A-Z]{3})_/);
  return match ? match[1] : null;
}

/**
 * Show operation results to user
 */

/**
 * Show message to user
 */

/**
 * =============================================================================
 * SECTION 6: LOGGING SYSTEM (MANDATORY)
 * =============================================================================
 */

/**
 * Enhanced logging system following project requirements
 * All operations must be logged with ISO timestamp, level, actor, action, component, details
 */
function logEvent(
  level,
  actor,
  action,
  component,
  details,
  entity = null,
  entityId = null
) {
  try {
    const timestamp = new Date().toISOString();
    const session = Session.getActiveUser().getEmail();

    // Format log message
    const logMessage = `${timestamp} | level=${level} | actor=${actor} | action=${action} | component=${component} | ${
      entity ? `entity=${entity} | ` : ""
    }${entityId ? `id=${entityId} | ` : ""}session=${session} | :: ${details}`;

    // Output to Apps Script Logger
    Logger.log(logMessage);

    // Also log to DBUG sheet if it exists
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const debugSheet =
        spreadsheet.getSheetByName("DBUG_AppLog") ||
        spreadsheet.getSheetByName("DBUG");

      if (debugSheet) {
        debugSheet.appendRow([
          timestamp,
          level,
          actor,
          action,
          component,
          entity || "",
          entityId || "",
          details,
          session,
        ]);
      }
    } catch (debugError) {
      // Ignore debug sheet errors - don't let logging fail the main operation
    }

    return logMessage;
  } catch (error) {
    // Last resort - just log to Apps Script Logger
    Logger.log(`Logging error: ${error.message}`);
    return null;
  }
}

/**
 * =============================================================================
 * SECTION 7: VERSION CONTROL
 * =============================================================================
 */

const VERSION_INFO = {
  version: "1.0.0",
  buildDate: "2025-12-07",
  gitCommit: "HEAD",
  branch: "main",
  environment: "production",
  compatibility: {
    minimumAppsScriptVersion: "1.0.0",
    supportedBrowsers: ["Chrome 90+", "Firefox 88+", "Safari 14+", "Edge 90+"],
    requiredApis: ["SpreadsheetApp", "Session", "Utilities"],
  },
};

/**
 * Get version information
 */
function getVersionInfo() {
  return VERSION_INFO;
}

/**
 * =============================================================================
 * INITIALIZATION LOG
 * =============================================================================
 */

// Log successful initialization (only once to avoid conflicts)
if (typeof CodeJSInitialized === "undefined") {
  var CodeJSInitialized = true;
  logEvent(
    "INFO",
    "SYSTEM",
    "INITIALIZATION_COMPLETE",
    "Code.js",
    `Nijjara ERP Code.js v${VERSION_INFO.version} initialized successfully`
  );
}

/**
 * =============================================================================
 * END OF FILE - Code.js
 * =============================================================================
 */
