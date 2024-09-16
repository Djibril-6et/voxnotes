import React from "react";
import PropTypes from "prop-types";
import "./index.css";

function SouscriptionCard({ title, price, content, onClickFunction }) {
  return (
    <div className="card">
      <div className="card-top">
        <p className="card-date">{price}</p>
        <p className="card-excerpt">{content}</p>
      </div>
      <div className="card-bottom">
        <p className="card-summary">{title}</p>
        <button
          type="button"
          className="payment-button"
          onClick={onClickFunction}
        >
          Allez au paiement
        </button>
      </div>
    </div>
  );
}

// Validation des props avec PropTypes
SouscriptionCard.propTypes = {
  title: PropTypes.string.isRequired, // Validation que title est une chaîne de caractères obligatoire
  price: PropTypes.string.isRequired, // Validation que price est une chaîne de caractères obligatoire
  content: PropTypes.string.isRequired, // Validation que content est une chaîne de caractères obligatoire
  onClickFunction: PropTypes.func.isRequired, // Validation que onClickFunction est une fonction obligatoire
};

export default SouscriptionCard;
