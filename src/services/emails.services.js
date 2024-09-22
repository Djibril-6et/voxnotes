// eslint-disable-next-line no-undef
const API_URL_BASE = process.env.REACT_APP_BDD_API_URL;

export default {
  sendResetPasswordEmail(payload) {
    return fetch(`${API_URL_BASE}/api/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.json().then((data) => {
          throw new Error(
            data.message ||
              "Une erreur est survenue lors de l'envoi de l'email de réinitialisation." // eslint-disable-line
          );
        });
      })
      .catch((err) => {
        console.error("Error:", err);
        throw err;
      });
  },

  sendCustomEmail(payload) {
    return fetch(`${API_URL_BASE}/send-email`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.json().then((data) => {
          throw new Error(
            data.message ||
              "Une erreur est survenue lors de l'envoi de l'email." // eslint-disable-line
          );
        });
      })
      .catch((err) => {
        console.error("Error:", err);
        throw err;
      });
  },
};
