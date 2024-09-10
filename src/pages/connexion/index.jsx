import React from "react"; // Remplacement des guillemets simples par des guillemets doubles
import { useNavigate } from "react-router-dom";
import "./index.css"; // Correction de la syntaxe des guillemets

import PropTypes from "prop-types"; // Importation de PropTypes pour valider les props

function Connexion({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true); // Met à jour l'état d'authentification
    navigate("/"); // Redirige vers la page d'accueil
  };

  return (
    <div className="connexion-container">
      <h2 className="connexion-title">Connexion</h2>
      <button className="connexion-button" onClick={handleLogin}>
        Me connecter
      </button>
    </div>
  );
}

// Validation des props avec PropTypes
Connexion.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired, // Validation de setIsAuthenticated comme fonction requise
};

export default Connexion;
