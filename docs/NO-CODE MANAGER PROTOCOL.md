================================================================================
NO-CODE MANAGER PROTOCOL (NCM-PRO V1.0)
================================================================================
Purpose:

---

A universal protocol that defines how an AI system or developer can build,
modify, extend, or maintain the ERP purely through declarative instructions,
metadata, and structured descriptions—without writing manual code unless
explicitly required.

This protocol establishes a strict contract between:

1. The human operator (Instruction Giver)
2. The AI Model (Executor)
3. The ERP Smart Engine V2 (Metadata Interpreter)
4. The Google Sheets Database (ERP Schema)
5. The Frontend/Backend Runtime (Code.gs / Setup.js / Dashboard.html)

================================================================================
SECTION 1.0 — CORE PRINCIPLES
================================================================================

## 1.1 Declarative, Not Imperative

You NEVER describe code directly unless explicitly needed.  
You describe **WHAT you want**, the system decides **HOW to build it**.

## 1.2 Metadata First

All forms, views, permissions, buttons, workflows, menus, and validation rules
are defined through metadata in the "ENG\_\*" tabs.  
The ERP auto-generates UI, backend operations, validation, and data bindings.

## 1.3 Three-Layer Separation

L1 — No-Code Instructions (Your words)  
L2 — Smart Engine Metadata (ENG_Settings, ENG_Forms, ENG_Views, ENG_Dropdowns…)  
L3 — Runtime Execution (Apps Script + HTML)

## 1.4 Everything Is an Object

Forms, Fields, Views, Buttons, Actions, Workflows, Validations, Permissions.

## 1.5 Human-Readable, Machine-Executable

Every instruction must be:

- Simple enough for a human to write
- Structured enough for AI to convert into metadata
- Precise enough for the ERP Engine to execute

================================================================================
SECTION 2.0 — NCM (NO-CODE MANAGER) COMMAND STRUCTURE
================================================================================

Each request MUST follow this general structure when talking to AI:
[DESCRIPTION]:

What the object is supposed to do

Where it appears

What data it links to

What the user experience should be

Any validation or automation rules

[CONSTRAINTS]:

Required fields

Business rules

Allowed roles

Examples:

NCM_ACTION: Create
TARGET_OBJECT: Form
OBJECT_ID: FORM_HRM_AddEmployee

DESCRIPTION:
A form that adds new employees into HRM_Employees table.
Fields include: Full_Name, Job_Title, Salary, Phone.
Field Salary must be numeric only.
Only HR Manager can access.

CONSTRAINTS:

Auto-fill Created_At, Created_By

Validate Phone is 11 digits

The AI transforms this into:

- ENG_Settings
- ENG_Forms metadata
- ENG_Buttons (Auto)
- ENG_Views (Optional)
- Setup.js schema (If new fields)
- Validation schemas
- Functional code blocks in Code.gs

================================================================================
SECTION 3.0 — OBJECT TYPES UNDER NCM
================================================================================

## 3.1 FORMS

Each form is defined by metadata:

- Form_ID
- Table_Name
- Fields[]
- Required[]
- Data_Types[]
- Default Values
- Validation Rules
- UI Positioning
- Associated Buttons (Save, Cancel, Custom Actions)

  3.2 VIEWS

---

Views define what data the user sees:

- View_ID
- Table
- Columns[]
- Filters
- Sorting Rules
- Permission Groups

  3.3 BUTTONS

---

Each button has:

- Button_ID
- Action Type (Save, Delete, Run_Workflow, Open_Form, JS_Action)
- Target_Object
- Visibility Rules
- Role Permissions

  3.4 WORKFLOWS

---

A workflow = a sequence of automated steps:

- On_Form_Submit
- On_Row_Update
- On_Delete
- On_Status_Change
  Examples:
- Auto-generate PRJ numbers
- Auto-calc net salary
- Auto-issue notifications

  3.5 PERMISSIONS

---

Role-based rules:

- Which forms/views they can access
- What buttons are visible
- Which fields are editable/read-only

  3.6 VALIDATIONS

---

Rules applied automatically by the Engine:

- Required fields
- Regex
- Range validation
- Cross-field logic  
  Example: (End_Date > Start_Date)

================================================================================
SECTION 4.0 — NCM EXECUTION PIPELINE (AI MUST FOLLOW)
================================================================================

Whenever the user gives an instruction, AI must execute the following pipeline:

## 4.1 INTERPRET

Understand intention → Classify object type → Determine module (SYS/HRM/PRJ/FIN)

## 4.2 TRANSLATE INTO METADATA

AI generates the exact metadata rows for the ENG tabs:

- ENG_Settings
- ENG_Forms
- ENG_Views
- ENG_Dropdowns
- ENG_Buttons

  4.3 UPDATE SCHEMA (IF NEEDED)

---

If new fields are introduced:

- Update ERP Schema section
- Provide seed data samples
- Update Setup.js field definitions

  4.4 UPDATE BACKEND

---

AI generates Apps Script code only if:

- Custom logic is required
- Workflow steps need implementation
- Data transformation is needed

  4.5 UPDATE FRONTEND

---

UI auto-builds from metadata, except for:

- Custom dashboards
- Custom widgets
- Interactive components

  4.6 PROVIDE A FULL EXECUTION SUMMARY

---

AI returns:

- What changed
- Full metadata
- Full code blocks (if any)
- Debug logs and tracing recommendations
- Testing checklist

================================================================================
SECTION 5.0 — NCM COMMAND TEMPLATES
================================================================================

## 5.1 CREATE NEW FORM

NCM*ACTION: Create
TARGET_OBJECT: Form
OBJECT_ID: FORM*<MODULE>\_<Name>

DESCRIPTION:

Purpose

Table binding

Fields

Required

Validation

Default values

Buttons needed

Views to update

Roles allowed

## 5.2 UPDATE EXISTING FORM

NCM_ACTION: Update
TARGET_OBJECT: Form
OBJECT_ID: <Existing ID>

CHANGES:

Add field

Remove field

Modify validation

Modify role access

## 5.3 DEFINE A WORKFLOW

NCM_ACTION: Create
TARGET_OBJECT: Workflow
TRIGGER: <OnSubmit / OnUpdate / OnStatusChange>

STEPS:
Step 1: ...
Step 2: ...
Step 3: ...

## 5.4 ADD PERMISSION RULES

NCM_ACTION: Update
TARGET_OBJECT: Permission
ROLE: HR_Manager

ALLOW:

FORM_HRM_AddEmployee

VIEW_HRM_AllEmployees

================================================================================
SECTION 6.0 — AI BEHAVIOR RULES (MANDATORY)
================================================================================

Rule 1 — Never invent IDs  
Use strict naming:  
FORM*<MODULE>*<Name>  
VIEW*<MODULE>*<Name>  
WORKFLOW*<MODULE>*<Name>

Rule 2 — Never modify schema without explicit instruction  
Confirm if unsure.

Rule 3 — Always generate bilingual headers (EN + AR)

Rule 4 — Always provide SEED DATA for any new table

Rule 5 — Always update Setup.js definitions

Rule 6 — Always generate DEBUG LOGS for every new code block

Rule 7 — Always provide a TESTING CHECKLIST after each deliverable

================================================================================
SECTION 7.0 — EXAMPLE RAW NCM REQUEST
================================================================================

I want a form for adding supplier invoices.
Fields: Supplier, Date, Amount, Tax, Net_Amount.
Net_Amount = Amount - Tax.
Only Finance Manager can access.
Add workflow to auto-calc net amount.
Add view to show all supplier invoices sorted by date.

AI must generate:

- Form metadata
- Workflow script
- View metadata
- Permissions
- Setup.js updates
- Debug logs
- Testing checklist

================================================================================
SECTION 8.0 — FULL END-TO-END WORKFLOW (SUMMARY)
================================================================================

1. User gives NCM request
2. AI interprets it
3. AI generates metadata
4. AI updates schema
5. AI updates backend logic
6. AI updates frontend (if needed)
7. AI outputs a full package ready for deployment
8. User pastes into Sheets & Code.gs
9. System runs immediately

================================================================================
END OF DOCUMENT — NCM-PRO V1.0
================================================================================
