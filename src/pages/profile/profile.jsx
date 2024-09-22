import React, { useState, useEffect } from "react";
import "./profile.css";
import { useNavigate, useLocation } from "react-router-dom";

function Profil() {
  // eslint-disable-next-line no-undef
  const PAYMENT_URL_BASE = process.env.REACT_APP_PAYMENT_URL;
  const [user, setUser] = useState({
    username: "",
    email: "",
    _id: "",
  });

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username");
  const email = queryParams.get("email");
  const sessionId = queryParams.get("session_id");
  // eslint-disable-next-line
  const _id =
    queryParams.get("_id") ||
    JSON.parse(localStorage.getItem("userConnected"))?.user._id; // eslint-disable-line

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
      // eslint-disable-next-line
    } catch (error) {}

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
        setUser({
          username: storedUsername,
          email: storedEmail,
          _id: storedId,
        }); // eslint-disable-line
      } else {
        navigate("/connexion");
      }
    }

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
  }, [location, navigate, username, email, sessionId, _id]);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("userConnected");

      const event = new Event("userDisconnected");
      window.dispatchEvent(event);

      navigate("/connexion");
      // eslint-disable-next-line
    } catch (error) {}
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
    </div>
  );
}

export default Profil;
