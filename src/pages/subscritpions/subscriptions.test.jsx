/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Souscriptions from "./subscriptions";

const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ url: "http://mock-payment-url.com" }),
  })
);

describe("Souscriptions Component", () => {
  beforeEach(() => {
    localStorage.setItem(
      "userConnected",
      JSON.stringify({ user: { _id: "12345" } })
    );
  });

  afterEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  it("renders subscription sections and cards", () => {
    render(<Souscriptions />);

    expect(screen.getByText("Abonnements :")).toBeInTheDocument();
    expect(screen.getByText("Personnel")).toBeInTheDocument();
    expect(screen.getByText("École/Entreprise")).toBeInTheDocument();

    const paiementUniqueElements = screen.getAllByText("Paiement Unique");
    expect(paiementUniqueElements.length).toBe(2);

    expect(screen.getByText("15€ / mois")).toBeInTheDocument();
    expect(screen.getByText("300€")).toBeInTheDocument();
    expect(screen.getByText("3500€ / An")).toBeInTheDocument();
  });

  it("handles API failure when clicking on a subscription card", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "API error" }),
      })
    );

    render(<Souscriptions />);

    const paiementCard = screen.getByText("300€").closest(".card");
    const paiementButton = within(paiementCard).getByRole("button", {
      name: /Allez au paiement/i,
    });

    fireEvent.click(paiementButton);

    await screen.findByText("API error");

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
