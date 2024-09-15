import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf"; // Importer jsPDF
import "./index.css"; // Assurez-vous que le fichier de style est bien lié
import SaveModal from "../../components/saveModal"; // Importer la modal

function NewTranscription() {
  const [transcription, setTranscription] = useState(""); // Transcription complète
  const [isRecording, setIsRecording] = useState(false); // État de l'enregistrement
  const [isTranscribing, setIsTranscribing] = useState(false); // État de la transcription
  const [isModalOpen, setIsModalOpen] = useState(false); // État de la modal
  const mediaRecorderRef = useRef(null); // Utilisation de useRef pour stocker mediaRecorder
  const audioBlobRef = useRef(null); // Stockage de l'audio complet après l'enregistrement
  const [audioUrl, setAudioUrl] = useState(""); // URL pour le lecteur audio

  // Démarrer l'enregistrement
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      mediaRecorder.ondataavailable = (event) => {
        audioBlobRef.current = event.data; // Stocker l'audio
      };

      mediaRecorder.start(); // Démarrer l'enregistrement
    } catch (error) {
      console.error("Erreur lors de l'initialisation du MediaRecorder:", error);
    }
  };

  // Arrêter l'enregistrement et envoyer à OpenAI
  const handleStopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Arrêter l'enregistrement
      setIsRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = audioBlobRef.current;
        if (audioBlob) {
          await sendAudioToAPI(audioBlob); // Envoyer à OpenAI
        }
      };
    }
  };

  // Fonction pour envoyer l'audio à l'API backend
  const sendAudioToAPI = async (audioBlob) => {
    const audioFile = new File([audioBlob], "audio.webm", {
      type: "audio/webm",
    });

    const formData = new FormData();
    formData.append("file", audioFile);

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
      setTranscription(data.text); // Afficher la transcription reçue
      setAudioUrl(data.audioUrl); // Stocker l'URL de l'audio
    } catch (error) {
      console.error("Erreur lors de la transcription :", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Fonction pour copier le texte
  const handleCopyText = () => {
    navigator.clipboard.writeText(transcription);
    alert("Texte copié dans le presse-papier !");
  };

  // Fonction pour télécharger le texte sous forme de PDF avec jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF(); // Créer un nouveau document PDF
    doc.text(transcription, 10, 10); // Ajouter le texte de la transcription au PDF
    doc.save("transcription.pdf"); // Télécharger le PDF avec le nom 'transcription.pdf'
  };

  // Ouvrir la modal d'enregistrement
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Fermer la modal d'enregistrement
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Soumettre le nom de la transcription depuis la modal
  const handleSaveTranscription = async (transcriptionName) => {
    try {
      // Envoyer la transcription et le nom au backend ou à une base de données
      const response = await fetch("http://localhost:5015/save-transcription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: transcriptionName,
          transcription: transcription,
          audioUrl: audioUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement de la transcription");
      }

      alert("Transcription enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="transcription-container">
      <h2>Créer une nouvelle transcription</h2>

      {/* Section des boutons pour démarrer et arrêter */}
      <div className="recording-controls">
        <button
          onClick={handleStartRecording}
          disabled={isRecording}
          className="record-btn"
        >
          Démarrer l'enregistrement
        </button>
        <button
          onClick={handleStopRecording}
          disabled={!isRecording}
          className="stop-btn"
        >
          Arrêter l'enregistrement
        </button>
      </div>

      {/* Message indiquant que l'enregistrement ou la transcription est en cours */}
      <div className="status-message">
        {isRecording && <p>Enregistrement en cours...</p>}
        {isTranscribing && <p>Transcription en cours...</p>}
      </div>

      {/* Section de la transcription */}
      <div className="transcription-section">
        <div className="transcription-text">
          <h3>Transcription complète :</h3>
          <textarea
            value={transcription}
            readOnly
            placeholder="Votre transcription apparaîtra ici..."
          />
        </div>

        {/* Lecteur audio */}
        <div className="audio-player">
          <h3>Écouter l'enregistrement :</h3>
          {audioUrl && <audio controls src={audioUrl}></audio>}
        </div>
      </div>

      {/* Boutons pour copier, télécharger et enregistrer la transcription */}
      <div className="action-buttons">
        <button onClick={handleCopyText}>Copier le texte</button>
        <button onClick={handleDownloadPDF}>Télécharger PDF</button>
        <button onClick={handleOpenModal}>Enregistrer</button>
      </div>

      {/* Modal pour enregistrer */}
      {isModalOpen && (
        <SaveModal
          onSave={handleSaveTranscription}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default NewTranscription;
