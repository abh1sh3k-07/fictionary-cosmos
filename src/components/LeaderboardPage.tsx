import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Crown, Medal, Star, TrendingUp } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  const { leaderboard, user } = useGame();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="font-display text-lg text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return 'cosmic-border bg-primary/10';
    }
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-yellow-500/20 border border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-300/20 via-gray-200/10 to-gray-300/20 border border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-amber-600/20 border border-amber-600/30';
      default:
        return 'bg-card/50 border border-border/30';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="neon-text">Live Leaderboard</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            Real-time rankings across all dimensions
          </p>
          
          {/* Live indicator */}
          <motion.div
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/30"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-destructive font-display text-sm uppercase tracking-wider">Live</span>
          </motion.div>
        </motion.div>

        {/* Current user stats */}
        {user && (
          <motion.div
            className="mb-8 p-6 rounded-2xl cosmic-border bg-card/50 backdrop-blur-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-violet flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-body">Your Stats</p>
                  <p className="font-display text-xl text-foreground">{user.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-sm font-body">Score</p>
                <p className="font-display text-3xl text-primary">{user.score}</p>
              </div>
            </div>
            
            {/* Rank indicator */}
            <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span className="font-body text-sm">Current Rank</span>
              </div>
              <span className="font-display text-lg text-violet">
                #{leaderboard.find((e) => e.isCurrentUser)?.rank || '-'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Leaderboard list */}
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.username}
              className={`relative p-5 rounded-xl transition-all duration-300 ${getRankStyle(entry.rank, !!entry.isCurrentUser)}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, x: 10 }}
            >
              {/* Glow effect for top 3 */}
              {entry.rank <= 3 && (
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-50"
                  animate={{
                    boxShadow: entry.rank === 1
                      ? ['0 0 20px rgba(250, 204, 21, 0.3)', '0 0 40px rgba(250, 204, 21, 0.5)', '0 0 20px rgba(250, 204, 21, 0.3)']
                      : entry.rank === 2
                      ? ['0 0 15px rgba(209, 213, 219, 0.2)', '0 0 30px rgba(209, 213, 219, 0.4)', '0 0 15px rgba(209, 213, 219, 0.2)']
                      : ['0 0 15px rgba(180, 83, 9, 0.2)', '0 0 30px rgba(180, 83, 9, 0.4)', '0 0 15px rgba(180, 83, 9, 0.2)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div className="relative flex items-center gap-4">
                {/* Rank */}
                <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Username */}
                <div className="flex-1">
                  <p className={`font-display text-lg ${entry.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                    {entry.username}
                    {entry.isCurrentUser && (
                      <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                    )}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <motion.p
                    className="font-display text-2xl text-foreground"
                    key={entry.score}
                    initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
                    animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                    transition={{ duration: 0.3 }}
                  >
                    {entry.score.toLocaleString()}
                  </motion.p>
                  <p className="text-muted-foreground text-xs font-body">points</p>
                </div>
              </div>

              {/* Current user indicator */}
              {entry.isCurrentUser && (
                <motion.div
                  className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-primary"
                  layoutId="currentUserIndicator"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center text-muted-foreground font-body text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Leaderboard updates in real-time as travelers answer questions</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
