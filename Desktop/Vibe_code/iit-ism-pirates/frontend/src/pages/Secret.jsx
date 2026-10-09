import React from 'react';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';
import confetti from 'canvas-confetti';

export default function Secret() {
  const { play } = useSound();
  const { addChaos, resetChaos } = useChaos();

  return (
    <div className="container secret-vault-wrapper">
      <header className="page-header">
        <h1>🗝️ The Captain's Secret Vault &amp; Admiralty Soundboard</h1>
        <p>You have unlocked the inner sanctum! Use the Admiralty controls to command the 7 seas.</p>
      </header>

      <div className="parchment-card" style={{ textAlign: 'center' }}>
        <h2>🔊 Pirate Soundboard &amp; FX Trigger</h2>
        <div className="soundboard-grid">
          <button className="btn" onClick={() => play('cannon')}>💣 Cannon</button>
          <button className="btn" onClick={() => play('parrot')}>🦜 Parrot</button>
          <button className="btn" onClick={() => play('bell')}>🔔 Ship Bell</button>
          <button className="btn" onClick={() => play('splash')}>🌊 Splash</button>
          <button className="btn" onClick={() => play('thunder')}>⚡ Thunder</button>
          <button className="btn" onClick={() => play('victory')}>🎺 Fanfare</button>
          <button className="btn" onClick={() => play('coin')}>🪙 Coin</button>
        </div>
      </div>

      <div className="parchment-card" style={{ marginTop: '2rem' }}>
        <h2>⚡ Admiralty Cheat Codes</h2>
        <p>Forbidden levers reserved only for High Admirals during judge demos:</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
          <button 
            className="btn btn-danger" 
            onClick={() => addChaos(100)}
          >
            ☠️ Instant 100% Capsize
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => { confetti({ particleCount: 150, spread: 100 }); play('victory'); }}
          >
            🎉 Royal Confetti Barrage
          </button>
          <button 
            className="btn" 
            onClick={resetChaos}
          >
            🌊 Calm the Waters (0%)
          </button>
        </div>
      </div>
    </div>
  );
}
