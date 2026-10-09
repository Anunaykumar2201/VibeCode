import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSound } from './SoundContext';
import { useChaos } from './ChaosContext';
import confetti from 'canvas-confetti';

const TreasureContext = createContext();

export const TreasureProvider = ({ children }) => {
  const { play } = useSound();
  const { showToast } = useChaos();
  const [coins, setCoins] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pirate_treasure_coins')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('pirate_treasure_coins', JSON.stringify(coins));
  }, [coins]);

  const collectCoin = (coinId, event) => {
    if (!coins.includes(coinId)) {
      const next = [...coins, coinId];
      setCoins(next);
      play('coin');

      confetti({
        particleCount: 50,
        spread: 60,
        origin: event ? { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight } : { y: 0.7 }
      });

      if (next.length >= 5) {
        setTimeout(() => play('victory'), 300);
        showToast('🎉 ALL 5 HIDDEN DOUBLOONS FOUND! Secret Captain\'s Locker UNLOCKED! 🗝️', 'success');
      } else {
        showToast(`🪙 Doubloon Found (${next.length}/5)! Keep searching the decks!`, 'info');
      }
    }
  };

  const isCollected = (coinId) => coins.includes(coinId);

  return (
    <TreasureContext.Provider value={{ coins, collectCoin, isCollected, isUnlocked: coins.length >= 5 }}>
      {children}
    </TreasureContext.Provider>
  );
};

export const useTreasure = () => useContext(TreasureContext);
