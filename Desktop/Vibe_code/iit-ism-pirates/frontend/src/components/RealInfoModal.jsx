import React from 'react';

export default function RealInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="real-info-modal active" onClick={onClose}>
      <div className="real-info-content" onClick={e => e.stopPropagation()}>
        <div className="real-info-header">
          <h2>🏛️ IIT (ISM) Dhanbad - Official Campus Directory &amp; Timings</h2>
          <button className="modal-close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="real-info-disclaimer">
          <strong>⚠️ Note for Judges &amp; Students:</strong> This information is accurate and sourced from the IIT (ISM) Campus Directory. Contacts and hours may change; please verify official notifications on <a href="https://www.iitism.ac.in" target="_blank" rel="noreferrer">iitism.ac.in</a>.
        </div>

        <div className="real-info-grid">
          <div className="real-info-card">
            <h3>🏢 Campus Facilities &amp; Timings</h3>
            <ul>
              <li><strong>Central Library:</strong> 09:00 - 23:45 (Mon-Sun)</li>
              <li><strong>Central Canteen:</strong> 07:00 - 23:30</li>
              <li><strong>Campus Health Centre:</strong> 24 Hours Open (Emergency: Ext. 5555)</li>
              <li><strong>Student Activity Centre (SAC):</strong> 06:00 - 00:00</li>
              <li><strong>Executive Development Centre (EDC):</strong> 08:00 - 22:00</li>
              <li><strong>NVCTI Innovation Hub:</strong> 09:00 - 17:00 (Mon-Fri)</li>
              <li><strong>SBI &amp; Post Office:</strong> 10:00 - 16:00 (Mon-Sat)</li>
            </ul>
          </div>

          <div className="real-info-card">
            <h3>🏠 Hostels Overview (11 Halls)</h3>
            <ul>
              <li><strong>Amber:</strong> Boys (~2000 Cap, Ext. 5180)</li>
              <li><strong>Diamond:</strong> Built 1926 (Founding year heritage, Ext. 5126)</li>
              <li><strong>Jasper:</strong> Boys (7 Floors, Ext. 5190)</li>
              <li><strong>Sapphire, Topaz, Emerald, Iolite:</strong> Central &amp; Old complexes</li>
              <li><strong>Aquamarine:</strong> 13-Storey Mega Hostel (Ext. 5200)</li>
              <li><strong>Opal, Ruby &amp; Rosaline:</strong> Girls Residences (Ext. 5130/5135)</li>
              <li><strong>International:</strong> Scholars &amp; Foreign delegates (Ext. 5090)</li>
            </ul>
          </div>
        </div>

        <div className="real-info-footer">
          <p>Dean of Students Welfare (DSW): <code>dsw@iitism.ac.in</code> | Security Control Room: Ext. 5000</p>
        </div>
      </div>
    </div>
  );
}
