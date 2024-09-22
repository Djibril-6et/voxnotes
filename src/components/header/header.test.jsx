import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "./header";
import "@testing-library/jest-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Header component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders login and about links when user is not authenticated", () => {
    localStorage.removeItem("userConnected");

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(screen.getByText("À propos")).toBeInTheDocument();
  });

  test("renders authenticated links when user is authenticated", () => {
    localStorage.setItem("userConnected", "true");

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText(/Transcription/i)).toBeInTheDocument();
    expect(screen.getByText(/Profil/i)).toBeInTheDocument();
    expect(screen.getByText(/Déconnexion/i)).toBeInTheDocument();
  });

  test("changes language when a different option is selected", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  });

  test("handles logout and redirects to homepage", () => {
    localStorage.setItem("userConnected", "true");

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const logoutLink = screen.getByText(/Déconnexion/i);
    fireEvent.click(logoutLink);

    expect(localStorage.getItem("userConnected")).toBeNull();

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
