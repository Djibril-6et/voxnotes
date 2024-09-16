import React, { useState } from "react";
import PropTypes from "prop-types";
import "./saveModal.css"; // Créer un fichier CSS pour styliser la modal

function SaveModal({ onSave, onClose }) {
  const [transcriptionName, setTranscriptionName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (transcriptionName) {
      onSave(transcriptionName); // Appeler la fonction d'enregistrement avec le nom
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Enregistrer la transcription</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom de la transcription"
            value={transcriptionName}
            onChange={(e) => setTranscriptionName(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Enregistrer
            </button>
            <button type="button" className="close-btn" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Validation des props avec PropTypes
SaveModal.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SaveModal;
