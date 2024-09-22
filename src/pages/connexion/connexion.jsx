import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usersServices from "../../services/users.services";
import googleLogo from "../../assets/googleLogo.png";
import githubLogo from "../../assets/githubLogo.png";
import discordLogo from "../../assets/discordLogo.png";
import "./connexion.css";

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
        localStorage.setItem("userConnected", JSON.stringify(userData));

        const event = new Event("userConnected");
        window.dispatchEvent(event);

        navigate("/transcription");
      })
      .catch((err) => {
        // eslint-disable-next-line
        alert(err.message);
      });
  };

  // eslint-disable-next-line no-undef
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

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  return (
    <div className="connexion-container">
      <h2 className="connexion-title">Connexion</h2>

      <div className="connexion-form-container">
        <form className="connexion-form">
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
            placeholder="Mot de passe"
            value={user.password}
            onChange={handleChange}
            className="connexion-input"
          />
          <button
            type="button"
            className="connexion-button"
            onClick={handleLogin}
          >
            Me connecter
          </button>
        </form>
        <button
          type="button"
          className="forgot-password-link"
          onClick={handleForgotPassword}
        >
          Mot de passe oublié ?
        </button>

        <hr />
        <button
          type="button"
          className="connexion-button oauth-button"
          onClick={handleGoogleAuth}
        >
          <img src={googleLogo} alt="Google" className="oauth-logo" />
          Connexion avec Google
        </button>

        <button
          type="button"
          className="connexion-button oauth-button"
          onClick={handleGithubAuth}
        >
          <img src={githubLogo} alt="GitHub" className="oauth-logo" />
          Connexion avec GitHub
        </button>

        <button
          type="button"
          className="connexion-button oauth-button"
          onClick={handleDiscordAuth}
        >
          <img src={discordLogo} alt="Discord" className="oauth-logo" />
          Connexion avec Discord
        </button>

        <p className="inscription-text">
          Pas encore inscrit ?{" "}
          <span
            className="inscription-link"
            role="button"
            tabIndex={0}
            onClick={handleInscription}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleInscription();
              }
            }}
          >
            Inscription
          </span>
        </p>
      </div>
    </div>
  );
}

export default Connexion;
