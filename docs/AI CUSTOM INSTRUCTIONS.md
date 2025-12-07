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

Rule 8 - After completing each Task List, before submitting the final report, you must perform the following GitHub synchronization procedure:

1. Execute a 'git push --force' operation to ensure all local changes are properly synchronized with the remote GitHub repository
2. Perform a full synchronization of the local working directory with the GitHub repository
3. Thoroughly resolve any merge conflicts or synchronization issues that may arise during this process
4. Verify and maintain perfect synchronization between all three components:
   - Local working directory
   - Local Git repository
   - Remote GitHub repository
5. Confirm successful synchronization by checking:
   - Commit history consistency
   - Branch alignment
   - File integrity across all locations
6. Only proceed with reporting task completion after successfully completing all synchronization steps and resolving any issues

Rule 9 - After successfully implementing Rule 8, proceed to integrate the '$ clasp push --force' functionality into the App Script project. This involves:

1. Setting up the project directory structure to match the App Script requirements
2. Executing the clasp push --force command to deploy all script files to the App Script environment
3. Verifying the successful deployment by checking the App Script dashboard
4. Ensuring all dependencies and required services are properly configured in the App Script manifest file
5. Confirming that the pushed changes maintain all functionality from the local development environment

The process should be completed with proper error handling and logging to track any deployment issues. Maintain version control throughout the push operation to enable rollback if needed.
