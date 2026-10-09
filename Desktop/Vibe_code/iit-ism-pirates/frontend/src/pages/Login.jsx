import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HOSTELS } from '../data/hostels';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { useChaos } from '../context/ChaosContext';
import T from '../components/T';
import confetti from 'canvas-confetti';

const PARROT_WRONG_PASS_JOKES = [
  "SQUAWK! Wrong secret phrase, ye bilge rat! Did a monkey steal yer memory?",
  "SQUAWK! Walk the plank! That password belongs to a landlubber!",
  "SQUAWK! Password rejected by the High Admiralty! Check yer caps lock, scallywag!",
  "SQUAWK! By Blackbeard's ghost! That combination opens no treasure chests here!"
];

const PARROT_FORGOT_HINTS = [
  "SQUAWK! Polly remembers all! Try the demo account: 'sparrow@dhanbad.ac.in' with password 'blackbeard123'!",
  "SQUAWK! Have ye checked under yer tricorn hat? Or did ye write it on a coconut?",
  "SQUAWK! Forgotten secrets require 1 Parle-G biscuit tribute to the campus monkeys!"
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, signup, logout } = useAuth();
  const { play } = useSound();
  const { add, showToast } = useChaos();

  // Initial mode from location state or default to 'login'
  const [mode, setMode] = useState(location.state?.mode === 'signup' ? 'signup' : 'login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupHostel, setSignupHostel] = useState(HOSTELS[0]?.id || 'diamond');

  // UI status & feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [parrotMessage, setParrotMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [successWelcome, setSuccessWelcome] = useState('');

  // Switch tabs
  const handleTabChange = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    setParrotMessage('');
    play('click');
  };

  const triggerShakeAndParrot = (customMsg) => {
    setIsShaking(true);
    play('parrot');
    const randomJoke = customMsg || PARROT_WRONG_PASS_JOKES[Math.floor(Math.random() * PARROT_WRONG_PASS_JOKES.length)];
    setParrotMessage(randomJoke);
    setTimeout(() => setIsShaking(false), 700);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setParrotMessage('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage("Ahoy! Empty scrolls carry no treasure! Enter both name/email and password.");
      play('click');
      add(2);
      return;
    }

    const res = login({
      identifier: loginIdentifier,
      password: loginPassword,
      rememberMe
    });

    if (!res.success) {
      setErrorMessage(res.error);
      add(3);
      triggerShakeAndParrot();
    } else {
      celebrateSuccess(res.user.name);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setParrotMessage('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword || !signupConfirm) {
      setErrorMessage("Avast! Fill out every parchment entry to sign the ship's register.");
      play('click');
      add(2);
      return;
    }

    if (signupPassword !== signupConfirm) {
      setErrorMessage("Yer passwords don't match, matey! Re-align yer compass.");
      play('click');
      add(2);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 700);
      return;
    }

    const res = signup({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      confirmPassword: signupConfirm,
      hostelId: signupHostel
    });

    if (!res.success) {
      setErrorMessage(res.error);
      add(2);
      triggerShakeAndParrot(res.error);
    } else {
      celebrateSuccess(res.user.name);
    }
  };

  const celebrateSuccess = (captainName) => {
    play('victory');
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 }
    });
    setSuccessWelcome(`Welcome aboard the High Admiralty, Captain ${captainName}! 🏴‍☠️`);
    showToast(`⚓ Captain ${captainName} has signed the ship's register!`, 'success');

    setTimeout(() => {
      navigate('/');
    }, 1400);
  };

  const handleForgotPassClick = (e) => {
    e.preventDefault();
    play('parrot');
    add(1);
    const hint = PARROT_FORGOT_HINTS[Math.floor(Math.random() * PARROT_FORGOT_HINTS.length)];
    setParrotMessage(hint);
  };

  const fillDemoAccount = () => {
    setLoginIdentifier('sparrow@dhanbad.ac.in');
    setLoginPassword('blackbeard123');
    setErrorMessage('');
    setParrotMessage('');
    play('coin');
  };

  // If already logged in, show current status card
  if (user && !successWelcome) {
    const userHostel = HOSTELS.find(h => h.id === user.hostelId);
    return (
      <div className="container login-page-container">
        <header className="page-header">
          <h1>📜 Crew Registration Scroll</h1>
          <p>
            <T pirate="Ye are currently enlisted in the Fleet Admiralty!" official="Account logged in" />
          </p>
        </header>

        <div className="parchment-card auth-card" style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
            {userHostel ? userHostel.flag : '🏴‍☠️'}
          </div>
          <h2 style={{ color: 'var(--blood-red)', fontSize: '2rem' }}>
            Captain {user.name}
          </h2>
          <p style={{ color: 'var(--text-brown)', margin: '0.4rem 0' }}>
            <strong>Scroll Address:</strong> {user.email}
          </p>
          <p style={{ color: 'var(--text-brown-light)', fontWeight: 'bold' }}>
            ⚓ Flagship: {userHostel ? userHostel.name : 'The 1926 Diamond Flagship'}
          </p>

          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => { play('click'); navigate('/hostels'); }}>
              ⚔️ View War Galleons
            </button>
            <button 
              className="btn btn-danger" 
              onClick={() => {
                play('splash');
                logout();
                showToast('🌊 Ye have abandoned the crew!', 'info');
              }}
            >
              🚪 Abandon Crew (Logout)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container login-page-container">
      <header className="page-header">
        <h1>📜 Crew Registration Scroll</h1>
        <p>
          <T pirate="Sign the black mark, board your war galleon, and claim yer loot!" official="Sign in or register your student account" />
        </p>
      </header>

      <div className={`parchment-card auth-card ${isShaking ? 'card-shaking' : ''}`}>
        {/* Success Overlay Banner */}
        {successWelcome && (
          <div className="auth-success-banner">
            <div style={{ fontSize: '3rem' }}>🎉 🏴‍☠️ ⚓</div>
            <h3>{successWelcome}</h3>
            <p>Setting sail for the 1926 Archipelago...</p>
          </div>
        )}

        {/* Tab Switcher */}
        {!successWelcome && (
          <>
            <div className="auth-tab-bar" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => handleTabChange('login')}
              >
                ⚓ <T pirate="Board the Ship" official="Login" />
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => handleTabChange('signup')}
              >
                📜 <T pirate="Join the Crew" official="Sign Up" />
              </button>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="pirate-error-msg" role="alert">
                <span>☠️</span> <span>{errorMessage}</span>
              </div>
            )}

            {/* Parrot Joke / Hint Box */}
            {parrotMessage && (
              <div className="parrot-joke-bubble">
                <span className="parrot-icon">🦜</span>
                <span className="parrot-text">{parrotMessage}</span>
              </div>
            )}

            {/* MODE 1: LOGIN FORM */}
            {mode === 'login' ? (
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="login-id">
                    <T pirate="Pirate Name or Scroll Address (Email):" official="Email or Username:" />
                  </label>
                  <input
                    id="login-id"
                    type="text"
                    placeholder="e.g. sparrow@dhanbad.ac.in or Jack Sparrow"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">
                    <T pirate="Secret Password / Cipher:" official="Password:" />
                  </label>
                  <div className="password-input-row">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter secret cipher..."
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => { setShowPassword(p => !p); play('click'); }}
                      title={showPassword ? 'Hide Cipher' : 'Reveal Cipher'}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="auth-form-extras">
                  <label className="remember-me-checkbox">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => { setRememberMe(e.target.checked); play('click'); }}
                    />
                    <span><T pirate="Bury my treasure (remember me)" official="Remember me" /></span>
                  </label>

                  <a href="#forgot" className="forgot-pass-link" onClick={handleForgotPassClick}>
                    🦜 <T pirate="Forgot secret? Ask Polly" official="Forgot password?" />
                  </a>
                </div>

                <button type="submit" className="btn btn-primary auth-submit-btn">
                  ⚓ <T pirate="Board the Ship!" official="Sign In" />
                </button>

                {/* Quick Demo Credentials Fill Button */}
                <div className="demo-helper-box">
                  <small style={{ color: 'var(--text-brown-light)', display: 'block', marginBottom: '4px' }}>
                    Quick Judge Test:
                  </small>
                  <button
                    type="button"
                    className="btn btn-secondary demo-fill-btn"
                    onClick={fillDemoAccount}
                    title="Fill demo captain credentials"
                  >
                    🪙 Fill Demo Captain (Jack Sparrow)
                  </button>
                </div>
              </form>
            ) : (
              /* MODE 2: SIGNUP FORM */
              <form className="auth-form" onSubmit={handleSignupSubmit}>
                <div className="form-group">
                  <label htmlFor="signup-name">
                    <T pirate="Pirate Moniker / Full Name:" official="Full Name:" />
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    placeholder="e.g. Captain Blackbeard"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signup-email">
                    <T pirate="Campus Pigeon Address (Email):" official="Email Address:" />
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="e.g. buccaneer@dhanbad.ac.in"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signup-hostel">
                    <T pirate="Choose Your War Galleon (Hostel):" official="Hostel Affiliation:" />
                  </label>
                  <select
                    id="signup-hostel"
                    value={signupHostel}
                    onChange={(e) => { setSignupHostel(e.target.value); play('click'); }}
                  >
                    {HOSTELS.map(hostel => (
                      <option key={hostel.id} value={hostel.id}>
                        {hostel.flag} {hostel.name} ({hostel.realName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-password">
                    <T pirate="Secret Cipher (Min. 6 runes):" official="Password (min 6 characters):" />
                  </label>
                  <div className="password-input-row">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters..."
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => { setShowPassword(p => !p); play('click'); }}
                      title={showPassword ? 'Hide Cipher' : 'Reveal Cipher'}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-confirm">
                    <T pirate="Confirm Secret Cipher:" official="Confirm Password:" />
                  </label>
                  <input
                    id="signup-confirm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat cipher exactly..."
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary auth-submit-btn">
                  📜 <T pirate="Join the Fleet!" official="Create Account" />
                </button>
              </form>
            )}

            {/* Demo Security Disclaimer Note */}
            <div className="demo-disclaimer-note">
              <span>⚠️</span>
              <small>
                <strong>Demo Admiralty Notice:</strong> Demo login stored only in browser local storage. Never use real banking or institute passwords!
              </small>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
