import React, { useState } from "react";
import PropTypes from "prop-types";
import "./index.css";

function FileUploadModal({ isOpen, onClose, onUpload, sendAudioToAPI }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleConfirm = async () => {
    if (selectedFile) {
      try {
        await sendAudioToAPI(selectedFile);
        onClose();
      } catch (error) {
        alert("Erreur lors de l'envoi de la transcription");
      }
    } else {
      alert("Veuillez sélectionner un fichier audio.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Sélectionnez un fichier à uploader :</h3>
        <input
          type="file"
          accept="audio/*" 
          onChange={handleFileChange}
          className="file-input"
        />
        <div className="modal-buttons">
          <button type="button" onClick={handleConfirm}>
            Upload
          </button>
          <button type="button" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

FileUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  sendAudioToAPI: PropTypes.func.isRequired
};

export default FileUploadModal;
