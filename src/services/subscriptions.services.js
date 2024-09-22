// eslint-disable-next-line no-undef
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

  getSubscriptionByUserId(userId) {
    return fetch(`${API_URL_BASE}/api/subscriptions/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching subscription: ${res.statusText}`);
      }
      return res.json();
    });
  },
};
