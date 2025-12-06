- WALK-THROUGH EXAMPLE 1  
  - This example illustrates a full, realistic user interaction with the system, showing how ENG_ sheets, setup.js, and the Google Sheet database collaborate to create screens, forms, validation, saving, views, and audit logs.  
  - Scenario: HR Officer logs in → Views Employees → Adds New Employee → System Saves Data → Views Updated Table  

- 6.1 USER LOGS IN  
  - User opens system URL and sees Login.html.  
  - Inputs username and password.  
  - Backend verifies credentials against SYS_Users, checking password hash, user activity, and role assignment.  
  - If valid, generates session token, writes session row, and returns BOOTSTRAP_OBJECT containing allowed forms, views, buttons, dropdowns, user role, permissions, and Arabic UI labels.  
  - Frontend builds UI and loads dashboard in Arabic.  

- 6.2 USER NAVIGATES TO HR → Employees  
  - User clicks on الموارد البشرية → الموظفين.  
  - SPA framework checks ENG_Views for HRM_EMP_LIST, sourcing HRM_Employees sheet and specific columns.  
  - Backend reads HRM_Employees data.  
  - UI dynamically builds a grid displaying Arabic column headers and employee data.  

- 6.3 USER CLICKS “إضافة موظف جديد”  
  - "Add Employee" button defined in ENG_Buttons (BTN_ID: HRM_EMP_ADD).  
  - Form structure defined in ENG_Forms (FORM_ID: HRM_EMP_ADD_FORM).  
  - Popup form loads with tabs and fields dynamically retrieved from ENG_Forms.  

- 6.4 USER FILLS THE FORM  
  - User enters employee details such as name, job title, department, email, mobile, hire date, and salary.  

- 6.5 USER CLICKS حفظ  
  - Backend reads form fields and validates mandatory fields, types, and dropdowns.  
  - Generates next employee ID by incrementing last EMP_ID.  
  - Appends new row to HRM_Employees with entered data and timestamps.  
  - Writes audit log entry recording the addition.  
  - Returns success status; frontend displays confirmation toast.  

- 6.6 UI AUTO-REFRESHES EMPLOYEE TABLE  
  - Frontend reloads HRM_EMP_LIST view.  
  - System reads updated HRM_Employees data and displays the new employee.  

- 6.7 USER CLICKS ON EMPLOYEE TO VIEW DETAILS  
  - Popup generated from ENG_Forms (HRM_EMP_VIEW_FORM).  
  - Fields like department, salary, and job title are read-only.  
  - Edit button appears if user role permits.  

- 6.8 USER UPDATES EMPLOYEE (EDIT)  
  - Example: Salary updated from 15000 to 17000.  
  - Backend checks permissions, updates HRM_Employees row, and logs the update in SYS_Audit_Log.  

- 6.9 SESSION END  
  - On logout, system updates session end time, revokes token, and clears browser storage.  

- WALK-THROUGH EXAMPLE 2  
  - Demonstrates user interaction lifecycle and how Engine tabs control experience.  

- 7.1 The Login Handshake  
  - User inputs credentials validated by frontend.  
  - Frontend sends LOGIN_REQUEST to backend.  
  - Backend authenticates user by querying SYS_Users, verifying password, and checking active status.  
  - Creates session record and logs event.  
  - Builds permission map from roles and permissions.  
  - Sends session token, user profile, and permission map to frontend.  
  - Frontend stores token and unlocks allowed modules.  

- 7.2 Loading a Module (The View Engine)  
  - User clicks "الموظفين" (Employees).  
  - Frontend requests view metadata for HRM_Employees.  
  - Backend reads ENG_Views and ENG_Buttons for source sheet and allowed actions.  
  - Retrieves data applying smart header protocol.  
  - Returns JSON with table headers, filtered data rows, and action buttons.  
  - Frontend renders dynamic table without hard-coded columns.  

- 7.3 Data Entry (The Form Engine - Smart Engine V2)  
  - User clicks "Add New Employee".  
  - Frontend requests form schema for FORM_HRM_Emp.  
  - Backend queries ENG_Forms for field definitions and labels, including dropdown options from ENG_Dropdowns.  
  - Returns complete form definition with labels, types, validation, and smart state flags.  
  - Frontend generates modal with tabs and inputs per field type and smart state.  
  - User submits form; frontend validates locally and sends data to backend.  
  - Backend maps fields to master sheet columns and writes data to HRM_Employees.  
  - Logs creation in SYS_Audit_Log and technical success in DBUG_AppLog.  

- 7.3.1 Edit Mode Intelligence  
  - System detects if form is in Add or Edit mode.  
  - In Add mode, all fields are writable, ignoring locked-on-edit flags.  

- END OF WALK-THROUGH EXAMPLES 1 & 2