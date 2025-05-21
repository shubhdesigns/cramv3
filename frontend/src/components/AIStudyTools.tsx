import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { Book, BookOpen, HelpCircle, School, UserRound } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { Tooltip } from '@radix-ui/react-tooltip';
import { Progress } from '@radix-ui/react-progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { aiService } from '../services/ai';

interface StudyTool {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => Promise<void>;
  color: string;
  gradient: string;
}

export default function AIStudyTools() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Mouse position tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const studyTools: StudyTool[] = [
    {
      id: 'study-plan',
      title: 'AI Study Plan',
      description: 'Get a personalized study plan based on your goals and schedule',
      icon: 'mdi:book-open-page-variant',
      color: 'from-blue-500 to-indigo-600',
      gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      action: async () => {
        setLoading('study-plan');
        setProgress(0);
        try {
          const plan = await aiService.generateStudyPlan('Mathematics', 'Advanced');
          setResult(plan);
          toast.success('Study plan generated successfully!');
        } catch (error) {
          console.error('Error generating study plan:', error);
          toast.error('Failed to generate study plan');
        } finally {
          setLoading(null);
          setProgress(100);
        }
      }
    },
    {
      id: 'flashcards',
      title: 'Smart Flashcards',
      description: 'Generate AI-powered flashcards for any topic',
      icon: 'mdi:cards',
      color: 'from-purple-500 to-pink-600',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-600',
      action: async () => {
        setLoading('flashcards');
        setProgress(0);
        try {
          const cards = await aiService.generateFlashcards('Calculus', 5);
          setResult(JSON.stringify(cards, null, 2));
          toast.success('Flashcards generated successfully!');
        } catch (error) {
          console.error('Error generating flashcards:', error);
          toast.error('Failed to generate flashcards');
        } finally {
          setLoading(null);
          setProgress(100);
        }
      }
    },
    {
      id: 'practice',
      title: 'Practice Questions',
      description: 'Get AI-generated practice questions with explanations',
      icon: 'mdi:help-circle',
      color: 'from-green-500 to-emerald-600',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-600',
      action: async () => {
        setLoading('practice');
        setProgress(0);
        try {
          const questions = await aiService.generatePracticeQuestions('Physics', 'Intermediate');
          setResult(questions);
          toast.success('Practice questions generated successfully!');
        } catch (error) {
          console.error('Error generating practice questions:', error);
          toast.error('Failed to generate practice questions');
        } finally {
          setLoading(null);
          setProgress(100);
        }
      }
    },
    {
      id: 'ap-resources',
      title: 'AP Exam Resources',
      description: 'Access comprehensive AP exam study materials',
      icon: 'mdi:school',
      color: 'from-yellow-500 to-orange-600',
      gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600',
      action: async () => {
        setLoading('ap-resources');
        setProgress(0);
        try {
          const resources = await aiService.getAPExamResources('AP Calculus BC');
          setResult(resources);
          toast.success('AP resources generated successfully!');
        } catch (error) {
          console.error('Error getting AP resources:', error);
          toast.error('Failed to generate AP resources');
        } finally {
          setLoading(null);
          setProgress(100);
        }
      }
    },
    {
      id: 'tutoring',
      title: 'AI Tutoring',
      description: 'Get personalized tutoring sessions with AI',
      icon: 'mdi:account-tie',
      color: 'from-red-500 to-rose-600',
      gradient: 'bg-gradient-to-br from-red-500 to-rose-600',
      action: async () => {
        setLoading('tutoring');
        setProgress(0);
        try {
          const session = await aiService.startTutoringSession('Chemistry', 'Organic Chemistry');
          setResult(session);
          toast.success('Tutoring session started successfully!');
        } catch (error) {
          console.error('Error starting tutoring session:', error);
          toast.error('Failed to start tutoring session');
        } finally {
          setLoading(null);
          setProgress(100);
        }
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="p-6" ref={ref}>
      <motion.h2 
        className="text-3xl font-bold mb-8 text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        AI-Powered Study Tools
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        onMouseMove={handleMouseMove}
        style={{
          perspective: 1000,
          transformStyle: 'preserve-3d',
        }}
      >
        {studyTools.map((tool) => (
          <motion.div
            key={tool.id}
            variants={itemVariants}
            className={`relative ${tool.gradient} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group`}
            style={{
              rotateX: hoveredTool === tool.id ? rotateX : 0,
              rotateY: hoveredTool === tool.id ? rotateY : 0,
            }}
            onHoverStart={() => setHoveredTool(tool.id)}
            onHoverEnd={() => setHoveredTool(null)}
            onClick={() => {
              setIsOpen(true);
              tool.action();
            }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <BookOpen className="w-8 h-8 text-white mr-3" />
                <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
              </div>
              <p className="text-white/90 mb-4">{tool.description}</p>
              {loading === tool.id && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transform transition-all duration-300">
            <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Results
            </Dialog.Title>
            
            <div className="mb-4">
              <Progress value={progress} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
              </Progress>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {result}
              </pre>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 