import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usersServices from "../../services/users.services";
import "./resetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation(); // Utiliser useLocation pour obtenir les paramètres de l'URL
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState(null); // Stocker le token extrait de l'URL

  // Récupérer le token depuis l'URL lors du montage du composant
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); // Récupérer les paramètres de l'URL
    const tokenFromUrl = queryParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl); // Stocker le token dans l'état
    } else {
      alert("Token de réinitialisation non trouvé.");
      navigate("/login"); // Rediriger vers la page de connexion si aucun token trouvé
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    const { newPassword, confirmPassword } = passwords;

    // Vérifier si les champs sont remplis
    if (!newPassword || !confirmPassword) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    // Vérifier si les deux mots de passe correspondent
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    // Vérifier la force du mot de passe
    if (newPassword.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    // Envoyer la requête de réinitialisation avec le token
    usersServices
      .resetPassword({
        token, // Envoyer le token
        newPassword, // Envoyer le nouveau mot de passe
      })
      .then(() => {
        alert("Mot de passe mis à jour avec succès.");
        navigate("/connexion"); // Rediriger vers la page de connexion
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour du mot de passe:", err);
        alert(err.message);
      });
  };

  return (
    <div className="resetpassword-container">
      <h2 className="resetpassword-title">Réinitialiser le mot de passe</h2>

      <form className="resetpassword-form" onSubmit={handleResetPassword}>
        <input
          type="password"
          name="newPassword"
          placeholder="Nouveau mot de passe"
          value={passwords.newPassword}
          onChange={handleChange}
          className="resetpassword-input"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmez le nouveau mot de passe"
          value={passwords.confirmPassword}
          onChange={handleChange}
          className="resetpassword-input"
          required
        />
        <button type="submit" className="resetpassword-button">
          Réinitialiser le mot de passe
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
