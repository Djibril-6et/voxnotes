import React, { useState, useEffect } from "react";
import "./index.css";
import { useNavigate, useLocation } from "react-router-dom";

function Profil() {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  const [paymentDetails, setPaymentDetails] = useState(null); // Détails du paiement
  const [subscriptionDetails, setSubscriptionDetails] = useState(null); // Détails de l'abonnement
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username");
  const email = queryParams.get("email");
  const sessionId = queryParams.get("session_id");

  // Fonction pour récupérer les détails du paiement ou de l'abonnement en fonction du session_id
  const fetchSessionDetails = async (sessionId) => { // eslint-disable-line
    try {
      const sessionResponse = await fetch(
        "http://localhost:8080/get-session-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        }
      );
      const sessionData = await sessionResponse.json();

      if (sessionResponse.ok && sessionData.session) {
        const session = sessionData.session; // eslint-disable-line

        if (session.mode === "payment") {
          const paymentResponse = await fetch(
            "http://localhost:8080/get-payment-details",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sessionId }),
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
            "http://localhost:8080/get-subscription-details",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sessionId }),
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
      console.error("Erreur lors de la requête :", error);
    }

    return { paymentDetails: null, subscriptionDetails: null };
  };

  useEffect(() => {
    if (username && email) {
      const userData = { username, email };
      localStorage.setItem("userConnected", JSON.stringify({ user: userData }));
      setUser(userData);
    } else {
      const storedUser = localStorage.getItem("userConnected");
      if (storedUser) {
        const {
          user: { username, email }, // eslint-disable-line
        } = JSON.parse(storedUser);
        setUser({ username, email });
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

        // La création de la souscription dans la base de données est maintenant gérée côté serveur
      };
      fetchDetails();
    }
  }, [location, navigate, username, email, sessionId]);

  const handleSignOut = async () => {
    try {
      // Remove user data from localStorage
      localStorage.removeItem("userConnected");

      // Redirect to login page
      navigate("/connexion");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="profil-container">
      <h2 className="profil-title">Profil</h2>
      <p className="profil-info">
        <strong>Username:</strong> {user.username}
      </p>
      <p className="profil-info">
        <strong>Email:</strong> {user.email}
      </p>

      {paymentDetails && (
        <div className="payment-details">
          <h3>Détails du paiement</h3>
          <p>
            <strong>ID du paiement :</strong> {paymentDetails.id}
          </p>
          <p>
            <strong>Montant payé :</strong> {paymentDetails.amount / 100} €
          </p>
          <p>
            <strong>Statut du paiement :</strong> {paymentDetails.status}
          </p>
        </div>
      )}
      {!paymentDetails && subscriptionDetails && (
        <div className="subscription-details">
          <h3>Détails de l&apos;abonnement</h3>
          <p>
            <strong>ID de l&apos;abonnement :</strong> {subscriptionDetails.id}
          </p>
          <p>
            <strong>Statut :</strong> {subscriptionDetails.status}
          </p>
          <p>
            <strong>Prochain renouvellement :</strong>{" "}
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
        Sign Out
      </button>
    </div>
  );
}

export default Profil;
