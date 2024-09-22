/* eslint-disable no-undef, no-unused-vars */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Connexion from "./connexion";
import usersServices from "../../services/users.services";

jest.mock("../../services/users.services");

describe("Connexion Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <Connexion />
      </Router>
    );
  });

  it("renders the form fields and buttons", () => {
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByText("Me connecter")).toBeInTheDocument();
    expect(screen.getByText("Connexion avec Google")).toBeInTheDocument();
    expect(screen.getByText("Connexion avec GitHub")).toBeInTheDocument();
    expect(screen.getByText("Connexion avec Discord")).toBeInTheDocument();
    expect(screen.getByText("Pas encore inscrit ?")).toBeInTheDocument();
    expect(screen.getByText("Inscription")).toBeInTheDocument();
  });

  it("handles input changes", () => {
    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");

    const passwordInput = screen.getByPlaceholderText("Mot de passe");
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");
  });

  it("shows an alert when email or password is missing", () => {
    window.alert = jest.fn();

    const loginButton = screen.getByText("Me connecter");
    fireEvent.click(loginButton);

    expect(window.alert).toHaveBeenCalledWith(
      "Veuillez remplir tous les champs."
    );
  });

  it("validates the email format and shows an alert for invalid email", () => {
    window.alert = jest.fn();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mot de passe"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Me connecter"));

    expect(window.alert).toHaveBeenCalledWith(
      "Veuillez entrer une adresse email valide."
    );
  });

  it("calls the login service with correct credentials", async () => {
    const mockUser = { email: "test@example.com", token: "abc123" };
    usersServices.loginUser.mockResolvedValueOnce(mockUser);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mot de passe"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Me connecter"));

    expect(usersServices.loginUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
});
