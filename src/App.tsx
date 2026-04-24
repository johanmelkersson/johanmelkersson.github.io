import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import Specialization from './pages/Specialization';
import About from './pages/About';
import ScrollToTop from './components/ScrollToTop';
import Terminal from './components/Terminal';
import { SOCIAL_LINKS } from './data/constants';
import './App.css';

function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <ScrollToTop />
        <Terminal forceOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
        <header>
          <nav className="navbar">
            <NavLink to="/" className="nav-logo">Johan Melkersson</NavLink>
            <div className="nav-links">
              <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
              <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>Projects</NavLink>
              <NavLink to="/specialization" className={({ isActive }) => isActive ? 'active' : ''}>AI & Behavior</NavLink>
            </div>
            <div className="nav-social">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                  <Icon />
                </a>
              ))}
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/specialization" element={<Specialization />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <div className="footer-inner">
            <span className="footer-name">Johan Melkersson</span>
            <button className="footer-terminal-btn" onClick={() => setTerminalOpen(true)} title="Open terminal (§)">
              &gt;_
            </button>
            <div className="footer-social">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                  <Icon /> {label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
