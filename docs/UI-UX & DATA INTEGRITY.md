--------------------------------------------------------------------  
# 3.4 UI/UX & FONT REQUIREMENTS  
--------------------------------------------------------------------  
- All text visible to users, including labels, buttons, and headers, **must** be presented in **Arabic**.  
- The entire user interface **must** utilise the **Cairo Family font**.  
- Smart Attachments (`SYS_Documents`)  
* **Logic:** Forms may feature an "Attachment Area".  
* **Process:**  
    1. The user uploads files.  
    2. The system transfers the files to Google Drive.  
    3. The system records an entry in `SYS_Documents` linked to the `Entity_ID` (for example, the Project ID).  
* **Viewing:** When accessing a record (e.g., Project Details), the system automatically retrieves associated files from `SYS_Documents`.  
---  
--------------------------------------------------------------------  
# 3.5 DATA INTEGRITY & AUTOMATION RULES  
--------------------------------------------------------------------  
### **3.5.1 Smart ID Generation (No Random Strings)**  
The system is required to generate clean, sequential, and easily readable IDs. Random UUIDs (such as `a1-b2-x9`) are **PROHIBITED** for IDs visible to users.  
* **Format:** `[PREFIX]-[NUMBER]`  
* **Logic:**  
    1. Read the last ID in the column (starting from Row 4).  
    2. Extract the numeric portion.  
    3. Increment the number by 1.  
    4. Format the ID with the module prefix.  
* **Examples:**  
    * `SYS_Users` → `SYS-1001`, `SYS-1002`  
    * `HRM_Employees` → `HRM-1001`  
    * `PRJ_Main` → `PRJ-5001`  
### **3.5.2 Smart Search & Lookups**  
* Any form field designated as `Smart_Lookup` in the Engine must initiate a live search against the target sheet.  
* **User Experience:** When a user types "Ahmed", the system searches Name/Email/Phone in `HRM_Employees`; upon selecting "Ahmed Ali", the system captures the hidden `EMP_ID`.
