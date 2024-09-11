import React from 'react';
import './index.css'; 
import { useNavigate } from 'react-router-dom';

function SouscriptionCard({ title, price, content }) {
  // Appel du hook useNavigate dans le corps du composant
  const navigate = useNavigate();

  // Fonction pour gérer la redirection
  const handlePaymentClick = () => {
    navigate('/paiement'); // Redirection vers la page /paiement
  };

  return (
    <div className="card">
      <div className="card-top">
        <p className="card-date">{price}</p>
        <p className="card-excerpt">{content}</p>
      </div>
      <div className="card-bottom">
        <p className="card-summary">{title}</p>
        <button className="payment-button" onClick={handlePaymentClick}>
          Allez au paiement
        </button>
      </div>
    </div>
  );
}

export default SouscriptionCard;
