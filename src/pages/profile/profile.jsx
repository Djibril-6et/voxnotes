import React, { useState, useEffect } from "react";
import "./profile.css";
import { useNavigate, useLocation } from "react-router-dom";
import audioFilesServices from "../../services/audioFiles.services";

function Profil() {
  const PAYMENT_URL_BASE = process.env.REACT_APP_PAYMENT_URL;
  const [user, setUser] = useState({
    username: "",
    email: "",
    _id: "", // Suppression de l'espace en trop ici
  });

  const [paymentDetails, setPaymentDetails] = useState(null); // Détails du paiement
  const [subscriptionDetails, setSubscriptionDetails] = useState(null); // Détails de l'abonnement
  const [audioFilesList, setAudioFilesList] = useState([]); // Liste des fichiers audio
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username");
  const email = queryParams.get("email");
  const sessionId = queryParams.get("session_id");

  // On récupère _id des query params ou du localStorage si les query params sont vides
  /* eslint-disable-next-line no-underscore-dangle */
  const _id =
    queryParams.get("_id") ||
    JSON.parse(localStorage.getItem("userConnected"))?.user._id; // eslint-disable-line
  // eslint-disable-next-line
  console.log("Query Params _id:", _id); // Ajout pour vérifier la valeur de _id

  // Fonction pour récupérer les fichiers audio de l'utilisateur connecté
  const fetchUserAudioFiles = async () => {
    if (_id) {
      // eslint-disable-next-line
      console.log("User ID:", _id); // Vérifiez que l'ID est correct
      try {
        const audioFiles = await audioFilesServices.getUserFiles(_id);
        // eslint-disable-next-line
        console.log("Audio Files Data: ", audioFiles); // Afficher la réponse complète de l'API
        setAudioFilesList(audioFiles); // Assigner la liste directement
        // eslint-disable-next-line
        console.log("State after setting audio files: ", audioFilesList); // Vérifier l'état après mise à jour
      } catch (error) {
        // eslint-disable-next-line
        console.error(
          "Erreur lors de la récupération des fichiers audio :",
          error
        );
      }
    } else {
      // eslint-disable-next-line
      console.warn("No user ID found!"); // Log si l'ID est manquant
    }
  };

  const fetchSessionDetails = async (fetchSessionId) => {
    // eslint-disable-line
    try {
      const sessionResponse = await fetch(
        `${PAYMENT_URL_BASE}/get-session-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId: fetchSessionId }),
        }
      );
      const sessionData = await sessionResponse.json();

      if (sessionResponse.ok && sessionData.session) {
        const session = sessionData.session; // eslint-disable-line

        if (session.mode === "payment") {
          const paymentResponse = await fetch(
            `${PAYMENT_URL_BASE}/get-payment-details`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sessionId: fetchSessionId }),
            }
          );
          const paymentData = await paymentResponse.json();
          if (paymentResponse.ok) {
            return {
              paymentDetails: paymentData.paymentIntent,
              subscriptionDetails: null,
            };
          }
        }

        if (session.mode === "subscription") {
          const subscriptionResponse = await fetch(
            `${PAYMENT_URL_BASE}/get-subscription-details`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sessionId: fetchSessionId }),
            }
          );
          const subscriptionData = await subscriptionResponse.json();
          if (subscriptionResponse.ok) {
            return {
              paymentDetails: null,
              subscriptionDetails: subscriptionData.subscription,
            };
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(
        "Erreur lors de la récupération des fichiers audio :",
        error
      ); // eslint-disable-line no-console
    }

    return { paymentDetails: null, subscriptionDetails: null };
  };

  useEffect(() => {
    if (username && email && _id) {
      const userData = { username, email, _id };
      localStorage.setItem("userConnected", JSON.stringify({ user: userData }));
      setUser(userData);
    } else {
      const storedUser = localStorage.getItem("userConnected");
      if (storedUser) {
        const {
          username: storedUsername,
          email: storedEmail,
          _id: storedId,
        } = JSON.parse(storedUser).user;
        // eslint-disable-next-line
        console.log("Stored user data:", {
          storedUsername,
          storedEmail,
          storedId,
        }); // eslint-disable-line
        setUser({
          username: storedUsername,
          email: storedEmail,
          _id: storedId,
        }); // eslint-disable-line
      } else {
        navigate("/connexion");
      }
    }

    // Récupération des détails de la session si sessionId est présent
    if (sessionId) {
      const fetchDetails = async () => {
        const {
          paymentDetails: fetchedPaymentDetails,
          subscriptionDetails: fetchedSubscriptionDetails,
        } = await fetchSessionDetails(sessionId);
        setPaymentDetails(fetchedPaymentDetails);
        setSubscriptionDetails(fetchedSubscriptionDetails);
      };
      fetchDetails();
    }
    // eslint-disable-next-line
    console.log("useEffect - _id:", _id); // Vérification de _id dans useEffect

    fetchUserAudioFiles();
  }, [location, navigate, username, email, sessionId, _id]);

  const handleSignOut = async () => {
    try {
      // Remove user data from localStorage
      localStorage.removeItem("userConnected");

      // Émettre un événement pour mettre à jour le header
      const event = new Event("userDisconnected");
      window.dispatchEvent(event);

      // Redirect to login page
      navigate("/connexion");
    } catch (error) {
      console.error("Error signing out:", error); // eslint-disable-line no-console
    }
  };

  return (
    <div className="profil-container">
      <h2 className="profil-title">Profil</h2>
      <div className="profil-info-container">
        <p className="profil-info">
          <strong>Username:</strong> {user.username}
        </p>
        <p className="profil-info">
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      {paymentDetails && (
        <div className="payment-details">
          <h3>Détails du paiement</h3>
          <p>
            <strong>ID du paiement :</strong>
            {paymentDetails.id}
          </p>
          <p>
            <strong>Montant payé :</strong>
            {paymentDetails.amount / 100} €
          </p>
          <p>
            <strong>Statut du paiement :</strong>
            {paymentDetails.status}
          </p>
        </div>
      )}

      {!paymentDetails && subscriptionDetails && (
        <div className="subscription-details">
          <h3>Détails de l&apos;abonnement</h3>
          <p>
            <strong>ID de l&apos;abonnement :</strong>
            {subscriptionDetails.id}
          </p>
          <p>
            <strong>Statut :</strong>
            {subscriptionDetails.status}
          </p>
          <p>
            <strong>Prochain renouvellement :</strong>
            {new Date(
              subscriptionDetails.current_period_end * 1000
            ).toLocaleDateString()}
          </p>
        </div>
      )}

      {!paymentDetails && !subscriptionDetails && (
        <p className="no-payment-details">
          Aucun paiement ou abonnement récent trouvé.
        </p>
      )}
      <button type="button" className="signout-button" onClick={handleSignOut}>
        Déconnexion
      </button>

      <div className="audio-files-section">
        <h3>Vos fichiers audio</h3>
        {audioFilesList.length > 0 ? (
          <ul>
            {audioFilesList.map((audioFile) => (
              <li key={audioFile.fileName}>
                <strong>Nom du fichier :</strong> {audioFile.fileName} <br />
                <strong>Type :</strong> {audioFile.fileType} <br />
                <strong>Taille :</strong>
                {(audioFile.fileSize / 1000000).toFixed(2)} MB <br />
                <strong>Statut :</strong> {audioFile.status} <br />
                <strong>Date de l&apos;upload :</strong>
                {new Date(audioFile.uploadDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun fichier audio disponible.</p>
        )}
      </div>
    </div>
  );
}

export default Profil;
