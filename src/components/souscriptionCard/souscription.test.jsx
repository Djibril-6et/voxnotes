import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SouscriptionCard from "./souscriptionCard";
import "@testing-library/jest-dom";

describe("SouscriptionCard component", () => {
  const mockOnClickFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders title, price, and content correctly", () => {
    render(
      <SouscriptionCard
        title="Souscription Premium"
        price="49,99 €"
        content="Accès illimité aux fonctionnalités avancées."
        onClickFunction={mockOnClickFunction}
      />
    );

    expect(screen.getByText(/Souscription Premium/i)).toBeInTheDocument();
    expect(screen.getByText(/49,99 €/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Accès illimité aux fonctionnalités avancées/i)
    ).toBeInTheDocument();
  });

  test("calls onClickFunction when payment button is clicked", () => {
    render(
      <SouscriptionCard
        title="Souscription Premium"
        price="49,99 €"
        content="Accès illimité aux fonctionnalités avancées."
        onClickFunction={mockOnClickFunction}
      />
    );

    const paymentButton = screen.getByRole("button", {
      name: /Allez au paiement/i,
    });
    fireEvent.click(paymentButton);

    expect(mockOnClickFunction).toHaveBeenCalledTimes(1);
  });
});
