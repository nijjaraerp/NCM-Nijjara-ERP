Smart Header Protocol (3‑Row Rule)  
--------------------------------------------------------------------  
**CRITICAL:** This protocol forms the basis of the entire data handling layer. Every Data Sheet (e.g., `HRM_Employees`, `PRJ_Main`) **MUST** comply with this format.  
### **3.1.1 Header Structure (Rows 1-3)**  
| Row Number | Technical Name | Purpose & Logic | Mutability |  
| :--- | :--- | :--- | :--- |  
| **Row 1** | `SYSTEM_KEY` | The internal unique column identifier (e.g., `emp_id`, `full_name_ar`). Utilized by API/Code to map JSON keys. | **IMMUTABLE** (Must not be altered after code deployment). |  
| **Row 2** | `UI_LABEL` | The Arabic label displayed in the UI (e.g., `معرّف الموظف`, `الاسم بالكامل`). The system **MUST** use this string to render Form Labels and Table Headers. | **MUTABLE** (Admin can update at any time). |  
| **Row 3** | `VIEW_FLAG` | Determines visibility in the "List View" (Grid). | **MUTABLE** (Visibility controlled by admin). |  
### **3.1.2 Data Ingestion Rule (Row 4+)**  
* **IGNORE ROW 3:** The system must strictly disregard Row 3 when processing data.  
* **BEGIN AT ROW 4:** All data records (Create/Read/Update/Delete) **MUST start from Row 4**.  
* **Rationale:** Row 3 is reserved for Configuration Flags (e.g., "SHOW"), not for data entries.  
### **3.1.3 `VIEW_FLAG` Logic (Row 3)**  
* **IF** the cell contains `"SHOW"` (case-insensitive) → **THEN** include the column in the Data Grid / List View.  
* **IF** the cell is empty → **THEN** exclude the column from the Data Grid (hidden in list but accessible in Detailed View Forms).  
### **3.1.4 Example Implementation**  
*Sheet: `HRM_Employees`*  
| Row | Col A | Col B | Col C | Col D |  
| :--- | :--- | :--- | :--- | :--- |  
| **1** | `emp_id` | `full_name` | `phone_num` | `basic_salary` |  
| **2** | `كود الموظف` | `الاسم بالكامل` | `رقم الهاتف` | `الراتب الأساسي` |  
| **3** | `SHOW` | `SHOW` | `SHOW` | *(Empty)* |  
| **4** | `HRM-1001` | `Ahmed Ali` | `010xxxx` | `5000` |  
* **UI Outcome:** The "Employees List" page will automatically generate a table with 3 columns using the **Arabic Headers from Row 2**: *كود الموظف, الاسم بالكامل, رقم الهاتف*.  
--------------------------------------------------------------------------