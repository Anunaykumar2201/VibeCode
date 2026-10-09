import React from 'react';
import { NavLink } from 'react-router-dom';
import { useChaos } from '../context/ChaosContext';
import { useTreasure } from '../context/TreasureContext';

export default function Footer() {
  const { resetChaos } = useChaos();
  const { collectCoin, isCollected } = useTreasure();

  return (
    <footer className="pirate-global-footer">
      <div className="footer-ocean-waves">
        <div className="wave wave1" />
        <div className="wave wave2" />
      </div>

      <div className="footer-content">
        <div className="footer-col">
          <h3>☠️ IIT (ISM) Pirate Archipelago</h3>
          <p>Chartered in 1926 by Royal Decree of the High Seas. Plundering knowledge, excavating gemstones, and sailing the seven semesters.</p>
          <p className="footer-loc">📍 826004, Dhanbad, Jharkhand, India</p>
        </div>

        <div className="footer-col">
          <h3>📜 Ship Navigation</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.4rem' }}><NavLink to="/">🗺️ Campus Treasure Map</NavLink></li>
            <li style={{ marginBottom: '0.4rem' }}><NavLink to="/hostels">⚔️ Hostel Wars Arena</NavLink></li>
            <li style={{ marginBottom: '0.4rem' }}><NavLink to="/tribute">💰 Doubloon Tribute</NavLink></li>
            <li style={{ marginBottom: '0.4rem' }}><NavLink to="/admissions">📜 Join the Crew (Quiz)</NavLink></li>
            <li style={{ marginBottom: '0.4rem' }}><NavLink to="/departments">🔬 Plunder Guilds</NavLink></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>⚡ Admiralty Orders</h3>
          <p>Experiencing too much turbulent storm?</p>
          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '1rem' }} onClick={resetChaos}>
            🌊 Calm the Sea (Reset 0%)
          </button>

          {/* Hidden Doubloon 5 in Footer */}
          {!isCollected('coin_footer') && (
            <button
              className="hidden-treasure-coin"
              style={{ display: 'block', marginTop: '1rem' }}
              onClick={(e) => collectCoin('coin_footer', e)}
              title="A suspicious glittering doubloon in the ship's ballast..."
            >
              🪙
            </button>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 1926 - 2026 IIT (ISM) Dhanbad Pirate Admiralty • React &amp; Express MERN Architecture • All jokes in good nautical spirit!</p>
      </div>
    </footer>
  );
}
