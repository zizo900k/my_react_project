import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_KEY = '9033c09f';
const API_URL = 'https://www.omdbapi.com/';

function Details() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(
        `${API_URL}?i=${id}&apikey=${API_KEY}`
      );
      
      if (response.data.Response === 'True') {
        setDetails(response.data);
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      setError('Erreur de connexion à l\'API');
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="details-container">
        <div className="message">Loading the details...</div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="error-message">{error || 'Aucune donnée disponible'}</div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-content">
        <div className="details-poster">
          <img
            src={details.Poster !== 'N/A' ? details.Poster : 'https://via.placeholder.com/400x600?text=No+Image'}
            alt={details.Title}
            className="details-image"
          />
        </div>

        <div className="details-info">
          <h1>{details.Title}</h1>

          <div className="details-meta">
            <span className="meta-item">📅 {details.Year}</span>
            <span className="meta-item">⏱️ {details.Runtime}</span>
            <span className="rating">⭐ {details.imdbRating}/10</span>
          </div>

          <div className="info-section">
            <h3>Synopsis</h3>
            <p>{details.Plot}</p>
          </div>

          <div className="info-section">
            <h3>Genres</h3>
            <div className="genres">
              {details.Genre.split(', ').map((genre, index) => (
                <span key={index} className="genre-badge">{genre}</span>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h3>Réalisateur</h3>
            <p>{details.Director}</p>
          </div>

          <div className="info-section">
            <h3>Acteurs</h3>
            <p>{details.Actors}</p>
          </div>

          <div className="info-section">
            <h3>Box Office</h3>
            <p>{details.BoxOffice || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
