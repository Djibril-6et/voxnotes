import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import usersServices from "../../services/users.services";
import googleLogo from "../../assets/googleLogo.png";
import githubLogo from "../../assets/githubLogo.png";
import discordLogo from "../../assets/discordLogo.png";
import "./inscription.css";

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
      // eslint-disable-next-line
      alert("Please fill in all fields");
      return;
    }

    try {
      await usersServices.registerUser(user);
      // eslint-disable-next-line
      alert("User registered successfully");
      navigate("/connexion");
    } catch (err) {
      // eslint-disable-next-line
      console.error("Error:", err);
      // eslint-disable-next-line
      alert(err.message);
    }
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

  return (
    <div className="connexion-container">
      <h2 className="connexion-title">Inscription</h2>

      <div className="connexion-form-container">
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

        <hr />

        <button
          type="button"
          className="connexion-button oauth-button"
          onClick={handleGoogleAuth}
        >
          <img src={googleLogo} alt="Google logo" className="oauth-logo" />
          S&apos;inscrire avec Google
        </button>
        <button
          type="button"
          className="connexion-button oauth-button"
          onClick={handleGithubAuth}
        >
          <img src={githubLogo} alt="GitHub logo" className="oauth-logo" />
          S&apos;inscrire avec GitHub
        </button>
        <button
          type="button"
          className="connexion-button oauth-button"
          onClick={handleDiscordAuth}
        >
          <img src={discordLogo} alt="Discord logo" className="oauth-logo" />
          S&apos;inscrire avec Discord
        </button>
        <p className="inscription-text">
          Vous avez un compte ?{" "}
          <Link to="/connexion" className="inscription-link">
            Connexion
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Inscription;
