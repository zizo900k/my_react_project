import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_KEY = '9033c09f';
const API_URL = 'https://www.omdbapi.com/';

function AllSeries() {
  const [series, setSeries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMultiplePages();
  }, []);

  // Njibou bzaf d series mn multiple genres
  const fetchMultiplePages = async () => {
    setLoading(true);
    setError('');
    
    try {
      const genres = ['game', 'house', 'office', 'lost', 'friends'];
      let allSeries = [];
      
      for (const genre of genres) {
        const response = await axios.get(
          `${API_URL}?s=${genre}&type=series&apikey=${API_KEY}&page=1`
        );
        
        if (response.data.Response === 'True') {
          allSeries = [...allSeries, ...response.data.Search];
        }
      }
      
      // Nmshou duplicates
      const uniqueSeries = allSeries.filter((show, index, self) =>
        index === self.findIndex((s) => s.imdbID === show.imdbID)
      );
      
      setSeries(uniqueSeries);
    } catch (err) {
      setError('Erreur de connexion à l\'API');
    }
    
    setLoading(false);
  };

  const fetchSeries = async (searchTerm = search) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      let allSeries = [];
      
      // Njibou 5 pages (50 series)
      for (let page = 1; page <= 5; page++) {
        const response = await axios.get(
          `${API_URL}?s=${searchTerm}&type=series&apikey=${API_KEY}&page=${page}`
        );
        
        if (response.data.Response === 'True') {
          allSeries = [...allSeries, ...response.data.Search];
        } else if (page === 1) {
          setError(response.data.Error);
          setSeries([]);
          setLoading(false);
          return;
        } else {
          break;
        }
      }
      
      setSeries(allSeries);
    } catch (err) {
      setError('Erreur de connexion à l\'API');
    }
    
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      fetchSeries();
    }
  };

  const handleCategoryClick = async (term) => {
    setSearch(term);
    setLoading(true);
    setError('');
    
    try {
      let allSeries = [];
      
      for (let page = 1; page <= 5; page++) {
        const response = await axios.get(
          `${API_URL}?s=${term}&type=series&apikey=${API_KEY}&page=${page}`
        );
        
        if (response.data.Response === 'True') {
          allSeries = [...allSeries, ...response.data.Search];
        } else {
          break;
        }
      }
      
      setSeries(allSeries);
    } catch (err) {
      setError('Erreur de connexion à l\'API');
    }
    
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">All Series</h1>
      
      <div className="movie-count">
        {series.length > 0 && (
          <p className="count-badge">{series.length} Series Found</p>
        )}
      </div>

      {/* Categories Buttons */}
      <div className="categories">
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('friends')}
        >
        Friends
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('game')}
        >
          Game
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('house')}
        >
          House
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('office')}
        >
          Office
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('breaking')}
        >
          Breaking
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('lost')}
        >
          Lost
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('doctor')}
        >
          Doctor
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('walking')}
        >
          Walking Dead
        </button>
      </div>

      {/* Search Form */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a series..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {loading && (
        <div className="message">
          Loading multiple pages... Please wait
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      {!loading && !error && series.length === 0 && (
        <div className="message">No serie found. Try another term!</div>
      )}

      <div className="grid">
        {series.map((s) => (
          <div
            key={s.imdbID}
            className="card"
            onClick={() => navigate(`/details/${s.imdbID}`)}
          >
            <img
              src={s.Poster !== 'N/A' ? s.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={s.Title}
              className="card-image"
            />
            <div className="card-body">
              <h3 className="card-title">{s.Title}</h3>
              <p className="card-year">📅 {s.Year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllSeries;
