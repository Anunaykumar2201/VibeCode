import React, { useState, useEffect } from 'react';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';

export default function RandomEvents() {
  const { play } = useSound();
  const { showToast } = useChaos();

  const [parrotActive, setParrotActive] = useState(false);
  const [cannonHole, setCannonHole] = useState(null);
  const [krakenActive, setKrakenActive] = useState(false);
  const [rumActive, setRumActive] = useState(false);
  const [mutinyActive, setMutinyActive] = useState(false);

  useEffect(() => {
    const triggerEvent = () => {
      const events = ['parrot', 'cannon', 'kraken', 'rum', 'mutiny'];
      const picked = events[Math.floor(Math.random() * events.length)];

      if (picked === 'parrot') {
        play('parrot');
        setParrotActive(true);
        showToast('🦜 Captain Polly flew across the deck!', 'info');
        setTimeout(() => setParrotActive(false), 4500);
      } else if (picked === 'cannon') {
        play('cannon');
        document.body.classList.add('cannon-shake-screen');
        setTimeout(() => document.body.classList.remove('cannon-shake-screen'), 850);

        const x = Math.floor(Math.random() * (window.innerWidth - 180)) + 40;
        const y = Math.floor(Math.random() * (window.innerHeight - 180)) + 60;
        setCannonHole({ x, y, patched: false });
        showToast('💣 INCOMING CANNONBALL! Hull breached! Click hole to patch!', 'warning');
      } else if (picked === 'kraken') {
        play('splash');
        setTimeout(() => play('creak'), 250);
        setKrakenActive(true);
        showToast('🐙 THE DHANBAD KRAKEN RISES FROM THE BILGE!', 'warning');
        setTimeout(() => setKrakenActive(false), 4200);
      } else if (picked === 'rum') {
        play('splash');
        setRumActive(true);
        document.body.classList.add('rum-spill-active');
        showToast('🍾 SPILLED 100-PROOF GROG ON DECK! Vision is blurry!', 'info');
        setTimeout(() => {
          setRumActive(false);
          document.body.classList.remove('rum-spill-active');
        }, 5000);
      } else if (picked === 'mutiny') {
        play('bell');
        setMutinyActive(true);
        showToast('⚔️ MUTINY! The crew is fighting for the wheel!', 'warning');
        setTimeout(() => setMutinyActive(false), 5500);
      }
    };

    const interval = setInterval(() => {
      triggerEvent();
    }, 13000);

    return () => clearInterval(interval);
  }, [play, showToast]);

  const patchHole = () => {
    play('creak');
    setCannonHole(prev => prev ? { ...prev, patched: true } : null);
    setTimeout(() => setCannonHole(null), 800);
  };

  return (
    <>
      {/* 1. Flying Parrot Event */}
      {parrotActive && (
        <div className="event-parrot-flyer parrot-flying-across" style={{ top: '30%' }}>
          🦜 <span className="parrot-speech">SQUAWK! Pieces of Eight! SQUAWK!</span>
        </div>
      )}

      {/* 2. Cannonball Hole Event */}
      {cannonHole && (
        <div 
          className="cannonball-hole" 
          style={{ left: cannonHole.x, top: cannonHole.y }}
          onClick={patchHole}
        >
          {cannonHole.patched ? (
            <div className="plank-patch">🪵 PATCHED!</div>
          ) : (
            <>
              <div className="hole-center">💥</div>
              <div className="patch-prompt">Click to patch hull!</div>
            </>
          )}
        </div>
      )}

      {/* 3. Kraken Tentacle Event */}
      {krakenActive && (
        <div className="kraken-tentacle-wrapper kraken-extended">
          <div className="kraken-tentacle">
            <span className="kraken-icon">🐙</span>
            <span className="kraken-roars">ROAARRR!</span>
          </div>
        </div>
      )}
    </>
  );
}
