import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import "./transcriptionCard.css";

function TranscriptionCard({ title, date, content, id }) {
  const navigate = useNavigate();

  const handleViewTranscription = () => {
    navigate(`/transcriptiondetail/${id}`);
  };

  const formattedDate = format(new Date(date), "dd MMMM yyyy", { locale: fr });

  return (
    <div className="card">
      <div className="card-top">
        <p className="card-summary">{title}</p>
        <p className="card-excerpt">{content}</p>
      </div>
      <div className="card-bottom">
        <p className="card-date">{formattedDate}</p>
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

TranscriptionCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

export default TranscriptionCard;
