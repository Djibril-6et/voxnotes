import React from 'react';
import './index.css';
import SouscriptionCard from '../../components/souscriptionCard';

function Souscriptions() {

  const goToPaiement = (e, subject, type, price) => {
    e.preventDefault();
  
    const userConnected = JSON.parse(localStorage.getItem('userConnected'));
    const userId = userConnected?.user?._id;
  
    const requestBody = {
      price: price * 100, // Convertir en centimes
      userId: userId,     // Inclure userId
    };
  
    console.log("Request body:", requestBody); // Ajoutez le console.log ici
  
    let endpoint = "";
    if (type === "PAI") endpoint = `/create-checkout-session/${subject}`;
    else if (type === "SUB") endpoint = `/create-subscription/${subject}`;
  
    fetch(`http://localhost:8080${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody)
    })
    .then(res => {
      if (res.ok) return res.json();
      return res.json().then(json => Promise.reject(json));
    })
    .then(({ url }) => {
      window.location.href = url;
    })
    .catch(e => {
      console.error(e.error);
    });
  };
  
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
            onClickFunction={e => goToPaiement(e, 'Abonnement Mensuel VoxNote', 'SUB', 15)}
          />
          <SouscriptionCard
            title="Paiement Unique"
            price="300€"
            content={`- Transcription illimitée \n- Téléchargement de transcription illimité`}
            onClickFunction={e => goToPaiement(e, 'Paiement Unique VoxNote', 'PAI', 300)}
          />
        </div>
      </div>

      <div className="subscription-section">
        <h2>École/Entreprise</h2>
        <div className="subscription-cards">
          <SouscriptionCard
            title="Paiement Unique"
            price="3500€ / An"
            content={`- Transcription illimitée \n- Téléchargement de transcription illimité \n- Utilisateurs illimités`}
            onClickFunction={e => goToPaiement(e, 'Paiement Unique Entreprise', 'PAI', 3500)}
          />
        </div>
      </div>
    </div>
  );
}

export default Souscriptions;
