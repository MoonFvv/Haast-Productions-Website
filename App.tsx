import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GearPage from './pages/GearPage';
import AuditionPage from './pages/AuditionPage';
import TeamPage from './pages/TeamPage';
import ShortFilm from './pages/ShortFilm';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import Footer from './components/Footer';
import { useLocation } from 'react-router-dom';
import './audition-system.css';


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isFullScreenRoute = ['/gear', '/team'].includes(location.pathname);

  useEffect(() => {
    // Allow scrolling on home page, disable on other pages that need it
    if (location.pathname === '/') {
      document.body.style.overflow = 'auto';

      if (location.hash) {
        const id = location.hash.replace('#', '');
        // Delay slightly so the DOM can mount
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 50);
      } else {
        // No hash — ensure we're at the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location]);

  // Admin routes — no navbar/footer
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Routes>
    );
  }

  return (
    <div className={`min-h-screen text-haast-text font-sans selection:bg-haast-accent selection:text-white ${location.pathname === '/' ? '' : 'bg-haast-black'}`}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gear" element={<GearPage />} />
        <Route path="/audition" element={<AuditionPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/shortfilm" element={<ShortFilm />} />
      </Routes>
      {!isFullScreenRoute && <Footer />}
    </div>
  );
}

export default App;