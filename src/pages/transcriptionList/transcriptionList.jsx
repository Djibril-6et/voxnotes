import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./transcriptionList.css";
import TranscriptionCard from "../../components/transcriptionCard/transcriptionCard";
import audioFilesService from "../../services/audioFiles.services"; // import du service

function Transcription() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération du userId depuis le localStorage
    const userConnected = JSON.parse(localStorage.getItem("userConnected"));
    const userId = userConnected?.user?._id;

    if (userId) {
      // Appel à l'API pour récupérer les fichiers audio de l'utilisateur
      audioFilesService.getUserFiles(userId)
        .then((data) => {
          setTranscriptions(data); // Met à jour les transcriptions avec les données récupérées
          console.log(data);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des transcriptions:", error);
        })
        .finally(() => {
          setLoading(false); // Indique que le chargement est terminé
        });
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Affiche un message de chargement
  }

  return (
    <div className="transcription-page">
      <section className="new-transcription-section">
        <div className="centered-content">
          <Link to="/newtranscription" className="new-transcription-link">
            New transcription
          </Link>
        </div>
      </section>
      <section className="my-transcriptions-section">
        <h1>My Transcriptions</h1>
        <div className="card-section">
          {transcriptions.length > 0 ? (
            transcriptions.map((transcription) => (
              <TranscriptionCard
                key={transcription.id}
                id={transcription.id}
                title={transcription.metadata.title}
                date={transcription.uploadDate}
                content={transcription.metadata.transcription}
              />
            ))
          ) : (
            <p>No transcriptions found</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Transcription;