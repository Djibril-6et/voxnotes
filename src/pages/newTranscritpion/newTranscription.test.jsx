import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewTranscription from './newTranscription';
import '@testing-library/jest-dom';
import SaveModal from '../../components/saveModal/saveModal';

// Mock du composant SaveModal
jest.mock('../../components/saveModal/saveModal', () => ({ onSave, onClose }) => (
  <div>
    <button onClick={() => onSave('Test Transcription')}>Save</button>
    <button onClick={onClose}>Close</button>
  </div>
));

beforeEach(() => {
  // Mock de navigator.mediaDevices.getUserMedia
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: jest.fn().mockResolvedValue({
        getTracks: () => [{ stop: jest.fn() }],
      }),
    },
    writable: true,
  });

  // Mock de navigator.clipboard
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(),
    },
  });
});

describe('NewTranscription component', () => {
  // Test 1: Vérifie que les boutons d'enregistrement et d'arrêt sont rendus correctement
  test('renders start and stop recording buttons', () => {
    render(<NewTranscription />);

    const startButton = screen.getByRole('button', { name: /Démarrer l'enregistrement/i });
    const stopButton = screen.getByRole('button', { name: /Stoppez enregistrement/i });

    // Vérifie que le bouton de démarrage est activé et celui d'arrêt est désactivé
    expect(startButton).toBeEnabled();
    expect(stopButton).toBeDisabled();
  });

  // Test 4: Vérifie que la modal d'enregistrement s'affiche et fonctionne
  test('opens save modal and saves transcription', async () => {
    render(<NewTranscription />);

    const saveButton = screen.getByRole('button', { name: /Enregistrer/i });

    // Simule l'ouverture de la modal
    fireEvent.click(saveButton);

    // Vérifie que la modal est rendue
    expect(screen.getByText(/Save/i)).toBeInTheDocument();

    // Simule l'enregistrement de la transcription via la modal
    fireEvent.click(screen.getByText(/Save/i));

    // Vérifie que la transcription a été sauvegardée
  });
});
