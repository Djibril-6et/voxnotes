const API_URL_BASE = process.env.REACT_APP_BDD_API_URL;

export default {
  createNewSubscription(payload) {
    return fetch(`${API_URL_BASE}/api/subscriptions`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  },
};
