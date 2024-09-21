import React, { useState } from "react";
import emailsServices from "../../services/emails.services";
import "./forgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email saisi par l'utilisateur:", email);
    if (!email) {
      alert("Veuillez entrer votre adresse e-mail.");
      return;
    }
    emailsServices
      .sendResetPasswordEmail({ email })
      .then((res) => {
        console.log("Réponse du serveur après soumission du formulaire:", res);
        setMessage(
          "Un email de réinitialisation a été envoyé si cet email est associé à un compte."
        );
      })
      .catch((err) => {
        console.error("Erreur lors de l'envoi de l'email de réinitialisation:", err); // eslint-disable-line
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
