import React, { useState, createContext, useContext } from 'react';

export interface User {
  name: string;
  score: number;
  powercards: string[];
}

export interface Question {
  id: number;
  category: 'Movies' | 'Anime' | 'Web Series' | 'Fiction Books' | 'Fantasy / Sci-Fi';
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  points: number;
}

export interface Powercard {
  id: string;
  name: string;
  type: 'Genre' | 'Language' | 'Country' | 'Year' | 'Universe';
  cost: number;
  hint: string;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  isCurrentUser?: boolean;
}

interface GameContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  questions: Question[];
  powercards: Powercard[];
  leaderboard: LeaderboardEntry[];
  unlockPowercard: (id: string) => void;
  answerQuestion: (isCorrect: boolean) => void;
  isRegistered: boolean;
  registerUser: (name: string) => void;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    category: 'Movies',
    question: 'In which film does a group of thieves enter dreams within dreams to plant an idea?',
    options: ['The Matrix', 'Inception', 'Shutter Island', 'Interstellar'],
    correctAnswer: 1,
    hint: 'Christopher Nolan directed this 2010 mind-bending thriller starring Leonardo DiCaprio.',
    points: 50,
  },
  {
    id: 2,
    category: 'Anime',
    question: 'What is the name of the notebook that kills anyone whose name is written in it?',
    options: ['Soul Note', 'Death Note', 'Dark Diary', 'Reaper\'s Journal'],
    correctAnswer: 1,
    hint: 'This anime features a battle of wits between a genius student and a detective known only as "L".',
    points: 50,
  },
  {
    id: 3,
    category: 'Web Series',
    question: 'In "Stranger Things", what is the parallel dimension called?',
    options: ['The Shadow Realm', 'The Upside Down', 'The Void', 'The Dark World'],
    correctAnswer: 1,
    hint: 'This Netflix series is set in the 1980s and features a girl with psychic powers named Eleven.',
    points: 50,
  },
  {
    id: 4,
    category: 'Fiction Books',
    question: 'Who wrote "The Hitchhiker\'s Guide to the Galaxy"?',
    options: ['Terry Pratchett', 'Neil Gaiman', 'Douglas Adams', 'Isaac Asimov'],
    correctAnswer: 2,
    hint: 'The answer to life, the universe, and everything is 42.',
    points: 50,
  },
  {
    id: 5,
    category: 'Fantasy / Sci-Fi',
    question: 'In the Dune universe, what is the most valuable substance in the cosmos?',
    options: ['Vibranium', 'Dilithium', 'Melange (Spice)', 'Adamantium'],
    correctAnswer: 2,
    hint: 'This substance is found only on the desert planet Arrakis and extends life.',
    points: 50,
  },
];

const mockPowercards: Powercard[] = [
  { id: 'genre1', name: 'Genre Reveal', type: 'Genre', cost: 100, hint: 'Science Fiction Thriller', unlocked: false },
  { id: 'lang1', name: 'Language Oracle', type: 'Language', cost: 100, hint: 'Originally in English', unlocked: false },
  { id: 'country1', name: 'Origin Finder', type: 'Country', cost: 100, hint: 'United States / Japan', unlocked: false },
  { id: 'year1', name: 'Time Crystal', type: 'Year', cost: 100, hint: 'Released between 2010-2020', unlocked: false },
  { id: 'universe1', name: 'Universe Key', type: 'Universe', cost: 100, hint: 'Part of a larger franchise', unlocked: false },
  { id: 'genre2', name: 'Genre Reveal II', type: 'Genre', cost: 100, hint: 'Psychological Horror', unlocked: false },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'CosmicWanderer', score: 2450 },
  { rank: 2, username: 'NebulaNinja', score: 2200 },
  { rank: 3, username: 'StardustSage', score: 1950 },
  { rank: 4, username: 'VoidVoyager', score: 1800 },
  { rank: 5, username: 'GalaxyGhost', score: 1650 },
  { rank: 6, username: 'QuantumQuester', score: 1500 },
  { rank: 7, username: 'DimensionDrifter', score: 1350 },
  { rank: 8, username: 'WarpWizard', score: 1200 },
  { rank: 9, username: 'EventHorizon', score: 1050 },
  { rank: 10, username: 'MultiverseMaven', score: 900 },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [powercards, setPowercards] = useState(mockPowercards);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [isRegistered, setIsRegistered] = useState(false);

  const registerUser = (name: string) => {
    const newUser: User = {
      name,
      score: 0,
      powercards: [],
    };
    setUser(newUser);
    setIsRegistered(true);
    
    // Add user to leaderboard
    setLeaderboard((prev) => {
      const updated = [...prev, { rank: prev.length + 1, username: name, score: 0, isCurrentUser: true }];
      return updated.sort((a, b) => b.score - a.score).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    });
  };

  const unlockPowercard = (id: string) => {
    const card = powercards.find(c => c.id === id);
    if (!user || !card || user.score < card.cost) return;
    
    setUser((prev) => prev ? { ...prev, score: prev.score - card.cost } : null);
    setPowercards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unlocked: true } : c))
    );
    
    // Update leaderboard
    setLeaderboard((prev) => {
      const updated = prev.map((entry) =>
        entry.isCurrentUser ? { ...entry, score: entry.score - card.cost } : entry
      );
      return updated.sort((a, b) => b.score - a.score).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    });
  };

  const answerQuestion = (isCorrect: boolean) => {
    if (!user) return;
    
    if (isCorrect) {
      const points = mockQuestions[currentQuestionIndex]?.points || 50;
      setUser((prev) => prev ? { ...prev, score: prev.score + points } : null);
      
      // Update leaderboard
      setLeaderboard((prev) => {
        const updated = prev.map((entry) =>
          entry.isCurrentUser ? { ...entry, score: entry.score + points } : entry
        );
        return updated.sort((a, b) => b.score - a.score).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
      });
    }
  };

  return (
    <GameContext.Provider
      value={{
        user,
        setUser,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        questions: mockQuestions,
        powercards,
        leaderboard,
        unlockPowercard,
        answerQuestion,
        isRegistered,
        registerUser,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
