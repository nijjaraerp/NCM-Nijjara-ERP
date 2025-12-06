8.0 APPLICATION LOGGING SYSTEM (MANDATORY)
================================================================================
This project enforces aggressive, full‑stack logging from day one and throughout the lifecycle. Logging spans frontend UI interactions, backend function executions, API requests/responses, and engine/state changes.

8.1 Architecture & Channels
--------------------------------------------------------------------------------
- Browser Console
- Apps Script Logger
- Google Sheets Persistent Logs: tabs `DBUG` (fallback `DBUG_AppLog`)

All channels receive identical messages:
- ISO timestamp
- level=DEBUG|INFO|WARN|ERROR
- actor=<USR_ID or client>
- action=<logical action>
- component=<module/function/UI part>
- id=<entity id, optional>
- session=<token prefix, optional>
- :: free‑text message

8.2 Example Log Lines
--------------------------------------------------------------------------------
2025-12-03T10:15:12.345Z | level=INFO | actor=USR-17 | action=CLICK | component=UI | id=app-hrm :: User clicked on app-hrm
2025-12-03T10:15:13.102Z | level=DEBUG | actor=USR-17 | action=FUNC_START | component=login | :: begin
2025-12-03T10:15:13.620Z | level=INFO | actor=USR-17 | action=FUNC_END | component=login | id=SYS-204 :: success
2025-12-03T10:15:14.005Z | level=ERROR | actor=USR-17 | action=API | component=getModuleData | :: Server error: AUTH_REQUIRED

8.3 Coverage Requirements
--------------------------------------------------------------------------------
- User interactions: button clicks, form submissions, navigation events
- Function executions: start/end, parameters, steps, data sent/received, status
- System events: API calls (request/response), state changes, errors

8.4 Implementation Notes
--------------------------------------------------------------------------------
- Frontend global listeners emit logs and push events to backend
- Backend normalizes and writes logs to all channels
- Levels: DEBUG, INFO, WARN, ERROR; ISO timestamps everywhere
- Persistent storage: `DBUG` (fallback `DBUG_AppLog`)

8.5 Troubleshooting via Logs
--------------------------------------------------------------------------------
- Filter by `actor` to trace a user session
- Use `FUNC_START`/`FUNC_END` pairs to measure time and locate failures
- Search `action=API` for request/response issues
- Inspect `ERROR` lines first; follow preceding `DEBUG` lines for context

8.6 Retention Policy
--------------------------------------------------------------------------------
- Keep last 90 days in `DBUG`; archive monthly to a separate spreadsheet
- Aggregate weekly metrics (error counts, slow functions) for analysis

8.7 Analysis Procedures
--------------------------------------------------------------------------------
- Weekly review of `ERROR` and `WARN` distributions by component
- Identify top 5 slowest functions from `FUNC_END.elapsed_ms`
- Validate cross‑channel consistency by spot‑checking identical messages