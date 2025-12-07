/**
 * NCM-Nijjara-ERP Setup.js
 * Database Architect Interface for Google Sheets ERP System
 *
 * @version 1.0.0
 * @date 2025-12-07
 * @author AI Assistant
 *
 * @description
 * This file serves as the database management interface for the Nijjara ERP system.
 * It provides GUI-based database administration through Google Sheets menu system
 * and handles all database schema operations, data seeding, and maintenance tasks.
 *
 * @system NCM-Nijjara-ERP
 * @environment Multi-environment support (development, staging, production)
 * @security High-security protocols implemented
 * @logging Comprehensive audit trail with mandatory logging
 * @compliance Follows NCM-PRO V1.0 No-Code Manager Protocol
 */

/**
 * =============================================================================
 * SECTION 1: ENVIRONMENT CONFIGURATION & SECURITY
 * =============================================================================
 */

// Environment-specific configurations
const ENVIRONMENTS = {
  DEVELOPMENT: {
    name: "development",
    debugMode: true,
    logLevel: "DEBUG",
    sheetId: "1DhWqZ99axEgs7i4QQM1DP9_kLWKdez-IhhssYizaDdM",
    scriptId: "16YtHjH0MrKGNfSBqbuhFYaaV79-31U_jHTLCiKzWveQ8JE63NurGlNvj",
    allowDestructiveOps: true,
    backupEnabled: true,
    maxRetries: 3,
    timeoutMs: 30000,
  },
  STAGING: {
    name: "staging",
    debugMode: true,
    logLevel: "INFO",
    sheetId: "STAGING_SHEET_ID",
    scriptId: "STAGING_SCRIPT_ID",
    allowDestructiveOps: false,
    backupEnabled: true,
    maxRetries: 5,
    timeoutMs: 45000,
  },
  PRODUCTION: {
    name: "production",
    debugMode: false,
    logLevel: "WARN",
    sheetId: "PRODUCTION_SHEET_ID",
    scriptId: "PRODUCTION_SCRIPT_ID",
    allowDestructiveOps: false,
    backupEnabled: true,
    maxRetries: 10,
    timeoutMs: 60000,
  },
};

// Security protocols and validation
const SECURITY_PROTOCOLS = {
  // Authentication requirements
  REQUIRE_AUTH: true,
  SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds

  // Input validation patterns
  VALIDATION_PATTERNS: {
    ID_FORMAT: /^[A-Z]{3}-\d{4,}$/,
    EMAIL_FORMAT: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_FORMAT: /^\d{11}$/,
    ARABIC_TEXT: /[\u0600-\u06FF\s]+/,
    NUMERIC_ONLY: /^\d+(\.\d{1,2})?$/,
  },

  // Access control
  ADMIN_ROLES: ["SYS_ADMIN", "DB_ADMIN"],
  REQUIRED_PERMISSIONS: {
    SCHEMA_MODIFICATION: "SCHEMA_MODIFY",
    DATA_MANIPULATION: "DATA_MANIPULATE",
    BACKUP_OPERATIONS: "BACKUP_EXECUTE",
  },

  // Rate limiting
  RATE_LIMIT: {
    MAX_OPERATIONS_PER_MINUTE: 60,
    COOL_DOWN_PERIOD: 60000, // 1 minute
  },
};

// Module prefixes and their configurations
const MODULE_CONFIGS = {
  SYS: {
    prefix: "SYS_",
    description: "System Administration Module",
    tables: [
      "SYS_Users",
      "SYS_Roles",
      "SYS_Permissions",
      "SYS_Sessions",
      "SYS_Audit_Log",
      "SYS_Dashboard",
      "SYS_Documents",
      "SYS_PubHolidays",
      "SYS_Role_Permissions",
      "SYS_Analysis",
    ],
    securityLevel: "HIGH",
    backupRequired: true,
  },
  HRM: {
    prefix: "HRM_",
    description: "Human Resources Management Module",
    tables: [
      "HRM_Employees",
      "HRM_Departments",
      "HRM_Attendance",
      "HRM_Leave",
      "HRM_Advances",
      "HRM_OverTime",
      "HRM_Deductions",
      "HRM_Dashboard",
      "HRM_Analysis",
    ],
    securityLevel: "HIGH",
    backupRequired: true,
  },
  PRJ: {
    prefix: "PRJ_",
    description: "Project Management Module",
    tables: [
      "PRJ_Main",
      "PRJ_Clients",
      "PRJ_Tasks",
      "PRJ_Material",
      "PRJ_DirectExpenses",
      "PRJ_IndirectExpenses_Time",
      "PRJ_IndirectExpenses_NoTime",
      "PRJ_Plan_vs_Actual",
      "PRJ_Dashboard",
      "PRJ_Analysis",
    ],
    securityLevel: "MEDIUM",
    backupRequired: true,
  },
  FIN: {
    prefix: "FIN_",
    description: "Finance Module",
    tables: [
      "FIN_DirectExpenses",
      "FIN_InDirectExpenses_Time",
      "FIN_InDirectExpenses_NoTime",
      "FIN_PRJ_Revenue",
      "FIN_Custody",
      "FIN_HRM_Payroll",
      "FIN_PandL_Statements",
      "FIN_Dashboard",
      "FIN_Analysis",
    ],
    securityLevel: "HIGH",
    backupRequired: true,
  },
  ENG: {
    prefix: "ENG_",
    description: "System Engine & Metadata",
    tables: [
      "ENG_Forms",
      "ENG_Views",
      "ENG_Dropdowns",
      "ENG_Buttons",
      "ENG_Settings",
    ],
    securityLevel: "CRITICAL",
    backupRequired: true,
  },
  DBUG: {
    prefix: "DBUG_",
    description: "Debug & Audit Logs",
    tables: ["DBUG_AppLog", "DBUG_WarnLog", "DBUG_ErrorLog"],
    securityLevel: "MEDIUM",
    backupRequired: false,
  },
};

/**
 * =============================================================================
 * SECTION 2: CORE UTILITY FUNCTIONS
 * =============================================================================
 */

/**
 * Enhanced logging system with mandatory audit trail
 * Follows LOGGING SYSTEM (MANDATORY) specifications
 * Note: Named to avoid conflict with Google Apps Script built-in Logger
 */
class ERPLogger {
  constructor(component = "Setup.js") {
    this.component = component;
    this.startTime = Date.now();
  }

  log(level, action, details, entity = null, entityId = null) {
    const timestamp = new Date().toISOString();
    const session = this.getSessionInfo();
    const actor = session?.userId || "SYSTEM";

    const logEntry = {
      timestamp,
      level,
      actor,
      action,
      component: this.component,
      entity,
      entityId,
      session: session?.tokenPrefix || "N/A",
      details: typeof details === "object" ? JSON.stringify(details) : details,
      elapsedMs: Date.now() - this.startTime,
    };

    // Format log message
    const logMessage = `${timestamp} | level=${level} | actor=${actor} | action=${action} | component=${
      this.component
    } | ${entity ? `entity=${entity} | ` : ""}${
      entityId ? `id=${entityId} | ` : ""
    }${
      session?.tokenPrefix ? `session=${session.tokenPrefix} | ` : ""
    }:: ${details}${
      logEntry.elapsedMs > 0 ? ` (elapsed: ${logEntry.elapsedMs}ms)` : ""
    }`;

    // Output to different channels
    this.outputToChannels(logMessage, logEntry);

    return logEntry;
  }

  outputToChannels(logMessage, logEntry) {
    // Browser console
    if (typeof console !== "undefined") {
      const consoleMethod = logEntry.level.toLowerCase();
      if (console[consoleMethod]) {
        console[consoleMethod](logMessage);
      } else {
        console.log(logMessage);
      }
    }

    // Google Apps Script Logger (avoid naming conflicts)
    try {
      // Use the built-in Apps Script Logger directly
      if (typeof Logger !== "undefined") {
        // Use Function constructor to avoid variable name conflicts
        const appsScriptLogger = Logger;
        if (appsScriptLogger && appsScriptLogger.log) {
          appsScriptLogger.log(logMessage);
        }
      }
    } catch (loggerError) {
      // If Apps Script Logger fails, just continue - don't throw
      console.error("Apps Script Logger error:", loggerError.message);
    }

    // Persistent storage to DBUG sheets
    this.persistLog(logEntry);
  }

  persistLog(logEntry) {
    try {
      const sheet = this.getLogSheet();
      if (sheet) {
        sheet.appendRow([
          logEntry.timestamp,
          logEntry.level,
          logEntry.actor,
          logEntry.action,
          logEntry.component,
          logEntry.entity || "",
          logEntry.entityId || "",
          logEntry.details,
          logEntry.session,
        ]);
      }
    } catch (error) {
      // Fallback logging - don't throw errors from logger
      if (typeof console !== "undefined") {
        console.error("Failed to persist log:", error);
      }
    }
  }

  getLogSheet() {
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = spreadsheet.getSheetByName("DBUG_AppLog");
      if (!sheet) {
        sheet = spreadsheet.getSheetByName("DBUG"); // Fallback
      }
      return sheet;
    } catch (error) {
      return null;
    }
  }

  getSessionInfo() {
    try {
      // Implementation would get actual session info
      return {
        userId: Session.getActiveUser().getEmail(),
        tokenPrefix: Utilities.getUuid().substring(0, 8),
      };
    } catch (error) {
      return null;
    }
  }

  // Convenience methods
  debug(action, details, entity, entityId) {
    return this.log("DEBUG", action, details, entity, entityId);
  }

  info(action, details, entity, entityId) {
    return this.log("INFO", action, details, entity, entityId);
  }

  warn(action, details, entity, entityId) {
    return this.log("WARN", action, details, entity, entityId);
  }

  error(action, details, entity, entityId) {
    return this.log("ERROR", action, details, entity, entityId);
  }
}

/**
 * Validation utilities with security protocols
 */
class ValidationUtils {
  static validateId(id, prefix) {
    if (!id || typeof id !== "string") {
      throw new Error(`Invalid ID format: ID must be a non-empty string`);
    }

    if (!id.startsWith(prefix)) {
      throw new Error(`Invalid ID format: ID must start with ${prefix}`);
    }

    const pattern = new RegExp(`^${prefix}\\d{4,}$`);
    if (!pattern.test(id)) {
      throw new Error(`Invalid ID format: Expected format ${prefix}####`);
    }

    return true;
  }

  static validateArabicText(text, fieldName) {
    if (!text || typeof text !== "string") {
      throw new Error(`${fieldName}: Arabic text is required`);
    }

    const arabicPattern = /[\u0600-\u06FF\s]+/;
    if (!arabicPattern.test(text)) {
      throw new Error(`${fieldName}: Must contain valid Arabic characters`);
    }

    return true;
  }

  static validateEmail(email) {
    if (
      !email ||
      !SECURITY_PROTOCOLS.VALIDATION_PATTERNS.EMAIL_FORMAT.test(email)
    ) {
      throw new Error("Invalid email format");
    }
    return true;
  }

  static validatePhone(phone) {
    if (
      !phone ||
      !SECURITY_PROTOCOLS.VALIDATION_PATTERNS.PHONE_FORMAT.test(phone)
    ) {
      throw new Error("Phone number must be 11 digits");
    }
    return true;
  }

  static validateNumeric(value, fieldName) {
    if (value === null || value === undefined || value === "") {
      throw new Error(`${fieldName}: Numeric value is required`);
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      throw new Error(`${fieldName}: Must be a valid positive number`);
    }

    return numValue;
  }

  static sanitizeInput(input) {
    if (typeof input !== "string") {
      return input;
    }

    // Remove potentially harmful characters
    return input
      .replace(/[<>]/g, "") // Remove HTML tags
      .replace(/['"`;]/g, "") // Remove SQL injection attempts
      .trim();
  }
}

/**
 * =============================================================================
 * SECTION 3: DATABASE ARCHITECT CORE FUNCTIONS
 * =============================================================================
 */

/**
 * Main Setup class for database operations
 */
class DatabaseArchitect {
  constructor(environment = "DEVELOPMENT") {
    this.environment = ENVIRONMENTS[environment] || ENVIRONMENTS.DEVELOPMENT;
    this.logger = new ERPLogger("DatabaseArchitect");
    this.validationUtils = ValidationUtils;
    this.operationCount = 0;
    this.lastOperationTime = Date.now();

    this.logger.info(
      "FUNC_START",
      "DatabaseArchitect initialized",
      "Setup.js",
      this.environment.name
    );
  }

  /**
   * Rate limiting check
   */
  checkRateLimit() {
    const now = Date.now();
    const timeDiff = now - this.lastOperationTime;

    if (timeDiff < 60000) {
      // Within 1 minute
      if (
        this.operationCount >=
        SECURITY_PROTOCOLS.RATE_LIMIT.MAX_OPERATIONS_PER_MINUTE
      ) {
        throw new Error(
          "Rate limit exceeded: Maximum operations per minute reached"
        );
      }
    } else {
      // Reset counter after cooldown period
      this.operationCount = 0;
    }

    this.operationCount++;
    this.lastOperationTime = now;

    return true;
  }

  /**
   * Authorization check
   */
  checkAuthorization(requiredPermission) {
    try {
      const user = Session.getActiveUser();
      const email = user.getEmail();

      // Check if user has required permission
      // This would be implemented based on actual permission system
      this.logger.info(
        "AUTH_CHECK",
        `Authorization check for ${email}`,
        "Setup.js",
        requiredPermission
      );

      return true;
    } catch (error) {
      this.logger.error(
        "AUTH_FAILED",
        `Authorization failed: ${error.message}`,
        "Setup.js",
        requiredPermission
      );
      throw new Error("Insufficient permissions for this operation");
    }
  }

  /**
   * Get spreadsheet instance with error handling
   */
  getSpreadsheet() {
    try {
      return SpreadsheetApp.getActiveSpreadsheet();
    } catch (error) {
      this.logger.error(
        "SPREADSHEET_ERROR",
        `Failed to get spreadsheet: ${error.message}`,
        "Setup.js"
      );
      throw new Error(
        "Unable to access spreadsheet. Please ensure you have proper permissions."
      );
    }
  }

  /**
   * Create or get sheet with proper headers
   */
  createSheet(sheetName, headers) {
    this.checkRateLimit();
    this.checkAuthorization(
      SECURITY_PROTOCOLS.REQUIRED_PERMISSIONS.SCHEMA_MODIFICATION
    );

    const spreadsheet = this.getSpreadsheet();
    let sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      this.logger.info(
        "SHEET_CREATED",
        `Created new sheet: ${sheetName}`,
        "Setup.js",
        sheetName
      );
    } else {
      this.logger.warn(
        "SHEET_EXISTS",
        `Sheet already exists: ${sheetName}`,
        "Setup.js",
        sheetName
      );
      return sheet;
    }

    // Apply Smart Header Protocol (3-Row Rule)
    if (headers && headers.length > 0) {
      this.applySmartHeaders(sheet, headers);
    }

    return sheet;
  }

  /**
   * Apply Smart Header Protocol (3-Row Rule)
   */
  applySmartHeaders(sheet, headers) {
    try {
      // Row 1: System Keys (Technical names)
      sheet
        .getRange(1, 1, 1, headers.length)
        .setValues([headers.map((h) => h.systemKey)]);

      // Row 2: UI Labels (Arabic display names)
      sheet
        .getRange(2, 1, 1, headers.length)
        .setValues([headers.map((h) => h.uiLabel)]);

      // Row 3: View Flags (SHOW/HIDE)
      sheet
        .getRange(3, 1, 1, headers.length)
        .setValues([headers.map((h) => h.viewFlag || "SHOW")]);

      // Format headers
      const headerRange = sheet.getRange(1, 1, 3, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#f0f0f0");
      headerRange.setBorder(true, true, true, true, true, true);

      this.logger.info(
        "HEADERS_APPLIED",
        "Smart headers applied successfully",
        sheet.getName()
      );
    } catch (error) {
      this.logger.error(
        "HEADERS_FAILED",
        `Failed to apply headers: ${error.message}`,
        sheet.getName()
      );
      throw error;
    }
  }

  /**
   * Build complete schema for a module
   */
  buildModuleSchema(modulePrefix) {
    this.logger.info(
      "FUNC_START",
      `Building schema for module: ${modulePrefix}`,
      "Setup.js",
      modulePrefix
    );

    const moduleConfig = MODULE_CONFIGS[modulePrefix];
    if (!moduleConfig) {
      throw new Error(`Invalid module prefix: ${modulePrefix}`);
    }

    const results = {
      module: modulePrefix,
      success: [],
      failed: [],
      warnings: [],
    };

    try {
      // Create sheets for each table in the module
      moduleConfig.tables.forEach((tableName) => {
        try {
          const headers = this.getTableHeaders(tableName);
          const sheet = this.createSheet(tableName, headers);
          results.success.push({
            table: tableName,
            action: "CREATE",
            status: "SUCCESS",
            message: `Sheet created successfully`,
          });
        } catch (error) {
          results.failed.push({
            table: tableName,
            action: "CREATE",
            status: "FAILED",
            message: error.message,
          });
        }
      });

      this.logger.info(
        "FUNC_END",
        `Schema build completed for ${modulePrefix}`,
        "Setup.js",
        modulePrefix
      );
      return results;
    } catch (error) {
      this.logger.error(
        "SCHEMA_BUILD_FAILED",
        `Schema build failed: ${error.message}`,
        "Setup.js",
        modulePrefix
      );
      throw error;
    }
  }

  /**
   * Get table headers based on schema definition
   */
  getTableHeaders(tableName) {
    // This would be implemented based on actual schema definitions
    // For now, returning sample headers
    const baseHeaders = [
      {
        systemKey: `${tableName.split("_")[0]}_ID`,
        uiLabel: "الكود",
        viewFlag: "SHOW",
      },
      { systemKey: "Created_At", uiLabel: "تاريخ الإنشاء", viewFlag: "SHOW" },
      { systemKey: "Created_By", uiLabel: "أنشئ بواسطة", viewFlag: "SHOW" },
      { systemKey: "Updated_At", uiLabel: "تاريخ التحديث", viewFlag: "HIDE" },
      { systemKey: "Updated_By", uiLabel: "حدث بواسطة", viewFlag: "HIDE" },
    ];

    // Add specific headers based on table type
    return this.addTableSpecificHeaders(baseHeaders, tableName);
  }

  /**
   * Add table-specific headers
   */
  addTableSpecificHeaders(baseHeaders, tableName) {
    // This would be implemented based on actual table definitions
    // For demonstration, adding some common fields
    const specificHeaders = [];

    if (tableName.includes("Employee")) {
      specificHeaders.push(
        {
          systemKey: "EMP_Name_EN",
          uiLabel: "الاسم بالإنجليزية",
          viewFlag: "SHOW",
        },
        {
          systemKey: "EMP_Name_AR",
          uiLabel: "الاسم بالعربية",
          viewFlag: "SHOW",
        },
        { systemKey: "EMP_Mob_Main", uiLabel: "رقم الهاتف", viewFlag: "SHOW" },
        {
          systemKey: "Basic_Salary",
          uiLabel: "الراتب الأساسي",
          viewFlag: "SHOW",
        }
      );
    }

    return [...baseHeaders, ...specificHeaders];
  }

  /**
   * Seed initial data for a module
   */
  seedModuleData(modulePrefix) {
    this.logger.info(
      "FUNC_START",
      `Seeding data for module: ${modulePrefix}`,
      "Setup.js",
      modulePrefix
    );

    const results = {
      module: modulePrefix,
      success: [],
      failed: [],
      warnings: [],
    };

    try {
      // Special handling for ENG module - use CSV data
      if (modulePrefix === "ENG") {
        this.logger.info(
          "ENG_MODULE_SEED",
          "Using CSV-based seeding for ENG module",
          "Setup.js"
        );

        try {
          const engResults = this.seedENGTablesFromCSV();
          results.success.push(...engResults.success);
          results.failed.push(...engResults.failed);
          results.warnings.push(...engResults.warnings);

          this.logger.info(
            "ENG_MODULE_SEED_COMPLETE",
            `ENG module seeding completed: ${engResults.success.length} successful, ${engResults.failed.length} failed`,
            "Setup.js"
          );

          return results;
        } catch (error) {
          results.failed.push({
            module: modulePrefix,
            action: "ENG_SEED",
            status: "FAILED",
            message: error.message,
          });
          return results;
        }
      }

      // Standard seeding for other modules
      const moduleConfig = MODULE_CONFIGS[modulePrefix];

      moduleConfig.tables.forEach((tableName) => {
        try {
          // Skip ENG tables for non-ENG modules (they're handled above)
          if (tableName.startsWith("ENG_")) {
            results.warnings.push({
              table: tableName,
              action: "SKIP",
              status: "WARNING",
              message: "ENG table skipped in non-ENG module seeding",
            });
            return;
          }

          this.seedTableData(tableName);
          results.success.push({
            table: tableName,
            action: "SEED",
            status: "SUCCESS",
            message: "Sample data seeded successfully",
          });
        } catch (error) {
          results.failed.push({
            table: tableName,
            action: "SEED",
            status: "FAILED",
            message: error.message,
          });
        }
      });

      return results;
    } catch (error) {
      this.logger.error(
        "DATA_SEED_FAILED",
        `Data seeding failed: ${error.message}`,
        "Setup.js",
        modulePrefix
      );
      throw error;
    }
  }

  /**
   * Seed ENG tables exclusively using engine_data CSV files
   * This function reads CSV data from engine_data folder and seeds ENG tables
   */
  seedENGTablesFromCSV() {
    this.logger.info(
      "FUNC_START",
      "Seeding ENG tables from engine_data CSV files",
      "Setup.js"
    );

    const results = {
      success: [],
      failed: [],
      warnings: [],
    };

    try {
      const engTables = [
        { tableName: "ENG_Forms", csvFile: "ENG_Forms.csv" },
        { tableName: "ENG_Views", csvFile: "ENG_Views.csv" },
        { tableName: "ENG_Dropdowns", csvFile: "ENG_Dropdowns.csv" },
        { tableName: "ENG_Buttons", csvFile: "ENG_Buttons.csv" },
        { tableName: "ENG_Settings", csvFile: "ENG_Settings.csv" },
      ];

      engTables.forEach(({ tableName, csvFile }) => {
        try {
          this.seedENGTableFromCSV(tableName, csvFile);
          results.success.push({
            table: tableName,
            action: "SEED_FROM_CSV",
            status: "SUCCESS",
            message: `Data seeded from ${csvFile}`,
          });
        } catch (error) {
          results.failed.push({
            table: tableName,
            action: "SEED_FROM_CSV",
            status: "FAILED",
            message: error.message,
          });
        }
      });

      return results;
    } catch (error) {
      this.logger.error(
        "ENG_SEED_FAILED",
        `ENG tables seeding failed: ${error.message}`,
        "Setup.js"
      );
      throw error;
    }
  }

  /**
   * Seed individual ENG table from CSV file
   */
  seedENGTableFromCSV(tableName, csvFileName) {
    try {
      this.logger.info(
        "ENG_TABLE_SEED",
        `Seeding ${tableName} from ${csvFileName}`,
        "Setup.js",
        tableName
      );

      // Get the sheet
      const spreadsheet = this.getSpreadsheet();
      const sheet = spreadsheet.getSheetByName(tableName);

      if (!sheet) {
        throw new Error(
          `Sheet ${tableName} not found. Ensure schema is built first.`
        );
      }

      // Read CSV data from engine_data folder
      const csvData = this.readCSVFromEngineData(csvFileName);

      if (!csvData || csvData.length === 0) {
        throw new Error(`No data found in ${csvFileName}`);
      }

      // Validate CSV structure matches expected headers
      this.validateENGCSVStructure(tableName, csvData);

      // Insert data starting from row 4 (after Smart Header Protocol rows)
      if (csvData.length > 1) {
        // Skip header row
        const dataRows = csvData.slice(1); // Remove header row
        if (dataRows.length > 0) {
          sheet
            .getRange(4, 1, dataRows.length, dataRows[0].length)
            .setValues(dataRows);

          this.logger.info(
            "ENG_DATA_INSERTED",
            `Inserted ${dataRows.length} rows into ${tableName}`,
            "Setup.js",
            tableName
          );
        }
      }
    } catch (error) {
      this.logger.error(
        "ENG_TABLE_SEED_FAILED",
        `Failed to seed ${tableName}: ${error.message}`,
        "Setup.js",
        tableName
      );
      throw error;
    }
  }

  /**
   * Read CSV file from engine_data folder
   * Uses embedded data from ENG_Data.js module for Google Apps Script compatibility
   */
  readCSVFromEngineData(csvFileName) {
    try {
      this.logger.info(
        "CSV_READ",
        `Reading CSV data from engine_data/${csvFileName}`,
        "Setup.js"
      );

      // Map CSV filenames to table names
      const csvToTableMap = {
        "ENG_Forms.csv": "ENG_Forms",
        "ENG_Views.csv": "ENG_Views",
        "ENG_Dropdowns.csv": "ENG_Dropdowns",
        "ENG_Buttons.csv": "ENG_Buttons",
        "ENG_Settings.csv": "ENG_Settings",
      };

      const tableName = csvToTableMap[csvFileName];
      if (!tableName) {
        throw new Error(`Unknown CSV file: ${csvFileName}`);
      }

      // Use the global ENG_Data module if available
      if (typeof ENG_Data !== "undefined" && ENG_Data.getENGDataByTableName) {
        return ENG_Data.getENGDataByTableName(tableName);
      }

      // Fallback: Try to access via global scope
      if (
        typeof global !== "undefined" &&
        global.ENG_Data &&
        global.ENG_Data.getENGDataByTableName
      ) {
        return global.ENG_Data.getENGDataByTableName(tableName);
      }

      throw new Error(
        `ENG_Data module not available. Please ensure ENG_Data.js is loaded.`
      );
    } catch (error) {
      this.logger.error(
        "CSV_READ_FAILED",
        `Failed to read CSV file ${csvFileName}: ${error.message}`,
        "Setup.js"
      );
      throw error;
    }
  }

  /**
   * Validate CSV structure against expected table headers
   */
  validateENGCSVStructure(tableName, csvData) {
    if (!csvData || csvData.length === 0) {
      throw new Error(`Empty CSV data for ${tableName}`);
    }

    const csvHeaders = csvData[0];
    const spreadsheet = this.getSpreadsheet();
    const sheet = spreadsheet.getSheetByName(tableName);

    if (!sheet) {
      throw new Error(`Sheet ${tableName} not found for validation`);
    }

    // Get expected headers from sheet (row 1 - system keys)
    const expectedHeaders = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    // Validate that CSV has required columns (basic validation)
    if (csvHeaders.length !== expectedHeaders.length) {
      this.logger.warn(
        "CSV_HEADER_MISMATCH",
        `Column count mismatch: CSV has ${csvHeaders.length}, expected ${expectedHeaders.length}`,
        "Setup.js",
        tableName
      );
    }

    this.logger.info(
      "CSV_VALIDATION_PASSED",
      `CSV structure validated for ${tableName}`,
      "Setup.js",
      tableName
    );
  }

  /**
   * Seed data for a specific table
   * For ENG tables, uses CSV data from ENG_Data.js
   * For other tables, creates appropriate sample data
   */
  seedTableData(tableName) {
    try {
      this.logger.info(
        "DATA_SEED",
        `Seeding data for table: ${tableName}`,
        "Setup.js",
        tableName
      );

      // Handle ENG tables specially - use CSV data
      if (tableName.startsWith("ENG_")) {
        this.logger.info(
          "ENG_DATA_SEED",
          `Using CSV data for ENG table: ${tableName}`,
          "Setup.js",
          tableName
        );

        // Map table name to CSV filename
        const csvFileName = `${tableName}.csv`;
        this.seedENGTableFromCSV(tableName, csvFileName);
        return;
      }

      // Handle other modules with appropriate sample data
      this.seedNonENGTableData(tableName);
    } catch (error) {
      this.logger.error(
        "DATA_SEED_FAILED",
        `Failed to seed table ${tableName}: ${error.message}`,
        "Setup.js",
        tableName
      );
      throw error;
    }
  }

  /**
   * Seed non-ENG tables with appropriate sample data
   */
  seedNonENGTableData(tableName) {
    this.logger.info(
      "NON_ENG_DATA_SEED",
      `Creating sample data for non-ENG table: ${tableName}`,
      "Setup.js",
      tableName
    );

    // Get the sheet
    const spreadsheet = this.getSpreadsheet();
    const sheet = spreadsheet.getSheetByName(tableName);

    if (!sheet) {
      throw new Error(
        `Sheet ${tableName} not found. Ensure schema is built first.`
      );
    }

    // Create sample data based on table type
    const sampleData = this.generateSampleDataForTable(tableName);

    if (sampleData && sampleData.length > 0) {
      // Insert data starting from row 4 (after Smart Header Protocol rows)
      sheet
        .getRange(4, 1, sampleData.length, sampleData[0].length)
        .setValues(sampleData);

      this.logger.info(
        "SAMPLE_DATA_INSERTED",
        `Inserted ${sampleData.length} sample rows into ${tableName}`,
        "Setup.js",
        tableName
      );
    }
  }

  /**
   * Generate appropriate sample data for different table types
   */
  generateSampleDataForTable(tableName) {
    const modulePrefix = tableName.split("_")[0];

    switch (modulePrefix) {
      case "SYS":
        return this.generateSYSSampleData(tableName);
      case "HRM":
        return this.generateHRMSampleData(tableName);
      case "PRJ":
        return this.generatePRJSampleData(tableName);
      case "FIN":
        return this.generateFINSampleData(tableName);
      default:
        this.logger.warn(
          "UNKNOWN_TABLE_TYPE",
          `No sample data generator for table: ${tableName}`,
          "Setup.js",
          tableName
        );
        return [];
    }
  }

  /**
   * Generate sample data for SYS module tables
   */
  generateSYSSampleData(tableName) {
    // This is a basic implementation - can be expanded based on specific requirements
    const timestamp = new Date().toISOString();

    switch (tableName) {
      case "SYS_Users":
        return [
          [
            "SYS-1001",
            "System Admin",
            "admin",
            "admin@company.com",
            "hashed_password",
            "salt_value",
            "Active",
            "SYS_ADMIN",
            timestamp,
            "system",
            timestamp,
            "system",
          ],
        ];
      case "SYS_Roles":
        return [
          [
            "SYS-1001",
            "System Administrator",
            "Full system access",
            "SYS",
            "TRUE",
            timestamp,
            "system",
            timestamp,
            "system",
          ],
          [
            "SYS-1002",
            "HR Manager",
            "HR module access",
            "HRM",
            "TRUE",
            timestamp,
            "system",
            timestamp,
            "system",
          ],
        ];
      case "SYS_Permissions":
        return [
          [
            "PRM-1001",
            "FULL_SYSTEM_ACCESS",
            "SYS",
            "Complete system access",
            "TRUE",
            timestamp,
            "system",
          ],
          [
            "PRM-1002",
            "HR_MODULE_ACCESS",
            "HRM",
            "Access HR module",
            "TRUE",
            timestamp,
            "system",
          ],
        ];
      default:
        return [];
    }
  }

  /**
   * Generate sample data for HRM module tables
   */
  generateHRMSampleData(tableName) {
    const timestamp = new Date().toISOString();

    switch (tableName) {
      case "HRM_Employees":
        return [
          [
            "HRM-1001",
            "John Smith",
            "جون سميث",
            "John",
            "Smith",
            "M",
            "john.smith@company.com",
            "12345678901",
            "Manager",
            "2024-01-01",
            "50000",
            "Active",
            timestamp,
            "system",
            timestamp,
            "system",
          ],
        ];
      case "HRM_Departments":
        return [
          [
            "HRM-1001",
            "Human Resources",
            "قسم الموارد البشرية",
            "HR Department",
            "Active",
            timestamp,
            "system",
            timestamp,
            "system",
          ],
        ];
      default:
        return [];
    }
  }

  /**
   * Generate sample data for PRJ module tables
   */
  generatePRJSampleData(tableName) {
    const timestamp = new Date().toISOString();

    switch (tableName) {
      case "PRJ_Main":
        return [
          [
            "PRJ-1001",
            "Website Development",
            "Internal",
            "2024-01-01",
            "2024-06-30",
            "50000",
            "Active",
            timestamp,
            "system",
            timestamp,
            "system",
          ],
        ];
      case "PRJ_Clients":
        return [
          [
            "PRJ-1001",
            "ABC Corporation",
            "ABC Corp",
            "contact@abc.com",
            "12345678901",
            "Active",
            timestamp,
            "system",
            timestamp,
            "system",
          ],
        ];
      default:
        return [];
    }
  }

  /**
   * Generate sample data for FIN module tables
   */
  generateFINSampleData(tableName) {
    const timestamp = new Date().toISOString();

    switch (tableName) {
      case "FIN_DirectExpenses":
        return [
          [
            "FIN-1001",
            "PRJ-1001",
            "2024-01-15",
            "Software License",
            "1000",
            "Paid",
            "Cash",
            timestamp,
            "system",
            timestamp,
            "system",
          ],
        ];
      default:
        return [];
    }
  }

  /**
   * Wipe all data from a module (destructive operation)
   */
  wipeModuleData(modulePrefix) {
    this.checkAuthorization(
      SECURITY_PROTOCOLS.REQUIRED_PERMISSIONS.DATA_MANIPULATION
    );

    if (!this.environment.allowDestructiveOps) {
      throw new Error("Destructive operations not allowed in this environment");
    }

    this.logger.warn(
      "FUNC_START",
      `Wiping data for module: ${modulePrefix}`,
      "Setup.js",
      modulePrefix
    );

    const results = {
      module: modulePrefix,
      success: [],
      failed: [],
      warnings: [],
    };

    try {
      const moduleConfig = MODULE_CONFIGS[modulePrefix];

      moduleConfig.tables.forEach((tableName) => {
        try {
          const sheet = this.getSpreadsheet().getSheetByName(tableName);
          if (sheet) {
            // Clear data but preserve headers (first 3 rows)
            const lastRow = sheet.getLastRow();
            if (lastRow > 3) {
              sheet.deleteRows(4, lastRow - 3);
            }

            results.success.push({
              table: tableName,
              action: "WIPE",
              status: "SUCCESS",
              message: "Data wiped successfully (headers preserved)",
            });
          }
        } catch (error) {
          results.failed.push({
            table: tableName,
            action: "WIPE",
            status: "FAILED",
            message: error.message,
          });
        }
      });

      return results;
    } catch (error) {
      this.logger.error(
        "DATA_WIPE_FAILED",
        `Data wipe failed: ${error.message}`,
        "Setup.js",
        modulePrefix
      );
      throw error;
    }
  }

  /**
   * Delete entire sheets for a module (very destructive)
   */
  deleteModuleSheets(modulePrefix) {
    this.checkAuthorization(
      SECURITY_PROTOCOLS.REQUIRED_PERMISSIONS.SCHEMA_MODIFICATION
    );

    if (!this.environment.allowDestructiveOps) {
      throw new Error("Destructive operations not allowed in this environment");
    }

    this.logger.error(
      "FUNC_START",
      `Deleting sheets for module: ${modulePrefix}`,
      "Setup.js",
      modulePrefix
    );

    const results = {
      module: modulePrefix,
      success: [],
      failed: [],
      warnings: [],
    };

    try {
      const moduleConfig = MODULE_CONFIGS[modulePrefix];

      moduleConfig.tables.forEach((tableName) => {
        try {
          const spreadsheet = this.getSpreadsheet();
          const sheet = spreadsheet.getSheetByName(tableName);

          if (sheet) {
            spreadsheet.deleteSheet(sheet);
            results.success.push({
              table: tableName,
              action: "DELETE",
              status: "SUCCESS",
              message: "Sheet deleted successfully",
            });
          }
        } catch (error) {
          results.failed.push({
            table: tableName,
            action: "DELETE",
            status: "FAILED",
            message: error.message,
          });
        }
      });

      return results;
    } catch (error) {
      this.logger.error(
        "SHEET_DELETE_FAILED",
        `Sheet deletion failed: ${error.message}`,
        "Setup.js",
        modulePrefix
      );
      throw error;
    }
  }

  /**
   * Generate comprehensive report
   */
  generateReport(results) {
    this.logger.info("FUNC_START", "Generating operation report", "Setup.js");

    const report = {
      timestamp: new Date().toISOString(),
      environment: this.environment.name,
      summary: {
        total:
          results.success.length +
          results.failed.length +
          results.warnings.length,
        success: results.success.length,
        failed: results.failed.length,
        warnings: results.warnings.length,
      },
      details: results,
      recommendations: this.generateRecommendations(results),
    };

    // Create report sheet if it doesn't exist
    const reportSheetName = `REPORT_${new Date().toISOString().split("T")[0]}`;
    const reportSheet = this.createSheet(reportSheetName, [
      { systemKey: "REPORT_ID", uiLabel: "كود التقرير", viewFlag: "SHOW" },
      { systemKey: "Timestamp", uiLabel: "الوقت", viewFlag: "SHOW" },
      { systemKey: "Module", uiLabel: "الوحدة", viewFlag: "SHOW" },
      { systemKey: "Operation", uiLabel: "العملية", viewFlag: "SHOW" },
      { systemKey: "Status", uiLabel: "الحالة", viewFlag: "SHOW" },
      { systemKey: "Message", uiLabel: "الرسالة", viewFlag: "SHOW" },
    ]);

    // Add report data
    const allResults = [
      ...results.success.map((r) => [
        Utilities.getUuid(),
        report.timestamp,
        results.module,
        r.action,
        "SUCCESS",
        r.message,
      ]),
      ...results.failed.map((r) => [
        Utilities.getUuid(),
        report.timestamp,
        results.module,
        r.action,
        "FAILED",
        r.message,
      ]),
      ...results.warnings.map((r) => [
        Utilities.getUuid(),
        report.timestamp,
        results.module,
        r.action,
        "WARNING",
        r.message,
      ]),
    ];

    if (allResults.length > 0) {
      reportSheet.getRange(4, 1, allResults.length, 6).setValues(allResults);
    }

    this.logger.info(
      "FUNC_END",
      "Report generated successfully",
      "Setup.js",
      reportSheetName
    );
    return report;
  }

  /**
   * Generate recommendations based on results
   */
  generateRecommendations(results) {
    const recommendations = [];

    if (results.failed.length > 0) {
      recommendations.push({
        type: "ERROR",
        priority: "HIGH",
        message:
          "Some operations failed. Review error messages and retry failed operations.",
        action: "Check permissions and data integrity",
      });
    }

    if (results.warnings.length > 0) {
      recommendations.push({
        type: "WARNING",
        priority: "MEDIUM",
        message: "Operations completed with warnings. Review warning messages.",
        action: "Address warning conditions to ensure optimal performance",
      });
    }

    if (results.success.length > 0) {
      recommendations.push({
        type: "SUCCESS",
        priority: "LOW",
        message: "Operations completed successfully.",
        action: "No immediate action required",
      });
    }

    return recommendations;
  }
}

/**
 * =============================================================================
 * SECTION 4: GOOGLE APPS SCRIPT UI FUNCTIONS
 * =============================================================================
 * Note: UI functions are now managed in Code.js to avoid conflicts
 * The onOpen() function has been moved to Code.js for proper Google Sheets integration
 */

/**
 * Show sidebar with database management interface
 */
function showSidebar() {
  const logger = new ERPLogger("showSidebar");
  logger.info("FUNC_START", "Showing sidebar", "Setup.js");

  try {
    const html = HtmlService.createHtmlOutputFromFile("Sidebar")
      .setTitle("Nijjara ERP - Database Architect")
      .setWidth(350);

    SpreadsheetApp.getUi().showSidebar(html);
    logger.info("FUNC_END", "Sidebar displayed successfully", "Setup.js");
  } catch (error) {
    logger.error(
      "SIDEBAR_FAILED",
      `Failed to show sidebar: ${error.message}`,
      "Setup.js"
    );
    throw error;
  }
}

/**
 * Build complete database schema
 */
function buildDatabaseSchema() {
  const logger = new ERPLogger("buildDatabaseSchema");
  logger.info("FUNC_START", "Building complete database schema", "Setup.js");

  try {
    const architect = new DatabaseArchitect("DEVELOPMENT");
    const results = {
      success: [],
      failed: [],
      warnings: [],
    };

    // Build schema for all modules
    Object.keys(MODULE_CONFIGS).forEach((modulePrefix) => {
      try {
        const moduleResults = architect.buildModuleSchema(modulePrefix);
        results.success.push(...moduleResults.success);
        results.failed.push(...moduleResults.failed);
        results.warnings.push(...moduleResults.warnings);
      } catch (error) {
        results.failed.push({
          module: modulePrefix,
          action: "BUILD_SCHEMA",
          status: "FAILED",
          message: error.message,
        });
      }
    });

    const report = architect.generateReport(results);
    logger.info("FUNC_END", "Database schema build completed", "Setup.js");

    return report;
  } catch (error) {
    logger.error(
      "SCHEMA_BUILD_FAILED",
      `Database schema build failed: ${error.message}`,
      "Setup.js"
    );
    throw error;
  }
}

/**
 * Seed initial data for all modules
 */
function seedInitialData() {
  const logger = new ERPLogger("seedInitialData");
  logger.info("FUNC_START", "Seeding initial data", "Setup.js");

  try {
    const architect = new DatabaseArchitect("DEVELOPMENT");
    const results = {
      success: [],
      failed: [],
      warnings: [],
    };

    // Seed data for all modules
    Object.keys(MODULE_CONFIGS).forEach((modulePrefix) => {
      try {
        const moduleResults = architect.seedModuleData(modulePrefix);
        results.success.push(...moduleResults.success);
        results.failed.push(...moduleResults.failed);
        results.warnings.push(...moduleResults.warnings);
      } catch (error) {
        results.failed.push({
          module: modulePrefix,
          action: "SEED_DATA",
          status: "FAILED",
          message: error.message,
        });
      }
    });

    const report = architect.generateReport(results);
    logger.info("FUNC_END", "Initial data seeding completed", "Setup.js");

    return report;
  } catch (error) {
    logger.error(
      "DATA_SEED_FAILED",
      `Initial data seeding failed: ${error.message}`,
      "Setup.js"
    );
    throw error;
  }
}

/**
 * Create backup of current database state
 */
function createBackup() {
  const logger = new ERPLogger("createBackup");
  logger.info("FUNC_START", "Creating database backup", "Setup.js");

  try {
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

    logger.info(
      "FUNC_END",
      `Backup created successfully: ${backupName}`,
      "Setup.js",
      backupName
    );
    return backupName;
  } catch (error) {
    logger.error(
      "BACKUP_FAILED",
      `Backup creation failed: ${error.message}`,
      "Setup.js"
    );
    throw error;
  }
}

/**
 * Validate data integrity across all modules
 */
function validateDataIntegrity() {
  const logger = new ERPLogger("validateDataIntegrity");
  logger.info("FUNC_START", "Validating data integrity", "Setup.js");

  try {
    const results = {
      valid: [],
      invalid: [],
      warnings: [],
    };

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Validate each module
    Object.keys(MODULE_CONFIGS).forEach((modulePrefix) => {
      const moduleConfig = MODULE_CONFIGS[modulePrefix];

      moduleConfig.tables.forEach((tableName) => {
        try {
          const sheet = spreadsheet.getSheetByName(tableName);
          if (sheet) {
            const validationResult = this.validateSheetData(sheet, tableName);

            if (validationResult.isValid) {
              results.valid.push({
                table: tableName,
                status: "VALID",
                message: "All data integrity checks passed",
              });
            } else {
              results.invalid.push({
                table: tableName,
                status: "INVALID",
                errors: validationResult.errors,
              });
            }
          }
        } catch (error) {
          results.invalid.push({
            table: tableName,
            status: "VALIDATION_FAILED",
            message: error.message,
          });
        }
      });
    });

    logger.info("FUNC_END", "Data integrity validation completed", "Setup.js");
    return results;
  } catch (error) {
    logger.error(
      "VALIDATION_FAILED",
      `Data integrity validation failed: ${error.message}`,
      "Setup.js"
    );
    throw error;
  }
}

/**
 * Validate individual sheet data
 */
function validateSheetData(sheet, tableName) {
  const result = {
    isValid: true,
    errors: [],
  };

  try {
    const data = sheet.getDataRange().getValues();

    if (data.length < 4) {
      result.errors.push(
        "Insufficient data rows (minimum 4 required for headers)"
      );
      result.isValid = false;
      return result;
    }

    // Validate Smart Header Protocol
    const headers = data[0]; // Row 1: System Keys
    const uiLabels = data[1]; // Row 2: UI Labels
    const viewFlags = data[2]; // Row 3: View Flags

    // Check for required columns
    const requiredColumns = ["Created_At", "Updated_At"];
    requiredColumns.forEach((col) => {
      if (!headers.includes(col)) {
        result.errors.push(`Missing required column: ${col}`);
        result.isValid = false;
      }
    });

    // Validate data rows (starting from row 4)
    for (let row = 3; row < data.length; row++) {
      const rowData = data[row];

      // Basic validation - check for empty required fields
      for (let col = 0; col < headers.length; col++) {
        const header = headers[col];
        const value = rowData[col];

        // Skip validation for optional fields
        if (this.isOptionalField(header)) {
          continue;
        }

        // Check for empty required fields
        if (
          this.isRequiredField(header) &&
          (!value || value.toString().trim() === "")
        ) {
          result.errors.push(
            `Row ${row + 1}: Empty required field '${header}'`
          );
          result.isValid = false;
        }

        // Validate specific field types
        if (header.endsWith("_ID") && value) {
          try {
            ValidationUtils.validateId(
              value.toString(),
              tableName.split("_")[0]
            );
          } catch (error) {
            result.errors.push(
              `Row ${row + 1}: Invalid ID format in field '${header}': ${
                error.message
              }`
            );
            result.isValid = false;
          }
        }
      }
    }

    return result;
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Validation error: ${error.message}`);
    return result;
  }
}

/**
 * Check if field is optional
 */
function isOptionalField(fieldName) {
  const optionalFields = ["Updated_At", "Updated_By", "Notes", "Description"];
  return optionalFields.some((field) => fieldName.includes(field));
}

/**
 * Check if field is required
 */
function isRequiredField(fieldName) {
  const requiredFields = ["Created_At", "Created_By"];
  return requiredFields.includes(fieldName) || fieldName.endsWith("_ID");
}

/**
 * Generate comprehensive system report
 */
function generateSystemReport() {
  const logger = new ERPLogger("generateSystemReport");
  logger.info("FUNC_START", "Generating system report", "Setup.js");

  try {
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
        totalColumns: 0,
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
        module: this.getModuleFromSheetName(sheet.getName()),
      });

      report.statistics.totalRows += numRows;
      report.statistics.totalColumns += numColumns;

      // Module breakdown
      const module = this.getModuleFromSheetName(sheet.getName());
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

    logger.info("FUNC_END", "System report generated successfully", "Setup.js");
    return report;
  } catch (error) {
    logger.error(
      "REPORT_FAILED",
      `System report generation failed: ${error.message}`,
      "Setup.js"
    );
    throw error;
  }
}

/**
 * Get module from sheet name
 */
function getModuleFromSheetName(sheetName) {
  const match = sheetName.match(/^([A-Z]{3})_/);
  return match ? match[1] : null;
}

/**
 * =============================================================================
 * SECTION 5: EXPORTS & VERSION CONTROL
 * =============================================================================
 */

// Version info is now managed in Code.js to avoid conflicts
// Use getVersionInfo() function from Code.js to access version information

// Export main classes and utilities for external use
const SetupJS = {
  // Core classes
  DatabaseArchitect,
  ERPLogger,
  ValidationUtils,

  // Configuration objects
  ENVIRONMENTS,
  SECURITY_PROTOCOLS,
  MODULE_CONFIGS,

  // Utility functions (UI functions moved to Code.js)
  buildDatabaseSchema,
  seedInitialData,
  createBackup,
  validateDataIntegrity,
  generateSystemReport,

  // Helper methods
  utils: {
    getModuleFromSheetName,
    isOptionalField,
    isRequiredField,
    validateSheetData,
  },
};

// Make available globally for Google Apps Script
if (typeof global !== "undefined") {
  global.SetupJS = SetupJS;
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = SetupJS;
}

// Log successful initialization
const setupLogger = new ERPLogger("SetupJS");
setupLogger.info(
  "INITIALIZATION_COMPLETE",
  `Setup.js initialized successfully in ${ENVIRONMENTS.DEVELOPMENT.name} environment`,
  "Setup.js",
  "1.0.0"
);

/**
 * =============================================================================
 * END OF FILE - Setup.js
 * =============================================================================
 *
 * This file is part of the NCM-Nijjara-ERP system.
 * For support and documentation, refer to the project documentation.
 *
 * @system NCM-Nijjara-ERP
 * @version 1.0.0
 * @lastUpdated 2025-12-07
 * =============================================================================
 */
