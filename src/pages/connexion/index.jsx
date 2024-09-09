import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';  // Importer le fichier CSS

function Connexion({ setIsAuthenticated }) {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleLogin = () => {
    console.log(user);
  };

  return (
    <div className="connexion-container">
      <h2 className="connexion-title">Connexion</h2>
      
      {/* Champ pour l'email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
        className="connexion-input"
      />
      
      {/* Champ pour le mot de passe */}
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        value={user.password}
        onChange={handleChange}
        className="connexion-input"
      />
      
      {/* Bouton pour soumettre le formulaire de connexion */}
      <button className="connexion-button" onClick={handleLogin}>
        Me connecter
      </button>
    </div>
  );
}

export default Connexion;