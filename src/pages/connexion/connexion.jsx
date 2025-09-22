import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usersServices from "../../services/users.services";
import googleLogo from "../../assets/googleLogo.png";
import githubLogo from "../../assets/githubLogo.png";
import discordLogo from "../../assets/discordLogo.png";
import "./connexion.css";

function Connexion() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState(null);

  // Fonction pour afficher une notification avec disparition automatique
  const showNotification = useCallback((type, message, duration = 5000) => {
    setNotification({ type, message });

    // Auto-disparition après la durée spécifiée
    setTimeout(() => {
      setNotification(null);
    }, duration);
  }, []);

  // Gestion des erreurs OAuth au chargement du composant
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get("error");
    const email = urlParams.get("email");

    if (error) {
      let message = "";

      switch (error) {
        case "email_exists":
          message = `Un compte existe déjà avec l'email ${email || "fourni"}.`;
          break;
        case "username_exists":
          message = "Un compte existe déjà avec cet email.";
          break;
        case "auth_error":
          message = "Erreur d'authentification. Veuillez réessayer.";
          break;
        case "auth_failed":
          message = "Échec de l'authentification. Veuillez réessayer.";
          break;
        case "user_not_found":
          message =
            "Utilisateur non trouvé après l'authentification. Veuillez réessayer.";
          break;
        case "callback_error":
          message =
            "Erreur lors du processus d'authentification. Veuillez réessayer.";
          break;
        case "login_error":
          message = "Erreur lors de la connexion. Veuillez réessayer.";
          break;
        default:
          message =
            "Une erreur inconnue s'est produite lors de l'authentification.";
      }

      showNotification("error", message, 8000);

      // Nettoyer l'URL après avoir affiché l'erreur
      navigate("/connexion", { replace: true });
    }
  }, [location, navigate, showNotification]);

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
      showNotification("error", "Veuillez remplir tous les champs.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification("error", "Veuillez entrer une adresse email valide.");
      return;
    }

    usersServices
      .loginUser(user)
      .then((userData) => {
        localStorage.setItem("userConnected", JSON.stringify(userData));

        const event = new Event("userConnected");
        window.dispatchEvent(event);

        showNotification(
          "success",
          "Connexion réussie ! Redirection en cours...",
          2000
        );

        setTimeout(() => navigate("/transcription"), 1000);
      })
      .catch((err) => {
        showNotification("error", err.message);
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

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="connexion-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          <button
            type="button"
            onClick={closeNotification}
            className="notification-close"
            aria-label="Fermer la notification"
          >
            ×
          </button>
        </div>
      )}

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
