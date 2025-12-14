import React from 'react';
import { motion } from 'framer-motion';
import { Brain, CreditCard, Trophy } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

type Tab = 'questions' | 'powercards' | 'leaderboard';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user } = useGame();

  const tabs = [
    { id: 'questions' as Tab, label: 'Questions', icon: Brain, emoji: '🧠' },
    { id: 'powercards' as Tab, label: 'Powercards', icon: CreditCard, emoji: '🃏' },
    { id: 'leaderboard' as Tab, label: 'Leaderboard', icon: Trophy, emoji: '🏆' },
  ];

  return (
    <motion.nav
      className="fixed top-4 right-4 z-50 flex items-center gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Score display */}
      <motion.div
        className="glass-panel px-4 py-2 rounded-xl mr-2 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-primary font-display text-sm">✦</span>
        <span className="font-display text-lg text-foreground">
          {user?.score || 0}
        </span>
        <span className="text-muted-foreground text-xs">PTS</span>
      </motion.div>

      {/* Navigation tabs */}
      <div className="glass-panel p-1 rounded-xl flex gap-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-4 py-2 rounded-lg font-body text-sm transition-all duration-300 flex items-center gap-2
              ${activeTab === tab.id 
                ? 'text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeTab === tab.id && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary via-violet to-accent rounded-lg"
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 hidden sm:inline">{tab.emoji}</span>
            <span className="relative z-10 hidden md:inline">{tab.label}</span>
            <tab.icon className="relative z-10 w-4 h-4 md:hidden" />
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navigation;
