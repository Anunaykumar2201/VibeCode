import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * IsleMapSVG - Authentic Hand-Drawn 1700s Pirate Cartography of The Isle of IIT (ISM)
 * Built with pure inline SVG, vintage hatching, mountain ranges, coastlines, and parchment textures.
 */
export default function IsleMapSVG({
  places,
  selectedPlace,
  onSelectPlace,
  shipPosition,
  activeRoutePath,
  zoom,
  pan
}) {
  return (
    <div className="isle-map-svg-container">
      <svg
        viewBox="0 0 1000 700"
        className="isle-cartography-svg"
        preserveAspectRatio="xMidYMid meet"
        aria-label="The Isle of IIT (ISM) Pirate Treasure Map"
      >
        <defs>
          {/* Authentic 1700s Aged Parchment Texture Filter */}
          <filter id="parchmentTexture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.93  0 0 0 0 0.86  0 0 0 0 0.72  0 0 0 0.25 0"
              result="coloredNoise"
            />
            <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
          </filter>

          {/* Gradients for Mountains & Banners */}
          <linearGradient id="parchmentScroll" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f7f0df" />
            <stop offset="50%" stopColor="#ebdcc0" />
            <stop offset="100%" stopColor="#ddc8a4" />
          </linearGradient>

          <linearGradient id="landmassShading" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3e8cf" />
            <stop offset="50%" stopColor="#eee0c1" />
            <stop offset="100%" stopColor="#e5d2ac" />
          </linearGradient>

          <linearGradient id="hiddenIsleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8dfc7" />
            <stop offset="100%" stopColor="#dfd2b5" />
          </linearGradient>

          {/* Curved paths for Zone Labels */}
          <path id="pathTreasureCaves" d="M 230 90 Q 420 60 670 105" />
          <path id="pathAcademicBay" d="M 330 270 Q 460 240 590 280" />
          <path id="pathStudentCove" d="M 590 390 Q 720 370 820 450" />
          <path id="pathGalleyWharf" d="M 180 660 Q 300 600 420 610" />
          <path id="pathSportsShores" d="M 370 730 Q 500 700 660 720" />
          <path id="pathHiddenIsle" d="M 140 220 Q 200 180 260 210" />
          <path id="pathHarbourGate" d="M 400 630 Q 500 610 600 630" />
        </defs>

        {/* 1. Sea Background */}
        <rect width="1000" height="700" fill="#e9ddc3" filter="url(#parchmentTexture)" />

        {/* Decorative Sea Wave Ripples */}
        <g stroke="#c7b088" strokeWidth="1" fill="none" opacity="0.65" strokeLinecap="round">
          {/* Northwest Waves */}
          <path d="M 60 120 Q 75 115 90 120 M 95 120 Q 110 115 125 120" />
          <path d="M 80 145 Q 95 140 110 145" />
          <path d="M 50 280 Q 65 275 80 280 M 85 280 Q 100 275 115 280" />
          {/* Northeast Waves */}
          <path d="M 780 90 Q 795 85 810 90 M 815 90 Q 830 85 845 90" />
          <path d="M 880 180 Q 895 175 910 180" />
          {/* Southeast Waves */}
          <path d="M 820 540 Q 835 535 850 540 M 855 540 Q 870 535 885 540" />
          <path d="M 870 590 Q 885 585 900 590" />
          {/* Southwest Waves */}
          <path d="M 90 560 Q 105 555 120 560" />
          <path d="M 120 630 Q 135 625 150 630 M 155 630 Q 170 625 185 630" />
        </g>

        {/* 2. Outer Shoreline Water Depth Contours (Hand-Drawn Maritime Hatching) */}
        <g stroke="#caa774" fill="none" opacity="0.5">
          {/* Main Island Outer Ring 2 */}
          <path
            d="M 270 95 C 410 60, 680 75, 780 160 C 850 220, 890 360, 840 480 C 790 590, 710 650, 500 655 C 330 655, 230 600, 190 510 C 140 410, 160 210, 270 95 Z"
            strokeWidth="3.5"
            strokeDasharray="4, 6"
          />
          {/* Main Island Outer Ring 1 */}
          <path
            d="M 280 105 C 415 75, 670 90, 765 170 C 830 230, 870 355, 825 470 C 780 575, 700 640, 500 645 C 340 645, 245 590, 205 505 C 160 410, 175 220, 280 105 Z"
            strokeWidth="2"
            strokeDasharray="2, 4"
          />
          {/* Hidden Isle Outer Rings */}
          <path
            d="M 120 180 C 180 145, 275 160, 285 230 C 295 300, 220 335, 160 315 C 105 295, 85 220, 120 180 Z"
            strokeWidth="2"
            strokeDasharray="3, 4"
          />
        </g>

        {/* 3. The Hidden Isle (Northwest Off-Shore Island) */}
        <g className="island-hidden-isle">
          <path
            d="M 130 190 C 185 155, 265 170, 275 235 C 285 295, 215 325, 165 305 C 115 285, 95 225, 130 190 Z"
            fill="url(#hiddenIsleGrad)"
            stroke="#5c3f1e"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Beach Shore Shading */}
          <path
            d="M 134 195 C 185 162, 260 176, 269 237 C 278 290, 211 319, 166 300 C 121 280, 102 227, 134 195 Z"
            fill="none"
            stroke="#b8935c"
            strokeWidth="1.5"
            opacity="0.6"
          />
          {/* Palm Grove Sketches */}
          <g fill="#4e3518" stroke="#4e3518" strokeWidth="0.8">
            <path d="M 170 230 Q 170 215 175 205 M 175 205 Q 165 198 160 203 M 175 205 Q 185 198 190 203 M 175 205 Q 175 195 172 192" />
            <path d="M 230 250 Q 232 235 238 225 M 238 225 Q 228 218 222 223 M 238 225 Q 248 218 253 223" />
            <path d="M 150 260 Q 152 248 156 240 M 156 240 Q 148 234 144 238 M 156 240 Q 164 234 168 238" />
          </g>
        </g>

        {/* 4. Main Island - "The Isle of IIT (ISM)" */}
        <g className="island-main-landmass">
          <path
            d="M 295 118 
               C 360 88, 450 78, 540 85 
               C 630 92, 710 115, 755 178 
               C 795 232, 850 285, 835 375 
               C 820 460, 785 530, 735 575 
               C 675 625, 595 635, 500 635 
               C 410 635, 345 618, 280 575 
               C 225 535, 175 465, 185 375 
               C 195 285, 230 155, 295 118 Z"
            fill="url(#landmassShading)"
            stroke="#4a2e12"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* Beach & Coastal Depth Rim */}
          <path
            d="M 300 124 
               C 363 95, 448 85, 536 92 
               C 623 99, 702 121, 746 182 
               C 784 234, 838 285, 824 371 
               C 810 452, 776 520, 728 564 
               C 670 613, 591 623, 500 623 
               C 413 623, 351 607, 288 566 
               C 236 528, 188 460, 197 374 
               C 207 288, 240 161, 300 124 Z"
            fill="none"
            stroke="#b8935c"
            strokeWidth="1.8"
            opacity="0.75"
          />

          {/* Interior Estuary Creek / Canal */}
          <path
            d="M 500 635 Q 490 560 450 510 T 470 420 Q 520 370 510 300"
            fill="none"
            stroke="#baa076"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 450 510 Q 380 490 310 500"
            fill="none"
            stroke="#baa076"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Ink-Drawn Mountain Ridges (Treasure Caves & Northern Spine) */}
          <g fill="#deb887" stroke="#4a2e12" strokeWidth="1.3" strokeLinejoin="round">
            {/* Peak 1 */}
            <path d="M 280 170 L 305 130 L 330 170 Z" fill="#edd6b1" />
            <path d="M 305 130 L 305 170" stroke="#7a5229" strokeWidth="0.9" />
            {/* Peak 2 */}
            <path d="M 320 165 L 355 115 L 390 165 Z" fill="#f4e0c1" />
            <path d="M 355 115 L 355 165" stroke="#7a5229" strokeWidth="0.9" />
            {/* Peak 3 (Highest Mining Ridge) */}
            <path d="M 380 160 L 420 100 L 460 160 Z" fill="#edd6b1" />
            <path d="M 420 100 L 420 160" stroke="#7a5229" strokeWidth="0.9" />
            {/* Peak 4 */}
            <path d="M 450 165 L 485 115 L 520 165 Z" fill="#f4e0c1" />
            <path d="M 485 115 L 485 165" stroke="#7a5229" strokeWidth="0.9" />
            {/* Peak 5 */}
            <path d="M 510 170 L 545 120 L 580 170 Z" fill="#edd6b1" />
            <path d="M 545 120 L 545 170" stroke="#7a5229" strokeWidth="0.9" />
            {/* Peak 6 (East Ridge) */}
            <path d="M 570 175 L 610 130 L 650 175 Z" fill="#f4e0c1" />
            <path d="M 610 130 L 610 175" stroke="#7a5229" strokeWidth="0.9" />
          </g>

          {/* Ink Forest & Tree Clustered Sketches */}
          <g fill="#5c4028" stroke="#5c4028" strokeWidth="0.8" opacity="0.85">
            {/* West Woods */}
            <path d="M 235 340 C 230 330 245 320 245 330 C 255 325 260 335 255 342 Z" fill="#d9c298" />
            <path d="M 255 370 C 250 360 265 350 265 360 C 275 355 280 365 275 372 Z" fill="#d9c298" />
            {/* East Groves */}
            <path d="M 685 320 C 680 310 695 300 695 310 C 705 305 710 315 705 322 Z" fill="#d9c298" />
            <path d="M 720 460 C 715 450 730 440 730 450 C 740 445 745 455 740 462 Z" fill="#d9c298" />
            <path d="M 670 540 C 665 530 680 520 680 530 C 690 525 695 535 690 542 Z" fill="#d9c298" />
          </g>
        </g>

        {/* 5. Animated Single Sailing Path (Active When Ship is Sailing) */}
        {activeRoutePath && (
          <path
            d={activeRoutePath}
            fill="none"
            stroke="#a81c1c"
            strokeWidth="2.5"
            strokeDasharray="5, 5"
            strokeLinecap="round"
            className="active-sailing-dotted-route"
          />
        )}

        {/* 6. Zone Names Written Along Curved Paths */}
        <g className="map-zone-labels" fontFamily="'Pirata One', serif" fill="#542e0f" letterSpacing="2px">
          {/* Treasure Caves */}
          <text fontSize="19" opacity="0.9">
            <textPath href="#pathTreasureCaves" startOffset="50%" textAnchor="middle">
              ⚔️ TREASURE CAVES (GUILDS)
            </textPath>
          </text>
          {/* Academic Bay */}
          <text fontSize="18" opacity="0.9">
            <textPath href="#pathAcademicBay" startOffset="50%" textAnchor="middle">
              🏛️ ACADEMIC BAY
            </textPath>
          </text>
          {/* Student Cove */}
          <text fontSize="18" opacity="0.9">
            <textPath href="#pathStudentCove" startOffset="50%" textAnchor="middle">
              🎭 STUDENT COVE
            </textPath>
          </text>
          {/* Galley and Infirmary Wharf */}
          <text fontSize="16" opacity="0.85">
            <textPath href="#pathGalleyWharf" startOffset="50%" textAnchor="middle">
              🍗 GALLEY &amp; INFIRMARY WHARF
            </textPath>
          </text>
          {/* Sports Shores */}
          <text fontSize="17" opacity="0.85">
            <textPath href="#pathSportsShores" startOffset="50%" textAnchor="middle">
              🏆 SPORTS SHORES
            </textPath>
          </text>
          {/* The Hidden Isle */}
          <text fontSize="16" opacity="0.85">
            <textPath href="#pathHiddenIsle" startOffset="50%" textAnchor="middle">
              🌴 THE HIDDEN ISLE
            </textPath>
          </text>
          {/* Harbour Gate */}
          <text fontSize="17" opacity="0.9">
            <textPath href="#pathHarbourGate" startOffset="50%" textAnchor="middle">
              ⚓ HARBOUR GATE
            </textPath>
          </text>
        </g>

        {/* 7. Hostel Harbour - Fleet of 11 Anchored Ships Linking to /hostels */}
        <g className="hostel-harbour-fleet" transform="translate(830, 240)">
          <NavLink to="/hostels" className="hostel-harbour-link" aria-label="Visit Hostel Harbour (11 War Galleons)">
            {/* Mooring Buoy & Anchor Line */}
            <circle cx="20" cy="40" r="7" fill="#b8860b" stroke="#3b1e08" strokeWidth="1.5" />
            <line x1="20" y1="40" x2="60" y2="70" stroke="#8b6b3e" strokeWidth="1.2" strokeDasharray="3, 3" />
            
            {/* 3 Illustrated Ships of the 11-Fleet Armada */}
            <g transform="translate(10, 0) scale(0.75)">
              {/* Flagship Hull */}
              <path d="M 10 35 Q 35 48 60 35 L 55 25 L 15 25 Z" fill="#4a2810" stroke="#1f0f04" strokeWidth="1.5" />
              {/* Masts */}
              <line x1="25" y1="25" x2="25" y2="5" stroke="#1f0f04" strokeWidth="1.8" />
              <line x1="45" y1="25" x2="45" y2="8" stroke="#1f0f04" strokeWidth="1.8" />
              {/* Sails */}
              <path d="M 25 8 Q 36 12 25 22 Q 18 15 25 8" fill="#f5eedc" stroke="#3b1e08" strokeWidth="1" />
              <path d="M 45 11 Q 56 15 45 23 Q 38 18 45 11" fill="#f5eedc" stroke="#3b1e08" strokeWidth="1" />
              {/* Pirate Flag */}
              <path d="M 25 5 L 34 2 L 25 0 Z" fill="#800000" />
            </g>

            {/* Background Sloop 2 */}
            <g transform="translate(50, 25) scale(0.55)">
              <path d="M 10 35 Q 35 48 60 35 L 55 25 L 15 25 Z" fill="#5c3818" stroke="#1f0f04" strokeWidth="1.5" />
              <line x1="35" y1="25" x2="35" y2="8" stroke="#1f0f04" strokeWidth="1.8" />
              <path d="M 35 10 Q 45 14 35 22 Q 28 17 35 10" fill="#eedbb8" stroke="#3b1e08" strokeWidth="1" />
            </g>

            {/* Background Sloop 3 */}
            <g transform="translate(45, -15) scale(0.55)">
              <path d="M 10 35 Q 35 48 60 35 L 55 25 L 15 25 Z" fill="#5c3818" stroke="#1f0f04" strokeWidth="1.5" />
              <line x1="35" y1="25" x2="35" y2="8" stroke="#1f0f04" strokeWidth="1.8" />
              <path d="M 35 10 Q 45 14 35 22 Q 28 17 35 10" fill="#eedbb8" stroke="#3b1e08" strokeWidth="1" />
            </g>

            {/* Fleet Label Banner */}
            <rect x="-10" y="58" width="130" height="24" rx="4" fill="#f7edd6" stroke="#8b6b3e" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
            <text x="55" y="74" textAnchor="middle" fontFamily="'Pirata One', serif" fontSize="13" fill="#800000" letterSpacing="0.5px">
              ⚓ HOSTEL HARBOUR (11)
            </text>
          </NavLink>
        </g>

        {/* 8. Small Vintage Kraken / Sea Monster in Bottom-Right Sea Corner */}
        <g className="decorative-kraken" transform="translate(860, 580) scale(0.65)" opacity="0.75">
          <path
            d="M 10 30 Q 20 5 40 10 Q 55 15 45 35 Q 35 20 25 35 
               M 35 32 Q 50 2 75 15 Q 90 25 70 45 Q 65 30 50 40 
               M 65 42 Q 95 20 110 40 Q 115 55 95 60 Q 90 45 75 52"
            fill="none"
            stroke="#63482a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Suction Cups */}
          <circle cx="28" cy="18" r="2.5" fill="#caa774" />
          <circle cx="38" cy="22" r="2.5" fill="#caa774" />
          <circle cx="62" cy="22" r="2.5" fill="#caa774" />
          <circle cx="78" cy="32" r="2.5" fill="#caa774" />
          <circle cx="98" cy="42" r="2.5" fill="#caa774" />
          {/* Water Splash Lines */}
          <path d="M 0 50 Q 40 45 80 50 M 50 58 Q 80 54 110 58" stroke="#a68c68" strokeWidth="1.5" fill="none" />
        </g>

        {/* 9. Small Compass Rose in Top-Right Corner */}
        <g className="vintage-compass-rose" transform="translate(870, 95) scale(0.72)">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#7a552b" strokeWidth="1.8" />
          <circle cx="50" cy="50" r="38" fill="#f5edd9" stroke="#7a552b" strokeWidth="1" opacity="0.9" />
          {/* 8-Point Star */}
          {/* North Point */}
          <polygon points="50,12 45,50 50,50" fill="#c0392b" />
          <polygon points="50,12 55,50 50,50" fill="#800000" />
          {/* South Point */}
          <polygon points="50,88 45,50 50,50" fill="#800000" />
          <polygon points="50,88 55,50 50,50" fill="#c0392b" />
          {/* East Point */}
          <polygon points="88,50 50,45 50,50" fill="#d4af37" />
          <polygon points="88,50 50,55 50,50" fill="#996515" />
          {/* West Point */}
          <polygon points="12,50 50,45 50,50" fill="#996515" />
          <polygon points="12,50 50,55 50,50" fill="#d4af37" />
          {/* Diagonal Points */}
          <polygon points="76,24 50,50 54,46" fill="#8b6b3e" />
          <polygon points="24,76 50,50 46,54" fill="#8b6b3e" />
          <polygon points="76,76 50,50 54,54" fill="#8b6b3e" />
          <polygon points="24,24 50,50 46,46" fill="#8b6b3e" />
          {/* Center Rivet */}
          <circle cx="50" cy="50" r="4" fill="#ffd700" stroke="#3b1e08" strokeWidth="1.2" />
          {/* Cardinal Letters */}
          <text x="50" y="6" textAnchor="middle" fontFamily="'Pirata One', serif" fontSize="14" fill="#800000" fontWeight="bold">N</text>
          <text x="50" y="102" textAnchor="middle" fontFamily="'Pirata One', serif" fontSize="13" fill="#3b1e08">S</text>
          <text x="98" y="54" textAnchor="middle" fontFamily="'Pirata One', serif" fontSize="13" fill="#3b1e08">E</text>
          <text x="2" y="54" textAnchor="middle" fontFamily="'Pirata One', serif" fontSize="13" fill="#3b1e08">W</text>
        </g>

        {/* 10. Title Banner Ribbon (Top-Center / Left) */}
        <g className="map-title-ribbon" transform="translate(200, 20)">
          {/* Ribbon Ends */}
          <path d="M 0 25 L 30 10 L 30 40 Z" fill="#b08b52" stroke="#3b1e08" strokeWidth="1.5" />
          <path d="M 440 25 L 410 10 L 410 40 Z" fill="#b08b52" stroke="#3b1e08" strokeWidth="1.5" />
          {/* Main Ribbon Body */}
          <rect x="25" y="6" width="390" height="42" rx="4" fill="url(#parchmentScroll)" stroke="#4a2810" strokeWidth="2" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.35))" />
          <line x1="32" y1="12" x2="408" y2="12" stroke="#8b6b3e" strokeWidth="0.8" strokeDasharray="4, 3" />
          <line x1="32" y1="42" x2="408" y2="42" stroke="#8b6b3e" strokeWidth="0.8" strokeDasharray="4, 3" />
          {/* Title Text */}
          <text x="220" y="26" textAnchor="middle" fontFamily="'Pirata One', cursive" fontSize="22" fill="#800000" letterSpacing="1.5px">
            ⚓ THE ISLE OF IIT (ISM) ⚓
          </text>
          <text x="220" y="41" textAnchor="middle" fontFamily="'IM Fell English', serif" fontSize="10.5" fill="#4a3014" fontStyle="italic">
            Formerly the Indian School of Mines: where pirates dig for treasure
          </text>
        </g>

        {/* 11. Antique Rope & Wood Cartography Outer Frame */}
        <rect x="8" y="8" width="984" height="684" fill="none" stroke="#5a3814" strokeWidth="8" rx="6" />
        <rect x="14" y="14" width="972" height="672" fill="none" stroke="#d4af37" strokeWidth="1.5" />
        <rect x="18" y="18" width="964" height="664" fill="none" stroke="#5a3814" strokeWidth="1" strokeDasharray="6, 4" />
        {/* Corner Rivets */}
        <circle cx="16" cy="16" r="4.5" fill="#d4af37" stroke="#3b1e08" strokeWidth="1.2" />
        <circle cx="984" cy="16" r="4.5" fill="#d4af37" stroke="#3b1e08" strokeWidth="1.2" />
        <circle cx="16" cy="684" r="4.5" fill="#d4af37" stroke="#3b1e08" strokeWidth="1.2" />
        <circle cx="984" cy="684" r="4.5" fill="#d4af37" stroke="#3b1e08" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
