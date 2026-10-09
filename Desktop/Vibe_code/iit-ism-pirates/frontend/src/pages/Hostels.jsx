import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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

  // Periodic random NPC raids (runs approximately every 9s, cleaned up on unmount)
  useEffect(() => {
    const interval = setInterval(() => {
      setFleet(prev => {
        if (!prev || prev.length < 2) return prev;

        // Pick 2 distinct random hostels from latest fleet
        const attackerIdx = Math.floor(Math.random() * prev.length);
        let defenderIdx = Math.floor(Math.random() * prev.length);
        if (attackerIdx === defenderIdx) {
          defenderIdx = (defenderIdx + 1) % prev.length;
        }

        const attacker = prev[attackerIdx];
        const defender = prev[defenderIdx];

        if (defender.loot <= 0) return prev;

        const stolen = Math.min(defender.loot, Math.floor(Math.random() * 300) + 100);
        if (stolen <= 0) return prev;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const logText = `⚔️ [${time}] ${attacker.name} plundered ${stolen} doubloons from ${defender.name}!`;

        setRaidLogs(logs => [logText, ...logs.slice(0, 19)]);

        const next = prev.map(h => {
          if (h.id === attacker.id) return { ...h, loot: h.loot + stolen };
          if (h.id === defender.id) return { ...h, loot: Math.max(0, h.loot - stolen) };
          return h;
        });

        return next.sort((a, b) => b.loot - a.loot);
      });
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  // Player Raid Handler (Player vs Hostels)
  const handleRaid = (targetHostel) => {
    // 1. Must be logged in to represent a hostel
    if (!user || !user.hostelId) {
      play('click');
      addChaos(2);
      showToast('⚓ Avast! Ye must board the ship (log in) to raid for a war galleon!', 'warning');
      return;
    }

    // 2. Prevent player from raiding their own hostel
    if (user.hostelId === targetHostel.id) {
      play('click');
      showToast("🛡️ Belay that order! Ye cannot fire upon yer own war galleon!", 'warning');
      return;
    }

    // 3. Minimum 500 Doubloons rule
    if (targetHostel.loot < 500) {
      play('click');
      showToast(`⚠️ ${targetHostel.name} has fewer than 500 Doubloons left to plunder! Pick another target!`, 'warning');
      return;
    }

    play('cannon');
    addChaos(6);

    const stolen = 500;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let attackerHostelName = '';
    const defenderHostelName = targetHostel.name;

    setFleet(prev => {
      const playerShip = prev.find(h => h.id === user.hostelId);
      if (playerShip) {
        attackerHostelName = playerShip.name;
      }

      const next = prev.map(h => {
        if (h.id === targetHostel.id) {
          return { ...h, loot: Math.max(0, h.loot - stolen) };
        }
        if (h.id === user.hostelId) {
          return { ...h, loot: h.loot + stolen };
        }
        return h;
      });

      return next.sort((a, b) => b.loot - a.loot);
    });

    const displayAttacker = attackerHostelName || 'Your Flagship';
    const logEntry = `💥 [${time}] Captain ${user.name} (${displayAttacker}) raided ${defenderHostelName} and seized ${stolen} Doubloons!`;
    setRaidLogs(logs => [logEntry, ...logs.slice(0, 19)]);
    showToast(`💥 Raid Success! Transferred 500 Doubloons from ${defenderHostelName} to ${displayAttacker}!`, 'success');
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1>⚔️ Hostel Wars: The 11 War Galleons Leaderboard</h1>
        <p>Gemstone-hulled pirate dreadnoughts clashing for loot, mess dominance, and midnight supremacy!</p>
      </header>

      {/* Visitor Notice Banner if Not Logged In */}
      {!user && (
        <div style={{
          background: 'rgba(212, 175, 55, 0.15)',
          border: '2px dashed var(--gold-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.4rem',
          marginBottom: '1.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.8rem' }}>⚓</span>
            <div>
              <strong style={{ color: 'var(--gold-glow)', fontSize: '1.05rem', display: 'block' }}>
                Enlist in the Fleet to Raid for Your War Galleon!
              </strong>
              <span style={{ color: 'var(--bg-parchment-light)', fontSize: '0.9rem' }}>
                Currently sailing as an observer. Board the ship to pledge allegiance to a hostel galleon and plunder rival ships!
              </span>
            </div>
          </div>
          <NavLink to="/login" className="btn" style={{ padding: '0.4rem 1rem', fontSize: '1rem' }}>
            ⚓ Board the Ship
          </NavLink>
        </div>
      )}

      {/* Hidden Coin 2 */}
      {!isCollected('coin_hostel') && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <button
            className="hidden-treasure-coin"
            onClick={(e) => collectCoin('coin_hostel', e)}
            title="A gemstone-encrusted doubloon in the captain's locker..."
          >
            🪙
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
                    <span className="user-flagship-tag" title="Your Enlisted War Galleon">
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

              {/* Action Button: Disabled for player's own flagship */}
              {isUserFlagship ? (
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: 'auto', width: '100%', padding: '0.5rem 1rem', opacity: 0.85, cursor: 'not-allowed' }}
                  disabled
                  title="Ye cannot raid yer own war galleon!"
                >
                  🛡️ Your Vessel (Protected)
                </button>
              ) : (
                <button 
                  className="btn btn-danger" 
                  style={{ marginTop: 'auto', width: '100%', padding: '0.5rem 1rem' }}
                  onClick={() => handleRaid(hostel)}
                  title={!user ? 'Board the ship to raid for your galleon' : `Raid ${hostel.name} (-500 Doubloons)`}
                >
                  💣 Raid This Galleon (-500)
                </button>
              )}
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
