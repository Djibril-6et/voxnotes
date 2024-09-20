/* eslint-disable no-undef */
import React from "react";
import { render, screen } from "@testing-library/react";
import TranscriptionCard from "./transcriptionCard";
import "@testing-library/jest-dom";

describe("TranscriptionCard component", () => {
  // Test 1: Vérifie que les informations du composant s'affichent correctement
  test("renders title, date, and content correctly", () => {
    render(
      <TranscriptionCard
        title="Transcription 1"
        date="01/01/2024"
        content="Ceci est un résumé de la transcription."
      />
    );

    // Vérifie que le titre, la date et le contenu sont affichés
    expect(screen.getByText(/Transcription 1/i)).toBeInTheDocument();
    expect(screen.getByText(/01\/01\/2024/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Ceci est un résumé de la transcription/i)
    ).toBeInTheDocument();
  });
});
