import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Unit {
  id: string;
  title: string;
  description: string;
  examWeight?: number;
  subunits: Subunit[];
  videoId?: string;
  order: number;
}

interface Subunit {
  id: string;
  title: string;
  topics: string[];
  order: number;
}

export default function SubjectUnitsIsland({ subjectId }: { subjectId: string }) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [focusedUnitId, setFocusedUnitId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch units for this subject
        const unitsQuery = query(
          collection(db, "subjects", subjectId, "units"),
          orderBy("order", "asc")
        );
        const unitSnap = await getDocs(unitsQuery);
        
        const unitsData: Unit[] = [];
        
        // Process each unit
        for (const unitDoc of unitSnap.docs) {
          const unitData = unitDoc.data() as Omit<Unit, "id" | "subunits">;
          
          // Fetch subunits for this unit
          const subunitsQuery = query(
            collection(db, "subjects", subjectId, "units", unitDoc.id, "subunits"),
            orderBy("order", "asc")
          );
          const subunitsSnap = await getDocs(subunitsQuery);
          
          const subunits: Subunit[] = subunitsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Subunit, "id">
          }));
          
          unitsData.push({
            id: unitDoc.id,
            ...unitData,
            subunits
          });
        }
        
        setUnits(unitsData);
      } catch (err: any) {
        console.error("Error fetching units:", err);
        setError(err.message || "Failed to load units.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUnits();
  }, [subjectId]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };
  
  // Calculate total exam weight
  const totalExamWeight = units.reduce((total, unit) => total + (unit.examWeight || 0), 0);
  
  if (loading) {
    return (
      <div className="my-8 text-center p-10">
        <div className="flex justify-center mb-4">
          <svg className="animate-spin h-10 w-10 text-accent1-light dark:text-accent1-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="font-medium text-accent1-light dark:text-accent1-dark animate-pulse">Loading curriculum content...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="my-8 text-center p-8 bg-error-light/10 dark:bg-error-dark/10 rounded-xl">
        <svg className="h-12 w-12 mx-auto text-error-light dark:text-error-dark mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-bold text-error-light dark:text-error-dark mb-2">Unable to load curriculum</h3>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">{error}</p>
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  if (units.length === 0) {
    return (
      <div className="my-8 text-center p-10 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm">
        <div className="inline-flex justify-center items-center mb-4 p-4 rounded-full bg-surface-secondary-light dark:bg-surface-secondary-dark">
          <svg className="h-8 w-8 text-text-secondary-light dark:text-text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="font-heading text-xl mb-3">Curriculum Coming Soon</h3>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4 max-w-md mx-auto">
          We're currently developing comprehensive curriculum content for this subject. Check back soon!
        </p>
        <Button variant="outline" size="sm">
          Request Updates
        </Button>
      </div>
    );
  }

  return (
    <div className="my-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold font-heading bg-gradient-to-r from-accent1-light to-accent2-light dark:from-accent1-dark dark:to-accent2-dark bg-clip-text text-transparent">
          Curriculum Units
        </h2>
        
        {totalExamWeight > 0 && (
          <div className="flex items-center px-4 py-2 rounded-full bg-surface-secondary-light dark:bg-surface-secondary-dark text-text-secondary-light dark:text-text-secondary-dark text-sm">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Displaying {units.length} units covering {totalExamWeight}% of exam content
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {units.map((unit, index) => {
          const { ref, inView } = useInView({
            triggerOnce: true,
            threshold: 0.1,
          });
          
          return (
            <motion.div 
              key={unit.id}
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl overflow-hidden border shadow-sm transition-all duration-300 
                ${expandedUnit === unit.id ? 'border-accent1-light dark:border-accent1-dark shadow-accent1-light/5 dark:shadow-accent1-dark/5' : 'border-border-light dark:border-border-dark'} 
                ${focusedUnitId === unit.id ? 'ring-2 ring-accent1-light dark:ring-accent1-dark' : ''}`}
              onMouseEnter={() => setFocusedUnitId(unit.id)}
              onMouseLeave={() => setFocusedUnitId(null)}
              onFocus={() => setFocusedUnitId(unit.id)}
              onBlur={() => setFocusedUnitId(null)}
            >
              <div 
                onClick={() => toggleUnit(unit.id)}
                className={`flex justify-between items-center p-5 bg-surface-light dark:bg-surface-dark cursor-pointer hover:bg-surface-hover-light dark:hover:bg-surface-hover-dark transition-colors ${expandedUnit === unit.id ? 'bg-gradient-to-r from-surface-light to-surface-hover-light dark:from-surface-dark dark:to-surface-hover-dark' : ''}`}
                role="button"
                aria-expanded={expandedUnit === unit.id}
                aria-controls={`unit-content-${unit.id}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleUnit(unit.id);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg text-white font-bold 
                    ${expandedUnit === unit.id ? 'bg-accent1-light dark:bg-accent1-dark' : 'bg-accent2-light/80 dark:bg-accent2-dark/80'}`}>
                    {unit.order}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">
                      {unit.title}
                    </h3>
                    {unit.examWeight && (
                      <div className="flex items-center mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 6v6l4 2"></path>
                        </svg>
                        {unit.examWeight}% of exam
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label={expandedUnit === unit.id ? "Collapse unit" : "Expand unit"}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="relative"
                >
                  <motion.div
                    animate={{ rotate: expandedUnit === unit.id ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </motion.div>
                </Button>
              </div>
              
              <AnimatePresence>
                {expandedUnit === unit.id && (
                  <motion.div
                    id={`unit-content-${unit.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="p-6 border-t border-border-light dark:border-border-dark">
                      <p className="mb-6 leading-relaxed">{unit.description}</p>
                      
                      {unit.videoId && (
                        <motion.div 
                          className="mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h4 className="font-heading font-medium mb-3 flex items-center">
                            <svg className="h-5 w-5 mr-2 text-accent2-light dark:text-accent2-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            College Board Video
                          </h4>
                          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
                            <iframe 
                              width="100%" 
                              height="100%"
                              src={`https://www.youtube.com/embed/${unit.videoId}`}
                              title={`Unit ${unit.order}: ${unit.title}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </motion.div>
                      )}
                      
                      {unit.subunits.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h4 className="font-heading font-medium mb-3 flex items-center">
                            <svg className="h-5 w-5 mr-2 text-accent1-light dark:text-accent1-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Subunits
                          </h4>
                          <div className="space-y-3">
                            {unit.subunits.map((subunit, idx) => (
                              <motion.div 
                                key={subunit.id} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                              >
                                <Card className="bg-surface-secondary-light dark:bg-surface-secondary-dark hover:shadow-md transition-shadow">
                                  <div className="p-4">
                                    <h5 className="font-heading font-medium flex items-center">
                                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent1-light/15 dark:bg-accent1-dark/15 text-accent1-light dark:text-accent1-dark text-xs mr-2">
                                        {unit.order}.{subunit.order}
                                      </span>
                                      {subunit.title}
                                    </h5>
                                    {subunit.topics.length > 0 && (
                                      <ul className="mt-3 space-y-2 text-sm">
                                        {subunit.topics.map((topic, i) => (
                                          <li key={i} className="flex items-start">
                                            <span className="mr-2 mt-0.5 text-accent2-light dark:text-accent2-dark">•</span>
                                            <span>{topic}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      <motion.div 
                        className="mt-6 flex flex-wrap gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group hover:bg-accent2-light/10 dark:hover:bg-accent2-dark/10 hover:border-accent2-light dark:hover:border-accent2-dark transition-colors"
                        >
                          <motion.svg 
                            className="mr-1.5 h-4 w-4 text-accent2-light dark:text-accent2-dark group-hover:scale-110 transition-transform" 
                            viewBox="0 0 24 24"
                            whileHover={{ rotate: 10 }}
                          >
                            <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 8v8m-4-4h8"></path>
                          </motion.svg>
                          Flashcards
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="group hover:bg-info-light/10 dark:hover:bg-info-dark/10 hover:border-info-light dark:hover:border-info-dark transition-colors"
                        >
                          <motion.svg 
                            className="mr-1.5 h-4 w-4 text-info-light dark:text-info-dark group-hover:scale-110 transition-transform" 
                            viewBox="0 0 24 24"
                            whileHover={{ rotate: 10 }}
                          >
                            <path fill="none" stroke="currentColor" strokeWidth="2" d="M9 12h6m-3-3v6"></path>
                          </motion.svg>
                          Practice Quiz
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group hover:bg-warning-light/10 dark:hover:bg-warning-dark/10 hover:border-warning-light dark:hover:border-warning-dark transition-colors"
                        >
                          <motion.svg 
                            className="mr-1.5 h-4 w-4 text-warning-light dark:text-warning-dark group-hover:scale-110 transition-transform" 
                            viewBox="0 0 24 24"
                            whileHover={{ rotate: 10 }}
                          >
                            <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 8v8m-4-4h8"></path>
                          </motion.svg>
                          FRQs
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Unit {
  id: string;
  title: string;
  description: string;
  examWeight?: number;
  subunits: Subunit[];
  videoId?: string;
  order: number;
}

interface Subunit {
  id: string;
  title: string;
  topics: string[];
  order: number;
}

export default function SubjectUnitsIsland({ subjectId }: { subjectId: string }) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [focusedUnitId, setFocusedUnitId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch units for this subject
        const unitsQuery = query(
          collection(db, "subjects", subjectId, "units"),
          orderBy("order", "asc")
        );
        const unitSnap = await getDocs(unitsQuery);
        
        const unitsData: Unit[] = [];
        
        // Process each unit
        for (const unitDoc of unitSnap.docs) {
          const unitData = unitDoc.data() as Omit<Unit, "id" | "subunits">;
          
          // Fetch subunits for this unit
          const subunitsQuery = query(
            collection(db, "subjects", subjectId, "units", unitDoc.id, "subunits"),
            orderBy("order", "asc")
          );
          const subunitsSnap = await getDocs(subunitsQuery);
          
          const subunits: Subunit[] = subunitsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Subunit, "id">
          }));
          
          unitsData.push({
            id: unitDoc.id,
            ...unitData,
            subunits
          });
        }
        
        setUnits(unitsData);
      } catch (err: any) {
        console.error("Error fetching units:", err);
        setError(err.message || "Failed to load units.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUnits();
  }, [subjectId]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };
  
  // Calculate total exam weight
  const totalExamWeight = units.reduce((total, unit) => total + (unit.examWeight || 0), 0);
  
  if (loading) {
    return (
      <div className="my-8 text-center p-10">
        <div className="flex justify-center mb-4">
          <svg className="animate-spin h-10 w-10 text-accent1-light dark:text-accent1-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="font-medium text-accent1-light dark:text-accent1-dark animate-pulse">Loading curriculum content...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="my-8 text-center p-8 bg-error-light/10 dark:bg-error-dark/10 rounded-xl">
        <svg className="h-12 w-12 mx-auto text-error-light dark:text-error-dark mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-bold text-error-light dark:text-error-dark mb-2">Unable to load curriculum</h3>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">{error}</p>
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  if (units.length === 0) {
    return (
      <div className="my-8 text-center p-10 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm">
        <div className="inline-flex justify-center items-center mb-4 p-4 rounded-full bg-surface-secondary-light dark:bg-surface-secondary-dark">
          <svg className="h-8 w-8 text-text-secondary-light dark:text-text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="font-heading text-xl mb-3">Curriculum Coming Soon</h3>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4 max-w-md mx-auto">
          We're currently developing comprehensive curriculum content for this subject. Check back soon!
        </p>
        <Button variant="outline" size="sm">
          Request Updates
        </Button>
      </div>
    );
  }

  return (
    <div className="my-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold font-heading bg-gradient-to-r from-accent1-light to-accent2-light dark:from-accent1-dark dark:to-accent2-dark bg-clip-text text-transparent">
          Curriculum Units
        </h2>
        
        {totalExamWeight > 0 && (
          <div className="flex items-center px-4 py-2 rounded-full bg-surface-secondary-light dark:bg-surface-secondary-dark text-text-secondary-light dark:text-text-secondary-dark text-sm">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Displaying {units.length} units covering {totalExamWeight}% of exam content
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {units.map((unit, index) => {
          const { ref, inView } = useInView({
            triggerOnce: true,
            threshold: 0.1,
          });
          
          return (
            <motion.div 
              key={unit.id}
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl overflow-hidden border shadow-sm transition-all duration-300 
                ${expandedUnit === unit.id ? 'border-accent1-light dark:border-accent1-dark shadow-accent1-light/5 dark:shadow-accent1-dark/5' : 'border-border-light dark:border-border-dark'} 
                ${focusedUnitId === unit.id ? 'ring-2 ring-accent1-light dark:ring-accent1-dark' : ''}`}
              onMouseEnter={() => setFocusedUnitId(unit.id)}
              onMouseLeave={() => setFocusedUnitId(null)}
              onFocus={() => setFocusedUnitId(unit.id)}
              onBlur={() => setFocusedUnitId(null)}
            >
              <div 
                onClick={() => toggleUnit(unit.id)}
                className={`flex justify-between items-center p-5 bg-surface-light dark:bg-surface-dark cursor-pointer hover:bg-surface-hover-light dark:hover:bg-surface-hover-dark transition-colors ${expandedUnit === unit.id ? 'bg-gradient-to-r from-surface-light to-surface-hover-light dark:from-surface-dark dark:to-surface-hover-dark' : ''}`}
                role="button"
                aria-expanded={expandedUnit === unit.id}
                aria-controls={`unit-content-${unit.id}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleUnit(unit.id);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg text-white font-bold 
                    ${expandedUnit === unit.id ? 'bg-accent1-light dark:bg-accent1-dark' : 'bg-accent2-light/80 dark:bg-accent2-dark/80'}`}>
                    {unit.order}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">
                      {unit.title}
                    </h3>
                    {unit.examWeight && (
                      <div className="flex items-center mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 6v6l4 2"></path>
                        </svg>
                        {unit.examWeight}% of exam
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label={expandedUnit === unit.id ? "Collapse unit" : "Expand unit"}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="relative"
                >
                  <motion.div
                    animate={{ rotate: expandedUnit === unit.id ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </motion.div>
                </Button>
              </div>
              
              <AnimatePresence>
                {expandedUnit === unit.id && (
                  <motion.div
                    id={`unit-content-${unit.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="p-6 border-t border-border-light dark:border-border-dark">
                      <p className="mb-6 leading-relaxed">{unit.description}</p>
                      
                      {unit.videoId && (
                        <motion.div 
                          className="mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h4 className="font-heading font-medium mb-3 flex items-center">
                            <svg className="h-5 w-5 mr-2 text-accent2-light dark:text-accent2-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            College Board Video
                          </h4>
                          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
                            <iframe 
                              width="100%" 
                              height="100%"
                              src={`https://www.youtube.com/embed/${unit.videoId}`}
                              title={`Unit ${unit.order}: ${unit.title}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </motion.div>
                      )}
                      
                      {unit.subunits.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h4 className="font-heading font-medium mb-3 flex items-center">
                            <svg className="h-5 w-5 mr-2 text-accent1-light dark:text-accent1-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Subunits
                          </h4>
                          <div className="space-y-3">
                            {unit.subunits.map((subunit, idx) => (
                              <motion.div 
                                key={subunit.id} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                              >
                                <Card className="bg-surface-secondary-light dark:bg-surface-secondary-dark hover:shadow-md transition-shadow">
                                  <div className="p-4">
                                    <h5 className="font-heading font-medium flex items-center">
                                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent1-light/15 dark:bg-accent1-dark/15 text-accent1-light dark:text-accent1-dark text-xs mr-2">
                                        {unit.order}.{subunit.order}
                                      </span>
                                      {subunit.title}
                                    </h5>
                                    {subunit.topics.length > 0 && (
                                      <ul className="mt-3 space-y-2 text-sm">
                                        {subunit.topics.map((topic, i) => (
                                          <li key={i} className="flex items-start">
                                            <span className="mr-2 mt-0.5 text-accent2-light dark:text-accent2-dark">•</span>
                                            <span>{topic}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      <motion.div 
                        className="mt-6 flex flex-wrap gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group hover:bg-accent2-light/10 dark:hover:bg-accent2-dark/10 hover:border-accent2-light dark:hover:border-accent2-dark transition-colors"
                        >
                          <motion.svg 
                            className="mr-1.5 h-4 w-4 text-accent2-light dark:text-accent2-dark group-hover:scale-110 transition-transform" 
                            viewBox="0 0 24 24"
                            whileHover={{ rotate: 10 }}
                          >
                            <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 8v8m-4-4h8"></path>
                          </motion.svg>
                          Flashcards
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="group hover:bg-info-light/10 dark:hover:bg-info-dark/10 hover:border-info-light dark:hover:border-info-dark transition-colors"
                        >
                          <motion.svg 
                            className="mr-1.5 h-4 w-4 text-info-light dark:text-info-dark group-hover:scale-110 transition-transform" 
                            viewBox="0 0 24 24"
                            whileHover={{ rotate: 10 }}
                          >
                            <path fill="none" stroke="currentColor" strokeWidth="2" d="M9 12h6m-3-3v6"></path>
                          </motion.svg>
                          Practice Quiz
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group hover:bg-warning-light/10 dark:hover:bg-warning-dark/10 hover:border-warning-light dark:hover:border-warning-dark transition-colors"
                        >
                          <motion.svg 
                            className="mr-1.5 h-4 w-4 text-warning-light dark:text-warning-dark group-hover:scale-110 transition-transform" 
                            viewBox="0 0 24 24"
                            whileHover={{ rotate: 10 }}
                          >
                            <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 8v8m-4-4h8"></path>
                          </motion.svg>
                          FRQs
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 