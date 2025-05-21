import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Quiz from "../../src/components/Quiz/QuizIsland"; // You'd create this based on your UI

const SAMPLE_QUESTIONS = [
  {
    questionId: "q1",
    text: "What's 2 + 2?",
    choices: ["2", "3", "4", "5"],
    answer: "4"
  },
  {
    questionId: "q2",
    text: "What color is the sky?",
    choices: ["green", "blue", "red", "yellow"],
    answer: "blue"
  }
];

test("Quiz renders all questions and choices", () => {
  render(<Quiz questions={SAMPLE_QUESTIONS} />);
  expect(screen.getByText(/what's 2 \+ 2\?/i)).toBeInTheDocument();
  expect(screen.getByText(/what color is the sky\?/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
});

test("Quiz accepts and evaluates answers", () => {
  render(<Quiz questions={SAMPLE_QUESTIONS} />);
  // Simulate selecting answer for first question
  fireEvent.click(screen.getByLabelText(/4/i));
  // Simulate selecting answer for second question
  fireEvent.click(screen.getByLabelText(/blue/i));
  fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  // After submit, show score
  expect(screen.getByText(/score/i)).toBeInTheDocument();
});