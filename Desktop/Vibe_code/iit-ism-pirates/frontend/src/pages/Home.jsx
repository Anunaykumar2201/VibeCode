import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PLACES, ZONES, isPlaceOpen } from '../data/places';
import { NOTICES } from '../data/notices';
import { CAMPUS_LIFE_STORIES, ACADEMICS_INFO, RESEARCH_DISCOVERIES } from '../data/campusLifeAndResearch';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';
import { useTreasure } from '../context/TreasureContext';
import IsleMapSVG from '../components/IsleMapSVG';
import confetti from 'canvas-confetti';


export default function Home() {
  const { play } = useSound();
  const { addChaos, showToast } = useChaos();
  const { collectCoin, isCollected } = useTreasure();

  // Selected Place & Initial Ship Position (Harbour Gate / Main Entrance)
  const initialPlace = PLACES.find(p => p.id === 'main_entrance') || PLACES[0];
  const [selectedPlace, setSelectedPlace] = useState(initialPlace);
  const [shipPosition, setShipPosition] = useState({ x: initialPlace.x, y: initialPlace.y });
  const [activeRoutePath, setActiveRoutePath] = useState(null);

  // Filters & Search
  const [activeZone, setActiveZone] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list' for mobile toggle
  const [activeStoryModal, setActiveStoryModal] = useState(null);
  const [activeResearchModal, setActiveResearchModal] = useState(null);

  // Captain's Log (Discovered Landmarks)
  const [captainsLog, setCaptainsLog] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('isle_captains_log')) || [initialPlace.id];
    } catch {
      return [initialPlace.id];
    }
  });

  // Pan & Zoom State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const mapContainerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('isle_captains_log', JSON.stringify(captainsLog));
  }, [captainsLog]);

  // Filter Logic (Search & Zone)
  const filteredPlaces = PLACES.filter(place => {
    const matchesZone = activeZone === 'all' || place.zone === activeZone;
    const matchesSearch = searchQuery === '' ||
      place.realName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  // Handle Location Selection with Single Animated Sailing Route
  const handleSelectPlace = (place, event) => {
    if (place.id === selectedPlace?.id && shipPosition.x === place.x && shipPosition.y === place.y) {
      return;
    }

    // Generate Single SVG Route Path from Current Ship Position to Target Marker
    const startX = (shipPosition.x / 100) * 1000;
    const startY = (shipPosition.y / 100) * 700;
    const endX = (place.x / 100) * 1000;
    const endY = (place.y / 100) * 700;

    // Slight arching curve for nautical realism
    const midX = (startX + endX) / 2 + (endY - startY) * 0.15;
    const midY = (startY + endY) / 2 - (endX - startX) * 0.15;
    const routeD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
    setActiveRoutePath(routeD);

    // Sail ship to new position
    setShipPosition({ x: place.x, y: place.y });
    setSelectedPlace(place);
    play('bell');
    addChaos(2);

    // Fade route after sailing
    setTimeout(() => {
      setActiveRoutePath(null);
    }, 2400);

    // Captain's Log Discovery Effect
    if (!captainsLog.includes(place.id)) {
      const nextLog = [...captainsLog, place.id];
      setCaptainsLog(nextLog);
      play('coin');

      confetti({
        particleCount: 40,
        spread: 55,
        origin: event ? { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight } : { y: 0.6 }
      });

      showToast(`🧭 New Chart Logged: ${place.realName}! (${nextLog.length}/${PLACES.length})`, 'success');
    }
  };

  // "Show Me the Treasure" (Random Navigator)
  const handleShowRandomTreasure = () => {
    const list = filteredPlaces.length > 0 ? filteredPlaces : PLACES;
    const randomPlace = list[Math.floor(Math.random() * list.length)];
    handleSelectPlace(randomPlace);
    play('victory');
    addChaos(3);

    // Pan camera smoothly towards target
    const targetPanX = (50 - randomPlace.x) * 3.5;
    const targetPanY = (50 - randomPlace.y) * 3.5;
    setPan({ x: targetPanX, y: targetPanY });

    confetti({ particleCount: 50, spread: 60 });
    showToast(`🎲 Captain's Choice: Sailing to ${randomPlace.realName}!`, 'info');
  };

  // Zoom Controls
  const handleZoomIn = () => setZoom(z => Math.min(2.4, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom(z => Math.max(0.85, +(z - 0.25).toFixed(2)));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    play('click');
  };

  // Mouse Drag-to-Pan Handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.isle-marker') || e.target.closest('.map-floating-controls') || e.target.closest('.hostel-harbour-link')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    const maxPan = 280 * zoom;
    setPan({
      x: Math.max(-maxPan, Math.min(maxPan, newX)),
      y: Math.max(-maxPan, Math.min(maxPan, newY))
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Helper for Rating Display (Coins for high, Skulls for low)
  const renderRatingDisplay = (rating) => {
    const num = typeof rating === 'number' ? rating : parseFloat(rating) || 4.5;
    if (num >= 3.8) {
      const coinCount = Math.min(5, Math.max(1, Math.round(num)));
      return (
        <span className="rating-coins" title={`Rating: ${num} / 5.0`}>
          {'🪙'.repeat(coinCount)} <strong style={{ color: 'var(--gold-glow)', marginLeft: '4px' }}>{num.toFixed(1)}</strong>
        </span>
      );
    } else {
      return (
        <span className="rating-skulls" title={`Rating: ${num} / 5.0`}>
          💀💀💀 <strong style={{ color: '#ff7675', marginLeft: '4px' }}>{num.toFixed(1)}</strong>
        </span>
      );
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1380px' }}>
      {/* Top Map Action Toolbar */}
      <div className="map-top-toolbar">
        {/* Searchable Treasure Index */}
        <div className="map-search-wrapper">
          <input
            type="text"
            className="map-search-input"
            placeholder="🔍 Search The Isle (e.g. Library, Mining, SAC, Canteen)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')} aria-label="Clear Search">✖</button>
          )}
        </div>

        {/* Action Controls */}
        <div className="map-action-buttons">
          <button className="btn" onClick={handleShowRandomTreasure} title="Sail to a random campus landmark">
            🎲 Show Me the Treasure!
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowLogModal(true)}
            title="Open Captain's Log"
          >
            📜 Captain's Log ({captainsLog.length}/{PLACES.length})
          </button>
          <button
            className="btn btn-secondary mobile-view-toggle-btn"
            onClick={() => setViewMode(v => v === 'map' ? 'list' : 'map')}
            title="Toggle between Map and List view on mobile"
          >
            {viewMode === 'map' ? '📋 List View' : '🗺️ Map View'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowLegend(!showLegend)}
            title="Toggle Map Key"
          >
            {showLegend ? '👁️ Hide Key' : '🗝️ Map Key'}
          </button>
        </div>
      </div>

      {/* Zone Filter Chips Bar */}
      <div className="map-categories-bar">
        <button
          className={`category-pill ${activeZone === 'all' ? 'active' : ''}`}
          onClick={() => { setActiveZone('all'); play('click'); }}
        >
          <span>🗺️</span>
          <span>All Zones ({PLACES.length})</span>
        </button>
        {ZONES.map(zone => {
          const count = PLACES.filter(p => p.zone === zone.name).length;
          return (
            <button
              key={zone.id}
              className={`category-pill ${activeZone === zone.name ? 'active' : ''}`}
              onClick={() => { setActiveZone(zone.name); play('click'); }}
            >
              <span>{zone.name}</span>
              <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Main Map / List Layout Grid */}
      <div className="map-layout-grid">
        {/* Left Column: Interactive Map Canvas or Mobile List View */}
        {viewMode === 'map' ? (
          <div className="parchment-map-wrapper">
            {/* Zoom Controls HUD inside map frame */}
            <div className="map-floating-controls">
              <button className="map-control-btn" onClick={handleZoomIn} title="Zoom In" aria-label="Zoom In">➕</button>
              <button className="map-control-btn" onClick={handleZoomOut} title="Zoom Out" aria-label="Zoom Out">➖</button>
              <button className="map-control-btn" onClick={handleResetView} title="Reset Chart View" aria-label="Reset Chart View">↺</button>
            </div>

            <div
              ref={mapContainerRef}
              className="treasure-map-canvas-area"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              {/* Transformed Layer for Smooth Pan & Zoom */}
              <div
                className="map-transform-layer"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: '50% 50%',
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                }}
              >
                {/* 1. Custom Inline SVG Cartography of The Isle of IIT (ISM) */}
                <IsleMapSVG
                  places={filteredPlaces}
                  selectedPlace={selectedPlace}
                  onSelectPlace={handleSelectPlace}
                  shipPosition={shipPosition}
                  activeRoutePath={activeRoutePath}
                  zoom={zoom}
                  pan={pan}
                />

                {/* 2. Sailing Pirate Galleon */}
                {shipPosition && (
                  <div
                    className="map-sailing-ship"
                    style={{ left: `${shipPosition.x}%`, top: `${shipPosition.y}%` }}
                    title={`Flagship anchored at ${selectedPlace?.realName || 'The Isle of IIT (ISM)'}`}
                  >
                    ⛵
                  </div>
                )}

                {/* 3. Gold-and-Red '✖' Flag Markers (Zero emoji on map pins) */}
                {filteredPlaces.map(place => {
                  const isSelected = selectedPlace?.id === place.id;
                  const isVisited = captainsLog.includes(place.id);
                  return (
                    <button
                      key={place.id}
                      type="button"
                      className={`isle-marker ${isSelected ? 'selected' : ''} ${isVisited ? 'visited' : ''}`}
                      style={{ left: `${place.x}%`, top: `${place.y}%` }}
                      onClick={(e) => handleSelectPlace(place, e)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectPlace(place, e); }}
                      aria-label={`${place.realName} in ${place.zone}`}
                    >
                      {/* Gold & Red X on Flag Pin */}
                      <div className="marker-pin-flag">
                        <span className="marker-cross">✖</span>
                      </div>

                      {/* Small Scroll Tooltip on Hover / Focus */}
                      <div className="marker-scroll-tooltip">
                        <strong className="tooltip-real-title">{place.realName}</strong>
                        <span className="tooltip-zone">{place.zone}</span>
                      </div>
                    </button>
                  );
                })}

                {/* Hidden Gold Doubloon on the Beach */}
                {!isCollected('coin_isle_map') && (
                  <button
                    className="hidden-treasure-coin"
                    style={{ position: 'absolute', bottom: '22px', left: '25px', zIndex: 12 }}
                    onClick={(e) => collectCoin('coin_isle_map', e)}
                    title="A glittering gold doubloon washed ashore on the reef..."
                    aria-label="Collect hidden gold doubloon"
                  >
                    🪙
                  </button>
                )}
              </div>
            </div>

            {/* Collapsible Map Key / Legend */}
            {showLegend && (
              <div className="compact-map-key-strip">
                <div className="key-header">
                  <strong>🗝️ The Isle of IIT (ISM) Cartography Key</strong>
                  <button className="key-close-btn" onClick={() => setShowLegend(false)}>✖</button>
                </div>
                <div className="key-items-grid">
                  <div className="key-item"><span className="key-flag-preview">✖</span><span>Active Landmark Marker</span></div>
                  <div className="key-item"><span className="key-flag-visited">✖</span><span>Logged / Charted Landmark</span></div>
                  <div className="key-item"><span>⛵</span><span>Captain's Flagship Position</span></div>
                  <div className="key-item"><span style={{ color: '#a81c1c', fontWeight: 'bold' }}>- - -</span><span>Sailing Route in Transit</span></div>
                  <div className="key-item"><span>🏛️</span><span>High Admiralty (Admin)</span></div>
                  <div className="key-item"><span>⚔️</span><span>Subterranean Guild Caves</span></div>
                  <div className="key-item"><span>⚓</span><span>Hostel Harbour (11 Galleons)</span></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mobile Fallback: Scrollable List View of All Places */
          <div className="mobile-list-view-container">
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-glow)', marginBottom: '1rem' }}>
              📜 The Isle of IIT (ISM) - Landmark Index
            </h3>
            <div className="mobile-places-list">
              {filteredPlaces.map(place => {
                const isSelected = selectedPlace?.id === place.id;
                const open = isPlaceOpen(place);
                return (
                  <div
                    key={place.id}
                    className={`list-place-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => { setSelectedPlace(place); setViewMode('map'); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#3b1e08' }}>{place.realName}</strong>
                      <span className={`live-status-pill ${open ? 'open' : 'closed'}`}>
                        {open ? '🟢 Open' : '🔴 Closed'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#5a3814', marginTop: '2px' }}>
                      {place.zone} • {place.hours}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Column: Parchment Location Inspector Scroll Card (Docked / Bottom Sheet on Mobile) */}
        <div className="map-sidebar-scroll">
          {selectedPlace ? (
            <div className="location-inspector-card vintage-inspector">
              {/* Header with Icon, Name, and Zone */}
              <div className="inspector-card-header">
                <span className="inspector-icon-large">{selectedPlace.icon}</span>
                <div style={{ flex: 1 }}>
                  <h3 className="inspector-place-title">{selectedPlace.realName}</h3>
                  <span className="inspector-zone-subtitle">
                    {selectedPlace.zone} • <em>{selectedPlace.name}</em>
                  </span>
                </div>
              </div>

              {/* Status Badge & Rating Row */}
              <div className="inspector-badges-row">
                <span className={`live-status-pill ${isPlaceOpen(selectedPlace) ? 'open' : 'closed'}`}>
                  {isPlaceOpen(selectedPlace) ? '🟢 OPEN NOW' : '🔴 CURRENTLY CLOSED'}
                </span>
                {selectedPlace.built && (
                  <span className="badge-heritage">
                    Est. {selectedPlace.built}
                  </span>
                )}
                <div className="inspector-rating-box">
                  {renderRatingDisplay(selectedPlace.rating)}
                </div>
              </div>

              {/* Operating Hours */}
              {selectedPlace.hours && (
                <div className="inspector-info-row">
                  <strong style={{ color: '#2b1a0e', fontSize: '0.9rem' }}>⏰ Official Hours:</strong>
                  <span style={{ fontSize: '0.9rem', color: '#3b1e08', marginLeft: '6px' }}>{selectedPlace.hours}</span>
                </div>
              )}

              {/* Real Description */}
              <div className="inspector-section">
                <strong style={{ color: '#2b1a0e', fontSize: '0.95rem' }}>📖 Overview &amp; Function:</strong>
                <p style={{ fontSize: '0.92rem', color: '#444', marginTop: '4px', lineHeight: 1.4 }}>
                  {selectedPlace.description}
                </p>
              </div>

              {/* Playful Pirate Lore Notes */}
              <div className="inspector-lore-box">
                <strong style={{ color: 'var(--blood-red)', display: 'block', marginBottom: '3px', fontSize: '0.9rem' }}>
                  🏴‍☠️ Pirate Archipelago Lore:
                </strong>
                <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-brown)', lineHeight: 1.35 }}>
                  {selectedPlace.pirateNotes}
                </p>
              </div>

              {/* Exploration Discovery Button */}
              <button
                className="btn btn-secondary inspector-action-btn"
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
              <p>Click any pin on The Isle of IIT (ISM) to inspect its campus details!</p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE PROCLAMATIONS SECTION (Positioned Below Map & Above Campus Life) */}
      {/* ========================================================================= */}
      <section className="home-dashboard-section home-proclamations-section">
        <div className="proclamations-board-wrapper">
          <div className="proclamations-board-header">
            <div className="proclamations-title-wrap">
              <h2 className="proclamations-main-title">
                <span className="proclamation-scroll-icon">📜</span> Active Proclamations
              </h2>
              <div className="proclamations-header-line"></div>
            </div>
            <span className="proclamations-subtitle-tag">
              ⚡ Institute Daily Dispatches &amp; Admiralty Decrees
            </span>
          </div>

          <div className="proclamations-items-grid">
            {NOTICES.map((n) => (
              <div key={n.id} className="proclamation-card-item">
                <div className="proclamation-top-row">
                  <span className="proclamation-alert-badge">{n.badge}</span>
                  <span className="proclamation-date-stamp">{n.date}</span>
                </div>
                <h3 className="proclamation-item-title">{n.title}</h3>
                <p className="proclamation-pirate-text">{n.pirateText}</p>
                <div className="proclamation-real-note">
                  <span className="real-note-label">🏛️ Official Notice:</span> {n.realText}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. CAMPUS LIFE SECTION (Matches Official IIT ISM Showcase) */}
      {/* ========================================================================= */}
      <section className="home-dashboard-section home-campus-life-section">

        <div className="section-header-banner">
          <div className="section-title-wrap">
            <div className="section-title-with-line">
              <h2 className="official-section-title">Campus Life</h2>
              <div className="section-title-line"></div>
            </div>
            <p className="official-section-subtitle">Where creativity pulsates...</p>
          </div>
          <Link to="/clubs" className="official-more-btn" onClick={() => play('click')}>
            More about campus life ➔
          </Link>
        </div>

        <div className="campus-life-cards-grid">
          {CAMPUS_LIFE_STORIES.map((story) => (
            <div key={story.id} className="campus-life-card">
              <div className="campus-life-img-box">
                <img src={story.image} alt={story.title} className="campus-life-img" />
                <span className="campus-life-badge">{story.badge}</span>
              </div>
              <div className="campus-life-content">
                <p className="campus-life-desc">{story.description}</p>
                <button
                  className="official-read-more-btn"
                  onClick={() => {
                    play('click');
                    setActiveStoryModal(story);
                  }}
                >
                  Read More ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ACADEMICS SECTION (Matches Official IIT ISM 9-Decade Legacy Showcase) */}
      {/* ========================================================================= */}
      <section className="home-dashboard-section home-academics-section">
        <div className="section-header-banner">
          <div className="section-title-wrap">
            <div className="section-title-with-line">
              <h2 className="official-section-title">Academics</h2>
              <div className="section-title-line"></div>
            </div>
            <p className="official-section-subtitle">A legacy built on more than nine decades of excellence and inventiveness</p>
          </div>
          <Link to="/departments" className="official-more-btn" onClick={() => play('click')}>
            More about academics ➔
          </Link>
        </div>

        <div className="academics-split-layout">
          {/* Left Column: Student Arch Feature Portrait */}
          <div className="academics-student-col">
            <div className="student-arch-wrapper">
              <img
                src={ACADEMICS_INFO.studentImage}
                alt="IIT (ISM) Scholar"
                className="student-arch-img"
              />
              <div className="student-arch-overlay">
                <span className="student-arch-badge">⚓ Nearly 100 Years of Academic Excellence</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Academic Program Cards */}
          <div className="academics-programs-col">
            {ACADEMICS_INFO.programs.map((prog) => (
              <Link
                key={prog.id}
                to={prog.link}
                className="academic-program-row-card"
                onClick={() => play('click')}
              >
                <div className="program-row-img-box">
                  <img src={prog.image} alt={prog.title} className="program-row-img" />
                </div>
                <div className="program-row-info">
                  <div className="program-row-top">
                    <h3 className="program-row-title">{prog.title}</h3>
                    <span className="program-row-badge">{prog.badge}</span>
                  </div>
                  <p className="program-row-degrees">{prog.degrees}</p>
                  <p className="program-row-desc">{prog.description}</p>
                </div>
                <span className="program-row-arrow">➔</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. RESEARCH SECTION (Matches Official IIT ISM Scientific Publications) */}
      {/* ========================================================================= */}
      <section className="home-dashboard-section home-research-section">
        <div className="section-header-banner">
          <div className="section-title-wrap">
            <div className="section-title-with-line">
              <h2 className="official-section-title">Research</h2>
              <div className="section-title-line"></div>
            </div>
            <p className="official-section-subtitle">Fostering inventiveness, imagination, and curiosity for a lifetime.</p>
          </div>
          <Link to="/departments" className="official-more-btn" onClick={() => play('click')}>
            More on research ➔
          </Link>
        </div>

        <div className="research-discoveries-grid">
          {RESEARCH_DISCOVERIES.map((disc) => (
            <div
              key={disc.id}
              className="research-discovery-card"
              onClick={() => {
                play('click');
                setActiveResearchModal(disc);
              }}
            >
              <div className="research-card-img-box">
                <img src={disc.image} alt={disc.title} className="research-card-img" />
                <span className="research-card-category-badge">{disc.category}</span>
              </div>
              <div className="research-card-body">
                <h3 className="research-card-title">{disc.title}</h3>
                <p className="research-card-summary">{disc.summary}</p>
                <div className="research-card-footer">
                  <span className="research-lead-author">✍️ {disc.lead}</span>
                  <span className="research-expand-link">Read Discovery ➔</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Life Story Expanded Modal */}
      {activeStoryModal && (
        <div className="real-info-modal active" onClick={() => setActiveStoryModal(null)}>
          <div className="real-info-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="real-info-header">
              <h2>{activeStoryModal.badge}</h2>
              <button className="modal-close-btn" onClick={() => setActiveStoryModal(null)}>✖</button>
            </div>
            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              <img
                src={activeStoryModal.image}
                alt={activeStoryModal.title}
                style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--gold-border)' }}
              />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-glow)', fontSize: '1.4rem', marginBottom: '0.4rem' }}>
              {activeStoryModal.title}
            </h3>
            <p style={{ color: 'var(--gold-parchment)', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '1rem' }}>
              🏴‍☠️ {activeStoryModal.pirateSubtitle} • 📍 {activeStoryModal.date}
            </p>
            <p style={{ color: '#e0e6ed', lineHeight: 1.6, fontSize: '1.05rem' }}>
              {activeStoryModal.description}
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
              <Link to="/clubs" className="btn" onClick={() => setActiveStoryModal(null)}>
                🏴‍☠️ Explore All Pirate Guilds &amp; Clubs
              </Link>
              <button className="btn btn-secondary" onClick={() => setActiveStoryModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Research Paper Expanded Modal */}
      {activeResearchModal && (
        <div className="real-info-modal active" onClick={() => setActiveResearchModal(null)}>
          <div className="real-info-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <div className="real-info-header">
              <h2>🔬 {activeResearchModal.category}</h2>
              <button className="modal-close-btn" onClick={() => setActiveResearchModal(null)}>✖</button>
            </div>
            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              <img
                src={activeResearchModal.image}
                alt={activeResearchModal.title}
                style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', background: '#ffffff', borderRadius: '12px', border: '2px solid var(--gold-border)', padding: '6px' }}
              />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-glow)', fontSize: '1.5rem', marginBottom: '0.4rem' }}>
              {activeResearchModal.title}
            </h3>
            <div style={{ background: 'rgba(0, 206, 201, 0.1)', padding: '0.8rem 1rem', borderRadius: '8px', borderLeft: '4px solid #00cec9', marginBottom: '1rem' }}>
              <strong style={{ color: '#00cec9', display: 'block', fontSize: '0.92rem' }}>Principal Investigators:</strong>
              <span style={{ color: '#fff', fontSize: '1rem' }}>{activeResearchModal.lead}</span>
              <div style={{ fontSize: '0.85rem', color: '#a0aec0', marginTop: '4px' }}>
                Published In / Field: <em>{activeResearchModal.journal}</em>
              </div>
            </div>
            <p style={{ color: '#e0e6ed', lineHeight: 1.6, fontSize: '1.05rem' }}>
              {activeResearchModal.summary}
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
              <Link to="/departments" className="btn" onClick={() => setActiveResearchModal(null)}>
                🏛️ Explore Research Guilds &amp; Labs
              </Link>
              <button className="btn btn-secondary" onClick={() => setActiveResearchModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Captain's Charting Log Modal */}
      {showLogModal && (
        <div className="real-info-modal active" onClick={() => setShowLogModal(false)}>
          <div className="real-info-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="real-info-header">
              <h2>📜 Captain's Charting Log</h2>
              <button className="modal-close-btn" onClick={() => setShowLogModal(false)}>✖</button>
            </div>

            <div style={{ marginBottom: '1.2rem', background: 'rgba(0, 206, 201, 0.15)', padding: '0.8rem 1rem', borderRadius: '6px' }}>
              <strong>Progress:</strong> You have charted <strong>{captainsLog.length} of {PLACES.length}</strong> landmarks on The Isle of IIT (ISM)!
              <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${(captainsLog.length / PLACES.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #00cec9, #81ecec)' }} />
              </div>
            </div>

            <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {PLACES.map(p => {
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
                          <div style={{ fontSize: '0.78rem', color: '#a0aec0' }}>{p.zone} • {p.name}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: logged ? '#2ecc71' : '#718096', fontWeight: 'bold' }}>
                        {logged ? '✅ Charted' : '🔒 Uncharted'}
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

