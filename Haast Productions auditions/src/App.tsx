
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuditionPage from './pages/AuditionPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import Navbar from './components/Navbar'; // Assuming reusable Navbar
import Footer from './components/Footer'; // Assuming reusable Footer
import './index.css';
import './audition-system.css';

function App() {
  return (
    <Router>
      <div className="bg-haast-black min-h-screen text-haast-text font-sans selection:bg-haast-accent selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<AuditionPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
