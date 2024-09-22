import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import "./newTranscription.css";
import SaveModal from "../../components/saveModal/saveModal";
import FileUploadModal from "../../components/fileUploadModal";

function NewTranscription() {
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioBlobRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);

  // eslint-disable-next-line no-undef
  const API_URL_BASE = process.env.REACT_APP_BDD_API_URL;

  // Fonction pour envoyer l'audio à l'API OpenAI
  const sendAudioToAPI = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsTranscribing(true);
      const response = await fetch("http://localhost:5015/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Erreur lors de la transcription : ${response.status} - ${errorMessage}`
        );
      }

      const data = await response.json();
      setTranscription(data.text);
      setAudioUrl(data.audioUrl);
      setAudioFile(file); // Stockez le fichier pour l'envoyer plus tard à la BDD

      return { transcription: data.text, audioUrl: data.audioUrl };
    } catch (error) {
      console.error("Erreur lors de la transcription :", error);
      alert("Erreur lors de la transcription");
    } finally {
      setIsTranscribing(false);
    }
  };

  // Fonction pour gérer le téléchargement de fichier et transcription
  const handleUploadFile = async (file) => {
    await sendAudioToAPI(file); // Envoyer l'audio à OpenAI
  };

  // Fonction pour démarrer l'enregistrement
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      mediaRecorder.ondataavailable = (event) => {
        audioBlobRef.current = event.data;
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Erreur lors de l'initialisation du MediaRecorder:", error);
    }
  };

  // Fonction pour stopper l'enregistrement et envoyer pour transcription
  const handleStopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = audioBlobRef.current;
        if (audioBlob) {
          const file = new File([audioBlob], "audio.webm", {
            type: "audio/webm",
          });
          await sendAudioToAPI(file); // Envoyer l'audio à l'API OpenAI
        }
      };
    }
  };

  // Fonction pour copier le texte de la transcription dans le presse-papier
  const handleCopyText = () => {
    navigator.clipboard.writeText(transcription);
    alert("Texte copié dans le presse-papier !");
  };

  // Fonction pour télécharger la transcription en PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(transcription, 10, 10);
    doc.save("transcription.pdf");
  };

  // Fonction pour ouvrir la modal d'enregistrement
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Fonction pour fermer la modal d'enregistrement
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Fonction pour sauvegarder la transcription et l'audio dans la BDD
  const handleSaveTranscription = async (transcriptionName) => {
    const formData = new FormData();
    formData.append("transcription", transcription); // Ajoute la transcription
    formData.append("title", transcriptionName); // Nom de la transcription

    // Récupérer les informations de l'utilisateur depuis le localStorage
    const userConnected = JSON.parse(localStorage.getItem("userConnected"));
    const userId = userConnected?.user?._id; // ID de l'utilisateur connecté

    if (userId) {
      formData.append("userId", userId); // Ajouter l'ID de l'utilisateur au FormData
    }

    if (audioFile) {
      formData.append("file", audioFile); // Ajoute le fichier audio
    }

    try {
      const response = await fetch(
        `${API_URL_BASE}/api/audioFiles/uploadfile`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Error during file upload: ${response.status} - ${errorMessage}`
        );
      }

      console.log(response);
      alert("Transcription et fichier audio enregistrés avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="transcription-container">
      <h2>Créer une nouvelle transcription</h2>

      <div className="recording-controls">
        <button
          type="button"
          onClick={handleStartRecording}
          disabled={isRecording}
          className="record-btn"
        >
          Démarrer l'enregistrement
        </button>
        <button
          type="button"
          onClick={handleStopRecording}
          disabled={!isRecording}
          className="stop-btn"
        >
          Stoppez enregistrement
        </button>

        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="upload-btn"
        >
          Importer un fichier audio
        </button>
      </div>

      <div className="status-message">
        {isRecording && <p>Enregistrement en cours...</p>}
        {isTranscribing && <p>Transcription en cours...</p>}
      </div>

      <div className="transcription-section">
        <div className="transcription-text">
          <h3>Transcription complète :</h3>
          <textarea
            value={transcription}
            readOnly
            placeholder="Votre transcription apparaîtra ici..."
          />
        </div>

        <div className="audio-player">
          <h3>Écouter enregistrement :</h3>
          <audio controls src={audioUrl}>
            <track kind="captions" />
          </audio>
        </div>
      </div>

      <div className="action-buttons">
        <button type="button" onClick={handleCopyText}>
          Copier le texte
        </button>
        <button type="button" onClick={handleDownloadPDF}>
          Télécharger PDF
        </button>
        <button type="button" onClick={handleOpenModal}>
          Enregistrer
        </button>
      </div>

      {isModalOpen && (
        <SaveModal
          onSave={handleSaveTranscription} // Sauvegarde dans la BDD
          onClose={handleCloseModal}
        />
      )}

      {isUploadModalOpen && (
        <FileUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUploadFile} // Assurez-vous que cette fonction est bien passée
          sendAudioToAPI={sendAudioToAPI} // Envoyer le fichier pour transcription
        />
      )}
    </div>
  );
}

export default NewTranscription;
