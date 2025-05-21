import * as admin from "firebase-admin";
import * as fs from "fs";
import * as csv from "csv-parse/sync";

admin.initializeApp();
const db = admin.firestore();

// Expects CSV format: question,choices,answer,type,subjectId,unitId (header)
export async function uploadQuestionsFromCsv(filePath: string) {
  const file = fs.readFileSync(filePath, "utf8");
  const records = csv.parse(file, { columns: true, skip_empty_lines: true });
  const batch = db.batch();
  for (const row of records) {
    const docRef = db.collection("questions").doc();
    batch.set(docRef, {
      text: row.question,
      choices: row.choices.split("|"),
      answer: row.answer,
      type: row.type || "MCQ",
      subjectId: row.subjectId,
      unitId: row.unitId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
  console.log(`${records.length} questions uploaded.`);
}

// Similar function possible for flashcards or subjects—just change fields and collection.