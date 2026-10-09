import React, { useState, useEffect } from 'react';
import { HOSTELS } from '../data/hostels';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';
import { useTreasure } from '../context/TreasureContext';
import { useAuth } from '../context/AuthContext';

export default function Hostels() {
  const { play } = useSound();
  const { addChaos, showToast } = useChaos();
  const { collectCoin, isCollected } = useTreasure();
  const { user } = useAuth();

  const [fleet, setFleet] = useState(HOSTELS);
  const [raidLogs, setRaidLogs] = useState([
    '⚔️ Amber War Galleon plundered 450 doubloons from Topaz!',
    '💣 Diamond Flagship fired broadside cannons at Jasper!',
    '🌊 Aquamarine Sky-Galleon raised sails for midnight canteen raid!'
  ]);

  // Periodic random NPC raids to keep leaderboard dynamic
  useEffect(() => {
    const interval = setInterval(() => {
      const attackerIdx = Math.floor(Math.random() * fleet.length);
      let defenderIdx = Math.floor(Math.random() * fleet.length);
      if (attackerIdx === defenderIdx) defenderIdx = (defenderIdx + 1) % fleet.length;

      const stolen = Math.floor(Math.random() * 300) + 100;
      setFleet(prev => {
        const next = [...prev];
        next[attackerIdx] = { ...next[attackerIdx], loot: next[attackerIdx].loot + stolen };
        next[defenderIdx] = { ...next[defenderIdx], loot: Math.max(0, next[defenderIdx].loot - stolen) };
        return next.sort((a, b) => b.loot - a.loot);
      });

      setRaidLogs(logs => [
        `⚔️ ${fleet[attackerIdx].name} plundered ${stolen} doubloons from ${fleet[defenderIdx].name}!`,
        ...logs.slice(0, 15)
      ]);
    }, 9000);

    return () => clearInterval(interval);
  }, [fleet]);

  const handleRaid = (targetHostel) => {
    play('cannon');
    addChaos(6);

    const stolen = 500;
    setFleet(prev => {
      const next = prev.map(h => {
        if (h.id === targetHostel.id) {
          return { ...h, loot: Math.max(0, h.loot - stolen) };
        }
        return h;
      });
      return next.sort((a, b) => b.loot - a.loot);
    });

    const msg = `💥 YOU raided ${targetHostel.name} and seized ${stolen} Doubloons!`;
    setRaidLogs(logs => [msg, ...logs.slice(0, 15)]);
    showToast(msg, 'success');
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1>⚔️ Hostel Wars: The 11 War Galleons Leaderboard</h1>
        <p>Gemstone-hulled pirate dreadnoughts clashing for loot, mess dominance, and midnight supremacy!</p>
      </header>

      {/* Hidden Coin 2 */}
      {!isCollected('coin_hostel') && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <button
            className="hidden-treasure-coin"
            onClick={(e) => collectCoin('coin_hostel', e)}
            title="A gemstone-encrusted doubloon in the captain's locker..."
          >
            🪙 (Plunder Secret Doubloon)
          </button>
        </div>
      )}

      {/* Hostels Grid Leaderboard */}
      <div className="hostels-grid">
        {fleet.map((hostel, index) => {
          const isUserFlagship = user?.hostelId === hostel.id;
          return (
            <div key={hostel.id} className={`hostel-card ${isUserFlagship ? 'my-flagship-card' : ''}`}>
              <div className="hostel-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="hostel-rank-badge">#{index + 1}</span>
                  {isUserFlagship && (
                    <span className="user-flagship-tag" title="Enlisted Crew Flagship">
                      ⭐ Your Flagship
                    </span>
                  )}
                </div>
                <span className="hostel-flag-icon">{hostel.flag}</span>
              </div>

              <h3 style={{ color: 'var(--gold-glow)', fontSize: '1.4rem' }}>{hostel.name}</h3>
            <p style={{ color: 'var(--bg-parchment-dark)', fontSize: '0.88rem', margin: '4px 0' }}>
              <strong>Official:</strong> {hostel.realName} • Built: {hostel.built} • {hostel.floors} Decks
            </p>
            <p style={{ color: 'var(--bg-parchment-light)', fontSize: '0.92rem', fontStyle: 'italic' }}>
              "{hostel.specialty}"
            </p>

            <div className="hostel-loot-bar-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="loot-amount-text">💰 {hostel.loot.toLocaleString()} Doubloons</span>
                <span style={{ fontSize: '0.9rem', color: '#ff7675' }}>💣 {hostel.cannons} Cannons</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (hostel.loot / 25000) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #f1c40f, #e67e22)' }} />
              </div>
            </div>

            <button 
              className="btn btn-danger" 
              style={{ marginTop: 'auto', width: '100%', padding: '0.5rem 1rem' }}
              onClick={() => handleRaid(hostel)}
            >
              💣 Raid This Galleon (-500)
            </button>
          </div>
          );
        })}
      </div>

      {/* Live Raid Activity Feed */}
      <div className="raid-feed-box">
        <h3>📡 Live Admiralty Combat &amp; Plunder Feed</h3>
        <ul className="raid-log-list">
          {raidLogs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
