import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SouscriptionCard from './souscriptionCard';
import '@testing-library/jest-dom';

describe('SouscriptionCard component', () => {
  const mockOnClickFunction = jest.fn(); // Simule la fonction onClick

  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test
  });

  // Test 1: Vérifie que les informations du composant s'affichent correctement
  test('renders title, price, and content correctly', () => {
    render(
      <SouscriptionCard
        title="Souscription Premium"
        price="49,99 €"
        content="Accès illimité aux fonctionnalités avancées."
        onClickFunction={mockOnClickFunction}
      />
    );

    // Vérifie que le titre, le prix et le contenu sont affichés
    expect(screen.getByText(/Souscription Premium/i)).toBeInTheDocument();
    expect(screen.getByText(/49,99 €/i)).toBeInTheDocument();
    expect(screen.getByText(/Accès illimité aux fonctionnalités avancées/i)).toBeInTheDocument();
  });

  // Test 2: Vérifie que la fonction onClickFunction est appelée lorsque le bouton est cliqué
  test('calls onClickFunction when payment button is clicked', () => {
    render(
      <SouscriptionCard
        title="Souscription Premium"
        price="49,99 €"
        content="Accès illimité aux fonctionnalités avancées."
        onClickFunction={mockOnClickFunction}
      />
    );

    // Simule un clic sur le bouton "Allez au paiement"
    const paymentButton = screen.getByRole('button', { name: /Allez au paiement/i });
    fireEvent.click(paymentButton);

    // Vérifie que la fonction onClickFunction a été appelée une fois
    expect(mockOnClickFunction).toHaveBeenCalledTimes(1);
  });
});
