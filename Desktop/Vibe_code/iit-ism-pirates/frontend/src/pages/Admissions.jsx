import React, { useState } from 'react';
import { QUIZ_QUESTIONS, PIRATE_RANKS } from '../data/quiz';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';
import confetti from 'canvas-confetti';

export default function Admissions() {
  const { play } = useSound();
  const { addChaos } = useChaos();

  const [currentStep, setCurrentStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [resultRank, setResultRank] = useState(null);

  const handleAnswer = (option) => {
    play('click');
    addChaos(3);
    const newScore = totalScore + option.score;
    setTotalScore(newScore);

    if (currentStep + 1 < QUIZ_QUESTIONS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Determine rank
      const rankIdx = Math.floor(Math.random() * PIRATE_RANKS.length);
      setResultRank(PIRATE_RANKS[rankIdx]);
      play('victory');
      confetti({ particleCount: 70, spread: 80 });
    }
  };

  const restartQuiz = () => {
    setCurrentStep(0);
    setTotalScore(0);
    setResultRank(null);
  };

  const q = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="container quiz-container">
      <header className="page-header">
        <h1>📜 Join the Crew: Pirate Aptitude Assessment</h1>
        <p>Complete the 5 trials to earn your official rank aboard the IIT (ISM) Dhanbad Fleet!</p>
      </header>

      {!resultRank ? (
        <div className="parchment-card">
          {/* Progress Indicator */}
          <div className="quiz-progress-dots">
            {QUIZ_QUESTIONS.map((_, i) => (
              <div 
                key={i} 
                className={`progress-dot ${i <= currentStep ? 'active' : ''}`} 
              />
            ))}
          </div>

          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.2rem', color: '#3b1e08' }}>
            Question {currentStep + 1} of {QUIZ_QUESTIONS.length}: {q.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                className="quiz-option-btn"
                onClick={() => handleAnswer(opt)}
              >
                <span>⚔️</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Certificate of Pirate Rank */
        <div className="certificate-card">
          <h2 style={{ color: 'var(--blood-red)', fontSize: '2.4rem', marginBottom: '0.4rem' }}>
            OFFICIAL PIRATE COMMISSION
          </h2>
          <p style={{ fontStyle: 'italic', color: 'var(--text-brown)' }}>
            By order of the IIT (ISM) High Admiralty of Dhanbad, the candidate is hereby decreed:
          </p>

          <div style={{ margin: '1.5rem 0' }}>
            <h1 style={{ color: '#2c3e50', fontSize: '2.2rem', textShadow: 'none' }}>
              {resultRank.title}
            </h1>
            <div style={{ fontSize: '1.6rem', margin: '0.4rem 0' }}>{resultRank.stars}</div>
            <span className="badge" style={{ background: 'var(--gold-primary)', color: '#000', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
              {resultRank.badge}
            </span>
          </div>

          <p style={{ maxWidth: '600px', margin: '1rem auto', fontSize: '1.1rem' }}>
            {resultRank.description}
          </p>

          <p style={{ color: 'var(--text-brown-light)', fontWeight: 'bold' }}>
            ⚓ Allocated Vessel: {resultRank.allocatedShip}
          </p>

          <div className="wax-seal">
            ☠️
          </div>

          <button className="btn" style={{ marginTop: '1.8rem' }} onClick={restartQuiz}>
            🔄 Take Assessment Again
          </button>
        </div>
      )}
    </div>
  );
}
