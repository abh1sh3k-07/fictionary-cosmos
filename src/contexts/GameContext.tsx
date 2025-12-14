import React, { useState, createContext, useContext } from 'react';

export interface User {
  name: string;
  score: number;
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
  getHint: (questionId: number) => string;
}

export interface OwnedPowercard {
  id: string;
  powercardId: string;
  purchasedAt: number;
  used: boolean;
  usedOnQuestion?: number;
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
  ownedPowercards: OwnedPowercard[];
  leaderboard: LeaderboardEntry[];
  buyPowercard: (id: string) => boolean;
  usePowercard: (ownedId: string, questionIndex: number) => string | null;
  answerQuestion: (isCorrect: boolean) => void;
  isRegistered: boolean;
  registerUser: (name: string) => void;
  isQuizComplete: boolean;
  setQuizComplete: (complete: boolean) => void;
}

// Question-specific hints for each powercard type
const questionHints: Record<number, Record<string, string>> = {
  1: {
    Genre: 'Science Fiction / Heist Thriller',
    Language: 'English',
    Country: 'United States / United Kingdom',
    Year: '2010',
    Universe: 'Standalone film by Christopher Nolan',
  },
  2: {
    Genre: 'Psychological Thriller / Supernatural',
    Language: 'Japanese (with English dub available)',
    Country: 'Japan',
    Year: '2006-2007',
    Universe: 'Death Note universe by Tsugumi Ohba',
  },
  3: {
    Genre: 'Science Fiction / Horror / Drama',
    Language: 'English',
    Country: 'United States',
    Year: '2016-present',
    Universe: 'Stranger Things universe by the Duffer Brothers',
  },
  4: {
    Genre: 'Science Fiction / Comedy',
    Language: 'English',
    Country: 'United Kingdom',
    Year: '1979 (first book)',
    Universe: 'The Hitchhiker\'s Guide to the Galaxy series',
  },
  5: {
    Genre: 'Science Fiction / Epic / Political',
    Language: 'English',
    Country: 'United States',
    Year: '1965 (book), 2021 (latest film)',
    Universe: 'Dune universe by Frank Herbert',
  },
};

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
  { 
    id: 'genre', 
    name: 'Genre Reveal', 
    type: 'Genre', 
    cost: 100, 
    getHint: (qId) => questionHints[qId]?.Genre || 'Genre hint unavailable'
  },
  { 
    id: 'language', 
    name: 'Language Oracle', 
    type: 'Language', 
    cost: 100, 
    getHint: (qId) => questionHints[qId]?.Language || 'Language hint unavailable'
  },
  { 
    id: 'country', 
    name: 'Origin Finder', 
    type: 'Country', 
    cost: 100, 
    getHint: (qId) => questionHints[qId]?.Country || 'Country hint unavailable'
  },
  { 
    id: 'year', 
    name: 'Time Crystal', 
    type: 'Year', 
    cost: 100, 
    getHint: (qId) => questionHints[qId]?.Year || 'Year hint unavailable'
  },
  { 
    id: 'universe', 
    name: 'Universe Key', 
    type: 'Universe', 
    cost: 100, 
    getHint: (qId) => questionHints[qId]?.Universe || 'Universe hint unavailable'
  },
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
  const [ownedPowercards, setOwnedPowercards] = useState<OwnedPowercard[]>([]);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isQuizComplete, setQuizComplete] = useState(false);

  const registerUser = (name: string) => {
    const newUser: User = {
      name,
      score: 0,
    };
    setUser(newUser);
    setIsRegistered(true);
    
    // Add user to leaderboard
    setLeaderboard((prev) => {
      const updated = [...prev, { rank: prev.length + 1, username: name, score: 0, isCurrentUser: true }];
      return updated.sort((a, b) => b.score - a.score).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    });
  };

  const buyPowercard = (id: string): boolean => {
    const card = mockPowercards.find(c => c.id === id);
    if (!user || !card || user.score < card.cost) return false;
    
    // Deduct points
    setUser((prev) => prev ? { ...prev, score: prev.score - card.cost } : null);
    
    // Add owned powercard
    const newOwned: OwnedPowercard = {
      id: `${id}_${Date.now()}`,
      powercardId: id,
      purchasedAt: Date.now(),
      used: false,
    };
    setOwnedPowercards((prev) => [...prev, newOwned]);
    
    // Update leaderboard
    setLeaderboard((prev) => {
      const updated = prev.map((entry) =>
        entry.isCurrentUser ? { ...entry, score: entry.score - card.cost } : entry
      );
      return updated.sort((a, b) => b.score - a.score).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    });
    
    return true;
  };

  const usePowercard = (ownedId: string, questionIndex: number): string | null => {
    const owned = ownedPowercards.find(o => o.id === ownedId && !o.used);
    if (!owned) return null;
    
    const card = mockPowercards.find(c => c.id === owned.powercardId);
    if (!card) return null;
    
    const questionId = mockQuestions[questionIndex]?.id;
    if (!questionId) return null;
    
    // Mark as used
    setOwnedPowercards((prev) =>
      prev.map((o) =>
        o.id === ownedId ? { ...o, used: true, usedOnQuestion: questionIndex } : o
      )
    );
    
    return card.getHint(questionId);
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
        powercards: mockPowercards,
        ownedPowercards,
        leaderboard,
        buyPowercard,
        usePowercard,
        answerQuestion,
        isRegistered,
        registerUser,
        isQuizComplete,
        setQuizComplete,
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
