import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import audioFilesService from "../../services/audioFiles.services";
import "./oneTranscription.css";

function OneTranscription() {
  const [fileMetadata, setFileMetadata] = useState(null);
  const [audioFileUrl, setAudioFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("transcriptionId");

    if (!id) {
      setError("No transcription ID found in localStorage");
      setLoading(false);
      return;
    }

    const fetchFileMetadata = async () => {
      try {
        const data = await audioFilesService.getFileMetadataById(id);
        setFileMetadata(data);

        const audioBlob = await audioFilesService.downloadAudioFile(id);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioFileUrl(audioUrl);
      } catch (err) {
        setError("Error fetching file metadata or audio file");
      } finally {
        setLoading(false);
      }
    };

    fetchFileMetadata();
  }, []);

  const handleCopyText = () => {
    if (fileMetadata?.metadata?.transcription) {
      navigator.clipboard.writeText(fileMetadata.metadata.transcription);
      alert("Texte copié dans le presse-papier !");
    }
  };

  const handleDownloadPDF = () => {
    if (fileMetadata?.metadata?.transcription) {
      // eslint-disable-next-line
      const doc = new jsPDF();
      doc.text(fileMetadata.metadata.transcription, 10, 10);
      doc.save(`${fileMetadata.metadata?.title || "transcription"}.pdf`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!fileMetadata) {
    return <div>No file metadata available</div>;
  }

  return (
    <div className="transcription-container">
      <h2>{fileMetadata.metadata?.title}</h2>
      <p>
        <strong>Date:</strong>
        {new Date(fileMetadata.uploadDate).toLocaleDateString()}
      </p>

      <div className="transcription-section">
        <div className="transcription-text">
          <h3>Transcription complète :</h3>
          <textarea
            value={fileMetadata.metadata?.transcription}
            readOnly
            placeholder="Votre transcription apparaîtra ici..."
          />
        </div>

        {audioFileUrl && (
          <div className="audio-player">
            <h3>Écouter enregistrement :</h3>
            <audio controls>
              <source
                src={audioFileUrl}
                type={fileMetadata.metadata?.mimetype}
              />
              <track kind="captions" srcLang="en" label="English captions" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button type="button" onClick={handleCopyText}>
          Copier le texte
        </button>
        <button type="button" onClick={handleDownloadPDF}>
          Télécharger PDF
        </button>
      </div>
    </div>
  );
}

export default OneTranscription;
