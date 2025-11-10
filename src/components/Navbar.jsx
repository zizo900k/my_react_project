import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon"></span>
          <span className="logo-text">Zizo TV</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <span className="nav-icon"></span>
            Home
          </Link>
          <Link to="/movies" className="nav-link">
            <span className="nav-icon"></span>
            Movies
          </Link>
          <Link to="/series" className="nav-link">
            <span className="nav-icon"></span>
            Series
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
