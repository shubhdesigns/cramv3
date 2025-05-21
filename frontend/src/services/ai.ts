import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Google AI Configuration
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// AI Service Functions
export const aiService = {
  // OpenAI Functions
  async generateStudyPlan(subject: string, level: string) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert educational AI tutor. Create a detailed study plan."
          },
          {
            role: "user",
            content: `Create a study plan for ${subject} at ${level} level.`
          }
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating study plan:', error);
      throw error;
    }
  },

  async generateFlashcards(topic: string, count: number) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert educational AI tutor. Create flashcards."
          },
          {
            role: "user",
            content: `Create ${count} flashcards for ${topic}. Format as JSON with 'question' and 'answer' fields.`
          }
        ],
      });
      return JSON.parse(completion.choices[0].message.content || '[]');
    } catch (error) {
      console.error('Error generating flashcards:', error);
      throw error;
    }
  },

  // Google AI Functions
  async generatePracticeQuestions(subject: string, difficulty: string) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(
        `Generate 5 practice questions for ${subject} at ${difficulty} difficulty level.`
      );
      return result.response.text();
    } catch (error) {
      console.error('Error generating practice questions:', error);
      throw error;
    }
  },

  // AP Exam Specific Functions
  async getAPExamResources(examName: string) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert AP exam tutor. Provide resources and study materials."
          },
          {
            role: "user",
            content: `Provide comprehensive study resources for ${examName} AP exam.`
          }
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error getting AP exam resources:', error);
      throw error;
    }
  },

  // College Board Integration
  async getCollegeBoardData(studentId: string) {
    try {
      // Implement College Board API integration
      const response = await fetch(`https://api.collegeboard.org/v1/student/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.COLLEGE_BOARD_API_KEY}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching College Board data:', error);
      throw error;
    }
  },

  // AI Tutoring Session
  async startTutoringSession(subject: string, topic: string) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert AI tutor. Provide interactive tutoring."
          },
          {
            role: "user",
            content: `Start a tutoring session for ${subject} focusing on ${topic}.`
          }
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error starting tutoring session:', error);
      throw error;
    }
  },

  // Progress Analysis
  async analyzeProgress(data: any) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert educational analyst. Analyze student progress."
          },
          {
            role: "user",
            content: `Analyze this student progress data and provide insights: ${JSON.stringify(data)}`
          }
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing progress:', error);
      throw error;
    }
  }
}; 