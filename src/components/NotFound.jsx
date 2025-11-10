import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-text">Page Not Found</p>
      <button 
        onClick={() => navigate('/')}
        className="btn btn-primary"
      >
        Back To Home
      </button>
    </div>
  );
}

export default NotFound;
