import { algoliasearch } from 'algoliasearch';

// Algolia credentials (for search only)
const ALGOLIA_APP_ID = '6CLC9IHNM3';
const ALGOLIA_SEARCH_API_KEY = 'f67c9f44a6296667bfc74fcacc255781';

// Initialize Algolia client with search API key (read-only)
const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);

// Init and export indices
export const subjectsIndex = searchClient.initIndex('subjects');
export const flashcardsIndex = searchClient.initIndex('flashcards');
export const quizzesIndex = searchClient.initIndex('quizzes');

// Helper to search across all indices
export const searchAll = async (query: string) => {
  const [subjectsResults, flashcardsResults, quizzesResults] = await Promise.all([
    subjectsIndex.search(query),
    flashcardsIndex.search(query),
    quizzesIndex.search(query)
  ]);
  
  return {
    subjects: subjectsResults.hits,
    flashcards: flashcardsResults.hits,
    quizzes: quizzesResults.hits
  };
};

export default searchClient; 