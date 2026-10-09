import React from 'react';
import { useChaos } from '../context/ChaosContext';
import { useTreasure } from '../context/TreasureContext';

export default function ChaosHUD() {
  const { chaos, resetChaos } = useChaos();
  const { coins } = useTreasure();

  let skullStatus = '⚓ CALM';
  let barGradient = 'linear-gradient(90deg, #00b4db, #0083b0)';

  if (chaos >= 100) {
    skullStatus = '☠️ CAPSIZED!';
    barGradient = 'linear-gradient(90deg, #ff416c, #ff4b2b)';
  } else if (chaos >= 75) {
    skullStatus = '⛈️ STORM!';
    barGradient = 'linear-gradient(90deg, #ff416c, #ff4b2b)';
  } else if (chaos >= 50) {
    skullStatus = '🏴‍☠️ PIRATE!';
    barGradient = 'linear-gradient(90deg, #f7971e, #ffd200)';
  } else if (chaos >= 25) {
    skullStatus = '🌊 CHOPPY';
    barGradient = 'linear-gradient(90deg, #56ab2f, #a8e063)';
  }

  return (
    <div className="chaos-meter-hud">
      <div className="chaos-hud-content">
        <div className="chaos-label-wrapper">
          <span className="chaos-title">⚡ SEA CHAOS METER</span>
          <span className="chaos-skull-status">{skullStatus}</span>
        </div>

        <div className="chaos-bar-track">
          <div 
            className="chaos-bar-fill" 
            style={{ width: `${chaos}%`, background: barGradient }} 
          />
        </div>

        <div className="chaos-percentage">{chaos}%</div>

        <button className="calm-sea-btn" onClick={resetChaos} title="Reset all chaos to 0%">
          🌊 Calm the Sea
        </button>

        <div className="treasure-hud-badge" title="Collected Doubloons">
          🪙 <span>{coins.length}/5</span>
        </div>
      </div>
    </div>
  );
}
