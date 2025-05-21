import React from "react";
import { render, screen } from "@testing-library/react";
import ThemeOptions from "../src/components/UI/ThemeOptions";

test("ThemeOptions renders radio buttons", () => {
  render(<ThemeOptions />);
  expect(screen.getByLabelText(/system/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/light/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/dark/i)).toBeInTheDocument();
});