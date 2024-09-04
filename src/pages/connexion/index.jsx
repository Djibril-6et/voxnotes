import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';  // Importer le fichier CSS

function Connexion({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);  // Met à jour l'état d'authentification
    navigate('/');  // Redirige vers la page d'accueil
  };

  return (
    <div className="connexion-container">
      <h2 className="connexion-title">Connexion</h2>
      <button className="connexion-button" onClick={handleLogin}>
        Me connecter
      </button>
    </div>
  );
}

export default Connexion;
