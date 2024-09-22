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
      setAudioFile(file);

      return { transcription: data.text, audioUrl: data.audioUrl };
    } catch (error) {
      alert("Erreur lors de la transcription");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleUploadFile = async (file) => {
    await sendAudioToAPI(file);
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
    } catch (error) {}
  };

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
          await sendAudioToAPI(file);
        }
      };
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(transcription);
    alert("Texte copié dans le presse-papier !");
  };

  const handleDownloadPDF = () => {
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
    const formData = new FormData();
    formData.append("transcription", transcription);
    formData.append("title", transcriptionName);

    const userConnected = JSON.parse(localStorage.getItem("userConnected"));
    const userId = userConnected?.user?._id;

    if (userId) {
      formData.append("userId", userId);
    }

    if (audioFile) {
      formData.append("file", audioFile);
    }

    try {
      const response = await fetch(
        "http://localhost:9090/api/audioFiles/uploadfile",
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
      alert("Transcription et fichier audio enregistrés avec succès !");
    } catch (error) {
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
          onSave={handleSaveTranscription}
          onClose={handleCloseModal}
        />
      )}

      {isUploadModalOpen && (
        <FileUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUploadFile}
          sendAudioToAPI={sendAudioToAPI}
        />
      )}
    </div>
  );
}

export default NewTranscription;
