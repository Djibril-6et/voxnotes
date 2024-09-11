import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

function Profil() {
  const [user, setUser] = useState({
    username: '',
    email: '',
  });

  const [paymentDetails, setPaymentDetails] = useState(null); // Pour stocker les détails du paiement
  const [subscriptionDetails, setSubscriptionDetails] = useState(null); // Pour stocker les détails de l'abonnement
  const navigate = useNavigate();

  // Fonction pour récupérer les détails du paiement ou de l'abonnement en fonction du session_id
  const fetchSessionDetails = async (sessionId) => {
    try {
      // 1. Récupérer la session Stripe pour vérifier si c'est un paiement ou un abonnement
      const sessionResponse = await fetch('http://localhost:8080/get-session-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      const sessionData = await sessionResponse.json();

      if (sessionResponse.ok && sessionData.session) {
        const session = sessionData.session;

        // 2. Si c'est un paiement unique, récupérer les détails du paiement
        if (session.mode === 'payment') {
          const paymentResponse = await fetch('http://localhost:8080/get-payment-details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),
          });
          const paymentData = await paymentResponse.json();
          if (paymentResponse.ok) {
            return { paymentDetails: paymentData.paymentIntent, subscriptionDetails: null };
          }
        }

        // 3. Si c'est un abonnement, récupérer les détails de l'abonnement
        if (session.mode === 'subscription') {
          const subscriptionResponse = await fetch('http://localhost:8080/get-subscription-details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),
          });
          const subscriptionData = await subscriptionResponse.json();
          if (subscriptionResponse.ok) {
            return { paymentDetails: null, subscriptionDetails: subscriptionData.subscription };
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la requête :', error);
    }

    return { paymentDetails: null, subscriptionDetails: null };
  };

  useEffect(() => {
    // Récupération des informations de l'utilisateur depuis localStorage
    const storedUser = localStorage.getItem('userConnected');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        username: parsedUser.user.username,
        email: parsedUser.user.email,
      });
    } else {
      navigate('/connexion'); // Redirection si aucun utilisateur n'est connecté
    }

    // Vérification de la présence du session_id dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    // Si un session_id est trouvé, récupérer les détails du paiement ou de l'abonnement
    if (sessionId) {
      const fetchDetails = async () => {
        const { paymentDetails, subscriptionDetails } = await fetchSessionDetails(sessionId);
        setPaymentDetails(paymentDetails);
        setSubscriptionDetails(subscriptionDetails);
      };
      fetchDetails();
    }
  }, [navigate]);

  return (
    <div className="profil-container">
      <h2 className="profil-title">Profil</h2>

      {/* Afficher les informations de l'utilisateur */}
      <p className="profil-info"><strong>Username:</strong> {user.username}</p>
      <p className="profil-info"><strong>Email:</strong> {user.email}</p>

      {/* Afficher les détails du paiement si présents */}
      {paymentDetails ? (
        <div className="payment-details">
          <h3>Détails du paiement</h3>
          <p><strong>ID du paiement :</strong> {paymentDetails.id}</p>
          <p><strong>Montant payé :</strong> {paymentDetails.amount / 100} €</p>
          <p><strong>Statut du paiement :</strong> {paymentDetails.status}</p>
        </div>
      ) : subscriptionDetails ? (
        <div className="subscription-details">
          <h3>Détails de l'abonnement</h3>
          <p><strong>ID de l'abonnement :</strong> {subscriptionDetails.id}</p>
          <p><strong>Statut :</strong> {subscriptionDetails.status}</p>
          <p><strong>Prochain renouvellement :</strong> {new Date(subscriptionDetails.current_period_end * 1000).toLocaleDateString()}</p>
        </div>
      ) : (
        <p className="no-payment-details">Aucun paiement ou abonnement récent trouvé.</p>
      )}
    </div>
  );
}

export default Profil;