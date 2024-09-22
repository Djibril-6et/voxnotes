/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Profil from "./profile";
import { MemoryRouter } from "react-router-dom";
import audioFilesServices from "../../services/audioFiles.services";

jest.mock("../../services/audioFiles.services", () => ({
  getUserFiles: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Profil component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem(
      "userConnected",
      JSON.stringify({
        user: {
          username: "testuser",
          email: "testuser@example.com",
          _id: "123",
        },
      })
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders profile information correctly", () => {
    render(
      <MemoryRouter>
        <Profil />
      </MemoryRouter>
    );

    const usernameElements = screen.getAllByText(/testuser/i);
    expect(usernameElements.length).toBeGreaterThan(0);

    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser@example.com/i)).toBeInTheDocument();
  });

  test("displays audio files correctly", async () => {
    const mockAudioFiles = [
      {
        fileName: "audio1.mp3",
        fileType: "mp3",
        fileSize: 1050000,
        status: "completed",
        uploadDate: "2023-09-15T00:00:00.000Z",
      },
    ];

    audioFilesServices.getUserFiles.mockResolvedValue(mockAudioFiles);

    render(
      <MemoryRouter>
        <Profil />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Vos fichiers audio/i)).toBeInTheDocument();
      expect(screen.getByText(/audio1.mp3/i)).toBeInTheDocument();
    });
  });

  test("shows no audio files message when no files are available", async () => {
    audioFilesServices.getUserFiles.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Profil />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Aucun fichier audio disponible/i)
      ).toBeInTheDocument();
    });
  });
});
