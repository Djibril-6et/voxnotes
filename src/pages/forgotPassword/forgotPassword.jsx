import React, { useState } from "react";
import emailsServices from "../../services/emails.services";
import "./forgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      // eslint-disable-next-line
      alert("Veuillez entrer votre adresse e-mail.");
      return;
    }
    emailsServices
      .sendResetPasswordEmail({ email })
      // eslint-disable-next-line
      .then((res) => {
        setMessage(
          "Un email de réinitialisation a été envoyé si cet email est associé à un compte."
        );
      })
      // eslint-disable-next-line
      .catch((err) => {
        setMessage("Erreur lors de l'envoi de l'email de réinitialisation.");
      });
  };

  return (
    <div className="forgotpassword-container">
      <h2>Mot de passe oublié</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Envoyer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
