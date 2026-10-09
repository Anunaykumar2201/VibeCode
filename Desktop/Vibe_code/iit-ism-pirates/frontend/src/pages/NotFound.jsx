import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSound } from '../context/SoundContext';

export default function NotFound() {
  const { play } = useSound();
  const [fell, setFell] = useState(false);

  const pushOffPlank = () => {
    if (fell) return;
    play('splash');
    setFell(true);
    setTimeout(() => {
      setFell(false);
    }, 2000);
  };

  return (
    <div className="container plank-stage">
      <header className="page-header">
        <h1>🦈 404: This Page Walked the Plank!</h1>
        <p>The coordinates you seek have been swallowed by the dark depths of Davy Jones' locker.</p>
      </header>

      <div className="parchment-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          Click the scallywag to make him walk the plank!
        </p>

        {/* Wooden Plank Structure */}
        <div className="wooden-plank">
          <div 
            className="pirate-on-plank"
            style={{ 
              transform: fell ? 'translateY(120px) rotate(90deg)' : 'translateY(0)',
              opacity: fell ? 0 : 1,
              transition: 'all 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53)'
            }}
            onClick={pushOffPlank}
            title="Click to push scallywag!"
          >
            🏴‍☠️
          </div>
        </div>

        {/* Shark Waters */}
        <div className="shark-ocean">
          🦈 🌊 🌊 🦈 🌊
        </div>

        {fell && (
          <p style={{ color: 'var(--blood-red)', fontWeight: 'bold', marginTop: '1rem' }}>
            SPLASH! Swallowed by the Dhanbad reef sharks!
          </p>
        )}

        <div style={{ marginTop: '2rem' }}>
          <NavLink to="/" className="btn">
            🧭 Return to Safe Port (Home)
          </NavLink>
        </div>
      </div>
    </div>
  );
}
