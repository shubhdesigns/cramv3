import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockUsers = [
  { id: 1, email: 'demo@example.com', name: 'Demo User' }
];

const mockFlashcards = [
  {
    id: 1,
    question: 'What is React?',
    answer: 'A JavaScript library for building user interfaces',
    category: 'Programming',
    difficulty: 'Easy',
    lastReviewed: '2024-03-15'
  },
  {
    id: 2,
    question: 'What is the difference between let and const?',
    answer: 'let allows reassignment while const does not',
    category: 'JavaScript',
    difficulty: 'Medium',
    lastReviewed: '2024-03-14'
  }
];

// New Mock Data for Subjects, Courses, Units, and Materials
const mockSubjects = [
  { id: 'math-cs', name: 'Math & Computer Science' },
  { id: 'science', name: 'Science' },
  { id: 'history', name: 'History' },
  { id: 'social-science', name: 'Social Science' },
  { id: 'english', name: 'English' },
  { id: 'world-languages', name: 'World Languages & Cultures' },
  { id: 'arts', name: 'Arts' },
  { id: 'college-admissions', name: 'College Admissions' },
  { id: 'capstone', name: 'Capstone' },
];

const mockCourses = [
  { id: 'calc-ab-bc', subjectId: 'math-cs', name: 'AP Calculus AB/BC' },
  { id: 'comp-sci-a', subjectId: 'math-cs', name: 'AP Computer Science A' },
  { id: 'comp-sci-p', subjectId: 'math-cs', name: 'AP Computer Science Principles' },
  { id: 'pre-calculus', subjectId: 'math-cs', name: 'AP Pre-Calculus' },
  { id: 'statistics', subjectId: 'math-cs', name: 'AP Statistics' },

  { id: 'biology', subjectId: 'science', name: 'AP Biology' },
  { id: 'chemistry', subjectId: 'science', name: 'AP Chemistry' },
  { id: 'env-science', subjectId: 'science', name: 'AP Environmental Science' },
  { id: 'physics-1', subjectId: 'science', name: 'AP Physics 1 (2025)' },
  { id: 'physics-2', subjectId: 'science', name: 'AP Physics 2 (2025)' },
  { id: 'physics-c-em', subjectId: 'science', name: 'AP Physics C: E&M (2025)' },
  { id: 'physics-c-mech', subjectId: 'science', name: 'AP Physics C: Mechanics (2025)' },

  { id: 'euro-history', subjectId: 'history', name: 'EU AP European History' },
  { id: 'us-history', subjectId: 'history', name: 'US AP US History' },
  { id: 'world-history-modern', subjectId: 'history', name: 'AP World History: Modern' },

  { id: 'african-american-studies', subjectId: 'social-science', name: 'AP African American Studies' },
  { id: 'comparative-govt', subjectId: 'social-science', name: 'AP Comparative Government' },
  { id: 'human-geography', subjectId: 'social-science', name: 'AP Human Geography' },
  { id: 'macroeconomics', subjectId: 'social-science', name: 'AP Macroeconomics' },
  { id: 'microeconomics', subjectId: 'social-science', name: 'AP Microeconomics' },
  { id: 'psychology', subjectId: 'social-science', name: 'AP Psychology (2025)' },
  { id: 'us-government', subjectId: 'social-science', name: 'AP US Government' },

  { id: 'english-lang', subjectId: 'english', name: 'AP English Language' },
  { id: 'english-lit', subjectId: 'english', name: 'AP English Literature' },

  { id: 'chinese', subjectId: 'world-languages', name: 'CN AP Chinese' },
  { id: 'french', subjectId: 'world-languages', name: 'FR AP French' },
  { id: 'german', subjectId: 'world-languages', name: 'DE AP German' },
  { id: 'italian', subjectId: 'world-languages', name: 'IT AP Italian' },
  { id: 'japanese', subjectId: 'world-languages', name: 'JP AP Japanese' },
  { id: 'latin', subjectId: 'world-languages', name: 'AP Latin' },
  { id: 'spanish-lang', subjectId: 'world-languages', name: 'ES AP Spanish Language' },
  { id: 'spanish-lit', subjectId: 'world-languages', name: 'AP Spanish Literature' },

  { id: 'art-design', subjectId: 'arts', name: 'AP Art & Design' },
  { id: 'art-history', subjectId: 'arts', name: 'AP Art History' },

  { id: 'act', subjectId: 'college-admissions', name: 'ACT' },
  { id: 'sat', subjectId: 'college-admissions', name: 'SAT' },

  { id: 'research', subjectId: 'capstone', name: 'AP Research' },
  { id: 'seminar', subjectId: 'capstone', name: 'AP Seminar' },
];

const mockUnits = [
  { id: 'calc-unit-1', courseId: 'calc-ab-bc', name: 'Unit 1: Limits and Continuity' },
  { id: 'calc-unit-2', courseId: 'calc-ab-bc', name: 'Unit 2: Differentiation: Definition and Fundamental Properties' },
  // Add more units for other courses
];

const mockMaterials = [
  { id: 'calc-unit-1-quiz-1', unitId: 'calc-unit-1', type: 'quiz', name: 'Unit 1 Quiz 1', questions: [{ question: '...', answer: '...' }] },
  { id: 'calc-unit-1-flashcards', unitId: 'calc-unit-1', type: 'flashcards', name: 'Unit 1 Flashcards', cards: [{ front: '...', back: '...' }] },
  { id: 'calc-unit-1-video-1', unitId: 'calc-unit-1', type: 'video', name: 'Limits Explained', url: 'https://www.youtube.com/watch?v=...' },
  // Add more materials for other units/courses
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // For demo, accept any email/password
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: mockUsers[0] });
});

app.post('/api/auth/signup', (req, res) => {
  const { email, password } = req.body;
  // For demo, always succeed
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: mockUsers[0] });
});

// Flashcard routes
app.get('/api/flashcards', authenticateToken, (req, res) => {
  res.json(mockFlashcards);
});

app.post('/api/flashcards', authenticateToken, (req, res) => {
  const newCard = {
    id: mockFlashcards.length + 1,
    ...req.body,
    lastReviewed: new Date().toISOString().split('T')[0]
  };
  mockFlashcards.push(newCard);
  res.status(201).json(newCard);
});

app.put('/api/flashcards/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const index = mockFlashcards.findIndex(card => card.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }
  mockFlashcards[index] = { ...mockFlashcards[index], ...req.body };
  res.json(mockFlashcards[index]);
});

app.delete('/api/flashcards/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const index = mockFlashcards.findIndex(card => card.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }
  mockFlashcards.splice(index, 1);
  res.status(204).send();
});

// New Study Routes

// Get all subjects
app.get('/api/subjects', authenticateToken, (req, res) => {
  res.json(mockSubjects);
});

// Get courses for a specific subject
app.get('/api/subjects/:subjectId/courses', authenticateToken, (req, res) => {
  const { subjectId } = req.params;
  const courses = mockCourses.filter(course => course.subjectId === subjectId);
  res.json(courses);
});

// Get units for a specific course
app.get('/api/courses/:courseId/units', authenticateToken, (req, res) => {
  const { courseId } = req.params;
  const units = mockUnits.filter(unit => unit.courseId === courseId);
  res.json(units);
});

// Get materials for a specific unit
app.get('/api/units/:unitId/materials', authenticateToken, (req, res) => {
  const { unitId } = req.params;
  const materials = mockMaterials.filter(material => material.unitId === unitId);
  res.json(materials);
});

// Get a specific material by ID
app.get('/api/materials/:materialId', authenticateToken, (req, res) => {
  const { materialId } = req.params;
  const material = mockMaterials.find(mat => mat.id === materialId);
  if (!material) {
    return res.status(404).json({ error: 'Material not found' });
  }
  res.json(material);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 