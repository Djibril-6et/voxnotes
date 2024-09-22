import React, { useState } from "react";
import "./subscriptions.css";
import SouscriptionCard from "../../components/souscriptionCard/souscriptionCard";

function Souscriptions() {
  // eslint-disable-next-line no-undef
  const PAYMENT_URL_BASE = process.env.REACT_APP_PAYMENT_URL;
  const [errorMessage, setErrorMessage] = useState("");

  const goToPaiement = (e, subject, type, price) => {
    e.preventDefault();

    const userConnected = JSON.parse(localStorage.getItem("userConnected"));
    // eslint-disable-next-line no-underscore-dangle
    const userId = userConnected?.user?._id;

    const requestBody = {
      price: price * 100,
      userId,
    };

    let endpoint = "";
    if (type === "PAI") endpoint = `/create-checkout-session/${subject}`;
    else if (type === "SUB") endpoint = `/create-subscription/${subject}`;

    fetch(`${PAYMENT_URL_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location.href = url;
      })
      .catch((error) => {
        setErrorMessage(error.error || "An error occurred");
      });
  };

  return (
    <div className="subscription-page">
      <h1>Abonnements :</h1>

      {errorMessage && <p>{errorMessage}</p>}

      <div className="subscription-section">
        <h2>Personnel</h2>
        <div className="subscription-cards">
          <SouscriptionCard
            title="Abonnement Mensuel"
            price="15€ / mois"
            content={`- Transcription illimitée \n- Téléchargement de transcription illimité`}
            onClickFunction={(e) =>
              goToPaiement(e, "Abonnement Mensuel VoxNote", "SUB", 15)
            }
          />
          <SouscriptionCard
            title="Paiement Unique"
            price="300€"
            content={`- Transcription illimitée \n- Téléchargement de transcription illimité`}
            onClickFunction={(e) =>
              goToPaiement(e, "Paiement Unique VoxNote", "PAI", 300)
            }
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
            onClickFunction={(e) =>
              goToPaiement(e, "Paiement Unique Entreprise", "PAI", 3500)
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Souscriptions;
