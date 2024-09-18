// connexion.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Connexion from './connexion';
import usersServices from '../../services/users.services';

// Mocking usersServices for login
jest.mock('../../services/users.services');

describe('Connexion Component', () => {
  beforeEach(() => {
    render(
      <Router>
        <Connexion />
      </Router>
    );
  });

  it('renders the form fields and buttons', () => {
    // Vérifie que les champs d'email et de mot de passe sont rendus
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument();
    
    // Vérifie que les boutons sont rendus
    expect(screen.getByText('Me connecter')).toBeInTheDocument();
    expect(screen.getByText('Connexion avec Google')).toBeInTheDocument();
    expect(screen.getByText('Connexion avec GitHub')).toBeInTheDocument();
    expect(screen.getByText('Connexion avec Discord')).toBeInTheDocument();
    expect(screen.getByText('Pas encore inscrit ? Inscription')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    // Saisie dans le champ email
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    // Saisie dans le champ mot de passe
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  it('shows an alert when email or password is missing', () => {
    // Mocking window alert
    window.alert = jest.fn();

    // Simule le clic sur le bouton "Me connecter" sans remplir les champs
    const loginButton = screen.getByText('Me connecter');
    fireEvent.click(loginButton);

    // Vérifie que l'alerte s'affiche en cas de champs vides
    expect(window.alert).toHaveBeenCalledWith('Veuillez remplir tous les champs.');
  });

  it('validates the email format and shows an alert for invalid email', () => {
    // Mocking window alert
    window.alert = jest.fn();

    // Simule la saisie d'un email incorrect
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password123' } });

    // Simule le clic sur "Me connecter"
    fireEvent.click(screen.getByText('Me connecter'));

    // Vérifie que l'alerte d'email invalide s'affiche
    expect(window.alert).toHaveBeenCalledWith('Veuillez entrer une adresse email valide.');
  });

  it('calls the login service with correct credentials', async () => {
    // Mock the login service to resolve successfully
    const mockUser = { email: 'test@example.com', token: 'abc123' };
    usersServices.loginUser.mockResolvedValueOnce(mockUser);

    // Simule la saisie des bonnes informations
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password123' } });

    // Simule le clic sur "Me connecter"
    fireEvent.click(screen.getByText('Me connecter'));

    // Vérifie que la méthode loginUser a bien été appelée avec les bons paramètres
    expect(usersServices.loginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    // Ajout de vérifications supplémentaires si nécessaire, comme la redirection vers la page "profile"
  });
});