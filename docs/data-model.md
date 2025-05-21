# Firestore Data Model – Cramtime

## Collections & Fields

| Collection/Path                  | DocID       | Key Fields (Sample)                   | Purpose |
|----------------------------------|-------------|---------------------------------------|---------|
| `subjects`                       | subjectId   | `name`, `examType`, `iconUrl`, `desc`, `category`, `isActive`, `launchYear`, `emoji`, `difficulty`, `prerequisites`, `status` | List of all subjects/tests (AP, SAT, ACT) |
| `subjectCategories`             | categoryId  | `name`, `emoji`, `description`, `order`, `subjects`, `isActive` | Subject categories (Math, Science, etc.) |
| `subjects/{subjectId}/units`     | unitId      | `title`, `description`, `order`, `topics`, `estimatedHours`, `keyTerms`, `visualSummaries`, `studyGuide` | Sub-units per subject |
| `questions`                      | questionId  | `subjectId`, `unitId`, `type`, `text`, `choices`, `answer`, `difficulty`, `source`, `year`, `isOfficial`, `explanation`, `tags` | MCQ/FRQ pool |
| `quizzes`                        | quizId      | `subjectId`, `title`, `questionIds`, `createdBy`, `createdAt`, `timeLimit`, `isTimed`, `difficulty`, `isAI`, `tags`, `type` | Quiz groups |
| `flashcards`                     | cardId      | `subjectId`, `prompt`, `answer`, `createdBy`, `createdAt`, `difficulty`, `tags`, `isAI`, `lastReviewed`, `reviewCount`, `source` | Public/user-generated flashcards |
| `pastExams`                      | examId      | `subjectId`, `year`, `fileUrl`, `solutionUrl`, `isOfficial`, `duration`, `scoringGuide`, `type` | PDF past tests |
| `users`                          | uid         | `email`, `displayName`, `role`, `createdAt`, `preferences`, `activeSubjects`, `studyStreak`, `theme`, `accessibility`, `onboardingComplete` | User root doc |
| `users/{uid}/progress`           | quizId      | `score`, `attempts`, `lastDate`, `answers`, `timeSpent`, `completedUnits`, `weakAreas`, `streak` | Quiz results |
| `users/{uid}/flashcards`         | cardId      | `prompt`, `answer`, `status`, `createdAt`, `lastReviewed`, `reviewCount`, `mastery`, `tags` | User flashcards |
| `users/{uid}/studyPlan`          | planId      | `subjectId`, `targetDate`, `dailyGoals`, `completedItems`, `nextReview`, `aiGenerated`, `schedule` | Personalized study plans |
| `sessions`                       | sessionId   | `userId`, `messages` [{speaker, text, timestamp, type}], `createdAt`, `type`, `subjectId`, `context`, `aiModel` | Chat sessions |
| `schedules`                      | scheduleId  | `userId`, `eventType`, `timeSlot`, `externalEventLink`, `subjectId`, `tutorId`, `calEventId`, `status` | Scheduling |
| `breakGames`                     | gameId      | `type`, `difficulty`, `questions`, `timeLimit`, `rewards`, `category`, `isActive`, `minBreakTime` | BreakTime games |
| `userStreaks`                    | streakId    | `userId`, `currentStreak`, `longestStreak`, `lastStudyDate`, `rewards`, `breakTimeCredits`, `goals` | Study streak tracking |
| `aiGenerations`                  | genId       | `userId`, `type`, `prompt`, `result`, `createdAt`, `subjectId`, `context`, `model`, `status` | AI-generated content |
| `contentSearch`                  | searchId    | `query`, `results`, `timestamp`, `userId`, `filters`, `algoliaId` | Search history |
| `tutoringSessions`              | sessionId   | `userId`, `tutorId`, `subjectId`, `startTime`, `endTime`, `status`, `notes`, `calEventId` | 1:1 tutoring sessions |
| `errorLogs`                      | logId       | `userId`, `error`, `timestamp`, `context`, `severity`, `sentryId` | Error tracking |
| `analytics`                      | eventId     | `userId`, `eventType`, `timestamp`, `context`, `properties`, `sessionId` | Usage analytics |
| `userPreferences`               | prefId      | `userId`, `theme`, `accessibility`, `notifications`, `privacy` | User settings |
| `studyMaterials`                | materialId  | `subjectId`, `type`, `content`, `createdBy`, `createdAt`, `tags` | Study guides and materials |
| `feedback`                      | feedbackId  | `userId`, `type`, `content`, `createdAt`, `status`, `priority` | User feedback |

## Relationships

- `subjects` ← 1:M → `units` (per subject)
- `subjectCategories` ← 1:M → `subjects`
- `quizzes` reference `questions` by ID
- `users` have subcollections: `progress`, `flashcards`, `studyPlan`
- `sessions` and `schedules` indexed by `userId`
- `flashcards` can be linked to `units` and `subjects`
- `questions` are organized by `subjectId` and `unitId`
- `userStreaks` tracks study activity across all subjects
- `aiGenerations` are linked to specific users and subjects
- `tutoringSessions` connect users with tutors via Cal.com
- `errorLogs` and `analytics` track system usage and issues
- `studyMaterials` are linked to subjects and units
- `userPreferences` are linked to user accounts

## Security Rules

Firestore Security Rules allow you to control access to your database. They ensure that users can only access the data they are supposed to, protecting your data from unauthorized access or modification.

Here are some high-level considerations for security rules based on the collections defined:

-   **`subjects`, `subjectCategories`, `subjects/{subjectId}/units`, `questions`, `quizzes`, `flashcards` (public/global), `pastExams`**: These collections contain public or shared data. Rules might allow anyone to read these documents, but potentially restrict write access to administrators or authenticated users depending on the specific use case (e.g., creating quizzes, adding flashcards).
-   **`users/{uid}`**: A user should only be able to read and write their own user document. The `uid` in the path should match the authenticated user's ID (`request.auth.uid`).
-   **`users/{uid}/progress`, `users/{uid}/flashcards` (user-specific), `users/{uid}/studyPlan`**: Similar to the user document, a user should only be able to read and write documents within their own subcollections. The `uid` in the path must match the authenticated user's ID.
-   **`sessions`, `schedules`**: Access to these collections should be restricted to the owner of the session/schedule (`userId` field) and potentially administrators.
-   **`breakGames`**: Public read access, write access restricted to administrators.
-   **`userStreaks`**: Read/write access restricted to the user's own streak document.
-   **`aiGenerations`**: Read/write access restricted to the user who generated the content.
-   **`contentSearch`**: Read/write access restricted to the user's own search history.
-   **`tutoringSessions`**: Read/write access restricted to the participants (user and tutor).
-   **`errorLogs`**: Write access for all authenticated users, read access restricted to administrators.
-   **`analytics`**: Write access for all authenticated users, read access restricted to administrators.
-   **`userPreferences`**: Read/write access restricted to the user's own preferences.
-   **`studyMaterials`**: Read access for all authenticated users, write access restricted to administrators and content creators.
-   **`feedback`**: Write access for all authenticated users, read access restricted to administrators.

It is important to define granular rules for each collection and document path to enforce the desired access control policies.
| `errorLogs`                      | logId       | `userId`, `error`, `timestamp`, `context`, `severity`, `sentryId` | Error tracking |
| `analytics`                      | eventId     | `userId`, `eventType`, `timestamp`, `context`, `properties`, `sessionId` | Usage analytics |
| `userPreferences`               | prefId      | `userId`, `theme`, `accessibility`, `notifications`, `privacy` | User settings |
| `studyMaterials`                | materialId  | `subjectId`, `type`, `content`, `createdBy`, `createdAt`, `tags` | Study guides and materials |
| `feedback`                      | feedbackId  | `userId`, `type`, `content`, `createdAt`, `status`, `priority` | User feedback |

## Relationships

- `subjects` ← 1:M → `units` (per subject)
- `subjectCategories` ← 1:M → `subjects`
- `quizzes` reference `questions` by ID
- `users` have subcollections: `progress`, `flashcards`, `studyPlan`
- `sessions` and `schedules` indexed by `userId`
- `flashcards` can be linked to `units` and `subjects`
- `questions` are organized by `subjectId` and `unitId`
- `userStreaks` tracks study activity across all subjects
- `aiGenerations` are linked to specific users and subjects
- `tutoringSessions` connect users with tutors via Cal.com
- `errorLogs` and `analytics` track system usage and issues
- `studyMaterials` are linked to subjects and units
- `userPreferences` are linked to user accounts

## Security Rules

Firestore Security Rules allow you to control access to your database. They ensure that users can only access the data they are supposed to, protecting your data from unauthorized access or modification.

Here are some high-level considerations for security rules based on the collections defined:

-   **`subjects`, `subjectCategories`, `subjects/{subjectId}/units`, `questions`, `quizzes`, `flashcards` (public/global), `pastExams`**: These collections contain public or shared data. Rules might allow anyone to read these documents, but potentially restrict write access to administrators or authenticated users depending on the specific use case (e.g., creating quizzes, adding flashcards).
-   **`users/{uid}`**: A user should only be able to read and write their own user document. The `uid` in the path should match the authenticated user's ID (`request.auth.uid`).
-   **`users/{uid}/progress`, `users/{uid}/flashcards` (user-specific), `users/{uid}/studyPlan`**: Similar to the user document, a user should only be able to read and write documents within their own subcollections. The `uid` in the path must match the authenticated user's ID.
-   **`sessions`, `schedules`**: Access to these collections should be restricted to the owner of the session/schedule (`userId` field) and potentially administrators.
-   **`breakGames`**: Public read access, write access restricted to administrators.
-   **`userStreaks`**: Read/write access restricted to the user's own streak document.
-   **`aiGenerations`**: Read/write access restricted to the user who generated the content.
-   **`contentSearch`**: Read/write access restricted to the user's own search history.
-   **`tutoringSessions`**: Read/write access restricted to the participants (user and tutor).
-   **`errorLogs`**: Write access for all authenticated users, read access restricted to administrators.
-   **`analytics`**: Write access for all authenticated users, read access restricted to administrators.
-   **`userPreferences`**: Read/write access restricted to the user's own preferences.
-   **`studyMaterials`**: Read access for all authenticated users, write access restricted to administrators and content creators.
-   **`feedback`**: Write access for all authenticated users, read access restricted to administrators.

It is important to define granular rules for each collection and document path to enforce the desired access control policies.