import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Inscription from "./inscription";
import usersServices from "../../services/users.services";

jest.mock("../../services/users.services");

describe("Inscription Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <Inscription />
      </Router>
    );
  });

  it("renders the form fields and buttons", () => {
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText("S'inscrire avec Google")).toBeInTheDocument();
    expect(screen.getByText("S'inscrire avec GitHub")).toBeInTheDocument();
    expect(screen.getByText("S'inscrire avec Discord")).toBeInTheDocument();
  });

  it("handles input changes", () => {
    const usernameInput = screen.getByPlaceholderText("Username");
    fireEvent.change(usernameInput, { target: { value: "TestUser" } });
    expect(usernameInput.value).toBe("TestUser");

    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");

    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");
  });

  it("shows an alert when fields are missing", () => {
    window.alert = jest.fn();

    const registerButton = screen.getByText("Register");
    fireEvent.click(registerButton);

    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields");
  });

  it("calls the registration service with correct data", async () => {
    usersServices.registerUser.mockResolvedValueOnce({
      message: "User registered",
    });

    window.alert = jest.fn();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    const registerButton = screen.getByText("Register");
    fireEvent.click(registerButton);

    expect(usersServices.registerUser).toHaveBeenCalledWith({
      username: "TestUser",
      email: "test@example.com",
      password: "password123",
    });
  });
});
