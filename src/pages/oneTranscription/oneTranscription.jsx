import React, { useState, useEffect } from "react";
import audioFilesService from "../../services/audioFiles.services";
import "./oneTranscription.css";

function OneTranscription() {
  const [fileMetadata, setFileMetadata] = useState(null); // État pour stocker les métadonnées
  const [audioFileUrl, setAudioFileUrl] = useState(null); // URL du fichier audio
  const [loading, setLoading] = useState(true); // État pour indiquer si les données sont en cours de chargement
  const [error, setError] = useState(null); // État pour les erreurs

  useEffect(() => {
    // Récupère l'ID depuis le localStorage
    const id = localStorage.getItem("transcriptionId");

    if (!id) {
      setError("No transcription ID found in localStorage");
      setLoading(false);
      return;
    }

    console.log("Fetching metadata for ID from localStorage:", id); // Log pour déboguer l'ID reçu

    const fetchFileMetadata = async () => {
      try {
        // Récupérer les métadonnées
        const data = await audioFilesService.getFileMetadataById(id);
        console.log("File metadata:", data); // Log pour voir les métadonnées récupérées
        setFileMetadata(data);

        // Télécharger le fichier audio
        const audioBlob = await audioFilesService.downloadAudioFile(id);
        const audioUrl = URL.createObjectURL(audioBlob); // Convertir le Blob en URL utilisable dans un lecteur audio
        setAudioFileUrl(audioUrl); // Stocker l'URL du fichier audio
      } catch (err) {
        console.error("Error fetching metadata or audio file:", err); // Log l'erreur si elle survient
        setError("Error fetching file metadata or audio file");
      } finally {
        setLoading(false);
      }
    };

    fetchFileMetadata();
  }, []);

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
    <div className="transcription-detail-container">
      <h2>{fileMetadata.metadata?.title}</h2>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(fileMetadata.uploadDate).toLocaleDateString()}
      </p>
      <div className="transcription-content">
        <p>{fileMetadata.metadata?.transcription}</p>
      </div>

      {audioFileUrl && (
        <div className="audio-player">
          <audio controls>
            <source src={audioFileUrl} type={fileMetadata.metadata?.mimetype} />
            <track kind="captions" srcLang="en" label="English captions" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default OneTranscription;
