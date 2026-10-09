import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_ACCOUNTS = [
  {
    id: 'crew_default_1',
    name: 'Captain Jack Sparrow',
    email: 'sparrow@dhanbad.ac.in',
    password: 'blackbeard123',
    hostelId: 'diamond',
    role: 'Captain'
  },
  {
    id: 'crew_default_2',
    name: 'First Mate Anne Bonny',
    email: 'bonny@dhanbad.ac.in',
    password: 'caribbean123',
    hostelId: 'aquamarine',
    role: 'First Mate'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pirate_crew_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Initialize demo accounts in localStorage if none exist
  useEffect(() => {
    try {
      const existing = localStorage.getItem('pirate_crew_accounts');
      if (!existing) {
        localStorage.setItem('pirate_crew_accounts', JSON.stringify(DEMO_ACCOUNTS));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  const getAccounts = () => {
    try {
      const raw = localStorage.getItem('pirate_crew_accounts');
      return raw ? JSON.parse(raw) : DEMO_ACCOUNTS;
    } catch {
      return DEMO_ACCOUNTS;
    }
  };

  const login = ({ identifier, password }) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Ahoy! Both pirate identifier and secret password are required!' };
    }

    const accounts = getAccounts();
    const matched = accounts.find(
      acc => acc.email.toLowerCase() === cleanId || acc.name.toLowerCase() === cleanId
    );

    if (!matched) {
      return {
        success: false,
        error: 'No buccaneer found by that scroll address or name! Sign the register first.'
      };
    }

    if (matched.password !== cleanPass) {
      return {
        success: false,
        error: 'Avast! The secret password is wrong, matey! Try again or consult Captain Polly.'
      };
    }

    const sessionUser = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      hostelId: matched.hostelId || 'diamond',
      role: matched.role || 'Deckhand'
    };

    try {
      localStorage.setItem('pirate_crew_user', JSON.stringify(sessionUser));
    } catch (e) {
      console.warn('Could not save user session:', e);
    }

    setUser(sessionUser);
    return { success: true, user: sessionUser };
  };

  const signup = ({ name, email, password, confirmPassword, hostelId }) => {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const cleanConfirm = (confirmPassword || '').trim();

    if (!cleanName || !cleanEmail || !cleanPass || !cleanConfirm) {
      return { success: false, error: 'All parchment fields must be filled by decree of the Admiralty!' };
    }

    if (cleanName.length < 2) {
      return { success: false, error: 'Pirate name must be at least 2 characters long!' };
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: 'That email format would sink any carrier pigeon! Provide a valid email.' };
    }

    if (cleanPass.length < 6) {
      return { success: false, error: 'Secret password must be at least 6 characters to foil bilge rats!' };
    }

    if (cleanPass !== cleanConfirm) {
      return { success: false, error: 'Yer passwords don’t match, matey! Re-align yer compass.' };
    }

    const accounts = getAccounts();
    const emailExists = accounts.some(acc => acc.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, error: 'That email is already registered aboard the fleet! Board the ship instead.' };
    }

    const newAccount = {
      id: `crew_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      hostelId: hostelId || 'diamond',
      role: 'Recruit'
    };

    const updatedAccounts = [...accounts, newAccount];
    try {
      localStorage.setItem('pirate_crew_accounts', JSON.stringify(updatedAccounts));
      localStorage.setItem('pirate_crew_user', JSON.stringify(newAccount));
    } catch (e) {
      console.warn('Could not persist new account:', e);
    }

    setUser(newAccount);
    return { success: true, user: newAccount };
  };

  const logout = () => {
    try {
      localStorage.removeItem('pirate_crew_user');
    } catch (e) {
      console.warn('Could not clear session:', e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
