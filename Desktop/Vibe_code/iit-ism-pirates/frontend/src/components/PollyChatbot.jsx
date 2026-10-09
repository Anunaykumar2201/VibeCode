import React, { useState, useRef, useEffect } from 'react';
import { useSound } from '../context/SoundContext';

export default function PollyChatbot() {
  const { play } = useSound();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'SQUAWK! Ahoy scallywag! I am Captain Polly. Ask me about campus places (library, canteen, health centre), hostels, fees, or exam secrets!' }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const toggleOpen = () => {
    setOpen(prev => {
      if (!prev) play('parrot');
      return !prev;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply = getPollyResponse(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: reply }]);
      play('parrot');
    }, 450);
  };

  const getPollyResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('library') || q.includes('book') || q.includes('study')) {
      return 'SQUAWK! The Central Library (Sacred Archives) is open 09:00 - 23:45! AC is frosty enough to freeze your grog. Maintain absolute silence or walk the plank!';
    }
    if (q.includes('food') || q.includes('canteen') || q.includes('eat') || q.includes('maggi') || q.includes('chai')) {
      return 'SQUAWK! Central Canteen serves grub 07:00 - 23:30. For midnight samosas and cheese rolls, raid Jasper Night Canteen until 02:30 AM!';
    }
    if (q.includes('health') || q.includes('doctor') || q.includes('medicine') || q.includes('sick')) {
      return 'SQUAWK! Campus Health Centre is open 24 HOURS! Perfect for bandaging cannonball wounds and emergency Paracetamol!';
    }
    if (q.includes('wifi') || q.includes('internet') || q.includes('lan')) {
      return 'SQUAWK! Wifi is powered by ethereal sea spirits! If connection drops, a Kraken is chewing on the yellow fiber cable in Jasper!';
    }
    if (q.includes('hostel') || q.includes('amber') || q.includes('diamond') || q.includes('aquamarine') || q.includes('jasper')) {
      return 'SQUAWK! We have 11 War Galleons! Diamond is the oldest (1926), and Aquamarine is a 13-storey sky dreadnought! Check Hostel Wars to raid them!';
    }
    if (q.includes('exam') || q.includes('marks') || q.includes('cgpa') || q.includes('study')) {
      return 'SQUAWK! Mid-sem and End-sem trials by fire await in GJLT! YouTube playlists at 2.5x speed are the only known counter-spell!';
    }
    if (q.includes('fee') || q.includes('tribute') || q.includes('money') || q.includes('pay')) {
      return 'SQUAWK! Head to the Tribute page! But beware—the Pay button runs away faster than a runaway pirate ketch!';
    }
    if (q.includes('monkey')) {
      return 'SQUAWK! Dhanbad monkeys hold black belts in corridor combat! Always pay 1 Parle-G biscuit tribute or lose your lunch!';
    }
    if (q.includes('secret') || q.includes('coin') || q.includes('treasure')) {
      return 'SQUAWK! Look closely at every deck (page)! 5 glittering gold doubloons are hidden. Collect them all to unlock the Captain\'s Secret Vault!';
    }
    return 'SQUAWK! By Blackbeard\'s beard! I know all secrets of ISM Dhanbad—ask me about hostels, library hours, canteens, health centre, or treasure!';
  };

  return (
    <div className="polly-widget">
      <div className="polly-bubble" onClick={toggleOpen} title="Chat with Captain Polly!">
        <span className="polly-avatar">🦜</span>
        <span className="polly-badge">Ask Polly</span>
      </div>

      <div className={`polly-chatbox ${open ? 'open' : ''}`}>
        <div className="polly-chat-header">
          <div className="polly-title">
            <span>🦜 Captain Polly AI</span>
            <small>Keeper of Campus Secrets</small>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', cursor: 'pointer' }}>✖</button>
        </div>

        <div className="polly-messages">
          {messages.map(m => (
            <div key={m.id} className={`polly-msg ${m.sender}`}>
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="polly-input-row" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ask about library, food, wifi..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="polly-send-btn">Send</button>
        </form>
      </div>
    </div>
  );
}
