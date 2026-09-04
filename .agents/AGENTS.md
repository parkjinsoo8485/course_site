# Project Rules: dbdbschool Clone & LMS Expert

- All features must support 3 distinct roles: `school_admin`, `teacher` (instructor), and `parent` (student/parent).
- Frontend layout must render dynamic Role-Based Access Control (RBAC) sidebar navigation matching the official manual.
- Data structures must support Edufine grouping, lottery priorities, auto-renewal, fractional refunds, time-slot conflict detection, safety schedules, and class Q&A channels.
- Run automated test harness scripts (`scratch/test_*.js`) for every phase before claiming success.

## Error Prevention & Code Quality Guidelines (Learned Lessons)
- **HTML DOM Structure Integrity**: When modifying HTML files, always verify that parent/child boundaries, `<form>`, `<aside>`, and `<div>` tags are strictly closed and not inadvertently merged into attribute values or truncated.
- **Server Process & Route Synchronization**: Whenever new API routes are added or modified in `server.js`, restart the active background server process (PORT 3005) and execute automated validation before finishing.
- **UI Button Alignment Standard**: Action buttons (`[취소]`, `[엑셀 출력]`, etc.) must use unified height (`height: 30px`), padding (`0 14px`), and flex centering (`display: inline-flex; align-items: center; justify-content: center; line-height: 1;`) to prevent vertical baseline drift.
- **Select Dropdown `<select>` Vertical Alignment Standard**:
  - Never apply numeric/pixel `line-height` (e.g. `line-height: 28px`) to `<select>` elements; in Chromium/WebKit engines, it causes the font baseline to drift below the box bottom, clipping the lower half of option text.
  - Always use `line-height: normal !important;`, `box-sizing: border-box !important;`, `height: 30px;`, balanced horizontal padding (`padding: 0 24px 0 10px;`), and `vertical-align: middle;`.
  - For paired select & input groups (e.g., classroom selection `#add_lec_room_sel` and `#add_lec_room`), wrap them in an inline-flex container (`display: inline-flex; align-items: center; gap: 6px;`) with matching 30px height and aligned baselines.
- **Optimal Cloning Workflow (Quota & Accuracy Standard)**:
  - When cloning specific pages or modals, avoid parsing heavy HAR files (1MB+) or guessing CSS from screenshots. Always request or use extracted live `outerHTML` (`scratch/*.html`) for exact structural fidelity.
  - Separate cloning into 2 isolated steps: Step 1 (pure DOM/CSS layout placement without JS side effects) -> Step 2 (JS dynamic binding & backend API integration). Full guide documented in [docs/OPTIMAL_CLONING_WORKFLOW_GUIDE.md](file:///c:/Users/user/My%20project/course/course_site/docs/OPTIMAL_CLONING_WORKFLOW_GUIDE.md).
- **User UX Preference: Page Navigation vs Modal Connection Standard**:
  - **Do NOT navigate away to external standalone pages** when connecting sub-action features (e.g. '강좌 일괄입력', '일괄수정', '일괄복사' 등).
  - **Always keep the existing left sidebar and layout 100% intact**, and connect the target feature/form as a centered in-page modal popup.
  - **Modal Centering Standard**: Modals must always be positioned dead-center horizontally and vertically across the viewport (`position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; display: flex !important; align-items: center !important; justify-content: center !important; z-index: 99999 !important;` and `.modal-box { margin: auto !important; position: relative !important; }`).


