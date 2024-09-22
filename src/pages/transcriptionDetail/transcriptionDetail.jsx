import React from "react";
import { useParams } from "react-router-dom";

function TranscriptionDetail() {
  const { id } = useParams();

  // Simuler la récupération de la transcription depuis un backend ou un état global
  const transcription = {
    id,
    title: "Titre de la transcription",
    date: "2024-01-01",
    content: "Ceci est le contenu complet de la transcription.",
  };

  return (
    <div className="transcription-detail-container">
      <h2>{transcription.title}</h2>
      <p>
        <strong>Date:</strong>
        {transcription.date}
      </p>
      <div className="transcription-content">
        <p>{transcription.content}</p>
      </div>
    </div>
  );
}

export default TranscriptionDetail;
