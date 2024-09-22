/* eslint-disable no-undef */
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Transcription from "./transcriptionList";

describe("Transcription component", () => {
  test("renders the link to create a new transcription", () => {
    render(
      <MemoryRouter>
        <Transcription />
      </MemoryRouter>
    );

    const newTranscriptionLink = screen.getByText(/New transcription/i);
    expect(newTranscriptionLink).toBeInTheDocument();
    expect(newTranscriptionLink.closest("a")).toHaveAttribute(
      "href",
      "/newtranscription"
    );
  });

  test("renders the list of transcriptions", () => {
    render(
      <MemoryRouter>
        <Transcription />
      </MemoryRouter>
    );

    expect(screen.getByText(/My Transcriptions/i)).toBeInTheDocument();

    const transcriptionTitle1 = screen.getAllByText(/Réunion de projet/i);
    const transcriptionTitle2 = screen.getAllByText(/Cours de Chimie/i);

    expect(transcriptionTitle1[0]).toBeInTheDocument();
    expect(transcriptionTitle2[0]).toBeInTheDocument();

    expect(
      screen.getByText(
        /Ce texte est un résumé de notre dernière réunion de projet/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Résumé du cours de chimie sur les réactions oxydoréduction/i
      )
    ).toBeInTheDocument();
  });
});
