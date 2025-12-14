import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Lightbulb, ChevronRight, Check, X, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import HintTimerBar from './HintTimerBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const QuestionsPage: React.FC = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    setCurrentQuestionIndex, 
    answerQuestion, 
    user,
    ownedPowercards,
    usePowercard,
    setQuizComplete
  } = useGame();
  
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [revealedPowercardHints, setRevealedPowercardHints] = useState<{ type: string; hint: string }[]>([]);
  const [usingPowercard, setUsingPowercard] = useState<string | null>(null);
  
  const { playCorrectAnswer, playWrongAnswer, playTransition, playPowercardUse } = useSoundEffects();

  const currentQuestion = questions[currentQuestionIndex];
  const hintDelay = 180; // 3 minutes in seconds
  
  // Filter unused owned powercards
  const availablePowercards = ownedPowercards.filter(op => !op.used);

  useEffect(() => {
    setTimeElapsed(0);
    setShowHint(false);
    setUserAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    setRevealedPowercardHints([]);
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

  const handleUsePowercard = (ownedId: string, powercardId: string) => {
    setUsingPowercard(ownedId);
    playPowercardUse();
    
    setTimeout(() => {
      const hint = usePowercard(ownedId, currentQuestionIndex);
      const card = ownedPowercards.find(o => o.id === ownedId);
      
      if (hint && card) {
        // Get the powercard type from the base powercard
        const baseCard = { genre: 'Genre', language: 'Language', country: 'Country', year: 'Year', universe: 'Universe' };
        const type = baseCard[card.powercardId as keyof typeof baseCard] || 'Hint';
        
        setRevealedPowercardHints(prev => [...prev, { type, hint }]);
        toast.success('Powercard Used!', {
          description: `${type} revealed!`,
          icon: <Zap className="w-5 h-5 text-accent" />,
        });
      }
      
      setUsingPowercard(null);
    }, 600);
  };

  const handleSubmitAnswer = () => {
    if (isAnswered || !userAnswer.trim()) return;
    
    setIsAnswered(true);
    
    // Case-insensitive comparison, trim whitespace
    const correct = userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
    setIsCorrect(correct);
    answerQuestion(correct);
    
    if (correct) {
      playCorrectAnswer();
      toast.success(`+${currentQuestion.points} points!`, {
        description: 'Correct answer! Well done, traveler.',
        icon: <Sparkles className="w-5 h-5 text-primary" />,
      });
    } else {
      playWrongAnswer();
      toast.error('Incorrect!', {
        description: `The answer was: ${currentQuestion.answer}`,
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      setQuizComplete(true);
      return;
    }
    
    playTransition();
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
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 relative z-10">
      <AnimatePresence mode="wait">
        {isTransitioning ? (
          <motion.div
            key="portal"
            className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Galaxy warp transition */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {/* Spiral galaxy arms */}
              {[...Array(4)].map((_, arm) => (
                <motion.div
                  key={`arm-${arm}`}
                  className="absolute"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  initial={{ rotate: arm * 90, scale: 0 }}
                  animate={{ 
                    rotate: [arm * 90, arm * 90 + 180],
                    scale: [0, 2],
                    opacity: [0.8, 0]
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: 4 + i * 2,
                        height: 4 + i * 2,
                        left: '50%',
                        top: '50%',
                        background: `radial-gradient(circle, hsl(var(--primary)), hsl(var(--violet)))`,
                        transform: `translate(-50%, -50%) rotate(${i * 15}deg) translateY(${-20 - i * 15}px)`,
                      }}
                      initial={{ opacity: 0.8, scale: 1 }}
                      animate={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.6, delay: i * 0.03 }}
                    />
                  ))}
                </motion.div>
              ))}
              
              {/* Central bright core */}
              <motion.div
                className="absolute w-40 h-40 rounded-full"
                style={{
                  background: 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--violet)) 40%, hsl(var(--accent)) 70%, transparent 100%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.5, 3, 0],
                  opacity: [0, 1, 0.8, 0]
                }}
                transition={{ duration: 0.8 }}
              />
              
              {/* Distant galaxy particles */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: i % 3 === 0 ? 'hsl(var(--primary))' : i % 3 === 1 ? 'hsl(var(--violet))' : 'hsl(var(--accent))',
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ 
                    x: Math.cos(i * 12 * Math.PI / 180) * (200 + Math.random() * 200),
                    y: Math.sin(i * 12 * Math.PI / 180) * (200 + Math.random() * 200),
                    opacity: 0,
                    scale: [1, 2, 0]
                  }}
                  transition={{ 
                    duration: 0.7,
                    delay: 0.1,
                    ease: 'easeOut'
                  }}
                />
              ))}
              
              <motion.p
                className="relative z-10 font-display text-2xl text-primary"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.5] }}
                transition={{ duration: 0.8 }}
              >
                Traversing Galaxies...
              </motion.p>
            </div>
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
            {/* Hint timer bar */}
            <HintTimerBar 
              timeElapsed={timeElapsed} 
              hintDelay={hintDelay} 
              showHint={showHint} 
            />
            
            {/* Question header */}
            <div className="flex items-center justify-between mb-8">
              <motion.div
                className="flex items-center gap-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-muted-foreground font-body">
                  Question {currentQuestionIndex + 1}/{questions.length}
                </span>
              </motion.div>
              
              <motion.div
                className="flex items-center gap-4"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="font-display text-primary">
                  {formatTime(timeElapsed)}
                </span>
              </motion.div>
            </div>

            {/* Available powercards to use */}
            {availablePowercards.length > 0 && (
              <motion.div
                className="mb-6"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <p className="text-sm text-muted-foreground font-body mb-2">Use a Powercard:</p>
                <div className="flex flex-wrap gap-2">
                  {availablePowercards.map((owned) => {
                    const baseCard = { genre: 'Genre', language: 'Language', country: 'Country', year: 'Year', universe: 'Universe' };
                    const type = baseCard[owned.powercardId as keyof typeof baseCard] || 'Card';
                    const isUsing = usingPowercard === owned.id;
                    
                    return (
                      <motion.button
                        key={owned.id}
                        onClick={() => handleUsePowercard(owned.id, owned.powercardId)}
                        disabled={isUsing}
                        className={`relative px-4 py-2 rounded-lg bg-gradient-to-r from-violet/20 to-accent/20 
                                   border border-violet/50 text-sm font-display text-foreground
                                   hover:from-violet/30 hover:to-accent/30 transition-all
                                   disabled:opacity-50`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={isUsing ? { 
                          scale: [1, 1.2, 0],
                          rotate: [0, 180, 360],
                          opacity: [1, 1, 0]
                        } : {}}
                        transition={isUsing ? { duration: 0.6 } : {}}
                      >
                        <Zap className="w-4 h-4 inline mr-1" />
                        {type}
                        
                        {/* Explosion effect when using */}
                        {isUsing && (
                          <>
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-accent"
                                initial={{ x: '-50%', y: '-50%', scale: 0 }}
                                animate={{
                                  x: `${-50 + Math.cos(i * 45 * Math.PI / 180) * 100}%`,
                                  y: `${-50 + Math.sin(i * 45 * Math.PI / 180) * 100}%`,
                                  scale: [0, 1.5, 0],
                                  opacity: [1, 0.5, 0],
                                }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                              />
                            ))}
                          </>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Revealed powercard hints */}
            <AnimatePresence>
              {revealedPowercardHints.map((revealed, idx) => (
                <motion.div
                  key={idx}
                  className="cosmic-border p-4 rounded-xl mb-4"
                  initial={{ opacity: 0, scale: 0.9, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-accent" />
                    <span className="font-display text-accent text-sm">{revealed.type}:</span>
                    <span className="text-foreground font-body">{revealed.hint}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

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

            {/* Answer input */}
            <motion.div
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="Type your answer..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                  disabled={isAnswered}
                  className={`flex-1 h-14 text-lg font-body bg-card/50 border-2 transition-all duration-300 ${
                    isAnswered
                      ? isCorrect
                        ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : 'border-destructive shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                      : 'border-border/50 focus:border-primary focus:shadow-[0_0_20px_hsl(var(--primary)/0.3)]'
                  }`}
                />
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={isAnswered || !userAnswer.trim()}
                  className="h-14 px-8 font-display uppercase tracking-wider bg-gradient-to-r from-primary to-violet hover:opacity-90 disabled:opacity-50"
                >
                  {isAnswered ? (isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />) : 'Submit'}
                </Button>
              </div>
              
              {/* Feedback message */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    className={`mt-4 p-4 rounded-xl text-center font-display ${
                      isCorrect 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                        : 'bg-destructive/20 text-destructive border border-destructive/50'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {isCorrect 
                      ? `✨ Correct! +${currentQuestion.points} points` 
                      : `The answer was: ${currentQuestion.answer}`
                    }
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Timed hint section */}
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
