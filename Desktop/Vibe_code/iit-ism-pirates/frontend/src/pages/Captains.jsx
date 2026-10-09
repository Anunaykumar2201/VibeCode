import React, { useState } from 'react';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';

const CAPTAINS = [
  {
    id: 'cap1',
    name: 'Captain Peg-Leg McSyllabus',
    title: 'Dreaded Admiral of Differential Calculus',
    avatar: '🏴‍☠️',
    bounty: 95000,
    crimes: 'Conspiring to hold 8:00 AM quizzes in torrential monsoons and failing to provide slide notes.',
    alias: 'The Red-Pen Marauder'
  },
  {
    id: 'cap2',
    name: 'Commodore Attendance-Zero',
    title: 'High Inquisitor of the Roll of Souls',
    avatar: '☠️',
    bounty: 120000,
    crimes: 'Strictly locking the GJLT gallery gates at 8:00:01 AM and demanding 75% biometric tribute.',
    alias: 'The Iron Gatekeeper'
  },
  {
    id: 'cap3',
    name: 'Admiral Gunpowder Vats',
    title: 'Master Alchemist of Organic Synthesis',
    avatar: '🧪',
    bounty: 88000,
    crimes: 'Filling the chemistry basement with green smoking fumes and laughing maniacally during lab vivas.',
    alias: 'The Smoldering Corsair'
  },
  {
    id: 'cap4',
    name: 'Quartermaster Bug-Catcher',
    title: 'Supreme Overlord of Null Pointers',
    avatar: '👾',
    bounty: 140000,
    crimes: 'Crafting hidden test cases with 0.0001ms time limits and making scallywags debug C++ pointers.',
    alias: 'The Segfault Siren'
  }
];

export default function Captains() {
  const { play } = useSound();
  const { addChaos, showToast } = useChaos();
  const [captains, setCaptains] = useState(CAPTAINS);

  const bribeCaptain = (captain) => {
    play('coin');
    addChaos(5);
    setCaptains(prev => prev.map(c => {
      if (c.id === captain.id) {
        return { ...c, bounty: c.bounty + 5000 };
      }
      return c;
    }));
    showToast(`💰 Bribed ${captain.name}! Bounty increased to ${captain.bounty + 5000} Doubloons!`, 'info');
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1>🏴‍☠️ Most Wanted Captains of the Admiralty</h1>
        <p>Fictional Dread Pirates: Feared syllabus enforcers, attendance tyrants, and exam tormentors.</p>
      </header>

      <div className="wanted-grid">
        {captains.map(cap => (
          <div key={cap.id} className="wanted-poster">
            <div className="wanted-banner-top">WANTED</div>
            <div style={{ fontSize: '0.8rem', color: '#5a3814', fontWeight: 'bold' }}>DEAD OR ALIVE (OR 75% ATTENDANCE)</div>

            <div className="wanted-avatar-frame">
              {cap.avatar}
            </div>

            <h3 style={{ color: 'var(--blood-red)', fontSize: '1.4rem', margin: '0.4rem 0 0' }}>
              {cap.name}
            </h3>
            <small style={{ color: '#5a3814', fontWeight: 'bold', display: 'block', marginBottom: '0.6rem' }}>
              Alias: "{cap.alias}"
            </small>

            <div className="wanted-bounty-badge">
              BOUNTY: {cap.bounty.toLocaleString()} 🪙
            </div>

            <div style={{ fontSize: '0.88rem', color: '#2b1a0e', margin: '0.8rem 0', background: 'rgba(255,255,255,0.4)', padding: '0.6rem', borderRadius: '4px' }}>
              <strong>Notorious Crimes:</strong> {cap.crimes}
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', fontSize: '1rem', padding: '0.4rem 0.8rem' }}
              onClick={() => bribeCaptain(cap)}
            >
              💰 Bribe with Hot Samosas (+5,000)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
