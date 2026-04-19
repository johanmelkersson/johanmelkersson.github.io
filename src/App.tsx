import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import Specialization from './pages/Specialization';
import About from './pages/About';
import { SOCIAL_LINKS } from './data/constants';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <nav className="navbar">
            <NavLink to="/" className="nav-logo">Johan Melkersson</NavLink>
            <div className="nav-links">
              <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
              <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>Projects</NavLink>
              <NavLink to="/specialization" className={({ isActive }) => isActive ? 'active' : ''}>Specialization</NavLink>
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
