import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';
import { useTreasure } from '../context/TreasureContext';

export default function Tribute() {
  const { play } = useSound();
  const { addChaos, showToast } = useChaos();
  const { collectCoin, isCollected } = useTreasure();

  const [rate, setRate] = useState(84.5);
  const [btnPos, setBtnPos] = useState({ top: 30, left: 40 });
  const [receipt, setReceipt] = useState(null);
  const arenaRef = useRef(null);

  // Fluctuating exchange rate ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setRate(prev => +(prev + (Math.random() * 4 - 2)).toFixed(2));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Runaway button physics
  const dodgeCursor = (e) => {
    if (!arenaRef.current) return;
    const arena = arenaRef.current.getBoundingClientRect();
    const btn = e.currentTarget.getBoundingClientRect();

    const mouseX = e.clientX - arena.left;
    const mouseY = e.clientY - arena.top;

    const btnCenterX = btn.left - arena.left + btn.width / 2;
    const btnCenterY = btn.top - arena.top + btn.height / 2;

    const dist = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);

    if (dist < 120) {
      const angle = Math.atan2(btnCenterY - mouseY, btnCenterX - mouseX);
      const moveDist = 140;
      let newX = btn.left - arena.left + Math.cos(angle) * moveDist;
      let newY = btn.top - arena.top + Math.sin(angle) * moveDist;

      newX = Math.max(10, Math.min(arena.width - btn.width - 10, newX));
      newY = Math.max(10, Math.min(arena.height - btn.height - 10, newY));

      setBtnPos({ top: newY, left: newX });
      play('click');
      addChaos(1);
    }
  };

  const handlePaySuccess = () => {
    play('victory');
    setReceipt({
      id: 'PIRATE-' + Math.floor(Math.random() * 89999 + 10000),
      amount: '5,000 Doubloons',
      purpose: 'Hostel High-Speed Wi-Fi & Samosa Tax',
      refundStatus: '🦜 Refunded in 100 Emojis: 🪙💰💎🍕🦜🏴‍☠️'
    });
    showToast('🎉 PAYMENT SEIZED BY THE HIGH ADMIRALTY!', 'success');
  };

  return (
    <div className="container tribute-wrapper">
      <header className="page-header">
        <h1>💰 Doubloon Tribute &amp; Fee Payment Portal</h1>
        <p>Worst E-Commerce Tribute Terminal: Catch the runaway button to submit semester tribute!</p>
      </header>

      {/* Live Exchange Rate Ticker */}
      <div className="rate-ticker-card">
        <div>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>📈 Live Sea Currency Exchange:</span>
          <p style={{ margin: '4px 0 0', fontSize: '0.95rem' }}>1 Gold Doubloon = <strong>₹{rate} INR</strong> (or 4.2 Canteen Samosas)</p>
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fffa65' }}>
          Tribute Due: 5,000 Doubloons
        </div>
      </div>

      <div className="parchment-card">
        <h3>📜 Semester Tribute Declaration</h3>
        <p style={{ color: 'var(--text-brown-light)' }}>
          Select your guild and ship to dispatch payment. No refunds will be provided unless approved by Captain Polly.
        </p>

        <form className="tribute-form" onSubmit={e => e.preventDefault()}>
          <div className="form-group">
            <label>Scallywag Name &amp; Roll Number:</label>
            <input type="text" defaultValue="Deckhand Sparrow (21JE0999)" />
          </div>

          <div className="form-group">
            <label>Select War Galleon (Hostel):</label>
            <select defaultValue="amber">
              <option value="amber">Amber War Galleon</option>
              <option value="diamond">Diamond 1926 Flagship</option>
              <option value="aquamarine">Aquamarine 13-Decker</option>
              <option value="jasper">Jasper Heavy Ironclad</option>
            </select>
          </div>

          <div className="form-group">
            <label>Payment Method:</label>
            <select defaultValue="doubloon">
              <option value="doubloon">Pure Gold Doubloons (Chests)</option>
              <option value="gems">Uncut Diamonds from Mining Mine</option>
              <option value="samosas">Jasper Canteen Cheese Rolls</option>
            </select>
          </div>

          {/* Arena with Runaway Button */}
          <div 
            ref={arenaRef}
            className="pay-btn-arena" 
            style={{ width: '100%', height: '180px', border: '2px dashed var(--border-parchment)', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}
          >
            <button
              type="button"
              className="btn btn-danger"
              style={{ position: 'absolute', top: `${btnPos.top}px`, left: `${btnPos.left}px`, transition: 'top 0.15s ease-out, left 0.15s ease-out' }}
              onMouseMove={dodgeCursor}
              onClick={handlePaySuccess}
            >
              💰 SUBMIT TRIBUTE (Catch Me!)
            </button>
          </div>
        </form>

        {/* Hidden Doubloon 3 */}
        {!isCollected('coin_tribute') && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              className="hidden-treasure-coin"
              onClick={(e) => collectCoin('coin_tribute', e)}
              title="A forgotten coin in the tribute counter..."
            >
              🪙 (Plunder Doubloon)
            </button>
          </div>
        )}
      </div>

      {/* Funny Payment Receipt Modal */}
      {receipt && (
        <div className="parchment-card" style={{ border: '3px solid var(--gold-primary)', background: '#fffcf2' }}>
          <h3 style={{ color: '#27ae60' }}>🧾 Official Admiralty Tribute Receipt</h3>
          <p><strong>Receipt Token:</strong> {receipt.id}</p>
          <p><strong>Amount Plundered:</strong> {receipt.amount}</p>
          <p><strong>Purpose:</strong> {receipt.purpose}</p>
          <p><strong>Refund Policy:</strong> {receipt.refundStatus}</p>
          <button className="btn" style={{ marginTop: '0.8rem' }} onClick={() => setReceipt(null)}>
            Close Receipt
          </button>
        </div>
      )}
    </div>
  );
}
