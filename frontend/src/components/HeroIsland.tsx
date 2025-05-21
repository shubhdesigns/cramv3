import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Button } from './UI/Button';
import confetti from 'canvas-confetti';
import * as THREE from 'three';

const HeroIsland: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particlePositions, setParticlePositions] = useState<{x: number, y: number, scale: number, rotate: number}[]>([]);
  const [shapePositions, setShapePositions] = useState<{x: number, y: number, rotate: number}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useSpring(1, { stiffness: 100, damping: 30 });

  const features = [
    {
      title: "AI-Powered Learning",
      description: "Personalized study plans and real-time feedback",
      icon: "🎯",
      color: "from-blue-500 to-purple-500",
      gradient: "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
    },
    {
      title: "Smart Flashcards",
      description: "Adaptive learning with spaced repetition",
      icon: "📚",
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Interactive Quizzes",
      description: "Real-time assessment and progress tracking",
      icon: "✍️",
      color: "from-pink-500 to-red-500",
      gradient: "bg-gradient-to-br from-pink-500/20 to-red-500/20"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Generate random positions for particles and shapes on client only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setParticlePositions(
        Array.from({ length: 30 }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: Math.random() * 0.5 + 0.5,
          rotate: Math.random() * 360
        }))
      );
      setShapePositions(
        Array.from({ length: 10 }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          rotate: Math.random() * 360
        }))
      );
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current!.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    setMousePosition({ x, y });
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced 3D Background Elements */}
      <motion.div 
        className="absolute inset-0"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/30 backdrop-blur-sm rounded-full"
              style={{
                x: pos.x,
                y: pos.y,
                scale: pos.scale,
                rotate: pos.rotate
              }}
              animate={{
                y: [0, -100],
                rotate: [0, 360],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        {/* Add floating geometric shapes */}
        <div className="absolute inset-0">
          {shapePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-16 h-16 border-2 border-white/20 rounded-lg backdrop-blur-sm"
              style={{
                x: pos.x,
                y: pos.y,
                rotate: pos.rotate
              }}
              animate={{
                y: [0, -50],
                rotate: [0, 360],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-7xl md:text-9xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transform hover:scale-105 transition-transform duration-300">
            Master Your Exams with AI
          </h1>
          <p className="text-3xl md:text-4xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Personalized study plans, interactive flashcards, and real-time feedback to help you excel in your exams.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Button
            size="lg"
            className="text-2xl px-12 py-6 transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={triggerConfetti}
          >
            Get Started Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-2xl px-12 py-6 transform hover:scale-105 transition-transform duration-300 border-2"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Enhanced Feature Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`max-w-md mx-auto ${features[currentFeature].gradient} backdrop-blur-lg rounded-3xl p-10 shadow-2xl transform hover:scale-105 transition-transform duration-300`}
            style={{
              transform: `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg)`
            }}
          >
            <div className="text-7xl mb-8 transform hover:rotate-12 transition-transform duration-300">
              {features[currentFeature].icon}
            </div>
            <h3 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {features[currentFeature].title}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {features[currentFeature].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Stats with 3D Effect */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            { number: "10K+", label: "Active Students", color: "from-blue-500 to-blue-600" },
            { number: "95%", label: "Success Rate", color: "from-purple-500 to-purple-600" },
            { number: "24/7", label: "AI Support", color: "from-pink-500 to-pink-600" },
            { number: "50+", label: "Subjects", color: "from-indigo-500 to-indigo-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center transform hover:scale-110 transition-transform duration-300"
              whileHover={{ y: -10 }}
              style={{
                transform: `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 5}deg) rotateY(${(mousePosition.x - 0.5) * 5}deg)`
              }}
            >
              <div className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.number}
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-400 mt-4">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroIsland; 