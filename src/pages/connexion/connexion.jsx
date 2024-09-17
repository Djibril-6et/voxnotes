import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./connexion.css"; // Assurez-vous que les styles sont bien appliqués
import usersServices from "../../services/users.services";

function Connexion() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
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

    const { email, password } = user;
    if (!email || !password) {
      // eslint-disable-next-line
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // eslint-disable-next-line
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    usersServices
      .loginUser(user)
      .then((userData) => {
        // eslint-disable-next-line
        console.log("LOGGED IN", userData);
        localStorage.setItem("userConnected", JSON.stringify(userData));

        // Déclencher un événement personnalisé "userConnected"
        const event = new Event("userConnected");
        window.dispatchEvent(event);

        navigate("/profile");
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.error("Error:", err);
        // eslint-disable-next-line
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

  const handleInscription = () => {
    navigate("/inscription");
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
      <button type="button" className="connexion-button" onClick={handleLogin}>
        Me connecter
      </button>

      {/* Boutons pour l'authentification avec Google, GitHub et Discord */}
      <button
        type="button"
        className="connexion-button google-auth"
        onClick={handleGoogleAuth}
      >
        Connexion avec Google
      </button>
      <button
        type="button"
        className="connexion-button github-auth"
        onClick={handleGithubAuth}
      >
        Connexion avec GitHub
      </button>
      <button
        type="button"
        className="connexion-button discord-auth"
        onClick={handleDiscordAuth}
      >
        Connexion avec Discord
      </button>

      {/* Bouton pour rediriger vers la page d'inscription */}
      <button
        type="button"
        className="connexion-button inscription-btn"
        onClick={handleInscription}
      >
        Pas encore inscrit ? Inscription
      </button>
    </div>
  );
}

export default Connexion;
