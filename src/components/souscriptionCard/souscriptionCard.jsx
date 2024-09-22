import React from "react";
import PropTypes from "prop-types";
import "./souscriptionCard.css";

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

SouscriptionCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onClickFunction: PropTypes.func.isRequired,
};

export default SouscriptionCard;
