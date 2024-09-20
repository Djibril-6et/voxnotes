/* eslint-disable no-undef */
import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./landingPage";
import "@testing-library/jest-dom";

// Mock du composant Banner
jest.mock("../../components/banner/banner", () => {
  const MockBanner = () => <div>Banner Component</div>;
  MockBanner.displayName = "Banner";
  return MockBanner;
});

describe("Home component", () => {
  // Test 1: Vérifie que le composant Banner est rendu
  test("renders the Banner component", () => {
    render(<Home />);

    // Vérifie que le composant Banner est affiché
    expect(screen.getByText("Banner Component")).toBeInTheDocument();
  });
});
