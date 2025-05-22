import { format, addDays, differenceInDays } from 'date-fns';

interface StudyPlanParams {
  examDate: string;
  subjects: string[];
  goal?: string;
  uid?: string;
}

interface StudyPlanResponse {
  plan: string;
}

/**
 * Generate a study plan based on the user's preferences
 * This is a client-side implementation using static data since we're avoiding Firebase
 */
export async function generateStudyPlan(params: StudyPlanParams): Promise<StudyPlanResponse> {
  const { examDate, subjects, goal } = params;
  
  // Calculate days until exam
  const today = new Date();
  const exam = new Date(examDate);
  const daysLeft = Math.max(1, differenceInDays(exam, today));
  
  // Format the current date
  const currentDate = format(today, 'MMMM d, yyyy');
  
  // Generate a study plan based on the parameters
  let planText = `Study Plan generated on ${currentDate}\n\n`;
  planText += `📚 GOAL: ${goal || 'Master the subjects and perform well on the exam'}\n`;
  planText += `📅 EXAM DATE: ${format(exam, 'MMMM d, yyyy')}\n`;
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