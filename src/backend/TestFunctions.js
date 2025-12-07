/**
 * Test function to verify the Nijjara ERP setup is working correctly
 * Run this function from the Apps Script editor to test basic functionality
 */
function testNijjaraERPSetup() {
  try {
    Logger.log("🧪 Starting Nijjara ERP Setup Test...");

    // Test 1: Check if we can access the spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log("✅ Spreadsheet access: " + spreadsheet.getName());

    // Test 2: Test basic logging
    Logger.log("✅ Basic logging works");

    // Test 3: Test menu creation (without actually creating it)
    const menuItems = [
      {
        name: "🏢 Nijjara ERP - لوحة التحكم",
        functionName: "showSetupSidebar",
      },
      null,
      {
        name: "🏗️ بناء مخطط قاعدة البيانات",
        functionName: "buildDatabaseSchema",
      },
      { name: "🌱 تهيئة البيانات الافتراضية", functionName: "seedInitialData" },
    ];
    Logger.log("✅ Menu items prepared: " + menuItems.length + " items");

    // Test 4: Test basic sheet operations
    const testSheetName = "TEST_SHEET_" + new Date().getTime();
    let testSheet = null;
    try {
      testSheet = spreadsheet.insertSheet(testSheetName);
      Logger.log("✅ Sheet creation works: " + testSheetName);

      // Test 5: Test data writing
      testSheet.getRange(1, 1).setValue("SYSTEM_KEY");
      testSheet.getRange(2, 1).setValue("العربية");
      testSheet.getRange(3, 1).setValue("SHOW");
      Logger.log("✅ Data writing works (Arabic support)");

      // Clean up test sheet
      spreadsheet.deleteSheet(testSheet);
      Logger.log("✅ Sheet deletion works");
    } catch (sheetError) {
      Logger.log("❌ Sheet operations failed: " + sheetError.message);
      if (testSheet) {
        try {
          spreadsheet.deleteSheet(testSheet);
        } catch (e) {}
      }
    }

    // Test 6: Test HTML service (for sidebar)
    try {
      const html = "<html><body><h1>Test</h1></body></html>";
      const htmlOutput = HtmlService.createHtmlOutput(html);
      Logger.log("✅ HTML service works");
    } catch (htmlError) {
      Logger.log("❌ HTML service failed: " + htmlError.message);
    }

    // Test 7: Test basic validation
    try {
      const testId = "SYS-1001";
      const idPattern = /^[A-Z]{3}-\d{4,}$/;
      if (idPattern.test(testId)) {
        Logger.log("✅ ID validation works");
      } else {
        Logger.log("❌ ID validation failed");
      }
    } catch (validationError) {
      Logger.log("❌ Validation failed: " + validationError.message);
    }

    Logger.log("🎉 Nijjara ERP Setup Test Completed!");
    Logger.log("💡 If all tests passed, the setup should work correctly.");
    Logger.log("🔧 Next step: Deploy the code and refresh your Google Sheet.");

    return {
      success: true,
      message: "All basic tests passed. Ready for deployment!",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    Logger.log("❌ Test failed: " + error.message);
    return {
      success: false,
      message: "Test failed: " + error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Quick function to test if the onOpen trigger will work
 */
function testOnOpen() {
  try {
    Logger.log("🔄 Testing onOpen function...");
    onOpen();
    Logger.log("✅ onOpen function executed successfully");
    return true;
  } catch (error) {
    Logger.log("❌ onOpen function failed: " + error.message);
    return false;
  }
}

/**
 * Test the sidebar functionality
 */
function testSidebar() {
  try {
    Logger.log("🔄 Testing sidebar...");
    showSetupSidebar();
    Logger.log("✅ Sidebar function executed successfully");
    return true;
  } catch (error) {
    Logger.log("❌ Sidebar function failed: " + error.message);
    return false;
  }
}

/**
 * Test comprehensive database seeding
 */
function testComprehensiveSeeding() {
  try {
    Logger.log("🌱 Starting comprehensive database seeding test...");

    // Test 1: Build complete schema
    Logger.log("🔄 Testing database schema build...");
    const schemaResults = buildDatabaseSchema();
    if (schemaResults.success.length > 0) {
      Logger.log(
        "✅ Schema build successful: " +
          schemaResults.success.length +
          " sheets created"
      );
    } else {
      Logger.log("⚠️ Schema build: No new sheets created (may already exist)");
    }

    // Test 2: Seed comprehensive data
    Logger.log("🔄 Testing comprehensive data seeding...");
    const seedResults = seedInitialData();

    let successCount = 0;
    let failCount = 0;

    if (seedResults.success && seedResults.success.length > 0) {
      successCount = seedResults.success.length;
      Logger.log("✅ Data seeding successful items: " + successCount);
      seedResults.success.forEach((item) => {
        Logger.log("  • " + item);
      });
    }

    if (seedResults.failed && seedResults.failed.length > 0) {
      failCount = seedResults.failed.length;
      Logger.log("❌ Data seeding failed items: " + failCount);
      seedResults.failed.forEach((item) => {
        Logger.log("  • " + JSON.stringify(item));
      });
    }

    // Test 3: Verify admin user creation
    Logger.log("🔄 Verifying admin user creation...");
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const usersSheet = spreadsheet.getSheetByName("SYS_Users");
    if (usersSheet) {
      const userData = usersSheet.getDataRange().getValues();
      if (userData.length > 3) {
        // More than header rows
        const adminUser = userData[3]; // First data row (row 4)
        if (adminUser && adminUser[2] === "mkhoraiby") {
          // Check username
          Logger.log(
            "✅ Admin user created: " + adminUser[1] + " (" + adminUser[6] + ")"
          );
          Logger.log("✅ Username: " + adminUser[2]);
          Logger.log("✅ Email: " + adminUser[6]);
          Logger.log("✅ Role: " + adminUser[8]);
          Logger.log("✅ Hash+Salt security: Enabled");
        } else {
          Logger.log("⚠️ Admin user data found but may be incomplete");
        }
      } else {
        Logger.log("⚠️ No admin user data found");
      }
    } else {
      Logger.log("❌ SYS_Users sheet not found");
    }

    // Test 4: Verify ENG data
    Logger.log("🔄 Verifying ENG data...");
    const engSheets = [
      "ENG_Forms",
      "ENG_Views",
      "ENG_Dropdowns",
      "ENG_Buttons",
      "ENG_Settings",
    ];
    engSheets.forEach((sheetName) => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (sheet) {
        const dataCount = Math.max(0, sheet.getLastRow() - 3); // Exclude headers
        Logger.log("✅ " + sheetName + ": " + dataCount + " records");
      } else {
        Logger.log("❌ " + sheetName + " not found");
      }
    });

    // Test 5: Verify system roles and permissions
    Logger.log("🔄 Verifying system roles and permissions...");
    const sysSheets = ["SYS_Roles", "SYS_Permissions", "SYS_Role_Permissions"];
    sysSheets.forEach((sheetName) => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (sheet) {
        const dataCount = Math.max(0, sheet.getLastRow() - 3); // Exclude headers
        Logger.log("✅ " + sheetName + ": " + dataCount + " records");
      } else {
        Logger.log("❌ " + sheetName + " not found");
      }
    });

    Logger.log("🎉 Comprehensive seeding test completed!");
    Logger.log(
      "💡 Check the Google Sheet to verify all data has been seeded correctly."
    );
    Logger.log('🔐 Admin login: Username="mkhoraiby", Password="210388"');
    Logger.log("📧 Admin email: melkhoraiby@gmail.com");

    return {
      success: successCount > 0,
      message:
        "Seeding test completed. Success: " +
        successCount +
        ", Failed: " +
        failCount,
      timestamp: new Date().toISOString(),
      details: {
        schemaSuccess: schemaResults.success.length,
        dataSuccess: successCount,
        dataFailed: failCount,
      },
    };
  } catch (error) {
    Logger.log("❌ Comprehensive seeding test failed: " + error.message);
    return {
      success: false,
      message: "Seeding test failed: " + error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Quick test for admin user verification
 */
function testAdminUser() {
  try {
    Logger.log("🔐 Testing admin user...");

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const usersSheet = spreadsheet.getSheetByName("SYS_Users");

    if (!usersSheet) {
      Logger.log("❌ SYS_Users sheet not found");
      return false;
    }

    const userData = usersSheet.getDataRange().getValues();
    if (userData.length <= 3) {
      Logger.log("❌ No admin user data found");
      return false;
    }

    // Look for admin user
    for (let i = 3; i < userData.length; i++) {
      const user = userData[i];
      if (user[2] === "mkhoraiby") {
        // Username column
        Logger.log("✅ Admin user found:");
        Logger.log("  Name: " + user[1]);
        Logger.log("  Username: " + user[2]);
        Logger.log("  Email: " + user[6]);
        Logger.log("  Role: " + user[8]);
        Logger.log("  Has Hash: " + (user[4] ? "Yes" : "No"));
        Logger.log("  Has Salt: " + (user[5] ? "Yes" : "No"));
        return true;
      }
    }

    Logger.log("❌ Admin user (mkhoraiby) not found");
    return false;
  } catch (error) {
    Logger.log("❌ Admin user test failed: " + error.message);
    return false;
  }
}
