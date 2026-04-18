import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import Specialization from './pages/Specialization';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <nav className="navbar">
            <Link to="/">Start</Link>
            <Link to="/projects">Projekt</Link>
            <Link to="/specialization">Specialisering</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/specialization" element={<Specialization />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;