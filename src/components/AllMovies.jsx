import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_KEY = '9033c09f';
const API_URL = 'https://www.omdbapi.com/';

function AllMovies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMultiplePages();
  }, []);

  // Njibou bzaf d movies mn multiple pages ou genres
  const fetchMultiplePages = async () => {
    setLoading(true);
    setError('');
    
    try {
      const genres = ['action', 'comedy', 'love', 'war', 'hero'];
      let allMovies = [];
      
      // N7oullou kol genre bach njibou bzaf d results
      for (const genre of genres) {
        const response = await axios.get(
          `${API_URL}?s=${genre}&type=movie&apikey=${API_KEY}&page=1`
        );
        
        if (response.data.Response === 'True') {
          allMovies = [...allMovies, ...response.data.Search];
        }
      }
      
      // Nmshou duplicates (ila kaynin)
      const uniqueMovies = allMovies.filter((movie, index, self) =>
        index === self.findIndex((m) => m.imdbID === movie.imdbID)
      );
      
      setMovies(uniqueMovies);
    } catch (err) {
      setError('Erreur de connexion à l\'API');
    }
    
    setLoading(false);
  };

  // Fetch movies from search with multiple pages
  const fetchMovies = async (searchTerm = search) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      let allMovies = [];
      
      // Njibou awel 5 pages (50 movies)
      for (let page = 1; page <= 5; page++) {
        const response = await axios.get(
          `${API_URL}?s=${searchTerm}&type=movie&apikey=${API_KEY}&page=${page}`
        );
        
        if (response.data.Response === 'True') {
          allMovies = [...allMovies, ...response.data.Search];
        } else if (page === 1) {
          // Ila page 1 ma fihach results, error
          setError(response.data.Error);
          setMovies([]);
          setLoading(false);
          return;
        } else {
          // Ila page akhor ma fihach, wakha
          break;
        }
      }
      
      setMovies(allMovies);
    } catch (err) {
      setError('Erreur de connexion à l\'API');
    }
    
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      fetchMovies();
    }
  };

  const handleCategoryClick = async (term) => {
    setSearch(term);
    setLoading(true);
    setError('');
    
    try {
      let allMovies = [];
      
      // Njibou 5 pages mn had l category
      for (let page = 1; page <= 5; page++) {
        const response = await axios.get(
          `${API_URL}?s=${term}&type=movie&apikey=${API_KEY}&page=${page}`
        );
        
        if (response.data.Response === 'True') {
          allMovies = [...allMovies, ...response.data.Search];
        } else {
          break;
        }
      }
      
      setMovies(allMovies);
    } catch (err) {
      setError('Erreur de connexion à l\'API');
    }
    
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">All Movies</h1>
      
      <div className="movie-count">
        {movies.length > 0 && (
          <p className="count-badge">{movies.length} Movies Found</p>
        )}
      </div>

      {/* Categories Buttons */}
      <div className="categories">
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('action')}
        >
          Action
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('comedy')}
        >
          Comedy
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('horror')}
        >
          Horror
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('love')}
        >
          Romance
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('marvel')}
        >
          Marvel
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('disney')}
        >
          Disney
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('war')}
        >
          War
        </button>
        <button 
          className="category-btn"
          onClick={() => handleCategoryClick('star')}
        >
          Star Wars
        </button>
      </div>

      {/* Search Form */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a movie... (e.g. Avengers, Batman, Titanic)"
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
      
      {!loading && !error && movies.length === 0 && (
        <div className="message">No movies found. Try another term!</div>
      )}

      <div className="grid">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="card"
            onClick={() => navigate(`/details/${movie.imdbID}`)}
          >
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={movie.Title}
              className="card-image"
            />
            <div className="card-body">
              <h3 className="card-title">{movie.Title}</h3>
              <p className="card-year">📅 {movie.Year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllMovies;
