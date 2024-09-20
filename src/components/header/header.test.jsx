/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "./header";
import "@testing-library/jest-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Simulez useNavigate et useTranslation
jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Header component", () => {
  const mockNavigate = jest.fn();
  const mockChangeLanguage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useTranslation.mockReturnValue({
      t: (key) => key, // Retourne la clé pour simplifier les tests
      i18n: { changeLanguage: mockChangeLanguage },
    });
  });

  // Test 1: Vérifie que les liens de connexion s'affichent lorsque l'utilisateur n'est pas authentifié
  test("renders login and about links when user is not authenticated", () => {
    localStorage.removeItem("userConnected"); // Simule l'absence de session utilisateur

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Vérifie la présence des liens de connexion et de "à propos"
    expect(screen.getByText(/banner.connexion/i)).toBeInTheDocument();
    expect(screen.getByText(/banner.about/i)).toBeInTheDocument();
  });

  // Test 2: Vérifie que les liens "Transcription", "Profil" et "Déconnexion" s'affichent lorsque l'utilisateur est authentifié
  test("renders authenticated links when user is authenticated", () => {
    localStorage.setItem("userConnected", "true"); // Simule la session utilisateur

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Vérifie la présence des liens "Transcription", "Profil" et "Déconnexion"
    expect(screen.getByText(/Transcription/i)).toBeInTheDocument();
    expect(screen.getByText(/Profil/i)).toBeInTheDocument();
    expect(screen.getByText(/Déconnexion/i)).toBeInTheDocument();
  });

  // Test 3: Vérifie que la langue change lorsqu'une option est sélectionnée
  test("changes language when a different option is selected", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const languageSelector = screen.getByRole("combobox");
    fireEvent.change(languageSelector, { target: { value: "fr" } });

    // Vérifie que la fonction de changement de langue a été appelée avec "fr"
    expect(mockChangeLanguage).toHaveBeenCalledWith("fr");
  });

  // Test 4: Vérifie la gestion de la déconnexion
  test("handles logout and redirects to homepage", () => {
    localStorage.setItem("userConnected", "true"); // Simule la session utilisateur

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Simule le clic sur le bouton "Déconnexion"
    const logoutLink = screen.getByText(/Déconnexion/i);
    fireEvent.click(logoutLink);

    // Vérifie que la session utilisateur a été supprimée
    expect(localStorage.getItem("userConnected")).toBeNull();

    // Vérifie que la redirection vers la page d'accueil a été effectuée
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
