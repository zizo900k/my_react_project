import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">
          Welcome to <span className="brand-highlight">Zizo TV</span> 
        </h1>
        <p className="home-subtitle">
          Discover thousands of movies and series in streaming
        </p>
        <div className="home-buttons">
          <Link to="/movies" className="btn btn-primary">
            Explore Movies
          </Link>
          <Link to="/series" className="btn btn-secondary">
            Explore Series
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
