import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export async function migrateSubjects(subjects: { subjectId: string; name: string; examType: string; }[]) {
  const batch = db.batch();
  subjects.forEach(sub => {
    const ref = db.collection("subjects").doc(sub.subjectId);
    batch.set(ref, sub, { merge: true });
  });
  await batch.commit();
  console.log("Subjects migrated!");
}

// Usage (node): import and call migrateSubjects([{subjectId, name, examType}, ...])
// Can extend for units, questions, etc.