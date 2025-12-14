import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Trophy, Sparkles, Calendar, ArrowRight } from 'lucide-react';

const QuizCompletePage: React.FC = () => {
  const { user, leaderboard } = useGame();
  
  const userRank = leaderboard.find(entry => entry.isCurrentUser)?.rank || 0;
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 relative z-10 flex flex-col items-center justify-center">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Completion message */}
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-violet to-accent flex items-center justify-center">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="neon-text">Quest Complete!</span>
          </h1>
          
          <p className="text-muted-foreground font-body text-lg">
            You've traversed the multiverse, {user?.name}!
          </p>
        </motion.div>

        {/* Score card */}
        <motion.div
          className="cosmic-card p-8 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-muted-foreground font-body text-sm mb-2">Final Score</p>
              <p className="font-display text-4xl text-primary">{user?.score || 0}</p>
            </div>
            <div className="w-px h-16 bg-border" />
            <div className="text-center">
              <p className="text-muted-foreground font-body text-sm mb-2">Your Rank</p>
              <p className="font-display text-4xl text-accent">#{userRank}</p>
            </div>
          </div>
        </motion.div>

        {/* Upcoming event promo */}
        <motion.div
          className="relative"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-violet/20 to-accent/20 rounded-2xl blur-xl" />
          
          <div className="relative cosmic-border p-8 md:p-12 rounded-2xl overflow-hidden">
            {/* Animated background particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/30"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
            
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="text-accent font-display text-sm uppercase tracking-wider">Next Event</span>
              </div>
              
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary via-violet to-accent bg-clip-text text-transparent">
                  REVERBERATE
                </span>
              </h2>
              
              <motion.div
                className="flex items-center justify-center gap-2 mb-6"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary font-display text-lg uppercase tracking-widest">Coming Soon</span>
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              
              <p className="text-muted-foreground font-body text-lg mb-6">
                Stay tuned for an electrifying experience!
              </p>
              
              <div className="flex items-center justify-center gap-2 text-foreground/80">
                <span className="font-body">From</span>
                <span className="font-display text-primary">The Debating Society</span>
              </div>
              
              <p className="font-display text-sm text-violet mt-2">NIT Durgapur</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizCompletePage;
