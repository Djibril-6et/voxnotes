import React, { useState } from "react";
import PropTypes from "prop-types";
import "./index.css";

function FileUploadModal({ isOpen, onClose, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      onClose();
    } else {
      alert("Please select a file first!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Select a file to upload:</h3>
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
            Cancel
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
};

export default FileUploadModal;
