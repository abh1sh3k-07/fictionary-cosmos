import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CosmicBackground from '@/components/CosmicBackground';
import Registration from '@/components/Registration';
import Navigation from '@/components/Navigation';
import QuestionsPage from '@/components/QuestionsPage';
import PowercardsPage from '@/components/PowercardsPage';
import LeaderboardPage from '@/components/LeaderboardPage';
import QuizCompletePage from '@/components/QuizCompletePage';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { Helmet } from 'react-helmet-async';

type Tab = 'questions' | 'powercards' | 'leaderboard';

const GameContent: React.FC = () => {
  const { isRegistered, isQuizComplete } = useGame();
  const [showGame, setShowGame] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('questions');

  const handleRegistrationComplete = () => {
    setShowGame(true);
  };

  const renderPage = () => {
    if (isQuizComplete) {
      return <QuizCompletePage />;
    }
    
    switch (activeTab) {
      case 'questions':
        return <QuestionsPage />;
      case 'powercards':
        return <PowercardsPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      default:
        return <QuestionsPage />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Fictionary - A Multiversal Quiz Across Fiction & Reality</title>
        <meta name="description" content="Journey through dimensions in Fictionary - the ultimate pop culture quiz spanning movies, anime, books, and more. Compete live, unlock powercards, and climb the leaderboard!" />
      </Helmet>

      <CosmicBackground />
      
      <AnimatePresence mode="wait">
        {!showGame ? (
          <motion.div
            key="registration"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Registration onComplete={handleRegistrationComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {!isQuizComplete && (
              <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
            )}
            
            <AnimatePresence mode="wait">
              <motion.div
                key={isQuizComplete ? 'complete' : activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Index: React.FC = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Index;
