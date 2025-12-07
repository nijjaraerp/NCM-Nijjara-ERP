# NCM-Nijjara-ERP Deployment Instructions

## 🚀 Quick Deployment Steps

### 1. **Deploy to Google Apps Script**

```bash
# Make sure you have clasp installed
npm install -g @google/clasp

# Login to your Google account
clasp login

# Deploy the code
clasp push
```

### 2. **Manual Deployment (Alternative)**

1. **Open Google Apps Script Editor:**
   - Go to https://script.google.com
   - Open your NCM-Nijjara-ERP project (ID: 16YtHjH0MrKGNfSBqbuhFYaaV79-31U_jHTLCiKzWveQ8JE63NurGlNvj)

2. **Copy Code Files:**
   - Copy the entire contents of `src/backend/Code.js` to a new file called `Code.gs`
   - Copy the entire contents of `src/tools/Setup.js` to a new file called `Setup.gs`

3. **Save and Refresh:**
   - Save all files
   - Refresh your Google Sheets document

### 3. **Verify Menu Appearance**

After deployment, you should see the **"🏢 Nijjara ERP"** menu in your Google Sheets toolbar.

## 🔧 Troubleshooting

### **Menu Not Appearing?**

1. **Check for Errors:**
   - Open Apps Script editor (Extensions → Apps Script)
   - Look for error messages in the execution log

2. **Force Refresh:**
   ```javascript
   // Run this in Apps Script editor
   function testMenu() {
     onOpen();
   }
   ```

3. **Check Permissions:**
   - Ensure you have edit permissions on the spreadsheet
   - Verify the Apps Script project is properly linked

### **Common Issues:**

- **Syntax Errors:** Check for red underline errors in Apps Script editor
- **Permission Errors:** Ensure proper OAuth scopes are authorized
- **Function Conflicts:** Make sure no duplicate function names exist

## 📋 Post-Deployment Checklist

- [ ] Menu "🏢 Nijjara ERP" appears in toolbar
- [ ] Clicking menu items opens sidebar
- [ ] Sidebar buttons work without errors
- [ ] Database operations complete successfully
- [ ] Logging appears in DBUG sheets

## 🎯 Next Steps

1. **Test Basic Operations:**
   - Click "بناء مخطط قاعدة البيانات" (Build Database Schema)
   - Verify sheets are created with proper headers

2. **Test Data Operations:**
   - Use "تهيئة البيانات الافتراضية" (Seed Initial Data)
   - Check that sample data is added correctly

3. **Test Validation:**
   - Run "فحص سلامة البيانات" (Validate Data Integrity)
   - Ensure all sheets pass validation

## 📞 Support

If you encounter issues:
1. Check the Apps Script execution logs
2. Verify the Google Sheet ID is correct: `1DhWqZ99axEgs7i4QQM1DP9_kLWKdez-IhhssYizaDdM`
3. Ensure the Apps Script ID matches: `16YtHjH0MrKGNfSBqbuhFYaaV79-31U_jHTLCiKzWveQ8JE63NurGlNvj`

## ✅ Success Indicators

- **Menu Visible:** 🏢 Nijjara ERP menu appears in toolbar
- **Sidebar Opens:** Clicking menu items shows the database architect interface
- **Operations Work:** All database functions execute without errors
- **Arabic UI:** All interface elements display in Arabic as expected
- **Smart Headers:** Sheets created with proper 3-row header structure