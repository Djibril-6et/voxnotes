import React from "react";
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
        <button className="payment-button" onClick={onClickFunction}>
          Allez au paiement
        </button>
      </div>
    </div>
  );
}

export default SouscriptionCard;
