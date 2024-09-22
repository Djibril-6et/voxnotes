/* eslint-disable no-undef, no-unused-vars */
import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./landingPage";
import "@testing-library/jest-dom";

jest.mock("../../components/banner/banner", () => {
  const MockBanner = () => <div>Banner Component</div>;
  MockBanner.displayName = "Banner";
  return MockBanner;
});

describe("Home component", () => {
  test("renders the Banner component", () => {
    render(<Home />);

    expect(screen.getByText("Banner Component")).toBeInTheDocument();
  });
});
