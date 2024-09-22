/* eslint-disable no-undef, no-unused-vars */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NewTranscription from "./newTranscription";
import "@testing-library/jest-dom";

jest.mock("../../components/saveModal/saveModal", () => {
  const React = require("react");
  const PropTypes = require("prop-types");

  const MockSaveModal = ({ onSave, onClose }) => (
    <div>
      <button onClick={() => onSave("Test Transcription")}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );

  MockSaveModal.displayName = "SaveModal";

  MockSaveModal.propTypes = {
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  return MockSaveModal;
});

beforeEach(() => {
  Object.defineProperty(navigator, "mediaDevices", {
    value: {
      getUserMedia: jest.fn().mockResolvedValue({
        getTracks: () => [{ stop: jest.fn() }],
      }),
    },
    writable: true,
  });

  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(),
    },
  });
});

describe("NewTranscription component", () => {
  test("renders start and stop recording buttons", () => {
    render(<NewTranscription />);

    const startButton = screen.getByRole("button", {
      name: /Démarrer l'enregistrement/i,
    });
    const stopButton = screen.getByRole("button", {
      name: /Stoppez enregistrement/i,
    });

    expect(startButton).toBeEnabled();
    expect(stopButton).toBeDisabled();
  });

  test("opens save modal and saves transcription", async () => {
    render(<NewTranscription />);

    const saveButton = screen.getByRole("button", { name: /Enregistrer/i });

    fireEvent.click(saveButton);

    expect(screen.getByText(/Save/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Save/i));
  });
});
