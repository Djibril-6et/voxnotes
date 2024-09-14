const API_URL_BASE = process.env.REACT_APP_BDD_API_URL;

export default {
  loginUser(payload) {
    return fetch(`${API_URL_BASE}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw new Error(
              data.message || "Une erreur est survenue lors de la connexion."
            );
          });
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        throw err;
      });
  },
};
