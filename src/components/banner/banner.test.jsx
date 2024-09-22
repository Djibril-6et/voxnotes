/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Banner from "./banner";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Banner component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders welcome text", () => {
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

  test("navigates to transcription when user is connected", () => {
    localStorage.setItem("userConnected", "true");

    render(
      <BrowserRouter>
        <Banner />
      </BrowserRouter>
    );

    const tryButton = screen.getByRole("button", { name: /Je veux Essayer/i });
    fireEvent.click(tryButton);

    expect(mockNavigate).toHaveBeenCalledWith("/transcription");
  });

  test("navigates to connexion when user is not connected", () => {
    localStorage.removeItem("userConnected");

    render(
      <BrowserRouter>
        <Banner />
      </BrowserRouter>
    );

    const tryButton = screen.getByRole("button", { name: /Je veux Essayer/i });
    fireEvent.click(tryButton);

    expect(mockNavigate).toHaveBeenCalledWith("/connexion");
  });
});
