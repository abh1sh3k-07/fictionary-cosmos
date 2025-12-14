import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Sparkles } from 'lucide-react';

interface RegistrationProps {
  onComplete: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [isEntering, setIsEntering] = useState(false);
  const { registerUser } = useGame();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    
    setIsEntering(true);
    registerUser(name.trim());
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 z-10">
      {/* Galaxy warp transition overlay */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hyperspace stars effect */}
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 bg-gradient-to-b from-transparent via-foreground to-primary"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  height: 2,
                }}
                initial={{ 
                  scaleY: 1,
                  opacity: 0,
                }}
                animate={{ 
                  scaleY: [1, 50, 100],
                  opacity: [0, 1, 0],
                  y: [0, -200],
                }}
                transition={{ 
                  duration: 1.5,
                  delay: Math.random() * 0.5,
                  ease: 'easeIn'
                }}
              />
            ))}
            
            {/* Central vortex */}
            <motion.div
              className="absolute w-64 h-64 rounded-full"
              style={{
                background: 'radial-gradient(circle, hsl(var(--primary) / 0.8) 0%, hsl(var(--violet) / 0.5) 40%, transparent 70%)',
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: [0, 3, 8], rotate: [0, 180, 360] }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
            
            {/* Galaxy spiral arms */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`arm-${i}`}
                className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                style={{
                  transformOrigin: 'center',
                  rotate: `${i * 45}deg`,
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 1.5], opacity: [0, 1, 0] }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
              />
            ))}
            
            {/* Welcome text */}
            <motion.div
              className="absolute text-center z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.5] }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              <p className="font-display text-2xl md:text-4xl text-foreground text-glow-cyan">
                Entering the Multiverse...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal effect background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={isEntering ? { scale: [1, 50], opacity: [1, 0] } : {}}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/20 via-violet/20 to-accent/20 blur-3xl" />
      </motion.div>

      <motion.div
        className="relative z-10 text-center max-w-2xl w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isEntering ? 0 : 1, y: isEntering ? -100 : 0, scale: isEntering ? 0.5 : 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{
              left: `${20 + i * 15}%`,
              top: `${-20 + (i % 3) * 10}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="font-display text-6xl md:text-8xl font-black tracking-wider mb-4">
            <span className="neon-text">FICTIONARY</span>
          </h1>
          <motion.div
            className="h-1 w-48 mx-auto rounded-full bg-gradient-to-r from-primary via-violet to-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-8 text-xl md:text-2xl text-muted-foreground font-body tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          A Multiversal Quiz Across Fiction & Reality
        </motion.p>

        {/* Tagline */}
        <motion.div
          className="mt-4 flex items-center justify-center gap-2 text-primary/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Sparkles className="w-5 h-5 animate-pulse-glow" />
          <span className="text-sm uppercase tracking-widest">Journey through dimensions</span>
          <Sparkles className="w-5 h-5 animate-pulse-glow" />
        </motion.div>

        {/* Registration form */}
        <motion.form
          onSubmit={handleSubmit}
          className="mt-12 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name, traveler..."
              className="w-full px-6 py-4 text-lg bg-card/50 border border-border/50 rounded-xl 
                         text-foreground placeholder:text-muted-foreground/50
                         focus:outline-none focus:border-primary/50 focus:box-glow-cyan
                         transition-all duration-300 font-body backdrop-blur-sm"
              maxLength={20}
              disabled={isEntering}
            />
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={name.trim().length < 2 || isEntering}
            className="group relative px-12 py-4 font-display text-lg uppercase tracking-wider
                       bg-gradient-to-r from-primary via-violet to-accent
                       text-primary-foreground rounded-xl
                       disabled:opacity-50 disabled:cursor-not-allowed
                       overflow-hidden transition-all duration-300
                       hover:scale-105 active:scale-95"
            whileHover={{ boxShadow: '0 0 40px hsl(var(--primary) / 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-3 justify-center">
              {isEntering ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Entering...
                </>
              ) : (
                <>
                  Enter the Multiverse
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </>
              )}
            </span>
            
            {/* Button glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </motion.button>
        </motion.form>

        {/* Decorative elements */}
        <motion.div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-full border border-primary/20" />
          <div className="absolute inset-4 rounded-full border border-violet/20" />
          <div className="absolute inset-8 rounded-full border border-accent/20" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Registration;
