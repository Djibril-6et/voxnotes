import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Souscriptions from './subscriptions';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch pour une requête réussie
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ url: 'http://mock-payment-url.com' }),
  })
);

describe('Souscriptions Component', () => {
  beforeEach(() => {
    localStorage.setItem(
      'userConnected',
      JSON.stringify({ user: { _id: '12345' } })
    );
  });

  afterEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  it('renders subscription sections and cards', () => {
    render(<Souscriptions />);

    expect(screen.getByText('Abonnements :')).toBeInTheDocument();
    expect(screen.getByText('Personnel')).toBeInTheDocument();
    expect(screen.getByText('École/Entreprise')).toBeInTheDocument();

    const paiementUniqueElements = screen.getAllByText('Paiement Unique');
    expect(paiementUniqueElements.length).toBe(2);

    expect(screen.getByText('15€ / mois')).toBeInTheDocument();
    expect(screen.getByText('300€')).toBeInTheDocument();
    expect(screen.getByText('3500€ / An')).toBeInTheDocument();
  });

//   it('calls goToPaiement with the correct parameters when clicking a subscription card', async () => {
//     render(<Souscriptions />);

//     // Trouver la carte qui contient "300€" et ensuite le bouton dans cette carte
//     const paiementCard = screen.getByText('300€').closest('.card');
//     const paiementButton = within(paiementCard).getByRole('button', { name: /Allez au paiement/i });

//     // Vérifier que le bouton est bien présent avant le clic
//     expect(paiementButton).toBeInTheDocument();

//     // Déclencher le clic
//     fireEvent.click(paiementButton);

//     // Vérifier que fetch est bien appelé avec les bons paramètres
//     expect(fetch).toHaveBeenCalledWith(
//       'http://localhost:8080/create-checkout-session/Paiement Unique VoxNote',
//       expect.objectContaining({
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           price: 30000, // 300€ en centimes
//           userId: '12345',
//         }),
//       })
//     );
//   });

  it('handles API failure when clicking on a subscription card', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'API error' }),
      })
    );

    render(<Souscriptions />);

    const paiementCard = screen.getByText('300€').closest('.card');
    const paiementButton = within(paiementCard).getByRole('button', { name: /Allez au paiement/i });

    // Déclencher le clic
    fireEvent.click(paiementButton);

    // Vérifier que l'erreur est affichée dans le DOM
    await screen.findByText('API error');

    // Vérifier que fetch a été appelé
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});