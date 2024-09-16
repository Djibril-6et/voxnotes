import React from "react";
import PropTypes from "prop-types";
import "./transcriptionCard.css";

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

// Validation des props avec PropTypes
TranscriptionCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default TranscriptionCard;
