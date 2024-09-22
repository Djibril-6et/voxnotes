import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./transcriptionList.css";
import TranscriptionCard from "../../components/transcriptionCard/transcriptionCard";
import audioFilesService from "../../services/audioFiles.services";
import subscriptionService from "../../services/subscriptions.services";

function Transcription() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const navigate = useNavigate();

  const MAX_FREE_TRANSCRIPTIONS = 3;

  const transcriptionsLeft =
    MAX_FREE_TRANSCRIPTIONS - (transcriptions.length || 0);

  useEffect(() => {
    const userConnected = JSON.parse(localStorage.getItem("userConnected"));
    const userId = userConnected?.user?._id; // eslint-disable-line no-underscore-dangle

    if (userId) {
      subscriptionService
        .getSubscriptionByUserId(userId)
        .then((subscription) => {
          if (subscription) {
            setHasSubscription(true);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setHasSubscription(false); // No subscription found
          }
        });

      audioFilesService
        .getUserFiles(userId)
        .then((data) => {
          setTranscriptions(data);
        })
        // eslint-disable-next-line
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            console.log("No transcriptions found");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  /* ADD SESSION ID */
  const handleNewTranscriptionClick = () => {
    if (!hasSubscription && transcriptions.length >= MAX_FREE_TRANSCRIPTIONS) {
      // eslint-disable-next-line
      alert(
        "Vous avez atteint la limite de transcriptions gratuites. Souscrivez à un abonnement pour continuer."
      );
      navigate("/souscription");
    } else {
      navigate("/newtranscription");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="transcription-page">
      <section className="new-transcription-section">
        <div className="centered-content">
          <button
            onClick={handleNewTranscriptionClick}
            className="new-transcription-link"
            type="button"
          >
            New transcription
          </button>
        </div>
      </section>
      <section className="my-transcriptions-section">
        <h1>My Transcriptions</h1>
        {!hasSubscription && (
          <p className="transcriptions-left-message">
            Il vous reste {transcriptionsLeft} transcription(s) gratuite(s) avant
            qu&apos;un abonnement soit requis.
          </p>
        )}

        <div className="card-section">
          {transcriptions.length > 0 ? (
            transcriptions.map((transcription) => (
              <TranscriptionCard
                key={transcription.id}
                id={transcription._id} // eslint-disable-line no-underscore-dangle
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
