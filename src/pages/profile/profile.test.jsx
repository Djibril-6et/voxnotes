import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Profil from "./profile";
import { MemoryRouter } from "react-router-dom";
import audioFilesServices from "../../services/audioFiles.services";

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
});
