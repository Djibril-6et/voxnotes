import React from "react";
import { useNavigate } from "react-router-dom"; // Importez useNavigate pour la redirection
import "./banner.css";

function Banner() {
  const navigate = useNavigate();

  // Fonction qui gère le clic sur le bouton
  const handleTryClick = () => {
    const userSession = localStorage.getItem("userConnected");

    if (userSession) {
      // Si l'utilisateur est connecté, redirigez-le vers la page de transcription
      navigate("/transcription");
    } else {
      // Sinon, redirigez-le vers la page de connexion
      navigate("/connexion");
    }
  };

  return (
    <div className="landing-banner">
      <div className="banner-content">
        <h1 className="banner-sub-title">
          Bienvenue <br /> sur
        </h1>
        <h1 className="banner-title">VoxNotes !</h1>

        <div className="banner-description">
          <h2>Découvrez VoxNotes</h2>
          <p>
            VoxNotes est une application innovante qui vous permet de
            transformer vos discours en texte en un clin d&apos;œil. Que vous
            soyez un professionnel en réunion, un étudiant en cours ou un
            créateur de contenu, VoxNotes vous aide à capturer chaque mot avec
            précision. Grâce à notre technologie de reconnaissance vocale
            avancée, vous pouvez facilement créer des transcriptions claires et
            précises, prêtes à être partagées ou stockées pour référence future.
          </p>
        </div>

        <div className="banner-buttons">
          <button
            type="button"
            className="banner-btn learn-more"
            onClick={handleTryClick}
          >
            Je veux Essayer !
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
