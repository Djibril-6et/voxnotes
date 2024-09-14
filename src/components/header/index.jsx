import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './index.css';
import voxNotesLogo from "../../assets/voxNotes.png"

function Header({ isAuthenticated }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="floating-header">
      <div className="logo">
        <img src={voxNotesLogo} alt="Logo" />
      </div>
      
      <div className="nav-links-container">
        <nav className="nav-links">
          <Link to="/">{t('banner.home')}</Link>
          {!isAuthenticated && <Link to="/connexion">{t('banner.connexion')}</Link>}
          {isAuthenticated && <Link to="/transcription">{t('banner.transcription')}</Link>}
          <Link to="/about">{t('banner.about')}</Link>
        </nav>
      </div>

      <select className="language-selector" onChange={(e) => changeLanguage(e.target.value)}>
        <option value="en">En</option>
        <option value="fr">Fr</option>
        <option value="pt">Pt</option>
        <option value="es">Es</option>
      </select>
    </header>
  );
}

export default Header;
