import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Banner from './banner';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';

// Simulez useNavigate dans un environnement JavaScript
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Banner component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Réinitialiser le mock avant chaque test
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate); // Aucune assertion de type ici
  });

  // Test 1: Vérifie que le texte de bienvenue est bien rendu
  test('renders welcome text', () => {
    render(
      <BrowserRouter>
        <Banner />
      </BrowserRouter>
    );

    const welcomeText = screen.getByText(/Bienvenue/i);
    const appName = screen.getAllByText(/VoxNotes/i);

    expect(welcomeText).toBeInTheDocument();
    expect(appName[0]).toBeInTheDocument();
  });

  // Test 2: Vérifie le comportement lorsque l'utilisateur est connecté
  test('navigates to transcription when user is connected', () => {
    // Simule la session utilisateur
    localStorage.setItem('userConnected', 'true');

    render(
      <BrowserRouter>
        <Banner />
      </BrowserRouter>
    );

    // Simule le clic sur le bouton
    const tryButton = screen.getByRole('button', { name: /Je veux Essayer/i });
    fireEvent.click(tryButton);

    // Vérifie que la fonction navigate a été appelée avec "/transcription"
    expect(mockNavigate).toHaveBeenCalledWith('/transcription');
  });

  // Test 3: Vérifie le comportement lorsque l'utilisateur n'est pas connecté
  test('navigates to connexion when user is not connected', () => {
    // Simule l'absence de session utilisateur
    localStorage.removeItem('userConnected');

    render(
      <BrowserRouter>
        <Banner />
      </BrowserRouter>
    );

    // Simule le clic sur le bouton
    const tryButton = screen.getByRole('button', { name: /Je veux Essayer/i });
    fireEvent.click(tryButton);

    // Vérifie que la fonction navigate a été appelée avec "/connexion"
    expect(mockNavigate).toHaveBeenCalledWith('/connexion');
  });
});
