import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "../../utils/hooks";
import Highlight from "../UI/Highlight";

type SearchResult = {
  objectID: string;
  name?: string;
  title?: string;
  prompt?: string;
  subject?: string;
  uid?: string;
  description?: string;
};

type SearchResults = {
  subjects: SearchResult[];
  flashcards: SearchResult[];
  quizzes: SearchResult[];
};

const SEARCH_CATEGORIES = ["subjects", "flashcards", "quizzes"] as const;
type SearchCategory = typeof SEARCH_CATEGORIES[number];

const CATEGORY_ICONS = {
  subjects: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  ),
  flashcards: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M8 10h8" />
      <path d="M8 14h4" />
    </svg>
  ),
  quizzes: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <path d="M12 17h.01"></path>
    </svg>
  )
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeCategory, setActiveCategory] = useState<SearchCategory | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchError, setSearchError] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Reset when query changes
  useEffect(() => {
    setSelectedIndex(-1);
    setActiveCategory(null);
  }, [debouncedQuery]);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults(null);
        setTotalCount(0);
        return;
      }
      
      setLoading(true);
      setSearchError(false);
      
      try {
        // Dynamically import to avoid SSR issues
        const { searchAll } = await import("../../utils/algolia");
        const searchResults = await searchAll(debouncedQuery);
        setResults(searchResults);
        setTotalCount(
          searchResults.subjects.length + 
          searchResults.flashcards.length + 
          searchResults.quizzes.length
        );
      } catch (error) {
        console.error("Search error:", error);
        setSearchError(true);
        setResults({
          subjects: [],
          flashcards: [],
          quizzes: []
        });
      } finally {
        setLoading(false);
      }
    };
    
    performSearch();
  }, [debouncedQuery]);

  // Set focus on input when opened
  useEffect(() => {
    if (showResults) {
      inputRef.current?.focus();
    }
  }, [showResults]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowResults(true);
      }
      // Escape to close
      else if (e.key === 'Escape' && showResults) {
        e.preventDefault();
        setShowResults(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showResults]);
  
  // Get flat list of all results
  const getCurrentResults = () => {
    if (!results) return [];
    
    if (activeCategory) {
      return results[activeCategory] || [];
    }
    
    const allResults = [
      ...results.subjects,
      ...results.flashcards, 
      ...results.quizzes
    ];
    
    return allResults;
  };
  
  // Handle keyboard navigation in results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentResults = getCurrentResults();
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => {
        const newIndex = prev < currentResults.length - 1 ? prev + 1 : 0;
        resultRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' });
        return newIndex;
      });
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => {
        const newIndex = prev > 0 ? prev - 1 : currentResults.length - 1;
        resultRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' });
        return newIndex;
      });
    }
    else if (e.key === 'Enter' && selectedIndex >= 0 && currentResults[selectedIndex]) {
      e.preventDefault();
      handleResultClick(currentResults[selectedIndex]);
    }
    else if (e.key === 'Tab') {
      e.preventDefault();
      // Cycle through categories
      const categoryIndex = activeCategory 
        ? SEARCH_CATEGORIES.indexOf(activeCategory)
        : -1;
      const nextCategoryIndex = (categoryIndex + 1) % SEARCH_CATEGORIES.length;
      setActiveCategory(SEARCH_CATEGORIES[nextCategoryIndex]);
      setSelectedIndex(-1);
    }
  };
  
  // Handle clicking on a result
  const handleResultClick = (result: SearchResult) => {
    // Navigate to the appropriate page
    const category = getResultCategory(result);
    
    if (category === 'subjects') {
      window.location.href = `/subjects/${result.objectID}`;
    } else if (category === 'flashcards') {
      window.location.href = `/flashcards/${result.objectID}`;
    } else if (category === 'quizzes') {
      window.location.href = `/quizzes/${result.objectID}`;
    }
    
    setShowResults(false);
  };
  
  // Determine which category a result belongs to
  const getResultCategory = (result: SearchResult): SearchCategory => {
    if (result.name && !result.title) return 'subjects';
    if (result.prompt) return 'flashcards';
    return 'quizzes';
  };
  
  // Clear search
  const clearSearch = () => {
    setQuery("");
    setResults(null);
    setSelectedIndex(-1);
    setActiveCategory(null);
    inputRef.current?.focus();
  };
  
  // Toggle category filter
  const toggleCategory = (category: SearchCategory) => {
    setActiveCategory(prev => prev === category ? null : category);
    setSelectedIndex(-1);
  };

  // Render individual result item
  const renderResultItem = (result: SearchResult, index: number, resultIndex: number) => {
    const category = getResultCategory(result);
    const isSelected = selectedIndex === resultIndex;
    
    return (
      <li key={result.objectID} className="px-2">
        <button
          ref={el => resultRefs.current[resultIndex] = el}
          className={`w-full text-left p-2 rounded-lg transition-colors ${
            isSelected 
              ? 'bg-accent1-light/10 dark:bg-accent1-dark/10 text-accent1-light dark:text-accent1-dark' 
              : 'hover:bg-surface-hover-light dark:hover:bg-surface-hover-dark'
          }`}
          onClick={() => handleResultClick(result)}
          onMouseEnter={() => setSelectedIndex(resultIndex)}
        >
          <div className="flex items-center">
            <span className={`mr-3 h-8 w-8 flex items-center justify-center rounded-full ${
              isSelected 
                ? 'bg-accent1-light dark:bg-accent1-dark text-white' 
                : 'bg-surface-secondary-light dark:bg-surface-secondary-dark text-text-secondary-light dark:text-text-secondary-dark'
            }`}>
              {CATEGORY_ICONS[category]}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">
                {result.name || result.title || "Untitled"}
              </div>
              <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">
                {result.description?.substring(0, 60) || result.prompt?.substring(0, 60) || category}
                {(result.description?.length || 0) > 60 || (result.prompt?.length || 0) > 60 ? "..." : ""}
              </div>
            </div>
          </div>
        </button>
      </li>
    );
  };
  
  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Search Input */}
                <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="block w-full pl-10 pr-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-accent1-light dark:focus:ring-accent1-dark outline-none placeholder-text-secondary-light dark:placeholder-text-secondary-dark transition"
                    placeholder="Search subjects, flashcards, quizzes..."
                    aria-label="Search"
                  />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {query && (
                    <button 
              className="p-1 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
                      onClick={clearSearch}
                      aria-label="Clear search"
                    >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
          )}
          <div className="ml-2 hidden md:flex items-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
            <kbd className="px-1.5 py-0.5 bg-surface-secondary-light dark:bg-surface-secondary-dark rounded border border-border-light dark:border-border-dark mr-1">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-surface-secondary-light dark:bg-surface-secondary-dark rounded border border-border-light dark:border-border-dark">K</kbd>
                </div>
                  </div>
              </div>
              
      {/* Results dropdown */}
      <AnimatePresence>
        {showResults && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 dark:bg-black/60 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResults(false)}
            />
            
            {/* Results panel */}
            <motion.div
              className="absolute left-0 right-0 mt-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg overflow-hidden z-40 max-h-[80vh] flex flex-col"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Category tabs */}
              <div className="flex border-b border-border-light dark:border-border-dark">
                    <button 
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    !activeCategory ? 'bg-accent1-light/10 dark:bg-accent1-dark/10 text-accent1-light dark:text-accent1-dark border-b-2 border-accent1-light dark:border-accent1-dark' 
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-hover-light dark:hover:bg-surface-hover-dark'
                  }`}
                  onClick={() => setActiveCategory(null)}
                >
                  All Results
                  {totalCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-surface-secondary-light dark:bg-surface-secondary-dark">
                      {totalCount}
                    </span>
                  )}
                </button>
                
                {SEARCH_CATEGORIES.map((category) => (
                      <button
                        key={category}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeCategory === category 
                        ? 'bg-accent1-light/10 dark:bg-accent1-dark/10 text-accent1-light dark:text-accent1-dark border-b-2 border-accent1-light dark:border-accent1-dark' 
                        : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-hover-light dark:hover:bg-surface-hover-dark'
                    }`}
                        onClick={() => toggleCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    {results && results[category].length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-surface-secondary-light dark:bg-surface-secondary-dark">
                            {results[category].length}
                          </span>
                        )}
                      </button>
                    ))}
              </div>
              
              {/* Results list */}
              <div className="flex-1 overflow-y-auto min-h-[200px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent1-light dark:border-accent1-dark"></div>
                    <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">Searching...</p>
                  </div>
                ) : results && totalCount > 0 ? (
                  <div className="p-2">
                    <AnimatePresence>
                      <ul className="space-y-1">
                        {/* All results or filtered by category */}
                        {!activeCategory && results.subjects.length > 0 && (
                          <>
                            <li className="px-2 py-1 text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                              Subjects ({results.subjects.length})
                            </li>
                            {results.subjects.map((subject, idx) => 
                              renderResultItem(subject, idx, idx)
                            )}
                          </>
                        )}
                        
                        {!activeCategory && results.flashcards.length > 0 && (
                          <>
                            <li className="px-2 py-1 text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark mt-2">
                              Flashcards ({results.flashcards.length})
                            </li>
                            {results.flashcards.map((flashcard, idx) => 
                              renderResultItem(flashcard, idx, results.subjects.length + idx)
                            )}
                          </>
                        )}
                        
                        {!activeCategory && results.quizzes.length > 0 && (
                          <>
                            <li className="px-2 py-1 text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark mt-2">
                              Quizzes ({results.quizzes.length})
                            </li>
                            {results.quizzes.map((quiz, idx) => 
                              renderResultItem(quiz, idx, results.subjects.length + results.flashcards.length + idx)
                            )}
                          </>
                        )}
                        
                        {activeCategory === "subjects" && results.subjects.length > 0 && (
                          <>
                            <li className="px-2 py-1 text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                              Subjects ({results.subjects.length})
                            </li>
                            {results.subjects.map((subject, idx) => 
                              renderResultItem(subject, idx, idx)
                            )}
                          </>
                        )}
                        
                        {activeCategory === "flashcards" && results.flashcards.length > 0 && (
                          <>
                            <li className="px-2 py-1 text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                              Flashcards ({results.flashcards.length})
                            </li>
                            {results.flashcards.map((flashcard, idx) => 
                              renderResultItem(flashcard, idx, idx)
                            )}
                          </>
                        )}
                        
                        {activeCategory === "quizzes" && results.quizzes.length > 0 && (
                          <>
                            <li className="px-2 py-1 text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark mt-2">
                              Quizzes ({results.quizzes.length})
                            </li>
                            {results.quizzes.map((quiz, idx) => 
                              renderResultItem(quiz, idx, idx)
                            )}
                          </>
                        )}
                      </ul>
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-surface-secondary-light dark:bg-surface-secondary-dark mb-4">
                      <svg className="h-8 w-8 text-text-secondary-light dark:text-text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 6a9 9 0 110 18 9 9 0 010-18z" />
                      </svg>
                    </div>
                    <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-2">No results found</p>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              {results && totalCount > 0 && (
                <div className="px-4 py-3 border-t border-border-light dark:border-border-dark bg-surface-secondary-light dark:bg-surface-secondary-dark text-sm text-text-secondary-light dark:text-text-secondary-dark flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Use <kbd className="px-1.5 py-0.5 bg-surface-light dark:bg-surface-dark rounded text-xs mx-1">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-surface-light dark:bg-surface-dark rounded text-xs mx-1">↓</kbd> to navigate,
                      <kbd className="px-1.5 py-0.5 bg-surface-light dark:bg-surface-dark rounded text-xs mx-1">Enter</kbd> to select,
                      <kbd className="px-1.5 py-0.5 bg-surface-light dark:bg-surface-dark rounded text-xs mx-1">Tab</kbd> to filter
                    </span>
                  </div>
                  <div>
                    <kbd className="px-1.5 py-0.5 bg-surface-light dark:bg-surface-dark rounded text-xs">ESC</kbd> to close
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 