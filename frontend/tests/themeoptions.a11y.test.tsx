import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ThemeOptions from "../src/components/UI/ThemeOptions";

expect.extend(toHaveNoViolations);

test("ThemeOptions has no a11y violations", async () => {
  const { container } = render(<ThemeOptions />);
  expect(await axe(container)).toHaveNoViolations();
});