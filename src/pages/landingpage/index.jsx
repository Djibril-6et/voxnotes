import React from "react";
import LandingBanner from "../../components/landingBanner";
import "./index.css";
import voicetotextLogo from "../../assets/voicetotext.png";

function Home() {
  return (
    <div>
      <LandingBanner />
      <section className="presentation-section">
        <div className="presentation-text">
          <h2>Découvrez VoxNotes</h2>
          <p>
            VoxNotes est une application innovante qui vous permet de
            transformer vos discours en texte en un clin d'œil. Que vous soyez
            un professionnel en réunion, un étudiant en cours ou un créateur de
            contenu, VoxNotes vous aide à capturer chaque mot avec précision.
            Grâce à notre technologie de reconnaissance vocale avancée, vous
            pouvez facilement créer des transcriptions claires et précises,
            prêtes à être partagées ou stockées pour référence future.
          </p>
        </div>
        <div className="presentation-image">
          <img src={voicetotextLogo} alt="Présentation de VoxNotes" />
        </div>
      </section>
      <section className="about-section">
        <h2>À propos de nous</h2>
        <p>
          Chez VoxNotes, nous sommes passionnés par l'idée de simplifier la
          communication et de rendre les informations accessibles à tous. Fondée
          par une équipe de développeurs et d'experts en technologie vocale,
          notre mission est de fournir un outil fiable et facile à utiliser pour
          la transcription de discours. Nous croyons que la technologie peut
          aider à briser les barrières linguistiques et améliorer la
          collaboration, c'est pourquoi nous nous engageons à offrir le meilleur
          service possible à nos utilisateurs.
        </p>
      </section>
    </div>
  );
}

export default Home;
