# Project Rules: dbdbschool Clone & LMS Expert

- All features must support 3 distinct roles: `school_admin`, `teacher` (instructor), and `parent` (student/parent).
- Frontend layout must render dynamic Role-Based Access Control (RBAC) sidebar navigation matching the official manual.
- Data structures must support Edufine grouping, lottery priorities, auto-renewal, fractional refunds, time-slot conflict detection, safety schedules, and class Q&A channels.
- Run automated test harness scripts (`scratch/test_*.js`) for every phase before claiming success.

## Error Prevention & Code Quality Guidelines (Learned Lessons)
- **HTML DOM Structure Integrity**: When modifying HTML files, always verify that parent/child boundaries, `<form>`, `<aside>`, and `<div>` tags are strictly closed and not inadvertently merged into attribute values or truncated.
- **Server Process & Route Synchronization**: Whenever new API routes are added or modified in `server.js`, restart the active background server process (PORT 3005) and execute automated validation before finishing.
- **UI Button Alignment Standard**: Action buttons (`[취소]`, `[엑셀 출력]`, etc.) must use unified height (`height: 30px`), padding (`0 14px`), and flex centering (`display: inline-flex; align-items: center; justify-content: center; line-height: 1;`) to prevent vertical baseline drift.

