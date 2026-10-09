import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SoundProvider } from './context/SoundContext';
import { ChaosProvider } from './context/ChaosContext';
import { TreasureProvider } from './context/TreasureContext';

import Navbar from './components/Navbar';
import ChaosHUD from './components/ChaosHUD';
import PollyChatbot from './components/PollyChatbot';
import RandomEvents from './components/RandomEvents';
import RealInfoModal from './components/RealInfoModal';
import Footer from './components/Footer';

import Home from './pages/Home';
import Hostels from './pages/Hostels';
import Tribute from './pages/Tribute';
import Admissions from './pages/Admissions';
import Departments from './pages/Departments';
import Captains from './pages/Captains';
import Placements from './pages/Placements';
import Secret from './pages/Secret';
import NotFound from './pages/NotFound';

export default function App() {
  const [realInfoOpen, setRealInfoOpen] = useState(false);

  return (
    <SoundProvider>
      <ChaosProvider>
        <TreasureProvider>
          <BrowserRouter>
            <div className="app-root">
              <Navbar onOpenRealInfo={() => setRealInfoOpen(true)} />
              <ChaosHUD />
              
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/hostels" element={<Hostels />} />
                  <Route path="/tribute" element={<Tribute />} />
                  <Route path="/admissions" element={<Admissions />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/captains" element={<Captains />} />
                  <Route path="/placements" element={<Placements />} />
                  <Route path="/secret" element={<Secret />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <PollyChatbot />
              <RandomEvents />
              <RealInfoModal isOpen={realInfoOpen} onClose={() => setRealInfoOpen(false)} />
              <Footer />
            </div>
          </BrowserRouter>
        </TreasureProvider>
      </ChaosProvider>
    </SoundProvider>
  );
}
