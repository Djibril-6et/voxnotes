// eslint-disable-next-line no-undef
const API_URL_BASE = process.env.REACT_APP_BDD_API_URL;

export default {
  getUserFiles(userId) {
    return fetch(`${API_URL_BASE}/api/audioFiles/user/${userId}`).then(
      (response) => response.json()
    );
  },

  getFileMetadataById(id) {
    return fetch(`${API_URL_BASE}/api/audioFiles/${id}/metadata`).then(
      (response) => response.json()
    );
  },

  // Méthode pour télécharger un fichier audio par son ID
  downloadAudioFile(fileId) {
    return fetch(`${API_URL_BASE}/api/audioFiles/file/${fileId}`, {
      method: "GET",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to download audio file");
      }
      return response.blob(); // Convertir la réponse en Blob (pour les fichiers binaires)
    });
  },
};
