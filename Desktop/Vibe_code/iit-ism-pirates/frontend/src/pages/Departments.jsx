import React, { useState } from 'react';
import { DEPARTMENTS } from '../data/departments';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';
import { useTreasure } from '../context/TreasureContext';

export default function Departments() {
  const { play } = useSound();
  const { addChaos } = useChaos();
  const { collectCoin, isCollected } = useTreasure();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = DEPARTMENTS.filter(d => 
    d.realName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.pirateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header className="page-header">
        <h1>🔬 Academic Plunder Guilds &amp; Department Decoder</h1>
        <p>Translate official engineering disciplines into sacred pirate professions!</p>
      </header>

      {/* Search Bar */}
      <div className="dept-search-bar">
        <input
          type="text"
          className="dept-search-input"
          placeholder="Search department (e.g. Mining, CSE, Petroleum, Mech)..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            if (Math.random() < 0.2) addChaos(1);
          }}
        />
        {searchTerm && (
          <button className="btn btn-secondary" onClick={() => setSearchTerm('')}>
            Clear
          </button>
        )}
      </div>

      {/* Hidden Coin 4 */}
      {!isCollected('coin_dept') && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <button
            className="hidden-treasure-coin"
            onClick={(e) => collectCoin('coin_dept', e)}
            title="A gold doubloon hidden inside the Mining excavation shaft..."
          >
            🪙 (Plunder Guild Doubloon)
          </button>
        </div>
      )}

      {/* Departments Grid */}
      {filtered.length > 0 ? (
        <div className="departments-grid">
          {filtered.map(dept => (
            <div key={dept.id} className="dept-card">
              <div className="dept-card-header">
                <span className="dept-icon">{dept.icon}</span>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#4a1500', margin: 0 }}>{dept.pirateName}</h3>
                  <small style={{ color: 'var(--text-brown-light)', fontWeight: 'bold' }}>
                    Official: {dept.realName} ({dept.code})
                  </small>
                </div>
              </div>

              <p style={{ fontStyle: 'italic', color: '#6b583f', fontSize: '0.95rem', margin: '0.5rem 0' }}>
                "{dept.motto}"
              </p>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-brown)' }}>
                {dept.pirateDescription}
              </p>

              <div className="dept-skills-tags">
                {dept.skills?.map((skill, i) => (
                  <span key={i} className="skill-tag">⚔️ {skill}</span>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px dashed var(--border-parchment)', fontSize: '0.85rem', color: 'var(--blood-red)', fontWeight: 'bold' }}>
                💰 Expected Bounty: {dept.bounty}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Funny Unknown Search Result */
        <div className="parchment-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <span style={{ fontSize: '3rem' }}>🧭</span>
          <h2 style={{ color: 'var(--blood-red)', margin: '1rem 0 0.5rem' }}>
            Guild Not Found on Any Admiralty Map!
          </h2>
          <p style={{ maxWidth: '550px', margin: '0 auto', fontSize: '1.1rem' }}>
            By Davy Jones! <strong>"{searchTerm}"</strong> has not been chartered yet. The Director has dispatched 3 exploration schooners to discover this mysterious science in the bay of Dhanbad.
          </p>
          <button className="btn" style={{ marginTop: '1.5rem' }} onClick={() => setSearchTerm('')}>
            Show All Guilds
          </button>
        </div>
      )}
    </div>
  );
}
