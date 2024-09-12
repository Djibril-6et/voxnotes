import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import usersServices from '../../services/users.services';

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

  const handleLogin = (e) => {
    e.preventDefault();
  
    // Check if empty
    const { email, password } = user;
    if (!email || !password) {
      alert('Veuillez remplir tous les champs');
      return;
    }
  
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Veuillez entrer une adresse email valide');
      return;
    }
  
    usersServices.loginUser(user)
    .then(userData => {
      console.log("LOGGED IN", userData);
      localStorage.setItem('userConnected', JSON.stringify(userData));
      navigate('/profile');
    })
    .catch(err => {
      console.error('Error:', err);
      alert(err.message);
    });
  };

  const oauthUrl = process.env.REACT_APP_OAUTH_SERVICE_URL;
  
  const handleGoogleAuth = () => {
    window.location.href = `${oauthUrl}/auth/google`;
  };
  const handleGithubAuth = () => {
    window.location.href = `${oauthUrl}/auth/github`;
  };
  const handleDiscordAuth = () => {
    window.location.href = `${oauthUrl}/auth/discord`;
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

      {/* Boutons pour l'authentification avec Google, GitHub et Discord */}
      <button className="connexion-button google-auth" onClick={handleGoogleAuth}>
        Connexion avec Google
      </button>
      <button className="connexion-button github-auth" onClick={handleGithubAuth}>
        Connexion avec GitHub
      </button>
      <button className="connexion-button discord-auth" onClick={handleDiscordAuth}>
        Connexion avec Discord
      </button>
    </div>
  );
}

export default Connexion;