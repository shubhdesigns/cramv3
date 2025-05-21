import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const subjects = [
  // Math & Computer Science
  { id: "ap-calculus-ab-bc", name: "AP Calculus AB/BC", category: "Math & Computer Science", icon: "➗", examType: "AP" },
  { id: "ap-computer-science-a", name: "AP Computer Science A", category: "Math & Computer Science", icon: "💻", examType: "AP" },
  { id: "ap-computer-science-principles", name: "AP Computer Science Principles", category: "Math & Computer Science", icon: "🖥️", examType: "AP" },
  { id: "ap-pre-calculus", name: "AP Pre-Calculus", category: "Math & Computer Science", icon: "📐", examType: "AP" },
  { id: "ap-statistics", name: "AP Statistics", category: "Math & Computer Science", icon: "📊", examType: "AP" },
  // Science
  { id: "ap-biology", name: "AP Biology", category: "Science", icon: "🧬", examType: "AP" },
  { id: "ap-chemistry", name: "AP Chemistry", category: "Science", icon: "🧪", examType: "AP" },
  { id: "ap-environmental-science", name: "AP Environmental Science", category: "Science", icon: "🌎", examType: "AP" },
  { id: "ap-physics-1", name: "AP Physics 1 (2025)", category: "Science", icon: "⚛️", examType: "AP" },
  { id: "ap-physics-2", name: "AP Physics 2 (2025)", category: "Science", icon: "🧲", examType: "AP" },
  { id: "ap-physics-c-em", name: "AP Physics C: E&M (2025)", category: "Science", icon: "🔋", examType: "AP" },
  { id: "ap-physics-c-mechanics", name: "AP Physics C: Mechanics (2025)", category: "Science", icon: "⚙️", examType: "AP" },
  // History
  { id: "ap-european-history", name: "AP European History", category: "History", icon: "🇪🇺", examType: "AP" },
  { id: "ap-us-history", name: "AP US History", category: "History", icon: "🇺🇸", examType: "AP" },
  { id: "ap-world-history-modern", name: "AP World History: Modern", category: "History", icon: "🌍", examType: "AP" },
  // World Languages & Cultures
  { id: "ap-chinese", name: "AP Chinese", category: "World Languages & Cultures", icon: "🇨🇳", examType: "AP" },
  { id: "ap-french", name: "AP French", category: "World Languages & Cultures", icon: "🇫🇷", examType: "AP" },
  { id: "ap-german", name: "AP German", category: "World Languages & Cultures", icon: "🇩🇪", examType: "AP" },
  { id: "ap-italian", name: "AP Italian", category: "World Languages & Cultures", icon: "🇮🇹", examType: "AP" },
  { id: "ap-japanese", name: "AP Japanese", category: "World Languages & Cultures", icon: "🇯🇵", examType: "AP" },
  { id: "ap-latin", name: "AP Latin", category: "World Languages & Cultures", icon: "🏛️", examType: "AP" },
  { id: "ap-spanish-language", name: "AP Spanish Language", category: "World Languages & Cultures", icon: "🇪🇸", examType: "AP" },
  { id: "ap-spanish-literature", name: "AP Spanish Literature", category: "World Languages & Cultures", icon: "📚", examType: "AP" },
  // College Admissions
  { id: "act", name: "ACT", category: "College Admissions", icon: "📝", examType: "ACT" },
  { id: "sat", name: "SAT", category: "College Admissions", icon: "📝", examType: "SAT" },
  // English
  { id: "ap-english-language", name: "AP English Language", category: "English", icon: "📝", examType: "AP" },
  { id: "ap-english-literature", name: "AP English Literature", category: "English", icon: "📖", examType: "AP" },
  // Arts
  { id: "ap-art-design", name: "AP Art & Design", category: "Arts", icon: "🎨", examType: "AP" },
  { id: "ap-art-history", name: "AP Art History", category: "Arts", icon: "🏺", examType: "AP" },
  // Social Science
  { id: "ap-african-american-studies", name: "AP African American Studies", category: "Social Science", icon: "🧑🏿‍🎓", examType: "AP" },
  { id: "ap-comparative-government", name: "AP Comparative Government", category: "Social Science", icon: "🏛️", examType: "AP" },
  { id: "ap-human-geography", name: "AP Human Geography", category: "Social Science", icon: "🌐", examType: "AP" },
  { id: "ap-macroeconomics", name: "AP Macroeconomics", category: "Social Science", icon: "💵", examType: "AP" },
  { id: "ap-microeconomics", name: "AP Microeconomics", category: "Social Science", icon: "💰", examType: "AP" },
  { id: "ap-psychology", name: "AP Psychology (2025)", category: "Social Science", icon: "🧠", examType: "AP" },
  { id: "ap-us-government", name: "AP US Government", category: "Social Science", icon: "🏛️", examType: "AP" },
  // Capstone
  { id: "ap-research", name: "AP Research", category: "Capstone", icon: "🔬", examType: "AP" },
  { id: "ap-seminar", name: "AP Seminar", category: "Capstone", icon: "💬", examType: "AP" }
];

async function seedSubjects() {
  for (const subj of subjects) {
    await db.collection("subjects").doc(subj.id).set(subj);
  }
  console.log("Subjects seeded!");
}

seedSubjects(); 