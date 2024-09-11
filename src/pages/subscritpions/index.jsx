import React from 'react';
import './index.css';
import SouscriptionCard from '../../components/souscriptionCard';

function Souscriptions() {
  return (
    <div className="subscription-page">
      <h1>Abonnements :</h1>
      
      <div className="subscription-section">
        <h2>Personnel</h2>
        <div className="subscription-cards">
          <SouscriptionCard
            title="Abonnement Mensuel"
            price="15€ / mois"
            content={`- Transcription illimitée \n- Téléchargement de transcription illimité`}
          />
          <SouscriptionCard
            title="Paiement Unique"
            price="300€"
            content={`- Transcription illimitée \n- Téléchargement de transcription illimité`}
          />
        </div>
      </div>

      <div className="subscription-section">
        <h2>École/Entreprise</h2>
        <div className="subscription-cards">
          <SouscriptionCard
            title="Paiement Unique"
            date="3500€ / An"
            content={`- Transcription illimitée \n- Téléchargement de transcription illimité \n- Utilisateurs illimités`}
          />
        </div>
      </div>
    </div>
  );
}

export default Souscriptions;
