import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./header.css";
import voxNotesLogo from "../../assets/voxNotes.png";

function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction pour vérifier l'authentification à partir du localStorage
  const checkAuthStatus = () => {
    const session = localStorage.getItem("userConnected");
    setIsAuthenticated(!!session);
  };

  useEffect(() => {
    // Vérification initiale lors du chargement de la page
    checkAuthStatus();

    // Ajout d'un écouteur personnalisé pour détecter l'événement de connexion
    window.addEventListener("userConnected", checkAuthStatus);

    // Ajoute un écouteur pour surveiller les modifications du localStorage
    window.addEventListener("storage", checkAuthStatus);

    // Nettoie l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener("userConnected", checkAuthStatus);
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  // Fonction pour changer la langue
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("userConnected"); // Supprime la session du localStorage
    setIsAuthenticated(false);
    navigate("/"); // Redirige vers la page d'accueil après la déconnexion
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
