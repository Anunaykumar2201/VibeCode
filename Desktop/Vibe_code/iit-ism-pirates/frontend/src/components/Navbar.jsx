import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';
import { useTreasure } from '../context/TreasureContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenRealInfo }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isMuted, toggleMute } = useSound();
  const { addChaos } = useChaos();
  const { isUnlocked } = useTreasure();
  const { user, logout } = useAuth();

  return (
    <header className="pirate-header-wrapper">
      {/* Top Proclamation Marquee */}
      <div className="pirate-banner">
        <span className="banner-icon">⚓</span>
        <span className="banner-text">
          🏴‍☠️ IIT (ISM) PIRATE ADMIRALTY • EST. 1926 • NOTICE: DO NOT FEED CANNONBALLS TO DHANBAD MONKEYS • CENTRAL LIBRARY AC CHILLED TO ZERO DEGREES • MID-SEM PLUNDER COMMENCING
        </span>
        <span className="banner-icon">🏴‍☠️</span>
      </div>

      {/* Row 1: Brand & Admiralty Controls */}
      <div className="pirate-brand-row">
        <NavLink to="/" className="nav-brand" onClick={() => setMobileOpen(false)}>
          <span className="nav-logo-icon">☠️</span>
          <div className="nav-logo-text">
            <span className="brand-title">IIT (ISM) PIRATES</span>
            <span className="brand-sub">Indian School of Mines &amp; Plunder</span>
          </div>
        </NavLink>

        <div className="nav-actions">
          <button className="nav-btn real-info-btn" onClick={onOpenRealInfo} title="View Clean Official Campus Info">
            📋 <span className="nav-btn-text">Real Info</span>
          </button>
          <button className="nav-btn sound-btn" onClick={toggleMute} title="Toggle Audio">
            {isMuted ? '🔇' : '🔊'} <span className="nav-btn-text">{isMuted ? 'Muted' : 'Sound'}</span>
          </button>
          <button 
            className="nav-btn danger-btn" 
            onClick={() => addChaos(20)}
            title="Warning: Forbidden button!"
          >
            💣 <span className="nav-btn-text">+20 Chaos</span>
          </button>
          <button 
            className="nav-menu-toggle" 
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Row 2: Full-Width Navigation Bar */}
      <nav className="pirate-navbar-row">
        <ul className={`nav-links ${mobileOpen ? 'nav-open' : ''}`}>
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileOpen(false)}>🗺️ Map</NavLink></li>
          <li><NavLink to="/hostels" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileOpen(false)}>⚔️ Hostel Wars</NavLink></li>
          <li><NavLink to="/tribute" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileOpen(false)}>💰 Tribute</NavLink></li>
          <li><NavLink to="/admissions" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileOpen(false)}>📜 Join Crew</NavLink></li>
          <li><NavLink to="/departments" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileOpen(false)}>🔬 Guilds</NavLink></li>
          <li><NavLink to="/captains" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileOpen(false)}>🏴‍☠️ Captains</NavLink></li>
          <li><NavLink to="/placements" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileOpen(false)}>💎 Plunder</NavLink></li>
          {isUnlocked && (
            <li><NavLink to="/secret" className="unlocked-secret-link" onClick={() => setMobileOpen(false)}>🗝️ Secret</NavLink></li>
          )}
          
          {/* Auth State in Row 2 */}
          {!user ? (
            <li className="nav-auth-item">
              <NavLink to="/login" className={({ isActive }) => isActive ? 'active board-ship-link' : 'board-ship-link'} onClick={() => setMobileOpen(false)}>
                ⚓ Board the Ship
              </NavLink>
            </li>
          ) : (
            <li className="nav-user-item">
              <NavLink to="/login" className="nav-user-name" onClick={() => setMobileOpen(false)} title="View Enlisted Profile">
                ⚓ {user.name}
              </NavLink>
              <button
                type="button"
                className="nav-abandon-crew-btn"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                title="Abandon the crew and sign out"
              >
                🚪 Abandon Crew
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
