import React, { useState, useRef } from "react";

function NewTranscription() {
  const [transcription, setTranscription] = useState(""); // Transcription complète
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null); // Utilisation de useRef pour stocker mediaRecorder
  const audioQueueRef = useRef([]); // File d'attente pour les segments audio
  const processingRef = useRef(false); // Indicateur pour savoir si une transcription est en cours

  // Fonction pour traiter les segments un par un
  const processNextAudioSegment = async () => {
    if (processingRef.current || audioQueueRef.current.length === 0) return;

    // Indiquer qu'une transcription est en cours
    processingRef.current = true;
    const audioBlob = audioQueueRef.current.shift(); // Extraire le premier élément de la file d'attente
    const audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" });

    // Vérification si le fichier est correctement généré
    console.log("Fichier audio généré :", audioFile);

    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      setIsTranscribing(true);
      console.log("Envoi du fichier à l'API backend...");

      const response = await fetch("http://localhost:5015/transcribe", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Obtenir le message d'erreur du serveur
        throw new Error(`Erreur lors de la transcription : ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      console.log("Réponse de l'API backend : ", data);
      setTranscription((prev) => prev + " " + data.text); // Ajouter la transcription à la transcription complète
    } catch (error) {
      console.error("Erreur lors de la transcription :", error);
    } finally {
      setIsTranscribing(false);
      processingRef.current = false; // Indiquer que la transcription est terminée

      // Traiter le segment suivant sans délai
      processNextAudioSegment();
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Utilisation de `audio/webm; codecs=opus` pour garantir que le codec Opus est utilisé
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm; codecs=opus" });
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      mediaRecorder.ondataavailable = (event) => {
        console.log("Nouveau segment audio disponible :", event.data);
        audioQueueRef.current.push(event.data); // Ajouter le segment à la file d'attente

        // Démarrer le traitement du segment si aucun autre segment n'est en cours de traitement
        if (!processingRef.current) {
          processNextAudioSegment();
        }
      };

      mediaRecorder.start(30000); // Enregistrer pendant 5 secondes
    } catch (error) {
      console.error("Erreur lors de l'initialisation du MediaRecorder:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Arrêter l'enregistrement
    }
    setIsRecording(false);
  };

  return (
    <div>
      <h2>Créer une nouvelle transcription</h2>
      <button onClick={handleStartRecording} disabled={isRecording}>
        Démarrer l'enregistrement
      </button>
      <button onClick={handleStopRecording} disabled={!isRecording}>
        Arrêter l'enregistrement
      </button>

      <div>
        {isRecording && <p>Enregistrement en cours...</p>}
        {isTranscribing && <p>Transcription en cours...</p>}
        <h3>Transcription complète :</h3>
        <p>{transcription}</p>
      </div>
    </div>
  );
}

export default NewTranscription;
