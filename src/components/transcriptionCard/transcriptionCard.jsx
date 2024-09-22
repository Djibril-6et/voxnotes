import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./transcriptionCard.css";

function TranscriptionCard({ title, date, content, id }) {
  const navigate = useNavigate();

  const handleViewTranscription = () => {
    navigate(`/transcriptiondetail/${id}`);
  };

  return (
    <div className="card">
      <div className="card-top">
        <p className="card-date">{date}</p>
        <p className="card-excerpt">{content}</p>
      </div>
      <div className="card-bottom">
        <p className="card-summary">{title}</p>
        <button
          type="button"
          className="view-transcription-btn"
          onClick={handleViewTranscription}
        >
          Voir la transcription
        </button>
      </div>
    </div>
  );
}

// Validation des props avec PropTypes
TranscriptionCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired, // Ajoutez un identifiant pour la navigation
};

export default TranscriptionCard;
