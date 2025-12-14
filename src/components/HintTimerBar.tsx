import React from 'react';
import { motion } from 'framer-motion';

interface HintTimerBarProps {
  timeElapsed: number;
  hintDelay: number;
  showHint: boolean;
}

const HintTimerBar: React.FC<HintTimerBarProps> = ({ timeElapsed, hintDelay, showHint }) => {
  const progress = Math.min(timeElapsed / hintDelay, 1);
  
  if (showHint) return null;
  
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-body text-muted-foreground">Hint unlocks in</span>
        <span className="text-xs font-display text-primary">
          {Math.max(0, Math.ceil((hintDelay - timeElapsed) / 60))} min
        </span>
      </div>
      
      <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
        {/* Progress bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--violet)), hsl(var(--accent)))',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Pulsing glow effect */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--violet)), hsl(var(--accent)))',
          }}
          animate={{
            boxShadow: [
              '0 0 10px hsl(var(--primary) / 0.5)',
              '0 0 25px hsl(var(--violet) / 0.7)',
              '0 0 10px hsl(var(--primary) / 0.5)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Leading edge glow */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary"
          style={{
            left: `calc(${progress * 100}% - 8px)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
            boxShadow: [
              '0 0 10px hsl(var(--primary))',
              '0 0 20px hsl(var(--primary))',
              '0 0 10px hsl(var(--primary))',
            ],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
};

export default HintTimerBar;
