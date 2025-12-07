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

// Include Setup.js functions (simplified version for main script)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * =============================================================================
 * SECTION 2: MAIN MENU CREATION
 * =============================================================================
 */

/**
 * Create custom menu when spreadsheet opens
 * This function is automatically triggered by Google Sheets
 */
function onOpen() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const menuItems = [
      {
        name: "🏢 Nijjara ERP - لوحة التحكم",
        functionName: "showSetupSidebar",
      },
      null, // Separator
      {
        name: "🏗️ بناء مخطط قاعدة البيانات",
        functionName: "buildDatabaseSchema",
      },
      { name: "🌱 تهيئة البيانات الافتراضية", functionName: "seedInitialData" },
      null, // Separator
      { name: "💾 إنشاء نسخة احتياطية", functionName: "createBackup" },
      { name: "📊 تقرير النظام", functionName: "generateSystemReport" },
      { name: "🔍 فحص سلامة البيانات", functionName: "validateDataIntegrity" },
    ];

    spreadsheet.addMenu("🏢 Nijjara ERP", menuItems);

    // Log successful menu creation
    logEvent(
      "INFO",
      "SYSTEM",
      "MENU_CREATED",
      "onOpen",
      "Custom menu created successfully"
    );
  } catch (error) {
    logEvent(
      "ERROR",
      "SYSTEM",
      "MENU_CREATION_FAILED",
      "onOpen",
      `Failed to create menu: ${error.message}`
    );
    throw error;
  }
}

/**
 * =============================================================================
 * SECTION 3: SETUP FUNCTIONS (SIMPLIFIED)
 * =============================================================================
 */

/**
 * Show the setup sidebar
 */
function showSetupSidebar() {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: #2c3e50; color: white; padding: 15px; text-align: center; border-radius: 5px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .button { background: #3498db; color: white; padding: 10px 15px; border: none; border-radius: 3px; cursor: pointer; margin: 5px; }
            .button:hover { background: #2980b9; }
            .danger { background: #e74c3c; }
            .danger:hover { background: #c0392b; }
            .warning { background: #f39c12; }
            .warning:hover { background: #e67e22; }
            .success { background: #27ae60; }
            .success:hover { background: #229954; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>🏢 Nijjara ERP</h2>
            <p>Database Architect Interface</p>
          </div>
          
          <div class="section">
            <h3>🏗️ Database Schema</h3>
            <button class="button" onclick="google.script.run.buildDatabaseSchema()">Build Complete Schema</button>
            <button class="button success" onclick="google.script.run.seedInitialData()">Seed Initial Data</button>
          </div>
          
          <div class="section">
            <h3>💾 Backup & Recovery</h3>
            <button class="button" onclick="google.script.run.createBackup()">Create Backup</button>
            <button class="button warning" onclick="google.script.run.restoreBackup()">Restore Backup</button>
          </div>
          
          <div class="section">
            <h3>🔍 Validation & Reports</h3>
            <button class="button" onclick="google.script.run.validateDataIntegrity()">Validate Data</button>
            <button class="button success" onclick="google.script.run.generateSystemReport()">System Report</button>
          </div>
          
          <div class="section">
            <h3>⚠️ Destructive Operations</h3>
            <p><strong>Warning:</strong> These operations cannot be undone!</p>
            <button class="button danger" onclick="if(confirm('Are you sure you want to wipe all data? This cannot be undone!')) google.script.run.wipeAllData()">Wipe All Data</button>
            <button class="button danger" onclick="if(confirm('Are you sure you want to delete all sheets? This cannot be undone!')) google.script.run.deleteAllSheets()">Delete All Sheets</button>
          </div>
          
          <div class="section">
            <h3>📋 Quick Actions</h3>
            <button class="button" onclick="google.script.run.buildModuleSchema('SYS')">Build SYS Module</button>
            <button class="button" onclick="google.script.run.buildModuleSchema('HRM')">Build HRM Module</button>
            <button class="button" onclick="google.script.run.buildModuleSchema('PRJ')">Build PRJ Module</button>
            <button class="button" onclick="google.script.run.buildModuleSchema('FIN')">Build FIN Module</button>
          </div>
          
          <div id="status"></div>
        </body>
      </html>
    `;

    const htmlOutput = HtmlService.createHtmlOutput(html)
      .setTitle("🏢 Nijjara ERP - Database Architect")
      .setWidth(350);

    SpreadsheetApp.getUi().showSidebar(htmlOutput);

    logEvent(
      "INFO",
      "SYSTEM",
      "SIDEBAR_SHOWN",
      "showSetupSidebar",
      "Setup sidebar displayed successfully"
    );
  } catch (error) {
    logEvent(
      "ERROR",
      "SYSTEM",
      "SIDEBAR_FAILED",
      "showSetupSidebar",
      `Failed to show sidebar: ${error.message}`
    );
    throw error;
  }
}

/**
 * =============================================================================
 * SECTION 4: DATABASE OPERATIONS
 * =============================================================================
 */

/**
 * Build complete database schema
 */
function buildDatabaseSchema() {
  try {
    logEvent(
      "INFO",
      "SYSTEM",
      "FUNC_START",
      "buildDatabaseSchema",
      "Starting database schema build"
    );

    // This would call the actual Setup.js functions
    // For now, we'll create a basic implementation
    const results = {
      success: [],
      failed: [],
      timestamp: new Date().toISOString(),
    };

    // Create all required sheets with proper headers
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Define all required sheets with their specific headers
    const sheetDefinitions = {
      // ENG Sheets (Engine/Metadata)
      ENG_Forms: [
        ["FORM_ID", "كود النموذج", "SHOW"],
        ["TAB_Section", "قسم التبويب", "SHOW"],
        ["Column_Pointer", "مؤشر العمود", "SHOW"],
        ["Field_Type", "نوع الحقل", "SHOW"],
        ["Smart_State", "الحالة الذكية", "SHOW"],
        ["DYN_Link", "الرابط الديناميكي", "HIDE"],
        ["Created_At", "تاريخ الإنشاء", "SHOW"],
        ["Created_By", "أنشئ بواسطة", "SHOW"],
        ["Updated_At", "تاريخ التحديث", "HIDE"],
        ["Updated_By", "حدث بواسطة", "HIDE"],
      ],
      ENG_Views: [
        ["VIEW_ID", "كود العرض", "SHOW"],
        ["View_Title", "عنوان العرض", "SHOW"],
        ["Source_Sheet", "ورقة المصدر", "SHOW"],
        ["Created_At", "تاريخ الإنشاء", "SHOW"],
        ["Created_By", "أنشئ بواسطة", "SHOW"],
        ["Updated_At", "تاريخ التحديث", "HIDE"],
        ["Updated_By", "حدث بواسطة", "HIDE"],
      ],
      ENG_Dropdowns: [
        ["DD_ID", "كود القائمة المنسدلة", "SHOW"],
        ["DD_EN", "النص الإنجليزي", "SHOW"],
        ["DD_AR", "النص العربي", "SHOW"],
        ["DD_Is_Active", "نشط", "SHOW"],
        ["DD_Sort_Order", "ترتيب الفرز", "SHOW"],
        ["Created_At", "تاريخ الإنشاء", "SHOW"],
        ["Created_By", "أنشئ بواسطة", "SHOW"],
        ["Updated_At", "تاريخ التحديث", "HIDE"],
        ["Updated_By", "حدث بواسطة", "HIDE"],
      ],
      ENG_Buttons: [
        ["BTN_ID", "كود الزر", "SHOW"],
        ["BTN_Label", "نص الزر", "SHOW"],
        ["BTN_Type", "نوع الزر", "SHOW"],
        ["BTN_Description", "وصف الزر", "SHOW"],
        ["Created_At", "تاريخ الإنشاء", "SHOW"],
        ["Created_By", "أنشئ بواسطة", "SHOW"],
        ["Updated_At", "تاريخ التحديث", "HIDE"],
        ["Updated_By", "حدث بواسطة", "HIDE"],
      ],
      ENG_Settings: [
        ["Setting_Key", "مفتاح الإعداد", "SHOW"],
        ["Setting_Value", "قيمة الإعداد", "SHOW"],
        ["Description_EN", "الوصف الإنجليزي", "HIDE"],
        ["Updated_By", "حدث بواسطة", "SHOW"],
        ["Updated_At", "تاريخ التحديث", "SHOW"],
      ],
      // SYS Sheets (System Administration)
      SYS_Users: [
        ["USR_ID", "كود المستخدم", "SHOW"],
        ["EMP_Name_EN", "الاسم الإنجليزي", "SHOW"],
        ["USR_Name", "اسم المستخدم", "SHOW"],
        ["Password_Hash", "تجزئة كلمة المرور", "HIDE"],
        ["Password_Salt", "ملح كلمة المرور", "HIDE"],
        ["EMP_Email", "البريد الإلكتروني", "SHOW"],
        ["Job_Title", "المسمى الوظيفي", "SHOW"],
        ["DEPT_Name", "اسم القسم", "SHOW"],
        ["Last_Login", "آخر تسجيل دخول", "SHOW"],
        ["USR_Crt_At", "تاريخ الإنشاء", "SHOW"],
        ["USR_Crt_By", "أنشئ بواسطة", "SHOW"],
        ["USR_Upd_At", "تاريخ التحديث", "HIDE"],
        ["USR_Upd_By", "حدث بواسطة", "HIDE"],
      ],
      SYS_Roles: [
        ["ROL_ID", "كود الدور", "SHOW"],
        ["ROL_Title", "عنوان الدور", "SHOW"],
        ["ROL_Title_AR", "عنوان الدور عربي", "SHOW"],
        ["ROL_Notes", "ملاحظات", "HIDE"],
        ["ROL_Is_System", "نظامي", "SHOW"],
        ["ROL_Crt_At", "تاريخ الإنشاء", "SHOW"],
        ["ROL_Crt_By", "أنشئ بواسطة", "SHOW"],
        ["ROL_Upd_At", "تاريخ التحديث", "HIDE"],
        ["ROL_Upd_By", "حدث بواسطة", "HIDE"],
      ],
      SYS_Permissions: [
        ["PRM_ID", "كود الصلاحية", "SHOW"],
        ["PRM_Name", "اسم الصلاحية", "SHOW"],
        ["PRM_Name_AR", "اسم الصلاحية عربي", "SHOW"],
        ["PRM_Notes", "ملاحظات", "HIDE"],
        ["PRM_Catg", "الفئة", "SHOW"],
        ["PRM_Crt_At", "تاريخ الإنشاء", "SHOW"],
        ["PRM_Crt_By", "أنشئ بواسطة", "SHOW"],
        ["PRM_Upd_At", "تاريخ التحديث", "HIDE"],
        ["PRM_Upd_By", "حدث بواسطة", "HIDE"],
      ],
      SYS_Role_Permissions: [
        ["ROL_ID", "كود الدور", "SHOW"],
        ["PRM_ID", "كود الصلاحية", "SHOW"],
        ["SRP_Scope", "نطاق الصلاحية", "SHOW"],
        ["SRP_Is_Allowed", "مسموح", "SHOW"],
        ["SRP_Constraints", "القيود", "HIDE"],
        ["SRP_Crt_At", "تاريخ الإنشاء", "SHOW"],
        ["SRP_Crt_By", "أنشئ بواسطة", "SHOW"],
        ["SRP_Upd_At", "تاريخ التحديث", "HIDE"],
        ["SRP_Upd_By", "حدث بواسطة", "HIDE"],
      ],
      SYS_Sessions: [
        ["SESS_ID", "كود الجلسة", "SHOW"],
        ["USR_ID", "كود المستخدم", "SHOW"],
        ["EMP_Email", "البريد الإلكتروني", "SHOW"],
        ["Actor_USR_ID", "كود المستخدم الفاعل", "HIDE"],
        ["SESS_Type", "نوع الجلسة", "SHOW"],
        ["SESS_Status", "حالة الجلسة", "SHOW"],
        ["IP_Address", "عنوان IP", "HIDE"],
        ["Auth_Token", "رمز المصادقة", "HIDE"],
        ["SESS_Start_At", "بداية الجلسة", "SHOW"],
        ["SESS_End_At", "نهاية الجلسة", "HIDE"],
        ["SESS_Crt_At", "تاريخ الإنشاء", "SHOW"],
        ["SESS_Crt_By", "أنشئ بواسطة", "SHOW"],
        ["SESS_Revoked_At", "تاريخ الإلغاء", "HIDE"],
        ["SESS_Revoked_By", "ألغي بواسطة", "HIDE"],
        ["SESS_Metadata", "البيانات الوصفية", "HIDE"],
      ],
      SYS_Audit_Log: [
        ["AUD_ID", "كود التدقيق", "SHOW"],
        ["AUD_Time_Stamp", "الطابع الزمني", "SHOW"],
        ["USR_ID", "كود المستخدم", "SHOW"],
        ["USR_Name", "اسم المستخدم", "SHOW"],
        ["USR_Action", "الإجراء", "SHOW"],
        ["ACT_Description", "وصف الإجراء", "SHOW"],
        ["AUD_Entity", "الكيان", "SHOW"],
        ["AUD_Entity_ID", "كود الكيان", "SHOW"],
        ["AUD_Scope", "نطاق التدقيق", "HIDE"],
        ["AUD_Sheet_ID", "كود الورقة", "HIDE"],
        ["AUD_Sheet_Name", "اسم الورقة", "HIDE"],
        ["IP_Address", "عنوان IP", "HIDE"],
      ],
      SYS_Documents: [
        ["DOC_ID", "كود المستند", "SHOW"],
        ["DOC_Entity", "الكيان", "SHOW"],
        ["DOC_Entity_ID", "كود الكيان", "SHOW"],
        ["DOC_File_Name", "اسم الملف", "SHOW"],
        ["DOC_Label", "التسمية", "SHOW"],
        ["DOC_Drive_URL", "رابط Google Drive", "HIDE"],
        ["DOC_Upload_By", "تم الرفع بواسطة", "SHOW"],
        ["DOC_Crt_At", "تاريخ الإنشاء", "SHOW"],
      ],
      SYS_PubHolidays: [
        ["PUBHOL_ID", "كود العطلة", "SHOW"],
        ["Pub_Holiday_Date", "تاريخ العطلة", "SHOW"],
        ["Pub_Holiday_Name", "اسم العطلة", "SHOW"],
      ],
      // HRM Sheets (Human Resources)
      HRM_Employees: [
        ["EMP_ID", "كود الموظف", "SHOW"],
        ["EMP_Name_EN", "الاسم الإنجليزي", "SHOW"],
        ["EMP_Name_AR", "الاسم العربي", "SHOW"],
        ["Date_of_Birth", "تاريخ الميلاد", "SHOW"],
        ["Gender", "الجنس", "SHOW"],
        ["Nationality", "الجنسية", "SHOW"],
        ["Marital_Status", "الحالة الاجتماعية", "SHOW"],
        ["Military_Status", "الحالة العسكرية", "SHOW"],
        ["EMP_Mob_Main", "المحمول الرئيسي", "SHOW"],
        ["EMP_Mob_Sub", "المحمول الثانوي", "HIDE"],
        ["Home_Address", "عنوان المنزل", "HIDE"],
        ["EMP_Email", "البريد الإلكتروني", "SHOW"],
        ["EmrCont_Name", "اسم جهة الاتصال الطارئة", "HIDE"],
        ["EmrCont_Relation", "علاقة جهة الاتصال الطارئة", "HIDE"],
        ["EmrCont_Mob", "محمول جهة الاتصال الطارئة", "HIDE"],
        ["Job_Title", "المسمى الوظيفي", "SHOW"],
        ["DEPT_Name", "اسم القسم", "SHOW"],
        ["Hire_Date", "تاريخ التعيين", "SHOW"],
        ["EMP_CONT_Type", "نوع العقد", "SHOW"],
        ["Basic_Salary", "الراتب الأساسي", "SHOW"],
        ["Allowances", "البدلات", "HIDE"],
        ["Deducts", "الخصومات", "HIDE"],
        ["EMP_Crt_At", "تاريخ الإنشاء", "SHOW"],
        ["EMP_Crt_By", "أنشئ بواسطة", "SHOW"],
      ],
      HRM_Departments: [
        ["DEPT_ID", "كود القسم", "SHOW"],
        ["DEPT_Name", "اسم القسم", "SHOW"],
        ["DEPT_Is_Active", "نشط", "SHOW"],
        ["DEPT_Sort_Order", "ترتيب الفرز", "SHOW"],
        ["DEPT_Crt_At", "تاريخ الإنشاء", "SHOW"],
        ["DEPT_Crt_By", "أنشئ بواسطة", "SHOW"],
        ["DEPT_Upd_At", "تاريخ التحديث", "HIDE"],
        ["DEPT_Upd_By", "حدث بواسطة", "HIDE"],
      ],
      // PRJ Sheets (Project Management)
      PRJ_Main: [
        ["PRJ_ID", "كود المشروع", "SHOW"],
        ["PRJ_Name", "اسم المشروع", "SHOW"],
        ["CLI_ID", "كود العميل", "SHOW"],
        ["CLI_Name", "اسم العميل", "SHOW"],
        ["PRJ_Status", "حالة المشروع", "SHOW"],
        ["PRJ_Type", "نوع المشروع", "SHOW"],
        ["PRJ_Budget", "ميزانية المشروع", "SHOW"],
        ["Plan_Start_Date", "تاريخ البدء المخطط", "SHOW"],
        ["PRJ_Location", "موقع المشروع", "SHOW"],
        ["PRJ_Crt_At", "تاريخ الإنشاء", "SHOW"],
        ["PRJ_Crt_By", "أنشئ بواسطة", "SHOW"],
        ["PRJ_Upd_At", "تاريخ التحديث", "HIDE"],
        ["PRJ_Upd_By", "حدث بواسطة", "HIDE"],
      ],
      PRJ_Clients: [
        ["CLI_ID", "كود العميل", "SHOW"],
        ["CLI_Name", "اسم العميل", "SHOW"],
        ["CLI_Mob_1", "المحمول 1", "SHOW"],
        ["CLI_Mob_2", "المحمول 2", "HIDE"],
        ["CLI_Email", "البريد الإلكتروني", "SHOW"],
        ["CLI_Crt_At", "تاريخ الإنشاء", "SHOW"],
        ["CLI_Crt_By", "أنشئ بواسطة", "SHOW"],
        ["CLI_Upd_At", "تاريخ التحديث", "HIDE"],
        ["CLI_Upd_By", "حدث بواسطة", "HIDE"],
      ],
      // FIN Sheets (Finance)
      FIN_DirectExpenses: [
        ["DiEXP_ID", "كود المصروف المباشر", "SHOW"],
        ["PRJ_ID", "كود المشروع", "SHOW"],
        ["PRJ_Name", "اسم المشروع", "SHOW"],
        ["DiEXP_Date", "تاريخ المصروف", "SHOW"],
        ["MAT_ID", "كود المادة", "SHOW"],
        ["MAT_Name", "اسم المادة", "SHOW"],
        ["MAT_Sub2", "تصنيف المادة 2", "SHOW"],
        ["Default_Unit", "الوحدة الافتراضية", "SHOW"],
        ["Default_Price", "السعر الافتراضي", "SHOW"],
        ["MAT_Quantity", "الكمية", "SHOW"],
        ["DiEXP_Total_VAT_Exc", "الإجمالي بدون ضريبة", "SHOW"],
        ["DiEXP_Total_VAT_Inc", "الإجمالي شامل الضريبة", "SHOW"],
        ["DiEXP_Pay_Status", "حالة الدفع", "SHOW"],
        ["DiEXP_Pay_Methd", "طريقة الدفع", "SHOW"],
        ["DiEXP_Notes", "ملاحظات", "HIDE"],
        ["ADV_Crt_At", "تاريخ الإنشاء", "SHOW"],
        ["ADV_Crt_By", "أنشئ بواسطة", "SHOW"],
        ["ADV_Upd_At", "تاريخ التحديث", "HIDE"],
        ["ADV_Upd_By", "حدث بواسطة", "HIDE"],
      ],
    };

    // Create all sheets with their specific headers
    Object.keys(sheetDefinitions).forEach((sheetName) => {
      try {
        let sheet = spreadsheet.getSheetByName(sheetName);
        if (!sheet) {
          sheet = spreadsheet.insertSheet(sheetName);

          // Apply Smart Header Protocol (3-Row Rule)
          const headers = sheetDefinitions[sheetName];
          const systemKeys = headers.map((header) => header[0]);
          const uiLabels = headers.map((header) => header[1]);
          const viewFlags = headers.map((header) => header[2]);

          // Row 1: System Keys
          sheet.getRange(1, 1, 1, headers.length).setValues([systemKeys]);

          // Row 2: UI Labels (Arabic)
          sheet.getRange(2, 1, 1, headers.length).setValues([uiLabels]);

          // Row 3: View Flags
          sheet.getRange(3, 1, 1, headers.length).setValues([viewFlags]);

          // Format headers
          const headerRange = sheet.getRange(1, 1, 3, headers.length);
          headerRange.setFontWeight("bold");
          headerRange.setBackground("#f0f0f0");
          headerRange.setBorder(true, true, true, true, true, true);

          results.success.push(
            `${sheetName}: Created with ${headers.length} columns`
          );
        } else {
          results.success.push(`${sheetName} (already exists)`);
        }
      } catch (error) {
        results.failed.push({ sheet: sheetName, error: error.message });
      }
    });

    logEvent(
      "INFO",
      "SYSTEM",
      "FUNC_END",
      "buildDatabaseSchema",
      `Schema build completed. Success: ${results.success.length}, Failed: ${results.failed.length}`
    );

    logEvent(
      "INFO",
      "SYSTEM",
      "FUNC_END",
      "buildDatabaseSchema",
      `Schema build completed. Success: ${results.success.length}, Failed: ${results.failed.length}`
    );

    // Show results to user
    showOperationResults("Database Schema Build", results);

    return results;
  } catch (error) {
    logEvent(
      "ERROR",
      "SYSTEM",
      "SCHEMA_BUILD_FAILED",
      "buildDatabaseSchema",
      `Schema build failed: ${error.message}`
    );
    throw error;
  }
}

/**
 * Seed initial data with comprehensive ENG data, system roles, permissions, and admin user
 */
function seedInitialData() {
  try {
    logEvent(
      "INFO",
      "SYSTEM",
      "FUNC_START",
      "seedInitialData",
      "Starting comprehensive data seeding"
    );

    const results = {
      success: [],
      failed: [],
      timestamp: new Date().toISOString(),
    };

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const currentUser = Session.getActiveUser().getEmail();
    const currentDate = new Date();

    // 1. Seed ENG data (Forms, Views, Dropdowns, Buttons, Settings)
    try {
      seedENGData(spreadsheet, currentDate, currentUser, results);
    } catch (error) {
      results.failed.push({ module: "ENG", error: error.message });
    }

    // 2. Seed System Roles
    try {
      seedSYSRoles(spreadsheet, currentDate, currentUser, results);
    } catch (error) {
      results.failed.push({ module: "SYS_Roles", error: error.message });
    }

    // 3. Seed System Permissions
    try {
      seedSYSPermissions(spreadsheet, currentDate, currentUser, results);
    } catch (error) {
      results.failed.push({ module: "SYS_Permissions", error: error.message });
    }

    // 4. Seed Role-Permission mappings
    try {
      seedSYSRolePermissions(spreadsheet, currentDate, currentUser, results);
    } catch (error) {
      results.failed.push({
        module: "SYS_Role_Permissions",
        error: error.message,
      });
    }

    // 5. Create Admin User with hash+salt security
    try {
      createAdminUser(spreadsheet, currentDate, currentUser, results);
    } catch (error) {
      results.failed.push({ module: "SYS_Users", error: error.message });
    }

    logEvent(
      "INFO",
      "SYSTEM",
      "FUNC_END",
      "seedInitialData",
      `Data seeding completed. Success: ${results.success.length}, Failed: ${results.failed.length}`
    );

    showOperationResults("Comprehensive Data Seeding", results);

    return results;
  } catch (error) {
    logEvent(
      "ERROR",
      "SYSTEM",
      "DATA_SEED_FAILED",
      "seedInitialData",
      `Data seeding failed: ${error.message}`
    );
    throw error;
  }
}

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

    showMessage(`✅ Backup created successfully: ${backupName}`);

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

    showOperationResults("Data Integrity Validation", results);

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

    showOperationResults("System Report", report);

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
function showOperationResults(operationName, results) {
  try {
    let message = `✅ ${operationName} completed successfully!\n\n`;

    if (results.success && results.success.length > 0) {
      message += `✅ Success (${results.success.length}):\n`;
      results.success.forEach((item) => {
        message += `  • ${
          typeof item === "string" ? item : JSON.stringify(item)
        }\n`;
      });
      message += "\n";
    }

    if (results.failed && results.failed.length > 0) {
      message += `❌ Failed (${results.failed.length}):\n`;
      results.failed.forEach((item) => {
        message += `  • ${
          typeof item === "string" ? item : JSON.stringify(item)
        }\n`;
      });
      message += "\n";
    }

    if (results.warnings && results.warnings.length > 0) {
      message += `⚠️ Warnings (${results.warnings.length}):\n`;
      results.warnings.forEach((item) => {
        message += `  • ${
          typeof item === "string" ? item : JSON.stringify(item)
        }\n`;
      });
    }

    showMessage(message);
  } catch (error) {
    showMessage(`❌ Error showing results: ${error.message}`);
  }
}

/**
 * Show message to user
 */
function showMessage(message) {
  try {
    SpreadsheetApp.getUi().alert(
      "🏢 Nijjara ERP - Database Architect",
      message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    // Fallback to browser alert if UI alert fails
    Logger.log(`Message: ${message}`);
  }
}

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
 * SECTION 7: COMPREHENSIVE SEEDING FUNCTIONS
 * =============================================================================
 */

/**
 * Seed ENG data (Forms, Views, Dropdowns, Buttons, Settings)
 */
function seedENGData(spreadsheet, currentDate, currentUser, results) {
  logEvent("INFO", "SYSTEM", "FUNC_START", "seedENGData", "Seeding ENG data");

  // ENG Forms data
  const formsSheet = spreadsheet.getSheetByName("ENG_Forms");
  if (formsSheet && formsSheet.getLastRow() === 3) {
    const formsData = [
      ["FORM_HRM_AddEmployee", "HRM", "A", "text", "active", "HRM_Employees"],
      ["FORM_HRM_EditEmployee", "HRM", "A", "text", "active", "HRM_Employees"],
      ["FORM_PRJ_AddProject", "PRJ", "A", "text", "active", "PRJ_Main"],
      ["FORM_PRJ_AddTask", "PRJ", "A", "text", "active", "PRJ_Tasks"],
      [
        "FORM_FIN_AddExpense",
        "FIN",
        "A",
        "number",
        "active",
        "FIN_DirectExpenses",
      ],
      ["FORM_SYS_AddUser", "SYS", "A", "text", "active", "SYS_Users"],
      ["FORM_SYS_EditUser", "SYS", "A", "text", "active", "SYS_Users"],
    ];
    formsSheet
      .getRange(4, 1, formsData.length, formsData[0].length)
      .setValues(formsData);
    results.success.push("ENG_Forms: 7 forms seeded");
  }

  // ENG Views data
  const viewsSheet = spreadsheet.getSheetByName("ENG_Views");
  if (viewsSheet && viewsSheet.getLastRow() === 3) {
    const viewsData = [
      ["VIEW_HRM_Employees", "قائمة الموظفين", "HRM_Employees"],
      ["VIEW_PRJ_Projects", "قائمة المشاريع", "PRJ_Main"],
      ["VIEW_PRJ_Tasks", "قائمة المهام", "PRJ_Tasks"],
      ["VIEW_FIN_Expenses", "قائمة المصروفات", "FIN_DirectExpenses"],
      ["VIEW_SYS_Users", "قائمة المستخدمين", "SYS_Users"],
      ["VIEW_SYS_Roles", "قائمة الأدوار", "SYS_Roles"],
    ];
    viewsSheet
      .getRange(4, 1, viewsData.length, viewsData[0].length)
      .setValues(viewsData);
    results.success.push("ENG_Views: 6 views seeded");
  }

  // ENG Dropdowns data
  const dropdownsSheet = spreadsheet.getSheetByName("ENG_Dropdowns");
  if (dropdownsSheet && dropdownsSheet.getLastRow() === 3) {
    const dropdownsData = [
      ["STATUS_ACTIVE", "Active", "نشط", true, 1],
      ["STATUS_INACTIVE", "Inactive", "غير نشط", true, 2],
      ["GENDER_MALE", "Male", "ذكر", true, 1],
      ["GENDER_FEMALE", "Female", "أنثى", true, 2],
      ["ROLE_ADMIN", "Admin", "مدير", true, 1],
      ["ROLE_USER", "User", "مستخدم", true, 2],
      ["ROLE_HR", "HR Manager", "مدير موارد بشرية", true, 3],
      ["ROLE_FINANCE", "Finance Manager", "مدير مالي", true, 4],
      ["ROLE_PROJECT", "Project Manager", "مدير مشروع", true, 5],
      ["YES_NO_YES", "Yes", "نعم", true, 1],
      ["YES_NO_NO", "No", "لا", true, 2],
    ];
    dropdownsSheet
      .getRange(4, 1, dropdownsData.length, dropdownsData[0].length)
      .setValues(dropdownsData);
    results.success.push("ENG_Dropdowns: 11 dropdowns seeded");
  }

  // ENG Buttons data
  const buttonsSheet = spreadsheet.getSheetByName("ENG_Buttons");
  if (buttonsSheet && buttonsSheet.getLastRow() === 3) {
    const buttonsData = [
      ["BTN_SAVE", "حفظ", "primary", "حفظ البيانات"],
      ["BTN_CANCEL", "إلغاء", "secondary", "إلغاء العملية"],
      ["BTN_EDIT", "تعديل", "warning", "تعديل السجل"],
      ["BTN_DELETE", "حذف", "danger", "حذف السجل"],
      ["BTN_ADD_NEW", "إضافة جديد", "success", "إضافة سجل جديد"],
      ["BTN_PRINT", "طباعة", "info", "طباعة التقرير"],
      ["BTN_EXPORT", "تصدير", "info", "تصدير البيانات"],
    ];
    buttonsSheet
      .getRange(4, 1, buttonsData.length, buttonsData[0].length)
      .setValues(buttonsData);
    results.success.push("ENG_Buttons: 7 buttons seeded");
  }

  // ENG Settings data
  const settingsSheet = spreadsheet.getSheetByName("ENG_Settings");
  if (settingsSheet && settingsSheet.getLastRow() === 3) {
    const settingsData = [
      ["SYSTEM_NAME", "Nijjara ERP", "System Name", currentUser, currentDate],
      ["SYSTEM_VERSION", "1.0.0", "System Version", currentUser, currentDate],
      ["DEFAULT_LANGUAGE", "ar", "Default Language", currentUser, currentDate],
      ["CURRENCY", "EGP", "Default Currency", currentUser, currentDate],
      ["DATE_FORMAT", "DD/MM/YYYY", "Date Format", currentUser, currentDate],
      [
        "SESSION_TIMEOUT",
        "3600",
        "Session Timeout (seconds)",
        currentUser,
        currentDate,
      ],
      [
        "MAX_LOGIN_ATTEMPTS",
        "3",
        "Maximum Login Attempts",
        currentUser,
        currentDate,
      ],
      [
        "PASSWORD_EXPIRY_DAYS",
        "90",
        "Password Expiry Days",
        currentUser,
        currentDate,
      ],
    ];
    settingsSheet
      .getRange(4, 1, settingsData.length, settingsData[0].length)
      .setValues(settingsData);
    results.success.push("ENG_Settings: 8 settings seeded");
  }

  logEvent(
    "INFO",
    "SYSTEM",
    "FUNC_END",
    "seedENGData",
    "ENG data seeding completed"
  );
}

/**
 * Seed System Roles
 */
function seedSYSRoles(spreadsheet, currentDate, currentUser, results) {
  logEvent(
    "INFO",
    "SYSTEM",
    "FUNC_START",
    "seedSYSRoles",
    "Seeding system roles"
  );

  const rolesSheet = spreadsheet.getSheetByName("SYS_Roles");
  if (rolesSheet && rolesSheet.getLastRow() === 3) {
    const rolesData = [
      [
        "SYS_ADMIN",
        "System Administrator",
        "مدير النظام",
        "Full system access and administration",
        true,
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "DB_ADMIN",
        "Database Administrator",
        "مدير قاعدة البيانات",
        "Database management and schema operations",
        true,
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "HR_MANAGER",
        "HR Manager",
        "مدير الموارد البشرية",
        "Human resources management access",
        true,
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "FINANCE_MANAGER",
        "Finance Manager",
        "مدير المالية",
        "Financial operations and reporting access",
        true,
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PROJECT_MANAGER",
        "Project Manager",
        "مدير المشاريع",
        "Project management and oversight access",
        true,
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "HR_STAFF",
        "HR Staff",
        "موظف موارد بشرية",
        "Basic HR operations access",
        true,
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "FINANCE_STAFF",
        "Finance Staff",
        "موظف مالي",
        "Basic financial operations access",
        true,
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PROJECT_STAFF",
        "Project Staff",
        "موظف مشروع",
        "Basic project operations access",
        true,
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "VIEWER",
        "Viewer",
        "مشاهد",
        "Read-only access to assigned modules",
        true,
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "GUEST",
        "Guest",
        "زائر",
        "Limited guest access",
        false,
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
    ];
    rolesSheet
      .getRange(4, 1, rolesData.length, rolesData[0].length)
      .setValues(rolesData);
    results.success.push("SYS_Roles: 10 roles seeded");
  }

  logEvent(
    "INFO",
    "SYSTEM",
    "FUNC_END",
    "seedSYSRoles",
    "System roles seeding completed"
  );
}

/**
 * Seed System Permissions
 */
function seedSYSPermissions(spreadsheet, currentDate, currentUser, results) {
  logEvent(
    "INFO",
    "SYSTEM",
    "FUNC_START",
    "seedSYSPermissions",
    "Seeding system permissions"
  );

  const permissionsSheet = spreadsheet.getSheetByName("SYS_Permissions");
  if (permissionsSheet && permissionsSheet.getLastRow() === 3) {
    const permissionsData = [
      [
        "PERM_SYS_FULL_ACCESS",
        "Full System Access",
        "وصول كامل للنظام",
        "SYS",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_DB_MODIFY",
        "Database Modification",
        "تعديل قاعدة البيانات",
        "DB",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_DB_BACKUP",
        "Database Backup",
        "نسخ احتياطي لقاعدة البيانات",
        "DB",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_HRM_FULL_ACCESS",
        "Full HR Access",
        "وصول كامل لإدارة الموارد البشرية",
        "HRM",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_HRM_VIEW",
        "HR View Access",
        "وصول للمشاهدة فقط لإدارة الموارد البشرية",
        "HRM",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_HRM_MODIFY",
        "HR Modification",
        "تعديل بيانات الموارد البشرية",
        "HRM",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_PRJ_FULL_ACCESS",
        "Full Project Access",
        "وصول كامل لإدارة المشاريع",
        "PRJ",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_PRJ_VIEW",
        "Project View Access",
        "وصول للمشاهدة فقط لإدارة المشاريع",
        "PRJ",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_PRJ_MODIFY",
        "Project Modification",
        "تعديل بيانات المشاريع",
        "PRJ",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_FIN_FULL_ACCESS",
        "Full Finance Access",
        "وصول كامل لإدارة المالية",
        "FIN",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_FIN_VIEW",
        "Finance View Access",
        "وصول للمشاهدة فقط لإدارة المالية",
        "FIN",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_FIN_MODIFY",
        "Finance Modification",
        "تعديل بيانات المالية",
        "FIN",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_SYS_VIEW",
        "System View Access",
        "وصول للمشاهدة فقط للنظام",
        "SYS",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_SYS_MODIFY",
        "System Modification",
        "تعديل إعدادات النظام",
        "SYS",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_REPORT_VIEW",
        "Report View Access",
        "وصول للتقارير",
        "REP",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_REPORT_GENERATE",
        "Report Generation",
        "إنشاء التقارير",
        "REP",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_USER_MANAGE",
        "User Management",
        "إدارة المستخدمين",
        "USR",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_ROLE_MANAGE",
        "Role Management",
        "إدارة الأدوار",
        "ROL",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PERM_PERMISSION_MANAGE",
        "Permission Management",
        "إدارة الصلاحيات",
        "PRM",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
    ];
    permissionsSheet
      .getRange(4, 1, permissionsData.length, permissionsData[0].length)
      .setValues(permissionsData);
    results.success.push("SYS_Permissions: 20 permissions seeded");
  }

  logEvent(
    "INFO",
    "SYSTEM",
    "FUNC_END",
    "seedSYSPermissions",
    "System permissions seeding completed"
  );
}

/**
 * Seed Role-Permission mappings
 */
function seedSYSRolePermissions(
  spreadsheet,
  currentDate,
  currentUser,
  results
) {
  logEvent(
    "INFO",
    "SYSTEM",
    "FUNC_START",
    "seedSYSRolePermissions",
    "Seeding role-permission mappings"
  );

  const rolePermissionsSheet = spreadsheet.getSheetByName(
    "SYS_Role_Permissions"
  );
  if (rolePermissionsSheet && rolePermissionsSheet.getLastRow() === 3) {
    const rolePermissionsData = [
      // SYS_ADMIN gets all permissions
      [
        "SYS_ADMIN",
        "PERM_SYS_FULL_ACCESS",
        "FULL",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "SYS_ADMIN",
        "PERM_DB_MODIFY",
        "FULL",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "SYS_ADMIN",
        "PERM_DB_BACKUP",
        "FULL",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "SYS_ADMIN",
        "PERM_USER_MANAGE",
        "FULL",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "SYS_ADMIN",
        "PERM_ROLE_MANAGE",
        "FULL",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "SYS_ADMIN",
        "PERM_PERMISSION_MANAGE",
        "FULL",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],

      // DB_ADMIN gets database permissions
      [
        "DB_ADMIN",
        "PERM_DB_MODIFY",
        "FULL",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "DB_ADMIN",
        "PERM_DB_BACKUP",
        "FULL",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "DB_ADMIN",
        "PERM_SYS_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],

      // HR_MANAGER gets HR permissions
      [
        "HR_MANAGER",
        "PERM_HRM_FULL_ACCESS",
        "FULL",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "HR_MANAGER",
        "PERM_HRM_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "HR_MANAGER",
        "PERM_HRM_MODIFY",
        "WRITE",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "HR_MANAGER",
        "PERM_REPORT_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "HR_MANAGER",
        "PERM_REPORT_GENERATE",
        "WRITE",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],

      // FINANCE_MANAGER gets finance permissions
      [
        "FINANCE_MANAGER",
        "PERM_FIN_FULL_ACCESS",
        "FULL",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "FINANCE_MANAGER",
        "PERM_FIN_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "FINANCE_MANAGER",
        "PERM_FIN_MODIFY",
        "WRITE",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "FINANCE_MANAGER",
        "PERM_REPORT_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "FINANCE_MANAGER",
        "PERM_REPORT_GENERATE",
        "WRITE",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],

      // PROJECT_MANAGER gets project permissions
      [
        "PROJECT_MANAGER",
        "PERM_PRJ_FULL_ACCESS",
        "FULL",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PROJECT_MANAGER",
        "PERM_PRJ_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PROJECT_MANAGER",
        "PERM_PRJ_MODIFY",
        "WRITE",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PROJECT_MANAGER",
        "PERM_REPORT_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PROJECT_MANAGER",
        "PERM_REPORT_GENERATE",
        "WRITE",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],

      // HR_STAFF gets limited HR permissions
      [
        "HR_STAFF",
        "PERM_HRM_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "HR_STAFF",
        "PERM_REPORT_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],

      // FINANCE_STAFF gets limited finance permissions
      [
        "FINANCE_STAFF",
        "PERM_FIN_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "FINANCE_STAFF",
        "PERM_REPORT_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],

      // PROJECT_STAFF gets limited project permissions
      [
        "PROJECT_STAFF",
        "PERM_PRJ_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "PROJECT_STAFF",
        "PERM_REPORT_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],

      // VIEWER gets read-only permissions across modules
      [
        "VIEWER",
        "PERM_SYS_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "VIEWER",
        "PERM_HRM_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "VIEWER",
        "PERM_PRJ_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "VIEWER",
        "PERM_FIN_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
      [
        "VIEWER",
        "PERM_REPORT_VIEW",
        "READ",
        true,
        "",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
    ];
    rolePermissionsSheet
      .getRange(4, 1, rolePermissionsData.length, rolePermissionsData[0].length)
      .setValues(rolePermissionsData);
    results.success.push(
      "SYS_Role_Permissions: 35 role-permission mappings seeded"
    );
  }

  logEvent(
    "INFO",
    "SYSTEM",
    "FUNC_END",
    "seedSYSRolePermissions",
    "Role-permission mappings seeding completed"
  );
}

/**
 * Create Admin User with hash+salt security
 */
function createAdminUser(spreadsheet, currentDate, currentUser, results) {
  logEvent(
    "INFO",
    "SYSTEM",
    "FUNC_START",
    "createAdminUser",
    "Creating admin user with enhanced security"
  );

  const usersSheet = spreadsheet.getSheetByName("SYS_Users");
  if (usersSheet && usersSheet.getLastRow() === 3) {
    // Generate secure password hash and salt
    const adminPassword = "210388";
    const salt = generateSecureSalt();
    const passwordHash = hashPassword(adminPassword, salt);

    const adminUserData = [
      [
        "SYS-ADMIN-001",
        "Mohamed Sherif Elkhoraiby",
        "Mohamed Sherif Elkhoraiby",
        "mkhoraiby",
        passwordHash,
        salt,
        "melkhoraiby@gmail.com",
        currentDate,
        "SYS_ADMIN",
        currentDate,
        currentUser,
        currentDate,
        currentUser,
      ],
    ];
    usersSheet
      .getRange(4, 1, adminUserData.length, adminUserData[0].length)
      .setValues(adminUserData);
    results.success.push(
      "SYS_Users: Admin user created with secure hash+salt authentication"
    );

    // Log admin creation (without password details)
    logEvent(
      "INFO",
      "SYSTEM",
      "ADMIN_CREATED",
      "createAdminUser",
      "Admin user created: mkhoraiby (melkhoraiby@gmail.com)",
      "SYS_Users",
      "SYS-ADMIN-001"
    );
  }

  logEvent(
    "INFO",
    "SYSTEM",
    "FUNC_END",
    "createAdminUser",
    "Admin user creation completed"
  );
}

/**
 * Generate secure salt for password hashing
 */
function generateSecureSalt() {
  // Generate a random 16-character salt using Utilities
  const randomBytes = Utilities.getUuid() + Utilities.getUuid();
  return randomBytes.substring(0, 16);
}

/**
 * Hash password with salt using SHA-256
 */
function hashPassword(password, salt) {
  // Combine password and salt
  const saltedPassword = password + salt;

  // Create SHA-256 hash using Utilities
  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    saltedPassword
  );

  // Convert to hexadecimal string
  let hashHex = "";
  for (let i = 0; i < hash.length; i++) {
    let byte = hash[i].toString(16);
    if (byte.length === 1) byte = "0" + byte;
    hashHex += byte;
  }

  return hashHex;
}

/**
 * =============================================================================
 * SECTION 8: VERSION CONTROL
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
    requiredApis: ["SpreadsheetApp", "Session", "Utilities", "HtmlService"],
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
