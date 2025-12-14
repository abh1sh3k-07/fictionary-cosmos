import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Sparkles, Lock, Globe, Calendar, Film, BookOpen, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useSoundEffects } from '@/hooks/useSoundEffects';
const typeIcons: Record<string, React.ReactNode> = {
  'Genre': <Film className="w-6 h-6" />,
  'Language': <Globe className="w-6 h-6" />,
  'Country': <Globe className="w-6 h-6" />,
  'Year': <Calendar className="w-6 h-6" />,
  'Universe': <BookOpen className="w-6 h-6" />
};
const typeColors: Record<string, string> = {
  'Genre': 'from-primary to-violet',
  'Language': 'from-violet to-accent',
  'Country': 'from-accent to-primary',
  'Year': 'from-primary to-accent',
  'Universe': 'from-violet to-primary'
};
const PowercardsPage: React.FC = () => {
  const {
    powercards,
    buyPowercard,
    user,
    ownedPowercards
  } = useGame();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [explosionId, setExplosionId] = useState<string | null>(null);
  const {
    playPowercardUnlock
  } = useSoundEffects();

  // Count owned cards of each type
  const ownedCounts = ownedPowercards.reduce((acc, owned) => {
    if (!owned.used) {
      acc[owned.powercardId] = (acc[owned.powercardId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  const handleBuy = (id: string, cost: number) => {
    if (!user || user.score < cost) {
      toast.error('Insufficient points!', {
        description: `You need ${cost} points to buy this powercard.`
      });
      return;
    }
    setBuyingId(id);
    setExplosionId(id);
    playPowercardUnlock();
    setTimeout(() => {
      const success = buyPowercard(id);
      setBuyingId(null);
      if (success) {
        toast.success('Powercard Acquired!', {
          description: 'Your powercard is now stored for use on any question.',
          icon: <Sparkles className="w-5 h-5 text-primary" />
        });
      }
    }, 600);
    setTimeout(() => {
      setExplosionId(null);
    }, 1000);
  };
  return <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <motion.div className="max-w-6xl mx-auto" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.5
    }}>
        {/* Header */}
        <motion.div initial={{
        y: -20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.2
      }} className="text-center mb-12 bg-inherit text-foreground">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="neon-text text-violet-50">Powercards</span>
          </h1>
          <p className="font-body text-lg max-w-2xl mx-auto text-foreground">
            Buy cosmic hint cards to use on any question. Each card reveals specific information to help you answer.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-primary">
            <Sparkles className="w-5 h-5" />
            <span className="font-display">100 points each</span>
          </div>
        </motion.div>

        {/* Owned powercards summary */}
        {Object.keys(ownedCounts).length > 0 && <motion.div className="cosmic-card p-6 mb-8" initial={{
        y: 10,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.25
      }}>
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg text-foreground">Your Inventory</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(ownedCounts).map(([cardId, count]) => {
            const card = powercards.find(c => c.id === cardId);
            if (!card) return null;
            return <div key={cardId} className={`px-4 py-2 rounded-lg bg-gradient-to-r ${typeColors[card.type]} 
                               text-primary-foreground font-display text-sm flex items-center gap-2`}>
                    {typeIcons[card.type]}
                    <span>{card.type}</span>
                    <span className="bg-background/30 px-2 py-0.5 rounded-full text-xs">×{count}</span>
                  </div>;
          })}
            </div>
            <p className="text-muted-foreground text-sm font-body mt-3">
              Go to Questions page to use your powercards!
            </p>
          </motion.div>}

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {powercards.map((card, index) => <motion.div key={card.id} className="relative perspective-1000" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1 * index
        }}>
              {/* Galaxy explosion effect */}
              <AnimatePresence>
                {explosionId === card.id && <>
                    {/* Outer ring explosion */}
                    {[...Array(16)].map((_, i) => <motion.div key={i} className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full" style={{
                background: i % 3 === 0 ? 'hsl(var(--primary))' : i % 3 === 1 ? 'hsl(var(--violet))' : 'hsl(var(--accent))'
              }} initial={{
                x: '-50%',
                y: '-50%',
                scale: 0
              }} animate={{
                x: `${-50 + Math.cos(i * 22.5 * Math.PI / 180) * 250}%`,
                y: `${-50 + Math.sin(i * 22.5 * Math.PI / 180) * 250}%`,
                scale: [0, 2, 0],
                opacity: [1, 0.7, 0]
              }} exit={{
                opacity: 0
              }} transition={{
                duration: 0.7,
                ease: 'easeOut'
              }} />)}
                    
                    {/* Inner spiral particles */}
                    {[...Array(8)].map((_, i) => <motion.div key={`inner-${i}`} className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white" initial={{
                x: '-50%',
                y: '-50%',
                scale: 0,
                rotate: 0
              }} animate={{
                x: `${-50 + Math.cos(i * 45 * Math.PI / 180 + 0.5) * 150}%`,
                y: `${-50 + Math.sin(i * 45 * Math.PI / 180 + 0.5) * 150}%`,
                scale: [0, 1.5, 0],
                opacity: [1, 0.5, 0],
                rotate: [0, 180]
              }} exit={{
                opacity: 0
              }} transition={{
                duration: 0.5,
                delay: 0.1,
                ease: 'easeOut'
              }} />)}
                    
                    {/* Central flash */}
                    <motion.div className="absolute inset-0 rounded-2xl" style={{
                background: 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--violet)) 50%, transparent 70%)'
              }} initial={{
                opacity: 1,
                scale: 0.8
              }} animate={{
                opacity: 0,
                scale: 2
              }} exit={{
                opacity: 0
              }} transition={{
                duration: 0.6
              }} />
                  </>}
              </AnimatePresence>

              <motion.div className="relative h-72 rounded-2xl overflow-hidden cursor-pointer
                           bg-card/80 border border-border/50 hover:border-primary/50 transition-colors" whileHover={{
            scale: 1.03,
            rotateY: 5
          }} whileTap={{
            scale: 0.98
          }} animate={buyingId === card.id ? {
            scale: [1, 1.1, 1]
          } : {}} transition={{
            duration: 0.4
          }} onClick={() => handleBuy(card.id, card.cost)}>
                {/* Card background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[card.type]} opacity-20`} />
                
                {/* Shimmer effect */}
                <motion.div className="absolute inset-0 opacity-30" style={{
              background: 'linear-gradient(45deg, transparent 40%, hsl(var(--primary) / 0.3) 50%, transparent 60%)',
              backgroundSize: '200% 200%'
            }} animate={{
              backgroundPosition: ['0% 0%', '200% 200%']
            }} transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }} />

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
                    Reveals the {card.type.toLowerCase()} of the answer
                  </p>

                  {/* Buy prompt */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground font-body text-sm">
                        Tap to purchase
                      </p>
                    </div>
                  </div>

                  {/* Cost badge */}
                  <div className="absolute bottom-6 right-6 flex items-center gap-2 
                                  px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-display text-sm text-foreground">{card.cost}</span>
                  </div>
                  
                  {/* Owned count badge */}
                  {ownedCounts[card.id] && <div className="absolute top-6 right-6 flex items-center gap-1 
                                    px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                      <Package className="w-3 h-3 text-primary" />
                      <span className="font-display text-xs text-primary">×{ownedCounts[card.id]}</span>
                    </div>}
                </div>

                {/* Floating particles */}
                {[...Array(3)].map((_, i) => <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-primary/40" style={{
              left: `${20 + i * 25}%`,
              bottom: `${15 + i % 2 * 10}%`
            }} animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.7, 0.3]
            }} transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3
            }} />)}
              </motion.div>
            </motion.div>)}
        </div>

        {/* Info section */}
        <motion.div className="mt-12 text-center text-muted-foreground font-body" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.8
      }}>
          <p>Powercards are stored in your inventory. Use them on the Questions page when you need a hint!</p>
        </motion.div>
      </motion.div>
    </div>;
};
export default PowercardsPage;