import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import TranscriptionCard from '../../components/transcriptionCard';

function Transcription() {
  const fakeData = [
    {
      id: 1,
      title: 'Réunion de projet',
      date: '2024-01-01',
      content: 'Ce texte est un résumé de notre dernière réunion de projet où nous avons discuté des prochaines étapes...'
    },
    {
      id: 2,
      title: 'Cours de Chimie',
      date: '2024-01-02',
      content: 'Résumé du cours de chimie sur les réactions oxydoréduction, très intéressant pour comprendre...'
    }
  ];

  return (
    <div className="transcription-page">
      <section className="new-transcription-section">
        <div className="centered-content">
        <Link to="/newtranscription" className="new-transcription-link">
            New transcription
          </Link>
        </div>
      </section>
      <section className="my-transcriptions-section">
        <h1>My Transcriptions</h1>
        <div className="card-section">
        {fakeData.map(transcription => (
          <TranscriptionCard key={transcription.id} title={transcription.title} date={transcription.date} content={transcription.content} />
        ))}
        </div>
      </section>
    </div>
  );
}

export default Transcription;
