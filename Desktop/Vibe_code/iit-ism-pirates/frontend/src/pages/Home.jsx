import React, { useState } from 'react';
import { PLACES } from '../data/places';
import { NOTICES } from '../data/notices';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';
import { useTreasure } from '../context/TreasureContext';

export default function Home() {
  const { play } = useSound();
  const { addChaos } = useChaos();
  const { collectCoin, isCollected } = useTreasure();

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(PLACES[0]);
  const [shipPos, setShipPos] = useState({ x: 50, y: 32 });

  const categories = [
    { id: 'all', label: 'All Landmarks' },
    { id: 'academic', label: '📚 Academic' },
    { id: 'food', label: '🍗 Taverns & Food' },
    { id: 'sports', label: '⚔️ Arenas' },
    { id: 'services', label: '⚕️ Health & Vaults' }
  ];

  const filteredPlaces = activeCategory === 'all' 
    ? PLACES 
    : PLACES.filter(p => p.category === activeCategory);

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setShipPos({ x: place.x, y: place.y });
    play('bell');
    addChaos(2);
  };

  const isPlaceOpen = (place) => {
    if (place.alwaysOpen) return true;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    if (!place.openTime || !place.closeTime) return true;
    const [oh, om] = place.openTime.split(':').map(Number);
    const [ch, cm] = place.closeTime.split(':').map(Number);
    const openMins = oh * 60 + om;
    const closeMins = ch * 60 + cm;
    if (closeMins < openMins) {
      return currentMins >= openMins || currentMins <= closeMins;
    }
    return currentMins >= openMins && currentMins <= closeMins;
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1>🗺️ Campus Treasure Map of the 21 Landmarks</h1>
        <p>Chart your course across the historic 1926 Dhanbad Archipelago. Click any marker to dispatch the galleon!</p>
      </header>

      <div className="map-layout-grid">
        {/* Left: Parchment Map Canvas */}
        <div className="parchment-map-wrapper">
          <div className="map-header-bar">
            <h2>📜 Nautical Chart</h2>
            <div className="map-filter-tags">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => { setActiveCategory(cat.id); play('click'); }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="treasure-map-canvas-area">
            <div className="map-compass-rose">🧭</div>
            <div className="map-grid-lines" />

            {/* Sailing Ship */}
            <div 
              className="map-sailing-ship"
              style={{ left: `${shipPos.x}%`, top: `${shipPos.y}%` }}
            >
              ⛵
            </div>

            {/* Map Markers */}
            {filteredPlaces.map(place => (
              <button
                key={place.id}
                className="map-marker"
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
                onClick={() => handleSelectPlace(place)}
                title={place.name}
              >
                <span className="marker-x">✖</span>
                <span className="marker-icon">{place.icon}</span>
                <span className="marker-label">{place.realName.split('(')[0]}</span>
              </button>
            ))}

            {/* Hidden Doubloon 1 on Map */}
            {!isCollected('coin_map') && (
              <button
                className="hidden-treasure-coin"
                style={{ position: 'absolute', bottom: '15px', left: '20px' }}
                onClick={(e) => collectCoin('coin_map', e)}
                title="A glittering gold doubloon washed ashore..."
              >
                🪙
              </button>
            )}
          </div>
        </div>

        {/* Right: Location Inspector & Notice Board */}
        <div className="map-sidebar-scroll">
          {/* Selected Place Inspector */}
          {selectedPlace && (
            <div className="location-inspector-card">
              <h3>{selectedPlace.icon} {selectedPlace.name}</h3>
              <p style={{ color: 'var(--text-brown-light)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                <strong>Official Name:</strong> {selectedPlace.realName}
              </p>
              
              <span className={`live-status-pill ${isPlaceOpen(selectedPlace) ? 'open' : 'closed'}`}>
                {isPlaceOpen(selectedPlace) ? '🟢 OPEN FOR PLUNDER' : '🔴 CLOSED (Locked in Armory)'}
              </span>

              <div style={{ margin: '0.8rem 0' }}>
                <p><strong>⏰ Hours:</strong> {selectedPlace.hours}</p>
                <p><strong>⭐ Rating:</strong> {selectedPlace.rating}</p>
              </div>

              <div style={{ background: 'rgba(139, 107, 62, 0.1)', padding: '0.8rem', borderRadius: '6px', borderLeft: '3px solid var(--gold-primary)', margin: '0.8rem 0' }}>
                <strong>🏴‍☠️ Pirate Lore:</strong>
                <p style={{ fontSize: '0.92rem', marginTop: '4px', marginBottom: 0 }}>{selectedPlace.pirateLore}</p>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#555', marginTop: '0.6rem' }}>
                <strong>Official Detail:</strong> {selectedPlace.realInfo}
              </p>
            </div>
          )}

          {/* Rotating Notices Board */}
          <div className="notice-board-widget">
            <h3>📜 Admiralty Proclamations</h3>
            {NOTICES.map(n => (
              <div key={n.id} className="notice-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="notice-badge">{n.badge}</span>
                  <small style={{ color: 'var(--gold-glow)' }}>{n.date}</small>
                </div>
                <strong style={{ display: 'block', margin: '4px 0 2px', color: 'var(--bg-parchment)' }}>
                  {n.title}
                </strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--bg-parchment-dark)', margin: 0 }}>
                  {n.pirateText}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
