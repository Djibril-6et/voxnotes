/* eslint-disable no-undef */
// inscription.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Inscription from "./inscription";
import usersServices from "../../services/users.services";

// Mocking usersServices for registration
jest.mock("../../services/users.services");

describe("Inscription Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <Inscription />
      </Router>
    );
  });

  it("renders the form fields and buttons", () => {
    // Vérifie que les champs sont bien affichés
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    // Vérifie que les boutons d'inscription sont présents
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText("S'inscrire avec Google")).toBeInTheDocument();
    expect(screen.getByText("S'inscrire avec GitHub")).toBeInTheDocument();
    expect(screen.getByText("S'inscrire avec Discord")).toBeInTheDocument();
  });

  it("handles input changes", () => {
    // Saisie dans le champ username
    const usernameInput = screen.getByPlaceholderText("Username");
    fireEvent.change(usernameInput, { target: { value: "TestUser" } });
    expect(usernameInput.value).toBe("TestUser");

    // Saisie dans le champ email
    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");

    // Saisie dans le champ mot de passe
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");
  });

  it("shows an alert when fields are missing", () => {
    // Mocking window alert
    window.alert = jest.fn();

    // Simule le clic sur le bouton "Register" sans remplir tous les champs
    const registerButton = screen.getByText("Register");
    fireEvent.click(registerButton);

    // Vérifie que l'alerte s'affiche en cas de champs vides
    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields");
  });

  it("calls the registration service with correct data", async () => {
    // Mock the register service to resolve successfully
    usersServices.registerUser.mockResolvedValueOnce({
      message: "User registered",
    });

    // Mocking window alert
    window.alert = jest.fn();

    // Simule la saisie des informations correctes
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Simule le clic sur "Register"
    const registerButton = screen.getByText("Register");
    fireEvent.click(registerButton);

    // Vérifie que la méthode registerUser a bien été appelée avec les bons paramètres
    expect(usersServices.registerUser).toHaveBeenCalledWith({
      username: "TestUser",
      email: "test@example.com",
      password: "password123",
    });

    // Vérifie que l'alerte de succès est affichée
    // expect(window.alert).toHaveBeenCalledWith('User registered successfully');
  });
});
