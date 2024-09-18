import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SaveModal from './saveModal';
import '@testing-library/jest-dom';

describe('SaveModal component', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test
  });

  // Test 1: Vérifie que la modale s'affiche correctement avec les éléments attendus
  test('renders modal with input and buttons', () => {
    render(<SaveModal onSave={mockOnSave} onClose={mockOnClose} />);

    // Vérifie que le titre de la modale est rendu
    expect(screen.getByText(/Enregistrer la transcription/i)).toBeInTheDocument();

    // Vérifie que le champ de texte est présent
    expect(screen.getByPlaceholderText(/Nom de la transcription/i)).toBeInTheDocument();

    // Utilisez getByRole pour cibler le bouton "Enregistrer"
    expect(screen.getByRole('button', { name: /Enregistrer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
  });

  // Test 2: Vérifie la soumission du formulaire lorsque le nom de la transcription est fourni
  test('submits form when transcription name is provided', () => {
    render(<SaveModal onSave={mockOnSave} onClose={mockOnClose} />);

    // Récupère le champ d'entrée et y entre une valeur
    const input = screen.getByPlaceholderText(/Nom de la transcription/i);
    fireEvent.change(input, { target: { value: 'Nouvelle transcription' } });

    // Simule la soumission du formulaire
    const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
    fireEvent.click(saveButton);

    // Vérifie que la fonction onSave a été appelée avec la valeur correcte
    expect(mockOnSave).toHaveBeenCalledWith('Nouvelle transcription');
  });

  // Test 3: Vérifie que la fonction onClose est appelée lorsqu'on clique sur "Annuler"
  test('calls onClose when the cancel button is clicked', () => {
    render(<SaveModal onSave={mockOnSave} onClose={mockOnClose} />);

    // Simule le clic sur le bouton "Annuler"
    const closeButton = screen.getByRole('button', { name: /Annuler/i });
    fireEvent.click(closeButton);

    // Vérifie que la fonction onClose a été appelée
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test 4: Vérifie que le formulaire ne se soumet pas si le nom de la transcription est vide
  test('does not submit form when transcription name is empty', () => {
    render(<SaveModal onSave={mockOnSave} onClose={mockOnClose} />);

    // Simule la soumission du formulaire sans entrer de nom
    const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
    fireEvent.click(saveButton);

    // Vérifie que la fonction onSave n'a pas été appelée
    expect(mockOnSave).not.toHaveBeenCalled();
  });
});
