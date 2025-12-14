import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Lightbulb, ChevronRight, Check, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const categoryColors: Record<string, string> = {
  'Movies': 'from-primary to-violet',
  'Anime': 'from-accent to-violet',
  'Web Series': 'from-violet to-primary',
  'Fiction Books': 'from-primary to-accent',
  'Fantasy / Sci-Fi': 'from-violet to-accent',
};

const QuestionsPage: React.FC = () => {
  const { questions, currentQuestionIndex, setCurrentQuestionIndex, answerQuestion, user } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const hintDelay = 180; // 3 minutes in seconds

  useEffect(() => {
    setTimeElapsed(0);
    setShowHint(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => {
        if (prev >= hintDelay && !showHint) {
          setShowHint(true);
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, showHint]);

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    const isCorrect = index === currentQuestion.correctAnswer;
    answerQuestion(isCorrect);
    
    if (isCorrect) {
      toast.success(`+${currentQuestion.points} points!`, {
        description: 'Correct answer! Well done, traveler.',
        icon: <Sparkles className="w-5 h-5 text-primary" />,
      });
    } else {
      toast.error('Incorrect!', {
        description: 'The multiverse has other plans...',
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      toast.info('Quiz Complete!', {
        description: `Final score: ${user?.score || 0} points`,
      });
      return;
    }
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsTransitioning(false);
    }, 800);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <AnimatePresence mode="wait">
        {isTransitioning ? (
          <motion.div
            key="portal"
            className="fixed inset-0 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dimension portal effect */}
            <motion.div
              className="relative w-64 h-64"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-violet to-accent"
                animate={{ scale: [1, 3, 0] }}
                transition={{ duration: 0.8 }}
              />
              <motion.div
                className="absolute inset-4 rounded-full bg-background"
                animate={{ scale: [1, 2.5, 0] }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
              <motion.div
                className="absolute inset-8 rounded-full bg-gradient-to-r from-accent via-primary to-violet"
                animate={{ scale: [1, 2, 0] }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key={currentQuestionIndex}
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Question header */}
            <div className="flex items-center justify-between mb-8">
              <motion.div
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${categoryColors[currentQuestion.category]} text-primary-foreground font-display text-sm uppercase tracking-wider`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentQuestion.category}
              </motion.div>
              
              <motion.div
                className="flex items-center gap-4"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-muted-foreground font-body">
                  Q{currentQuestionIndex + 1}/{questions.length}
                </span>
                <span className="font-display text-primary">
                  {formatTime(timeElapsed)}
                </span>
              </motion.div>
            </div>

            {/* Question card */}
            <motion.div
              className="cosmic-card p-8 md:p-12 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-display text-foreground leading-relaxed">
                {currentQuestion.question}
              </h2>
              
              {/* Points indicator */}
              <div className="mt-4 flex items-center gap-2 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="font-display text-sm">+{currentQuestion.points} points</span>
              </div>
            </motion.div>

            {/* Answer options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showResult = isAnswered;
                
                let bgClass = 'bg-card/50 border-border/50 hover:border-primary/50';
                if (showResult && isCorrect) {
                  bgClass = 'bg-emerald-500/20 border-emerald-500';
                } else if (showResult && isSelected && !isCorrect) {
                  bgClass = 'bg-destructive/20 border-destructive';
                } else if (isSelected) {
                  bgClass = 'bg-primary/20 border-primary';
                }
                
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className={`relative p-6 rounded-xl border-2 text-left transition-all duration-300
                               font-body text-lg disabled:cursor-not-allowed ${bgClass}`}
                    initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  >
                    <span className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-display text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showResult && isCorrect && (
                        <Check className="w-6 h-6 text-emerald-500" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <X className="w-6 h-6 text-destructive" />
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Hint section */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  className="cosmic-border p-6 rounded-xl mb-8"
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-violet/20">
                      <Lightbulb className="w-6 h-6 text-violet" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-violet mb-2">Dimensional Hint</h3>
                      <p className="text-muted-foreground font-body">{currentQuestion.hint}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next question button */}
            {isAnswered && (
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={handleNextQuestion}
                  className="group flex items-center gap-3 px-8 py-4 rounded-xl
                           bg-gradient-to-r from-primary via-violet to-accent
                           text-primary-foreground font-display text-lg uppercase tracking-wider
                           hover:scale-105 transition-transform"
                  whileHover={{ boxShadow: '0 0 40px hsl(var(--primary) / 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentQuestionIndex >= questions.length - 1 ? 'View Results' : 'Jump Dimensions'}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionsPage;
