# Cramtime Content Authoring & Admin Quickstart

## Who is this for?
- **Admins:** Can create/edit/delete all subjects, units, questions, and quizzes.
- **Editors:** Same as admins, or configure by Firestore role.
- **Teachers/Content Authors:** May have separate roles; see RBAC config.

## Accessing Admin Dashboard

1. Sign in with your Google/Firebase account.
2. Ask admin to grant you the “admin” or “editor” role in Firebase console.
3. Visit `/admin` (browser-side RBAC enforced—if your role is not admin/editor, you’ll be blocked).

## Authoring Features

- **Subjects/Units:** Add, edit, and delete subject and topic/unit metadata.
- **Questions/Flashcards:** Bulk upload via CSV (see scripts or UI batch upload).
- **Quiz/Exam Creation:** Select from question pools, assign subject/unit links.
- **Instant AI Generation:** Use “AI generate” (Gemini) for draft content, then review/edit.
- **Search/Edit:** Filter by subject, exam type, or keywords for easy editing.

## Bulk Upload

- Use spreadsheets (Excel, Google Sheets), export CSV with headers:  
  - For questions: `question,choices,answer,type,subjectId,unitId`
- Run `uploadQuestionsFromCsv` (see `/functions/src/utils/bulkUploadFromCsv.ts`)
  - Or request an admin to import for you.

## Review & Approval

- All changes are live immediately if rules permit.
- For additional review flows (draft, publish), extend the data model and RBAC as needed.

## Help

- For issues, reach out to dev team or open a GitHub issue.
- For advanced usage (e.g. special question types, image uploads, exam scans), see `/docs/` or discuss with engineering team.

---