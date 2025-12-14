import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Sparkles, Lock, Eye, Globe, Calendar, Film, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const typeIcons: Record<string, React.ReactNode> = {
  'Genre': <Film className="w-6 h-6" />,
  'Language': <Globe className="w-6 h-6" />,
  'Country': <Globe className="w-6 h-6" />,
  'Year': <Calendar className="w-6 h-6" />,
  'Universe': <BookOpen className="w-6 h-6" />,
};

const typeColors: Record<string, string> = {
  'Genre': 'from-primary to-violet',
  'Language': 'from-violet to-accent',
  'Country': 'from-accent to-primary',
  'Year': 'from-primary to-accent',
  'Universe': 'from-violet to-primary',
};

const PowercardsPage: React.FC = () => {
  const { powercards, unlockPowercard, user } = useGame();
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [explosionId, setExplosionId] = useState<string | null>(null);

  const handleUnlock = (id: string, cost: number) => {
    if (!user || user.score < cost) {
      toast.error('Insufficient points!', {
        description: `You need ${cost} points to unlock this powercard.`,
      });
      return;
    }

    setUnlockingId(id);
    setExplosionId(id);

    setTimeout(() => {
      unlockPowercard(id);
      setUnlockingId(null);
      toast.success('Powercard Unlocked!', {
        description: 'A new secret has been revealed...',
        icon: <Sparkles className="w-5 h-5 text-primary" />,
      });
    }, 600);

    setTimeout(() => {
      setExplosionId(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <motion.div
        className="max-w-6xl mx-auto"
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
            <span className="neon-text">Powercards</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Unlock cosmic secrets to gain advantages. Each powercard reveals hidden information about the current question.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-primary">
            <Sparkles className="w-5 h-5" />
            <span className="font-display">Cost: 300 points each</span>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {powercards.map((card, index) => (
            <motion.div
              key={card.id}
              className="relative perspective-1000"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {/* Explosion effect */}
              <AnimatePresence>
                {explosionId === card.id && (
                  <>
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-primary"
                        initial={{ x: '-50%', y: '-50%', scale: 0 }}
                        animate={{
                          x: `${-50 + Math.cos(i * 30 * Math.PI / 180) * 200}%`,
                          y: `${-50 + Math.sin(i * 30 * Math.PI / 180) * 200}%`,
                          scale: [0, 1.5, 0],
                          opacity: [1, 0.5, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    ))}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-violet to-accent"
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  </>
                )}
              </AnimatePresence>

              <motion.div
                className={`relative h-80 rounded-2xl overflow-hidden cursor-pointer
                           ${card.unlocked ? 'cosmic-border' : 'bg-card/80 border border-border/50'}`}
                whileHover={{ scale: 1.03, rotateY: card.unlocked ? 0 : 5 }}
                whileTap={{ scale: 0.98 }}
                animate={unlockingId === card.id ? { rotateY: 180 } : {}}
                transition={{ duration: 0.4 }}
                onClick={() => !card.unlocked && handleUnlock(card.id, card.cost)}
              >
                {/* Card background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[card.type]} opacity-20`} />
                
                {/* Animated glow border for unlocked cards */}
                {card.unlocked && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 20px hsl(var(--primary) / 0.3)',
                        '0 0 40px hsl(var(--violet) / 0.4)',
                        '0 0 20px hsl(var(--primary) / 0.3)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Card content */}
                <div className="relative h-full p-6 flex flex-col">
                  {/* Card type icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${typeColors[card.type]} 
                                   flex items-center justify-center text-primary-foreground mb-4`}>
                    {typeIcons[card.type]}
                  </div>

                  {/* Card name */}
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {card.name}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm mb-4">
                    {card.type} Powercard
                  </p>

                  {/* Card content - locked or unlocked */}
                  <div className="flex-1 flex items-center justify-center">
                    {card.unlocked ? (
                      <motion.div
                        className="text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Eye className="w-8 h-8 text-primary mx-auto mb-3" />
                        <p className="font-body text-foreground text-lg">
                          {card.hint}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground font-body">
                          Tap to unlock
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Cost badge */}
                  {!card.unlocked && (
                    <div className="absolute bottom-6 right-6 flex items-center gap-2 
                                    px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-display text-sm text-foreground">{card.cost}</span>
                    </div>
                  )}

                  {/* Unlocked badge */}
                  {card.unlocked && (
                    <div className="absolute bottom-6 right-6 flex items-center gap-2 
                                    px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-display text-sm text-primary">Unlocked</span>
                    </div>
                  )}
                </div>

                {/* Floating particles for unlocked cards */}
                {card.unlocked && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-primary/50"
                        style={{
                          left: `${20 + i * 15}%`,
                          bottom: `${10 + (i % 3) * 10}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 2 + i * 0.3,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Info section */}
        <motion.div
          className="mt-12 text-center text-muted-foreground font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Powercards are one-time use items. Choose wisely when to reveal them!</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PowercardsPage;
