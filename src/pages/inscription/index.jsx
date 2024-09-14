import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usersServices from "../../services/users.services"; // Adjust the import path if necessary

function Inscription() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, email, password } = user;
    if (!username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await usersServices.registerUser(user);
      alert("User registered successfully");
      navigate("/connexion"); // Redirect to login page after successful registration
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
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
      <h2 className="connexion-title">Inscription</h2>

      <form onSubmit={handleRegister} className="connexion-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
          className="connexion-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          className="connexion-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          className="connexion-input"
        />
        <button type="submit" className="connexion-button">
          Register
        </button>
      </form>

      {/* Boutons pour l'authentification avec Google, GitHub et Discord */}
      <button
        className="connexion-button google-auth"
        onClick={handleGoogleAuth}
      >
        S'inscrire avec Google
      </button>
      <button
        className="connexion-button github-auth"
        onClick={handleGithubAuth}
      >
        S'inscrire avec GitHub
      </button>
      <button
        className="connexion-button discord-auth"
        onClick={handleDiscordAuth}
      >
        S'inscrire avec Discord
      </button>
    </div>
  );
}

export default Inscription;
