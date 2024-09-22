import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usersServices from "../../services/users.services";
import "./resetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      // eslint-disable-next-line
      alert("Token de réinitialisation non trouvé.");
      navigate("/login");
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

    if (!newPassword || !confirmPassword) {
      // eslint-disable-next-line
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (newPassword !== confirmPassword) {
      // eslint-disable-next-line
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 8) {
      // eslint-disable-next-line
      alert("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    usersServices
      .resetPassword({
        token,
        newPassword,
      })
      .then(() => {
        // eslint-disable-next-line
        alert("Mot de passe mis à jour avec succès.");
        navigate("/connexion");
      })
      .catch((err) => {
        // eslint-disable-next-line
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
