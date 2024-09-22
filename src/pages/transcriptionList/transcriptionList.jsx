import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./transcriptionList.css";
import TranscriptionCard from "../../components/transcriptionCard/transcriptionCard";
import audioFilesService from "../../services/audioFiles.services"; // import du service

function Transcription() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const MAX_FREE_TRANSCRIPTIONS = 3; // Limite des transcriptions gratuites

  // Ajout d'une vérification de sécurité pour éviter NaN
  const transcriptionsLeft =
    MAX_FREE_TRANSCRIPTIONS - (transcriptions.length || 0);

  useEffect(() => {
    // Récupération du userId depuis le localStorage
    const userConnected = JSON.parse(localStorage.getItem("userConnected"));
    const userId = userConnected?.user?._id;

    if (userId) {
      // Appel à l'API pour récupérer les fichiers audio de l'utilisateur
      audioFilesService
        .getUserFiles(userId)
        .then((data) => {
          setTranscriptions(data); // Met à jour les transcriptions avec les données récupérées
          console.log(data);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des transcriptions:",
            error
          );
        })
        .finally(() => {
          setLoading(false); // Indique que le chargement est terminé
        });
    }
  }, []);

  // Fonction pour gérer le clic sur le bouton "New Transcription"
  const handleNewTranscriptionClick = () => {
    if (transcriptions.length >= MAX_FREE_TRANSCRIPTIONS) {
      alert(
        "Vous avez atteint la limite de transcriptions gratuites. Souscrivez à un abonnement pour continuer."
      );
      navigate("/souscription"); // Redirige vers la page de souscription si 3 transcriptions ont été créées
    } else {
      navigate("/newtranscription"); // Redirige vers la création de nouvelle transcription
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Affiche un message de chargement
  }

  return (
    <div className="transcription-page">
      <section className="new-transcription-section">
        <div className="centered-content">
          <button
            onClick={handleNewTranscriptionClick}
            className="new-transcription-link"
          >
            New transcription
          </button>
        </div>
      </section>
      <section className="my-transcriptions-section">
        <h1>My Transcriptions</h1>
        
        {/* Message affichant le nombre de transcriptions restantes */}
        <p className="transcriptions-left-message">
          Il vous reste {transcriptionsLeft} transcription(s) gratuite(s) avant qu'un abonnement soit requis.
        </p>

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
