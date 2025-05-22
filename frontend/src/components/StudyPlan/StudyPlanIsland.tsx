import React, { useState } from "react";

interface StudyPlanParams {
  examDate: string;
  subjects: string[];
  goal?: string;
  uid?: string;
}

/**
 * Generate a study plan based on the user's preferences
 * Simple client-side implementation using static data
 */
async function generateStudyPlan(params: StudyPlanParams): Promise<{ plan: string }> {
  const { examDate, subjects, goal } = params;
  
  // Calculate days until exam without date-fns
  const today = new Date();
  const exam = new Date(examDate);
  const daysLeft = Math.max(1, Math.ceil((exam.getTime() - today.getTime()) / (1000 * 3600 * 24)));
  
  // Format the current date
  const currentDate = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Format exam date
  const examFormatted = exam.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Generate a study plan based on the parameters
  let planText = `Study Plan generated on ${currentDate}\n\n`;
  planText += `📚 GOAL: ${goal || 'Master the subjects and perform well on the exam'}\n`;
  planText += `📅 EXAM DATE: ${examFormatted}\n`;
  planText += `⏱️ TIME REMAINING: ${daysLeft} days\n\n`;
  
  // Add a section for each subject
  subjects.forEach((subject, index) => {
    planText += `📘 SUBJECT ${index + 1}: ${subject}\n`;
    
    // Create a simple weekly schedule
    const weeksLeft = Math.ceil(daysLeft / 7);
    
    if (subject.toLowerCase().includes('ap')) {
      // AP subject plan
      planText += `- Week 1-${Math.min(2, weeksLeft)}: Review fundamental concepts\n`;
      planText += `- Week ${Math.min(3, weeksLeft)}-${Math.min(4, weeksLeft)}: Practice with past exam questions\n`;
      if (weeksLeft > 4) {
        planText += `- Week ${Math.min(5, weeksLeft)}-${weeksLeft}: Take full-length practice exams\n`;
      }
    } else if (subject.toLowerCase().includes('sat')) {
      // SAT subject plan
      planText += `- Week 1-${Math.min(2, weeksLeft)}: Learn test strategies and review concepts\n`;
      planText += `- Week ${Math.min(3, weeksLeft)}-${Math.min(4, weeksLeft)}: Practice section-specific questions\n`;
      if (weeksLeft > 4) {
        planText += `- Week ${Math.min(5, weeksLeft)}-${weeksLeft}: Complete timed practice sections and full tests\n`;
      }
    } else {
      // Generic subject plan
      planText += `- Week 1-${Math.min(2, weeksLeft)}: Review key concepts\n`;
      planText += `- Week ${Math.min(3, weeksLeft)}-${weeksLeft}: Practice problems and mock exams\n`;
    }
    
    planText += `\n`;
  });
  
  // Add study tips
  planText += `💡 STUDY TIPS:\n`;
  planText += `- Study in 25-minute intervals with 5-minute breaks (Pomodoro Technique)\n`;
  planText += `- Review material regularly using spaced repetition\n`;
  planText += `- Get adequate sleep and exercise\n`;
  planText += `- Join or form a study group for collaborative learning\n`;
  
  // Simulate async API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ plan: planText });
    }, 1000);
  });
}

export default function StudyPlanIsland({ uid }: { uid: string }) {
  const [examDate, setExamDate] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await generateStudyPlan({ examDate, subjects, goal, uid });
      setPlan(res.plan);
    } catch (err) {
      setError("Could not generate study plan. Try again.");
    }
    setLoading(false);
  }

  return (
    <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-3">📅 Build Your Study Plan</h2>
      <form className="flex gap-3 flex-wrap mb-4" onSubmit={handlePlan}>
        <input
          type="date"
          value={examDate}
          onChange={e => setExamDate(e.target.value)}
          className="p-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark"
          required
          placeholder="Exam date"
          aria-label="Exam date"
        />
        <input
          type="text"
          value={subjects.join(", ")}
          onChange={e => setSubjects(e.target.value.split(",").map(s => s.trim()))}
          className="p-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark"
          required
          placeholder="Subjects (e.g. AP Biology, SAT Math)"
          aria-label="Subjects"
        />
        <input
          type="text"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          className="p-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark"
          placeholder="e.g. Score 5, improve vocabulary"
          aria-label="Goal"
        />
        <button 
          type="submit" 
          className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-xl transition-colors"
          disabled={loading}
        >
          {loading ? "Generating..." : "Get Plan"}
        </button>
      </form>
      {error && <div className="text-error-light dark:text-error-dark">{error}</div>}
      {plan && (
        <article className="mt-4 whitespace-pre-line bg-primary/10 dark:bg-primary-dark/30 text-text-primary-light dark:text-text-primary-dark p-4 rounded-xl">
          <strong>Your AI Study Plan:</strong>
          <br />
          {plan}
        </article>
      )}
    </section>
  );
}