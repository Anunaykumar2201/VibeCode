import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSound } from './SoundContext';

const ChaosContext = createContext();

export const ChaosProvider = ({ children }) => {
  const { play } = useSound();
  const [chaos, setChaos] = useState(() => {
    const val = parseInt(sessionStorage.getItem('pirate_chaos_level'), 10);
    return isNaN(val) ? 0 : Math.max(0, Math.min(100, val));
  });

  const [toasts, setToasts] = useState([]);
  const [floatingChaos, setFloatingChaos] = useState([]);
  const [abandonPos, setAbandonPos] = useState({ top: 45, left: 45 });

  useEffect(() => {
    sessionStorage.setItem('pirate_chaos_level', chaos);

    const body = document.body;
    body.classList.toggle('chaos-tier-1', chaos >= 25);
    body.classList.toggle('chaos-tier-2', chaos >= 50);
    body.classList.toggle('chaos-tier-3', chaos >= 75);
    body.classList.toggle('chaos-tier-4', chaos >= 100);
  }, [chaos]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const addChaos = (amount = 5) => {
    setChaos(prev => {
      const next = Math.min(100, prev + amount);
      if (next >= 100 && prev < 100) {
        play('thunder');
        showToast('☠️ SHIP CAPSIZED! 100% CHAOS REACHED! CATCH ABANDON SHIP TO RESET!', 'danger');
      } else if (next >= 75 && prev < 75) {
        play('creak');
        showToast('⛈️ GALE-FORCE STORM AHEAD! (75% Chaos)', 'warning');
      } else if (next >= 50 && prev < 50) {
        play('bell');
        showToast('🏴‍☠️ PIRATE TALK ACTIVATED! (50% Chaos)', 'info');
      } else {
        play('click');
      }

      // Add floating feedback
      const fId = Date.now() + Math.random();
      setFloatingChaos(f => [...f, { id: fId, text: `+${amount}% Chaos`, x: window.innerWidth / 2 + (Math.random() * 160 - 80), y: window.innerHeight / 2 + (Math.random() * 100 - 50) }]);
      setTimeout(() => {
        setFloatingChaos(f => f.filter(item => item.id !== fId));
      }, 1200);

      return next;
    });
  };

  const resetChaos = () => {
    setChaos(0);
    play('victory');
    showToast('🌊 The Seven Seas are Calmed! (Chaos Reset to 0%)', 'success');
  };

  // Runaway button mousemove physics
  const dodgeAbandonShip = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 150) {
      const angle = Math.atan2(btnCenterY - e.clientY, btnCenterX - e.clientX);
      const moveDist = 200;
      let newX = rect.left + Math.cos(angle) * moveDist;
      let newY = rect.top + Math.sin(angle) * moveDist;

      newX = Math.max(20, Math.min(window.innerWidth - rect.width - 20, newX));
      newY = Math.max(20, Math.min(window.innerHeight - rect.height - 20, newY));

      setAbandonPos({
        top: (newY / window.innerHeight) * 100,
        left: (newX / window.innerWidth) * 100
      });
    }
  };

  return (
    <ChaosContext.Provider value={{ chaos, addChaos, resetChaos, showToast }}>
      {children}

      {/* Storm Rain Canvas when tier 3 */}
      {chaos >= 75 && (
        <div className="storm-rain-overlay" />
      )}

      {/* Runaway Abandon Ship Button when tier 4 (100%) */}
      {chaos >= 100 && (
        <button
          className="abandon-ship-runaway-btn"
          style={{ top: `${abandonPos.top}%`, left: `${abandonPos.left}%` }}
          onMouseMove={dodgeAbandonShip}
          onClick={resetChaos}
        >
          🚨 ABANDON SHIP! (Catch me to reset!)
        </button>
      )}

      {/* Floating Chaos Indicators */}
      {floatingChaos.map(f => (
        <div key={f.id} className="floating-chaos-indicator" style={{ left: f.x, top: f.y }}>
          {f.text}
        </div>
      ))}

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`pirate-toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ChaosContext.Provider>
  );
};

export const useChaos = () => useContext(ChaosContext);
