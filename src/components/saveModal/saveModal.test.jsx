/* eslint-disable no-undef, no-unused-vars */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SaveModal from "./saveModal";
import "@testing-library/jest-dom";

describe("SaveModal component", () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal with input and buttons", () => {
    render(<SaveModal onSave={mockOnSave} onClose={mockOnClose} />);

    expect(
      screen.getByText(/Enregistrer la transcription/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Nom de la transcription/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Enregistrer/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Annuler/i })
    ).toBeInTheDocument();
  });

  test("submits form when transcription name is provided", () => {
    render(<SaveModal onSave={mockOnSave} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/Nom de la transcription/i);
    fireEvent.change(input, { target: { value: "Nouvelle transcription" } });

    const saveButton = screen.getByRole("button", { name: /Enregistrer/i });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith("Nouvelle transcription");
  });

  test("calls onClose when the cancel button is clicked", () => {
    render(<SaveModal onSave={mockOnSave} onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button", { name: /Annuler/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("does not submit form when transcription name is empty", () => {
    render(<SaveModal onSave={mockOnSave} onClose={mockOnClose} />);

    const saveButton = screen.getByRole("button", { name: /Enregistrer/i });
    fireEvent.click(saveButton);

    expect(mockOnSave).not.toHaveBeenCalled();
  });
});
