import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';

export default function Placements() {
  const { play } = useSound();
  const { addChaos } = useChaos();

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paddleX, setPaddleX] = useState(250);
  const [items, setItems] = useState([]);

  const gameAreaRef = useRef(null);

  // Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    // Spawn falling items
    const spawnTimer = setInterval(() => {
      const isBomb = Math.random() < 0.3;
      setItems(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: Math.random() * 440 + 20,
          y: 0,
          isBomb,
          speed: Math.random() * 3 + 4
        }
      ]);
    }, 800);

    // Frame update
    const frameTimer = setInterval(() => {
      setItems(prev => {
        const next = [];
        for (const item of prev) {
          const newY = item.y + item.speed;

          // Catch collision at bottom (y ~ 360)
          if (newY >= 340 && newY <= 380 && Math.abs(item.x - paddleX) < 45) {
            if (item.isBomb) {
              play('cannon');
              setGameOver(true);
              setIsPlaying(false);
              addChaos(10);
            } else {
              play('coin');
              setScore(s => s + 100);
            }
          } else if (newY < 400) {
            next.push({ ...item, y: newY });
          }
        }
        return next;
      });
    }, 50);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(frameTimer);
    };
  }, [isPlaying, gameOver, paddleX, play, addChaos]);

  const handleMouseMove = (e) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setPaddleX(Math.max(30, Math.min(rect.width - 30, x)));
  };

  const startGame = () => {
    setScore(0);
    setItems([]);
    setGameOver(false);
    setIsPlaying(true);
    play('click');
  };

  return (
    <div className="container game-arena-wrapper">
      <header className="page-header">
        <h1>💎 Privateer Plunder &amp; Placement Coin Catcher</h1>
        <p>Catch falling gold doubloons with your chest paddle while dodging explosive cannonballs!</p>
      </header>

      <div className="game-scoreboard">
        <span>💰 Plunder Score: <strong>{score}</strong></span>
        <span>Status: {isPlaying ? '🟢 PLUNDERING' : gameOver ? '💥 SHIP SUNK' : '⚓ READY'}</span>
      </div>

      <div 
        ref={gameAreaRef}
        className="game-canvas-box"
        onMouseMove={handleMouseMove}
        style={{ cursor: 'none' }}
      >
        {!isPlaying && !gameOver && (
          <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <h2>🪙 PLUNDER MINI-GAME</h2>
            <p style={{ color: 'var(--bg-parchment-dark)' }}>Move your pirate chest to catch gold coins!</p>
            <button className="btn" onClick={startGame}>▶️ Start Plundering</button>
          </div>
        )}

        {gameOver && (
          <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <h2 style={{ color: '#ff4757' }}>💥 DIRECT HIT BY CANNONBALL!</h2>
            <p>Final Plunder Booty: <strong>{score} Doubloons</strong></p>
            <button className="btn" onClick={startGame}>🔄 Play Again</button>
          </div>
        )}

        {/* Falling items */}
        {isPlaying && items.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: `${item.x}px`,
              top: `${item.y}px`,
              fontSize: '1.8rem',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {item.isBomb ? '💣' : '🪙'}
          </div>
        ))}

        {/* Player Chest Paddle */}
        {isPlaying && (
          <div
            style={{
              position: 'absolute',
              left: `${paddleX}px`,
              bottom: '20px',
              transform: 'translateX(-50%)',
              fontSize: '2.5rem',
              pointerEvents: 'none'
            }}
          >
            🧰
          </div>
        )}
      </div>

      <div className="parchment-card" style={{ textAlign: 'left', marginTop: '2rem' }}>
        <h3>📜 Privateer Recruiting Letters of Marque</h3>
        <p>Distinguished pirate corporations currently recruiting deckhands from our fleet:</p>
        <ul>
          <li><strong>East India Tech Corp:</strong> 45,000 Doubloons / annum (Full health grog insurance)</li>
          <li><strong>Google Galleons:</strong> 60,000 Doubloons / annum (Unlimited free mess samosas)</li>
          <li><strong>Microsoft Privateers:</strong> 55,000 Doubloons / annum (Equipped with high-speed satellite radar)</li>
        </ul>
      </div>
    </div>
  );
}
