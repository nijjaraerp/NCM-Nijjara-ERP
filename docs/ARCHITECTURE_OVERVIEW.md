- **Concept Overview**  
  - The Nijjara ERP is a serverless Single-Page Application (SPA) built for high performance and seamless user experience without page reloads.  
  - It features a hybrid architecture:  
    - Static UI Shell: A fixed core layout.  
    - Dynamic Content: Areas controlled by metadata from Google Sheets.  
  - The backend is a stateless API using Google Apps Script and interacts with a single Google Sheet serving as both database and configuration engine.

- **System & Project Information**  
  - Google Sheet ID: 1DhWqZ99axEgs7i4QQM1DP9_kLWKdez-IhhssYizaDdM  
  - Google Sheet Name: NCM-Nijjara-ERP  
  - App Script ID: 16YtHjH0MrKGNfSBqbuhFYaaV79-31U_jHTLCiKzWveQ8JE63NurGlNvj  
  - App Script Name: NCM-Nijjara-ERP  
  - Google Cloud Project:  
    - Name: NCM-Nijjara-ERP  
    - Number: 749790232044  
    - ID: ncm-nijjara-erp  
  - Local Directory: C:\Users\moham\MK_Work\NCM-Nijjara-ERP  
  - GitHub Repository: nijjaraerp/NCM-Nijjara-ERP

- **System Scope & Files**  
  - Core database file: NCM-Nijjara-ERP  
  - All modules consolidated in this file with tabs grouped by prefixes:  
    - [SYS_] System Administration  
    - [HRM_] Human Resources Management  
    - [PRJ_] Project Management  
    - [FIN_] Finance  
    - [ENG_] System Engines (Metadata & Configs)  
    - [DBUG_] Debugging & Audit Logs

- **Three-File Architecture Details**  
  1. **Code.gs (Backend Core)**  
     - Serves HTML, handles API requests, parses engine metadata, and runs business logic.  
     - Functions include:  
       - HTTP Routing: doGet(e), include(filename)  
       - Authentication: login(user, pass), checkSession(token)  
       - Engine Core: getFormConfig(formId), getViewConfig(viewId)  
       - I/O Layer (CRUD): saveRecord(formId, data), updateRecord(formId, recId, data), performSmartSearch(query, linkID)  
       - Logic Modules: runAllocations(expenseData)  
       - Logger: logEvent(level, actor, action, details)

  2. **Dashboard.html (Frontend SPA)**  
     - User interface with HTML shell, CSS styles, and Vue.js/Vanilla JS logic.  
     - Structure includes:  
       - HTML Shell: imports fonts and libraries, root component div#app  
       - CSS Styles: dark mode variables, glassmorphism, animations  
       - JS Application: state management, components (Navbar, ModuleHub, SmartForm, SmartGrid), API handler with loading and error handling

  3. **Setup.js (Database Architect)**  
     - Interface for database management via a GUI menu in Google Sheets.  
     - UI flow: menu item, dropdown, sidebar with checkboxes for tasks, execute button, status report popup.  
     - Core functions:  
       - UI triggers: onOpen(), showSidebar()  
       - Orchestrator: processSidebarQueue(taskList) with smart task sequencing to avoid conflicts  
       - Destructive actions: deleteGroupSheets(prefix), wipeGroupData(prefix)  
       - Constructive actions: buildGroupSchema(prefix), seedGroupData(prefix)  
       - Reporting: generateReport(results) with success/failure summaries  
     - Example sequencing logic: reorders tasks to ensure proper execution order (e.g., wipe before seed)

