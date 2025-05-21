import React, { useState, useRef, useEffect } from "react";
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState as useToastState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation, useSpring, useScroll } from "framer-motion";
import confetti from "canvas-confetti";
import * as THREE from "three";
import gsap from "gsap";
import { useInView } from "react-intersection-observer";
import { useFirebase } from "../../firebase/init";

interface PomodoroIslandProps {
  onClose: () => void;
}

// Default timer durations (in seconds)
const DEFAULT_DURATIONS = {
  work: {
    short: 15 * 60, // 15 minutes
    default: 25 * 60, // 25 minutes
    long: 50 * 60, // 50 minutes
  },
  break: {
    short: 3 * 60, // 3 minutes
    default: 5 * 60, // 5 minutes
    long: 10 * 60, // 10 minutes
  }
};

// Type for duration settings
type DurationType = "short" | "default" | "long";

// Add new interfaces for tasks and statistics
interface Task {
  id: string;
  title: string;
  completed: boolean;
  pomodoros: number;
  createdAt: Date;
}

interface Statistics {
  totalPomodoros: number;
  totalFocusTime: number;
  dailyStreak: number;
  bestStreak: number;
  lastCompletedAt: Date;
}

// Enhanced CustomCursor with magnetic effect
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 30 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 30 });
  const cursorInnerX = useSpring(mouseX, { stiffness: 700, damping: 30 });
  const cursorInnerY = useSpring(mouseY, { stiffness: 700, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-accent1-light dark:border-accent1-dark pointer-events-none z-50 mix-blend-difference"
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        ref={cursorInnerRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent1-light dark:bg-accent1-dark pointer-events-none z-50"
        style={{ x: cursorInnerX, y: cursorInnerY }}
      />
      {/* Cursor trail effect */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent1-light/30 dark:bg-accent1-dark/30 pointer-events-none z-40"
          style={{
            x: useSpring(mouseX, { 
              stiffness: 100 - i * 10,
              damping: 30
            }),
            y: useSpring(mouseY, { 
              stiffness: 100 - i * 10,
              damping: 30
            }),
            scale: useSpring(1 - i * 0.1, { 
              stiffness: 100,
              damping: 30
            })
          }}
        />
      ))}
    </>
  );
};

// Enhanced Background3D with dynamic particles
const Background3D = ({ theme, isRunning }: { theme: string; isRunning: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: theme === "ocean" ? 0x4a90e2 : theme === "forest" ? 0x2ecc71 : 0xff6b6b,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0005;
        particlesRef.current.rotation.y += 0.0005;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Enhanced particle behavior
    const handleMouseMove = (e: MouseEvent) => {
      if (!particlesRef.current) return;
      
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Create ripple effect
      const ripple = new THREE.Mesh(
        new THREE.CircleGeometry(0.1, 32),
        new THREE.MeshBasicMaterial({
          color: theme === "ocean" ? 0x4a90e2 : theme === "forest" ? 0x2ecc71 : 0xff6b6b,
          transparent: true,
          opacity: 0.5
        })
      );
      
      ripple.position.set(mouseX * 5, mouseY * 5, 0);
      sceneRef.current?.add(ripple);
      
      gsap.to(ripple.scale, {
        x: 2,
        y: 2,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          sceneRef.current?.remove(ripple);
        }
      });
      
      gsap.to(ripple.material, {
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      });
      
      // Update particle rotation
      gsap.to(particlesRef.current.rotation, {
        x: mouseY * 0.2,
        y: mouseX * 0.2,
        duration: 1,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      scene.clear();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme, isRunning]);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

// Enhanced Timer Display Component
const TimerDisplay = ({ seconds, isBreak, themeClasses, progress }: {
  seconds: number;
  isBreak: boolean;
  themeClasses: any;
  progress: number;
}) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  // Format time as MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const secs = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  return (
    <motion.div
      ref={ref}
      className="relative flex items-center justify-center w-48 h-48"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Glowing background effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-accent1-light/20 to-accent2-light/20 dark:from-accent1-dark/20 dark:to-accent2-dark/20 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 3D Progress Ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className={`stop-color-${themeClasses.progress.split(' ')[0].split('-')[1]}-${themeClasses.progress.split(' ')[0].split('-')[2]}`} />
            <stop offset="100%" className={`stop-color-${themeClasses.progress.split(' ')[2].split('-')[1]}-${themeClasses.progress.split(' ')[2].split('-')[2]}`} />
          </linearGradient>
        </defs>
        
        {/* Background circle with 3D effect */}
        <circle 
          cx="50" cy="50" r="45" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="4"
          className="text-surface-secondary-light dark:text-surface-secondary-dark"
          style={{
            filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
          }}
        />
        
        {/* Progress circle with 3D effect */}
        <motion.circle 
          cx="50" cy="50" r="45" 
          fill="none" 
          stroke="url(#progressGradient)" 
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="283"
          animate={{ 
            strokeDashoffset: 283 - (283 * progress) / 100 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))"
          }}
        />
      </svg>
      
      {/* Timer text with 3D effect */}
      <motion.div
        className="text-5xl font-mono font-bold relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-accent1-light to-accent2-light dark:from-accent1-dark dark:to-accent2-dark"
        style={{
          textShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transform: "translateZ(20px)"
        }}
        animate={{
          scale: [1, 1.05, 1],
          rotateX: [0, 5, 0],
          rotateY: [0, 5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {formatTime(seconds)}
      </motion.div>
    </motion.div>
  );
};

export default function PomodoroIsland({ onClose }: PomodoroIslandProps) {
  // Timer state
  const [workDurationType, setWorkDurationType] = useState<DurationType>("default");
  const [breakDurationType, setBreakDurationType] = useState<DurationType>("default");
  const [seconds, setSeconds] = useState(DEFAULT_DURATIONS.work.default);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(4); // Default goal: 4 pomodoros
  
  // Audio references
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useToastState<string | null>(null);
  const [theme, setTheme] = useState<"default" | "ocean" | "forest">("default");
  
  // Element refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startPauseRef = useRef<HTMLButtonElement | null>(null);

  // Firebase state
  const [firebaseModule, setFirebaseModule] = useState<any>(null);
  const [db, setDb] = useState<any>(null);

  // Initialize Firebase when component mounts
  useEffect(() => {
    useFirebase((module) => {
      setFirebaseModule(module);
      if (module.db) {
        setDb(module.db);
      } else if (module.app) {
        setDb(getFirestore(module.app));
      }
    });
  }, []);

  // Current duration values based on settings
  const currentWorkDuration = DEFAULT_DURATIONS.work[workDurationType];
  const currentBreakDuration = DEFAULT_DURATIONS.break[breakDurationType];

  // Percentage of time elapsed for progress indicator
  const totalDuration = isBreak ? currentBreakDuration : currentWorkDuration;
  const progress = (1 - seconds / totalDuration) * 100;
  
  // Theme-based color classes
  const getThemeClasses = () => {
    switch (theme) {
      case "ocean":
        return {
          accent: "bg-blue-500 text-white",
          progress: "from-blue-400 to-cyan-500",
          text: "text-blue-500"
        };
      case "forest":
        return {
          accent: "bg-emerald-600 text-white",
          progress: "from-emerald-600 to-green-400",
          text: "text-emerald-600"
        };
      default:
        return {
          accent: "bg-accent1-light dark:bg-accent1-dark text-white",
          progress: "from-accent1-light to-accent2-light dark:from-accent1-dark dark:to-accent2-dark",
          text: "text-accent1-light dark:text-accent1-dark"
        };
    }
  };
  
  const themeClasses = getThemeClasses();

  // Add new state for 3D effects
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);
  const scale = useSpring(1, {
    stiffness: 300,
    damping: 20
  });

  useEffect(() => {
    scale.set(isHovered ? 1.05 : 1);
  }, [isHovered, scale]);

  // Add new state for tasks and statistics
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [statistics, setStatistics] = useState<Statistics>({
    totalPomodoros: 0,
    totalFocusTime: 0,
    dailyStreak: 0,
    bestStreak: 0,
    lastCompletedAt: new Date(),
  });
  const [showStats, setShowStats] = useState(false);
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  
  // Animation controls
  const timerControls = useAnimation();
  const statsControls = useAnimation();
  
  // Enhanced timer display with 3D effect
  const [timerRotation, setTimerRotation] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (!timerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = timerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setTimerRotation({
        x: y * 20,
        y: x * 20
      });
    };
    
    timerRef.current.addEventListener("mousemove", handleMouseMove);
    return () => timerRef.current?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Load tasks and statistics from Firebase
  useEffect(() => {
    const loadData = async () => {
      const user = getAuth().currentUser;
      if (!user) return;
      
      // Load tasks
      const tasksRef = collection(db, `users/${user.uid}/tasks`);
      const tasksSnapshot = await getDocs(tasksRef);
      const tasksData = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksData);
      
      // Load statistics
      const statsRef = doc(db, `users/${user.uid}/statistics`);
      const statsSnap = await getDoc(statsRef);
      if (statsSnap.exists()) {
        setStatistics(statsSnap.data() as Statistics);
      }
    };
    
    loadData();
  }, [db]);

  // Handle session completion
  const handleSessionComplete = async () => {
    try {
      // Play completion sound
      if (soundEnabled && completeSoundRef.current) {
        completeSoundRef.current.play().catch(() => {});
      }
      
      // Update stats in Firebase
      const user = getAuth().currentUser;
      if (!user || !db) return;
      
      const statsRef = doc(db, `users/${user.uid}/gameStats/pomodoro`);
      const statsSnap = await getDoc(statsRef);
      
      if (statsSnap.exists()) {
        const data = statsSnap.data();
        await updateDoc(statsRef, {
          pomodorosCompleted: (data.pomodorosCompleted || 0) + 1,
          focusTimeMinutes: (data.focusTimeMinutes || 0) + Math.round(currentWorkDuration / 60),
          lastCompletedAt: new Date(),
        });
      } else {
        await setDoc(statsRef, {
          pomodorosCompleted: 1,
          focusTimeMinutes: Math.round(currentWorkDuration / 60),
          lastCompletedAt: new Date(),
        });
      }
      
      // Update local session count
      setSessionsCompleted(prev => {
        const newCount = prev + 1;
        
        // Show celebration when completing daily goal
        if (newCount === dailyGoal) {
          celebrateDailyGoal();
        }
        
        return newCount;
      });
      
      setToast("Pomodoro session complete! 🎉");
      setTimeout(() => setToast(null), 2500);

      // Update task progress
      if (currentTask) {
        const updatedTask = {
          ...currentTask,
          pomodoros: currentTask.pomodoros + 1,
          completed: currentTask.pomodoros + 1 >= 4 // Mark as completed after 4 pomodoros
        };
        
        setTasks(tasks.map(t => t.id === currentTask.id ? updatedTask : t));
        setCurrentTask(updatedTask);
        
        // Update in Firebase
        await updateDoc(doc(db, `users/${user.uid}/tasks/${currentTask.id}`), updatedTask);
      }
      
      // Show enhanced celebration
      celebrateSessionComplete();
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };
  
  // Show celebration animation when reaching daily goal
  const celebrateDailyGoal = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 250);
    
    setToast("Daily goal reached! 🏆");
    setTimeout(() => setToast(null), 3000);
  };

  // Enhanced celebration effects
  const celebrateSessionComplete = () => {
    // Multiple confetti bursts
    const bursts = [
      { particleCount: 100, spread: 70, origin: { y: 0.6 } },
      { particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } },
      { particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }
    ];
    
    bursts.forEach((burst, index) => {
      setTimeout(() => confetti(burst), index * 250);
    });
    
    // Animate timer
    timerControls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.5 }
    });
  };

  // Handle timer
  useEffect(() => {
    if (isRunning) {
      // Play start sound
      if (soundEnabled && startSoundRef.current) {
        startSoundRef.current.play().catch(() => {});
      }
      
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s === 1) {
            setIsBreak((b) => {
              const nextIsBreak = !b;
              setSeconds(nextIsBreak ? currentBreakDuration : currentWorkDuration);
              if (!b) handleSessionComplete();
              return nextIsBreak;
            });
            setIsRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isBreak, currentWorkDuration, currentBreakDuration, soundEnabled]);

  // Reset timer when duration type changes
  useEffect(() => {
    if (!isRunning) {
      setSeconds(isBreak ? currentBreakDuration : currentWorkDuration);
    }
  }, [workDurationType, breakDurationType, isBreak]);

  // Focus Start/Pause button on mount
  useEffect(() => {
    startPauseRef.current?.focus();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsRunning(r => !r);
      } else if (e.key.toLowerCase() === "r") {
        setIsRunning(false);
        setSeconds(isBreak ? currentBreakDuration : currentWorkDuration);
      } else if (e.key === "Escape") {
        if (showSettings) {
          setShowSettings(false);
        } else {
          onClose();
        }
      }
    };
    
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isBreak, onClose, showSettings, currentBreakDuration, currentWorkDuration]);

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(isBreak ? currentBreakDuration : currentWorkDuration);
  };

  // Add new task
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    const user = getAuth().currentUser;
    if (!user) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      pomodoros: 0,
      createdAt: new Date()
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setShowTaskInput(false);
    
    // Save to Firebase
    await addDoc(collection(db, `users/${user.uid}/tasks`), newTask);
  };

  return (
    <>
      <CustomCursor />
      <Background3D theme={theme} isRunning={isRunning} />
      <div className="relative" role="dialog" aria-modal="true" aria-label="Pomodoro Timer">
        {/* Audio elements for sound effects */}
        <audio ref={startSoundRef} src="/sounds/timer-start.mp3" preload="auto" />
        <audio ref={completeSoundRef} src="/sounds/timer-complete.mp3" preload="auto" />
        
        <motion.div 
          ref={timerRef}
          className="flex flex-col items-center gap-6 p-8 rounded-3xl shadow-2xl border border-border-light dark:border-border-dark backdrop-blur-lg
            transform-gpu perspective-1000"
          style={{
            rotateX: timerRotation.x,
            rotateY: timerRotation.y,
            transformStyle: "preserve-3d"
          }}
          animate={timerControls}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          {/* Header with Daily Progress */}
          <div className="flex w-full items-center justify-between">
            <motion.h2 
              className="font-heading text-2xl text-accent1-light dark:text-accent1-dark"
              key={isBreak ? "break" : "work"}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {isBreak ? "Break Time" : "Focus Time"}
            </motion.h2>
            
            <div className="flex items-center gap-1.5">
              {Array.from({ length: dailyGoal }).map((_, i) => (
                <motion.div 
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full ${i < sessionsCompleted ? themeClasses.accent : 'bg-surface-secondary-light dark:bg-surface-secondary-dark'}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
              <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark ml-1">
                {sessionsCompleted}/{dailyGoal}
              </span>
            </div>
          </div>
          
          <TimerDisplay
            seconds={seconds}
            isBreak={isBreak}
            themeClasses={themeClasses}
            progress={progress}
          />
          
          {/* Enhanced Session Type Indicator */}
          <motion.div 
            className="text-sm text-text-secondary-light dark:text-text-secondary-dark bg-surface-secondary-light/50 dark:bg-surface-secondary-dark/50 px-4 py-2 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isBreak 
              ? "Take a short break and recharge! 💆‍♂️" 
              : "Focus on your work. You can do it! 💪"}
          </motion.div>
          
          {/* Task List */}
          <div className="w-full mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-heading text-lg">Current Task</h3>
              <button
                className="text-accent1-light dark:text-accent1-dark hover:underline"
                onClick={() => setShowTaskInput(true)}
              >
                + Add Task
              </button>
            </div>
            
            <AnimatePresence>
              {showTaskInput && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4"
                >
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
                    onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-2">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  className={`p-3 rounded-lg border ${
                    currentTask?.id === task.id
                      ? "border-accent1-light dark:border-accent1-dark bg-accent1-light/10 dark:bg-accent1-dark/10"
                      : "border-border-light dark:border-border-dark"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setCurrentTask(task)}
                >
                  <div className="flex justify-between items-center">
                    <span className={task.completed ? "line-through text-text-secondary-light dark:text-text-secondary-dark" : ""}>
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {task.pomodoros}/4
                      </span>
                      {task.completed && (
                        <svg className="h-4 w-4 text-success-light dark:text-success-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Statistics Panel */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                className="absolute inset-0 z-20 bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-xl p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-heading text-xl">Your Statistics</h3>
                  <button
                    onClick={() => setShowStats(false)}
                    className="p-2 rounded-full hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-secondary-light dark:bg-surface-secondary-dark">
                    <h4 className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Total Pomodoros</h4>
                    <p className="text-2xl font-bold">{statistics.totalPomodoros}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-secondary-light dark:bg-surface-secondary-dark">
                    <h4 className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Focus Time</h4>
                    <p className="text-2xl font-bold">{Math.round(statistics.totalFocusTime / 60)}h</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-secondary-light dark:bg-surface-secondary-dark">
                    <h4 className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Current Streak</h4>
                    <p className="text-2xl font-bold">{statistics.dailyStreak} days</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-secondary-light dark:bg-surface-secondary-dark">
                    <h4 className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Best Streak</h4>
                    <p className="text-2xl font-bold">{statistics.bestStreak} days</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Enhanced Timer Controls */}
          <div className="flex gap-4" role="group" aria-label="Timer controls">
            <motion.button
              ref={startPauseRef}
              className={`px-6 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all ${themeClasses.accent}
                relative overflow-hidden group`}
              onClick={() => setIsRunning((r) => !r)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              aria-label={isRunning ? "Pause timer" : "Start timer"}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="flex items-center gap-2 relative z-10">
                {isRunning ? (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    Start
                  </>
                )}
              </span>
            </motion.button>
            
            <motion.button
              className="p-2.5 rounded-lg bg-surface-secondary-light dark:bg-surface-secondary-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark shadow hover:shadow-md transition-all"
              onClick={handleReset}
              whileTap={{ scale: 0.95 }}
              aria-label="Reset timer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.button>
            
            <motion.button
              className="p-2.5 rounded-lg bg-surface-secondary-light dark:bg-surface-secondary-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark shadow hover:shadow-md transition-all"
              onClick={() => setShowSettings(!showSettings)}
              whileTap={{ scale: 0.95 }}
              aria-label="Settings"
              aria-expanded={showSettings}
              aria-controls="pomodoro-settings"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.button>
            
            <motion.button
              className="p-2.5 rounded-lg bg-error-light dark:bg-error-dark text-white shadow hover:shadow-md transition-all"
              onClick={onClose}
              whileTap={{ scale: 0.95 }}
              aria-label="Close Pomodoro"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
          
          {/* Quick sound toggle */}
          <motion.button
            className={`absolute top-2 right-2 p-1.5 rounded-full ${soundEnabled ? 'text-accent1-light dark:text-accent1-dark' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            whileTap={{ scale: 0.9 }}
            aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </motion.button>
          
          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div 
                id="pomodoro-settings"
                className="absolute inset-0 z-10 bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading text-lg font-semibold">Timer Settings</h3>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="p-1 rounded-full hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark"
                    aria-label="Close settings"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Duration Settings */}
                <div className="mb-4">
                  <h4 className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">Work Duration</h4>
                  <div className="flex gap-2">
                    <button 
                      className={`flex-1 py-2 rounded-lg border ${workDurationType === 'short' ? themeClasses.accent : 'bg-surface-secondary-light dark:bg-surface-secondary-dark border-border-light dark:border-border-dark'}`}
                      onClick={() => setWorkDurationType('short')}
                    >
                      15 min
                    </button>
                    <button 
                      className={`flex-1 py-2 rounded-lg border ${workDurationType === 'default' ? themeClasses.accent : 'bg-surface-secondary-light dark:bg-surface-secondary-dark border-border-light dark:border-border-dark'}`}
                      onClick={() => setWorkDurationType('default')}
                    >
                      25 min
                    </button>
                    <button 
                      className={`flex-1 py-2 rounded-lg border ${workDurationType === 'long' ? themeClasses.accent : 'bg-surface-secondary-light dark:bg-surface-secondary-dark border-border-light dark:border-border-dark'}`}
                      onClick={() => setWorkDurationType('long')}
                    >
                      50 min
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">Break Duration</h4>
                  <div className="flex gap-2">
                    <button 
                      className={`flex-1 py-2 rounded-lg border ${breakDurationType === 'short' ? themeClasses.accent : 'bg-surface-secondary-light dark:bg-surface-secondary-dark border-border-light dark:border-border-dark'}`}
                      onClick={() => setBreakDurationType('short')}
                    >
                      3 min
                    </button>
                    <button 
                      className={`flex-1 py-2 rounded-lg border ${breakDurationType === 'default' ? themeClasses.accent : 'bg-surface-secondary-light dark:bg-surface-secondary-dark border-border-light dark:border-border-dark'}`}
                      onClick={() => setBreakDurationType('default')}
                    >
                      5 min
                    </button>
                    <button 
                      className={`flex-1 py-2 rounded-lg border ${breakDurationType === 'long' ? themeClasses.accent : 'bg-surface-secondary-light dark:bg-surface-secondary-dark border-border-light dark:border-border-dark'}`}
                      onClick={() => setBreakDurationType('long')}
                    >
                      10 min
                    </button>
                  </div>
                </div>
                
                {/* Daily Goal */}
                <div className="mb-4">
                  <h4 className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">Daily Goal (Pomodoros)</h4>
                  <div className="flex gap-2">
                    {[2, 4, 6, 8].map(goal => (
                      <button 
                        key={goal}
                        className={`flex-1 py-2 rounded-lg border ${dailyGoal === goal ? themeClasses.accent : 'bg-surface-secondary-light dark:bg-surface-secondary-dark border-border-light dark:border-border-dark'}`}
                        onClick={() => setDailyGoal(goal)}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Theme Selection */}
                <div className="mb-4">
                  <h4 className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">Timer Theme</h4>
                  <div className="flex gap-2">
                    <button 
                      className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1.5 ${theme === 'default' ? 'border-accent1-light dark:border-accent1-dark' : 'border-border-light dark:border-border-dark'}`}
                      onClick={() => setTheme('default')}
                    >
                      <div className="h-3 w-3 rounded-full bg-accent1-light dark:bg-accent1-dark"></div>
                      Default
                    </button>
                    <button 
                      className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1.5 ${theme === 'ocean' ? 'border-blue-500' : 'border-border-light dark:border-border-dark'}`}
                      onClick={() => setTheme('ocean')}
                    >
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      Ocean
                    </button>
                    <button 
                      className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1.5 ${theme === 'forest' ? 'border-emerald-600' : 'border-border-light dark:border-border-dark'}`}
                      onClick={() => setTheme('forest')}
                    >
                      <div className="h-3 w-3 rounded-full bg-emerald-600"></div>
                      Forest
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    className={`px-4 py-2 rounded-lg text-white font-medium ${themeClasses.accent}`}
                    onClick={() => setShowSettings(false)}
                  >
                    Save Settings
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg text-success-light dark:text-success-dark font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
} 