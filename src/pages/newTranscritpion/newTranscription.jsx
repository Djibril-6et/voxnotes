import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import "./newTranscription.css";
import SaveModal from "../../components/saveModal/saveModal";

function NewTranscription() {
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioBlobRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState("");

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
      setTranscription(data.text);
      setAudioUrl(data.audioUrl);
    } catch (error) {
      // eslint-disable-next-line
      console.error("Erreur lors de la transcription :", error);
    } finally {
      setIsTranscribing(false);
    }
  };

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
      // eslint-disable-next-line
      console.error("Erreur lors de l'initialisation du MediaRecorder:", error);
    }
  };

  const handleStopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = audioBlobRef.current;
        if (audioBlob) {
          await sendAudioToAPI(audioBlob);
        }
      };
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(transcription);
    // eslint-disable-next-line
    alert("Texte copié dans le presse-papier !");
  };

  const handleDownloadPDF = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();
    doc.text(transcription, 10, 10);
    doc.save("transcription.pdf");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTranscription = async (transcriptionName) => {
    try {
      const response = await fetch("http://localhost:5015/save-transcription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: transcriptionName,
          transcription,
          audioUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement de la transcription");
      }
      // eslint-disable-next-line
      alert("Transcription enregistrée avec succès !");
    } catch (error) {
      // eslint-disable-next-line
      console.error("Erreur lors de l'enregistrement :", error);
    } finally {
      handleCloseModal();
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
          D&eacute;marrer l&apos;enregistrement
        </button>
        <button
          type="button"
          onClick={handleStopRecording}
          disabled={!isRecording}
          className="stop-btn"
        >
          Stoppez enregistrement
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
          onSave={handleSaveTranscription}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default NewTranscription;
