import React, { useState, useRef, useEffect } from 'react';
import { CAMPUS_LOCATIONS, MAP_CATEGORIES } from '../data/places';
import { NOTICES } from '../data/notices';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';
import { useTreasure } from '../context/TreasureContext';
import confetti from 'canvas-confetti';

export default function Home() {
  const { play } = useSound();
  const { addChaos, showToast } = useChaos();
  const { collectCoin, isCollected } = useTreasure();

  // Navigation & Filter States
  const [selectedPlace, setSelectedPlace] = useState(CAMPUS_LOCATIONS[0]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  // Captain's Log (Visited / Discovered Places)
  const [captainsLog, setCaptainsLog] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pirate_captains_log')) || [CAMPUS_LOCATIONS[0].id];
    } catch {
      return [CAMPUS_LOCATIONS[0].id];
    }
  });

  // Pan & Zoom Transform State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const mapContainerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('pirate_captains_log', JSON.stringify(captainsLog));
  }, [captainsLog]);

  // Filter & Search Logic
  const filteredPlaces = CAMPUS_LOCATIONS.filter(place => {
    const matchesCategory = activeCategory === 'all' || place.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.realName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Location Selection with Discovery Effect
  const handleSelectPlace = (place, event) => {
    setSelectedPlace(place);
    play('bell');
    addChaos(2);

    // Add to Captain's Log
    if (!captainsLog.includes(place.id)) {
      const nextLog = [...captainsLog, place.id];
      setCaptainsLog(nextLog);
      play('coin');

      // Treasure discovery effect
      confetti({
        particleCount: 35,
        spread: 50,
        origin: event ? { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight } : { y: 0.6 }
      });

      showToast(`🧭 New Chart Logged: ${place.realName}! (${nextLog.length}/${CAMPUS_LOCATIONS.length})`, 'success');
    }
  };

  // "Show Me the Treasure" (Random Location Picker)
  const handleShowRandomTreasure = () => {
    const list = filteredPlaces.length > 0 ? filteredPlaces : CAMPUS_LOCATIONS;
    const randomPlace = list[Math.floor(Math.random() * list.length)];
    setSelectedPlace(randomPlace);
    play('victory');
    addChaos(3);

    // Pan camera smoothly towards target
    const targetPanX = (50 - randomPlace.x) * 4;
    const targetPanY = (50 - randomPlace.y) * 4;
    setPan({ x: targetPanX, y: targetPanY });

    confetti({ particleCount: 60, spread: 70 });
    showToast(`🎲 Captain's Fortune: Dispatched ship to ${randomPlace.realName}!`, 'info');
  };

  // Zoom Controls
  const handleZoomIn = () => setZoom(z => Math.min(2.5, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom(z => Math.max(0.8, +(z - 0.25).toFixed(2)));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    play('click');
  };

  // Mouse Drag-to-Pan Handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.map-marker') || e.target.closest('.map-control-btn') || e.target.closest('.map-cartography-legend')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    // Keep pan within reasonable bounds
    const maxPan = 300 * zoom;
    setPan({
      x: Math.max(-maxPan, Math.min(maxPan, newX)),
      y: Math.max(-maxPan, Math.min(maxPan, newY))
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="container" style={{ maxWidth: '1360px' }}>
      <header className="page-header">
        <h1>🗺️ IIT (ISM) Dhanbad - Interactive Treasure Map</h1>
        <p>Interactive pirate navigation interface: Explore the 26 landmarks, chart routes, and log discoveries in the Captain's Log!</p>
      </header>

      {/* Top Map Action Toolbar */}
      <div className="map-top-toolbar">
        {/* Searchable Treasure Index */}
        <div className="map-search-wrapper">
          <input
            type="text"
            className="map-search-input"
            placeholder="🔍 Search treasure index (e.g. Library, Diamond, SAC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✖</button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="map-action-buttons">
          <button className="btn" onClick={handleShowRandomTreasure} title="Explore a random campus landmark">
            🎲 Show Me the Treasure!
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowLogModal(true)}
            title="Open Captain's Log"
          >
            📜 Captain's Log ({captainsLog.length}/{CAMPUS_LOCATIONS.length})
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowLegend(!showLegend)}
          >
            {showLegend ? '👁️ Hide Key' : '🗺️ Map Key'}
          </button>
        </div>
      </div>

      {/* Category Filter Chips Bar */}
      <div className="map-categories-bar">
        {MAP_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => { setActiveCategory(cat.id); play('click'); }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Map + Side Panel Grid */}
      <div className="map-layout-grid">
        {/* Parchment Map Canvas Area */}
        <div className="parchment-map-wrapper">
          {/* Zoom & View Control HUD */}
          <div className="map-floating-controls">
            <button className="map-control-btn" onClick={handleZoomIn} title="Zoom In">➕</button>
            <button className="map-control-btn" onClick={handleZoomOut} title="Zoom Out">➖</button>
            <button className="map-control-btn" onClick={handleResetView} title="Reset View">↺</button>
          </div>

          <div
            ref={mapContainerRef}
            className="treasure-map-canvas-area realistic-pirate-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {/* Pan & Zoom Transformed Layer */}
            <div
              className="map-transform-layer"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '50% 50%',
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
              }}
            >
              {/* Visible Dotted Sailing Route connecting primary spine */}
              <svg className="nautical-trails-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 48 88 L 52 30 L 56 38 L 44 48 L 48 54 L 68 56 L 58 78"
                  fill="none"
                  stroke="#c0392b"
                  strokeWidth="0.75"
                  strokeDasharray="1.6, 1.4"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </svg>

              {/* Sailing Pirate Galleon */}
              {selectedPlace && (
                <div 
                  className="map-sailing-ship authentic-ship"
                  style={{ left: `${selectedPlace.x}%`, top: `${selectedPlace.y}%` }}
                  title="Flagship en route to destination"
                >
                  ⛵
                </div>
              )}

              {/* Clickable HTML Map Markers */}
              {filteredPlaces.map(place => {
                const isSelected = selectedPlace?.id === place.id;
                const isVisited = captainsLog.includes(place.id);
                return (
                  <button
                    key={place.id}
                    className={`map-marker authentic-marker ${isSelected ? 'selected' : ''} ${isVisited ? 'visited' : ''}`}
                    style={{ left: `${place.x}%`, top: `${place.y}%` }}
                    onClick={(e) => handleSelectPlace(place, e)}
                    title={place.realName}
                  >
                    <span className="marker-x">✖</span>
                    <span className="marker-icon-badge">{place.icon}</span>
                    <span className="marker-label">
                      <strong style={{ display: 'block', color: 'var(--blood-red)' }}>{place.name.split('(')[0]}</strong>
                      <small>{place.realName}</small>
                    </span>
                  </button>
                );
              })}

              {/* Hidden Doubloon on Map Beach */}
              {!isCollected('coin_map') && (
                <button
                  className="hidden-treasure-coin"
                  style={{ position: 'absolute', bottom: '25px', left: '25px' }}
                  onClick={(e) => collectCoin('coin_map', e)}
                  title="A glittering gold doubloon washed ashore on the reef..."
                >
                  🪙
                </button>
              )}
            </div>

            {/* Collapsible Cartography Key / Legend */}
            {showLegend && (
              <div className="map-cartography-legend">
                <div className="legend-title">⚔️ MAP KEY</div>
                <div className="legend-items-list">
                  <div className="legend-row"><span>🏛️</span><span>Administration</span></div>
                  <div className="legend-row"><span>🏫</span><span>Academic Halls</span></div>
                  <div className="legend-row"><span>📚</span><span>Central Library</span></div>
                  <div className="legend-row"><span>🏴‍☠️</span><span>Hostels &amp; Galleons</span></div>
                  <div className="legend-row"><span>⚔️</span><span>Sports &amp; Arenas</span></div>
                  <div className="legend-row"><span>🍗</span><span>Food &amp; Taverns</span></div>
                  <div className="legend-row"><span>⚕️</span><span>Health &amp; Facilities</span></div>
                  <div className="legend-row"><span style={{ color: '#c0392b' }}>- - -</span><span>Sailing Route</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Location Details Parchment Card */}
        <div className="map-sidebar-scroll">
          {selectedPlace ? (
            <div className="location-inspector-card vintage-inspector">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: '1.5px solid var(--border-parchment)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2.4rem' }}>{selectedPlace.icon}</span>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: '#3b1e08', margin: 0, lineHeight: 1.2 }}>{selectedPlace.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-brown-light)', fontWeight: 'bold' }}>
                    Official: {selectedPlace.realName}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: 'var(--gold-primary)', color: '#000', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {selectedPlace.categoryLabel}
                </span>
                {selectedPlace.rating && (
                  <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-glow)', border: '1px solid var(--gold-primary)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {selectedPlace.rating}
                  </span>
                )}
                {selectedPlace.hours && (
                  <span className="badge" style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--gold-glow)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    ⏰ {selectedPlace.hours}
                  </span>
                )}
                {selectedPlace.built && (
                  <span className="badge" style={{ background: 'var(--blood-red)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    Built: {selectedPlace.built}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#2b1a0e', fontSize: '0.95rem' }}>Overview &amp; Purpose:</strong>
                <p style={{ fontSize: '0.95rem', color: '#444', marginTop: '4px' }}>
                  {selectedPlace.description || selectedPlace.realInfo}
                </p>
              </div>

              <div style={{ background: 'rgba(139, 107, 62, 0.12)', padding: '0.9rem', borderRadius: '6px', borderLeft: '4px solid var(--gold-primary)', marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--blood-red)', display: 'block', marginBottom: '2px' }}>
                  🏴‍☠️ Pirate Crew Lore:
                </strong>
                <p style={{ fontSize: '0.92rem', margin: 0, color: 'var(--text-brown)' }}>
                  {selectedPlace.pirateLore || selectedPlace.pirateNotes}
                </p>
              </div>

              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '0.5rem' }}
                onClick={() => {
                  play('coin');
                  confetti({ particleCount: 30 });
                  showToast(`🪙 Charted ${selectedPlace.realName}!`, 'success');
                }}
              >
                ✨ Mark Landmark Explored
              </button>
            </div>
          ) : (
            <div className="location-inspector-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <span style={{ fontSize: '3rem' }}>🧭</span>
              <h3>No Landmark Selected</h3>
              <p>Click any pin on the nautical chart to inspect its campus details!</p>
            </div>
          )}

          {/* Quick Notice Board */}
          <div className="notice-board-widget">
            <h3>📜 Active Proclamations</h3>
            {NOTICES.slice(0, 3).map(n => (
              <div key={n.id} className="notice-item">
                <span className="notice-badge">{n.badge}</span>
                <strong style={{ display: 'block', margin: '4px 0 2px', color: 'var(--bg-parchment)', fontSize: '0.9rem' }}>
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

      {/* Captain's Log Modal */}
      {showLogModal && (
        <div className="real-info-modal active" onClick={() => setShowLogModal(false)}>
          <div className="real-info-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="real-info-header">
              <h2>📜 Captain's Charting Log</h2>
              <button className="modal-close-btn" onClick={() => setShowLogModal(false)}>✖</button>
            </div>

            <div style={{ marginBottom: '1.2rem', background: 'rgba(0, 206, 201, 0.15)', padding: '0.8rem 1rem', borderRadius: '6px' }}>
              <strong>Progress:</strong> You have charted <strong>{captainsLog.length} of {CAMPUS_LOCATIONS.length}</strong> IIT (ISM) Dhanbad landmarks!
              <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${(captainsLog.length / CAMPUS_LOCATIONS.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #00cec9, #81ecec)' }} />
              </div>
            </div>

            <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {CAMPUS_LOCATIONS.map(p => {
                  const logged = captainsLog.includes(p.id);
                  return (
                    <li 
                      key={p.id}
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderBottom: '1px solid #16385c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: logged ? 'rgba(46, 204, 113, 0.1)' : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span>{p.icon}</span>
                        <div>
                          <strong>{p.realName}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#a0aec0' }}>{p.categoryLabel}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: logged ? '#2ecc71' : '#718096', fontWeight: 'bold' }}>
                        {logged ? '✅ Discovered' : '🔒 Uncharted'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
              <button className="btn" onClick={() => setShowLogModal(false)}>
                ⚓ Return to Navigation Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
