import algoliasearch from 'algoliasearch';

const ALGOLIA_APP_ID = '6CLC9IHNM3';
const ALGOLIA_WRITE_API_KEY = '682b10e08065ebb590f50e26224124dd';

// Create Algolia client
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_API_KEY);

// Export client
export const algoliaClient = client;

// Export indices
export const subjectsIndex = client.initIndex('subjects');
export const flashcardsIndex = client.initIndex('flashcards');
export const quizzesIndex = client.initIndex('quizzes');
