import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./header.css";
import voxNotesLogo from "../../assets/voxNotes.png";

function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = () => {
    const session = localStorage.getItem("userConnected");
    setIsAuthenticated(!!session);
  };

  useEffect(() => {
    checkAuthStatus();

    const handleUserConnected = () => {
      checkAuthStatus();
    };

    const handleUserDisconnected = () => {
      checkAuthStatus();
    };

    window.addEventListener("userConnected", handleUserConnected);
    window.addEventListener("userDisconnected", handleUserDisconnected);

    return () => {
      window.removeEventListener("userConnected", handleUserConnected);
      window.removeEventListener("userDisconnected", handleUserDisconnected);
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    localStorage.removeItem("userConnected");

    const event = new Event("userDisconnected");
    window.dispatchEvent(event);

    navigate("/");
  };

  return (
    <header className="floating-header">
      <div className="logo">
        <Link to="/">
          <img src={voxNotesLogo} alt="Logo" />
        </Link>
      </div>

      <div className="nav-links-container">
        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/transcription">Transcription</Link>
              <Link to="/profile">Profil</Link>
              <Link to="/" onClick={handleLogout}>
                Déconnexion
              </Link>
            </>
          ) : (
            <>
              <Link to="/connexion">{t("banner.connexion")}</Link>
              <Link to="/about">{t("banner.about")}</Link>
            </>
          )}
        </nav>
      </div>

      <select
        className="language-selector"
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">En</option>
        <option value="fr">Fr</option>
        <option value="pt">Pt</option>
        <option value="es">Es</option>
      </select>
    </header>
  );
}

export default Header;
