- GOOGLE SHEETS ERP SCHEMA (THE DATABASE)  
  Managed by Setup.js.

- [1. SYSTEM CORE (SYS)]

  - SYS_Analysis: SYS_ANA_ID, SYS_ANA_Date, SYS_ANA_Start, SYS_ANA_End, SYS_ANA_Item1 to SYS_ANA_Item9
  - SYS_Audit_Log: AUD_ID, AUD_Time_Stamp, USR_ID, USR_Name, USR_Action, ACT_Description, AUD_Entity, AUD_Entity_ID, AUD_Scope, AUD_Sheet_ID, AUD_Sheet_Name, IP_Address
  - SYS_Dashboard: SYS_Dash_ID, SYS_Metric_Code, SYS_Metric_Value, SYS_Dash_Date
  - SYS_Documents: DOC_ID, DOC_Entity, DOC_Entity_ID, DOC_File_Name, DOC_Label, DOC_Drive_URL, DOC_Upload_By, DOC_Crt_At
  - SYS_Permissions: PRM_ID, PRM_Name, PRM_Notes, PRM_Catg, PRM_Crt_At, PRM_Crt_By, PRM_Upd_At, PRM_Upd_By
  - SYS_PubHolidays: PUBHOL_ID, Pub_Holiday_Date, Pub_Holiday_Name
  - SYS_Role_Permissions: ROL_ID, PRM_ID, SRP_Scope, SRP_Is_Allowed, SRP_Constraints, SRP_Crt_At, SRP_Crt_By, SRP_Upd_At, SRP_Upd_By
  - SYS_Roles: ROL_ID, ROL_Title, ROL_Notes, ROL_Is_System, ROL_Crt_At, ROL_Crt_By, ROL_Upd_At, ROL_Upd_By
  - SYS_Sessions: SESS_ID, USR_ID, EMP_Email, Actor_USR_ID, SESS_Type, SESS_Status, IP_Address, Auth_Token, SESS_Start_At, SESS_End_At, SESS_Crt_At, SESS_Crt_By, SESS_Revoked_At, SESS_Revoked_By, SESS_Metadata
  - SYS_Users: USR_ID, EMP_Name_EN, USR_Name, EMP_Email, Job_Title, DEPT_Name, Password_Hash, Password_Salt, Last_Login, USR_Crt_At, USR_Crt_By, USR_Upd_At, USR_Upd_By

- [2. HUMAN RESOURCES (HRM)]

  - HRM_Advances: ADV_ID, EMP_ID, ADV_Issue_Date, ADV_Amnt, ADV_Setlmnt_Period, ADV_Notes, ADV_Status, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By
  - HRM_Analysis: HR_ANA_ID, HR_ANA_Date, HR_ANA_Start, HR_ANA_End, HR_ANA_Item1 to HR_ANA_Item9
  - HRM_Attendance: ATT_ID, EMP_ID, ATT_Date, ATT_Check_In, ATT_Check_Out, ATT_Late_Mints, ATT_EarlyLV_Mints, ATT_OT_Mints, ATT_Notes, ATT_Status, ATT_Crt_At, ATT_Crt_By, ATT_Upd_At, ATT_Upd_By
  - HRM_Dashboard: HR_Dash_ID, HR_Metric_Code, HR_Metric_Value, HR_Dash_Date
  - HRM_Deductions: DEDCT_ID, PEN_ID, PEN_Name, EMP_ID, DEDCT_Date, DEDCT_Amnt, DEDCT_Crt_At, DEDCT_Crt_By, DEDCT_Upd_At, DEDCT_Upd_By
  - HRM_Departments: DEPT_ID, DEPT_Name, DEPT_Is_Active, DEPT_Sort_Order, DEPT_Crt_At, DEPT_Crt_By, DEPT_Upd_At, DEPT_Upd_By
  - HRM_Employees: EMP_ID, EMP_Name_EN, EMP_Name_AR, Date_of_Birth, Gender, Nationality, Marital_Status, Military_Status, EMP_Mob_Main, EMP_Mob_Sub, Home_Address, EMP_Email, EmrCont_Name, EmrCont_Relation, EmrCont_Mob, Job_Title, DEPT_Name, Hire_Date, EMP_CONT_Type, Basic_Salary, Allowances, Deducts, EMP_Crt_At, EMP_Crt_By
  - HRM_Leave: LV_ID, EMP_ID, LV_Type, LV_Start_Date, LV_End_Date, LV_NumDays, LV_Approved_By, LV_Notes, LV_Crt_At, LV_Crt_By, LV_Upd_At, LV_Upd_By
  - HRM_OverTime: OT_ID, EMP_ID, POL_OT_ID, ATT_Date, ATT_OT_Mints, OT_Amnt, OT_Crt_At, OT_Crt_By, OT_Upd_At, OT_Upd_By

- [3. PROJECTS (PRJ)]

  - PRJ_Analysis: PRJ_ANA_ID, PRJ_ANA_Item1 to PRJ_ANA_Item9
  - PRJ_Clients: CLI_ID, CLI_Name, CLI_Mob_1, CLI_Mob_2, CLI_Email, CLI_Crt_At, CLI_Crt_By, CLI_Upd_At, CLI_Upd_By
  - PRJ_Dashboard: PRJ_Dash_ID, PRJ_Metric_Code, PRJ_Metric_Value, PRJ_Dash_Date
  - PRJ_IndirExp_NoTime_Alloc: ALO_NT_ID, InDiEXP_NT_ID, PRJ_ID, ALO_NT_Methd, ALO_NT_Amnt, ALO_NT_Crt_At, ALO_NT_Crt_By, ALO_NT_Upd_At, ALO_NT_Upd_By
  - PRJ_IndirExp_Time_Alloc: ALO_TM_ID, InDiEXP_TM_ID, PRJ_ID, ALO_TM_Methd, ALO_TM_Amnt, ALO_TM_Crt_At, ALO_TM_Crt_By, ALO_TM_Upd_At, ALO_TM_Upd_By
  - PRJ_Main: PRJ_ID, PRJ_Name, CLI_ID, CLI_Name, PRJ_Status, PRJ_Type, PRJ_Budget, Plan_Start_Date, PRJ_Location, PRJ_Crt_At, PRJ_Crt_By, PRJ_Upd_At, PRJ_Upd_By
  - PRJ_Material: MAT_ID, MAT_Name, MAT_Catg, MAT_Sub1, MAT_Sub2, Default_Unit, MAT_Active, MAT_Crt_At, MAT_Crt_By, MAT_Upd_At, MAT_Upd_By
  - PRJ_Plan_vs_Actual: PvA_ID, PRJ_ID, PRJ_Name, Plan_Start_Date, Actual_Start_Date, Actual_Num_Days, Plan_End_Date, Actual_End_Date, Plan_Direct_Exp, Actual_Direct_Exp, Actual_MATs, PvA_Crt_At, PvA_Crt_By, PvA_Upd_At, PvA_Upd_By
  - PRJ_Tasks: TSK_ID, PRJ_ID, TSK_Name, TSK_Priority, EMP_ID, TSK_Plan_Start, TSK_Start, TSK_End, TSK_Status, TSK_Crt_At, TSK_Crt_By, TSK_Upd_At, TSK_Upd_By

- [4. FINANCE (FIN)]

  - FIN_Analysis: FIN_ANA_ID, FIN_ANA_Item1 to FIN_ANA_Item9
  - FIN_Custody: CSTD_ID, EMP_ID, EMP_Name, PRJ_ID, PRJ_Name, CSTD_Issue_Date, CSTD_Amnt, CSTD_Purpose, CSTD_Status, CSTD_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By
  - FIN_Dashboard: FIN_Dash_ID, FIN_Metric_Code, FIN_Metric_Value, FIN_Dash_Date
  - FIN_DirectExpenses: DiEXP_ID, PRJ_ID, PRJ_Name, DiEXP_Date, MAT_ID, MAT_Name, MAT_Sub2, Default_Unit, Default_Price, MAT_Quantity, DiEXP_Total_VAT_Exc, DiEXP_Total_VAT_Inc, DiEXP_Pay_Status, DiEXP_Pay_Methd, DiEXP_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By
  - FIN_HRM_Payroll: PAY_ID, EMP_ID, EMP_Name, PAY_Start_Date, PAY_End_Date, Basic_Salary, Total_OT_Amnt, ADV_Instal, Total_DEDCT_Amnt, PAY_Net_Pay, PAY_Status, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By
  - FIN_InDirectExpenses_NoTime: InDiEXP_NT_ID, InDiEXP_NT_Catg, InDiEXP_NT_Sub1, Useful_Life_Months, Depreciation_Start_Date, InDiEXP_NT_Pay_Status, InDiEXP_NT_Pay_Methd, InDiEXP_NT_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By
  - FIN_InDirectExpenses_Time: InDiEXP_TM_ID, InDiEXP_TM_Catg, InDiEXP_TM_Sub1, InDiEXP_Start, InDiEXP_End, InDiEXP_TM_Pay_Status, InDiEXP_TM_Pay_Methd, InDiEXP_TM_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By
  - FIN_PandL_Statements: PL_ID, Rev_ID, DiEXP_ID, InDiEXP_TM_ID, InDiEXP_NT_ID, Total_Rev, Total_DiEXP, Total_InDiEXP_TM, Total_InDiEXP_NT, PL_Start_Date, PL_End_Date, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By
  - FIN_PRJ_Revenue: REV_ID, PRJ_ID, REV_Date, REV_Amnt, REV_Type, REV_Source, REV_Pay_Methd, REV_Invoice_Number, REV_Pay_Status, REV_Total, REV_Remain, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By

- [5. ENGINE (ENG)]

  - ENG_Forms: FORM_ID, TAB_Section, Column_Pointer, Field_Type, Smart_State, DYN_Link
  - ENG_Views: VIEW_ID, View_Title, Source_Sheet
  - ENG_Dropdowns: DD_ID, DD_EN, DD_AR, DD_Is_Active, DD_Sort_Order
  - ENG_Buttons: BTN_ID, BTN_Label, BTN_Type, BTN_Description
  - ENG_Settings: Setting_Key, Setting_Value, Description_EN, Updated_By, Updated_At

- [6. Debug & Log (DBUG)]
  - DBUG_AppLog: DBG_ID, Time_Stamp, Actor, Action, Entity, Entity_ID, Details
  - DBUG_WarnLog: DBG_WARN_ID, Time_Stamp, Actor, Action, Entity, Entity_ID, Details
  - DBUG_ErrorLog: DBG_ERR_ID, Time_Stamp, Actor, Action, Entity, Entity_ID, Message
