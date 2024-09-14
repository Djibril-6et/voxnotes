import React from "react";
import "./index.css";

function TranscriptionCard({ title, date, content }) {
  return (
    <div className="card">
      <div className="card-top">
        <p className="card-date">{date}</p>
        <p className="card-excerpt">{content}</p>
      </div>
      <div className="card-bottom">
        <p className="card-summary">{title}</p>
      </div>
    </div>
  );
}

export default TranscriptionCard;
