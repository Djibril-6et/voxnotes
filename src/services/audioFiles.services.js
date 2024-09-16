const API_URL_BASE = process.env.REACT_APP_BDD_API_URL;

export default {
  getUserFiles(userId) {
    return fetch(`${API_URL_BASE}/api/audioFiles/user/${userId}`).then(
      (response) => response.json()
    );
  },
};
