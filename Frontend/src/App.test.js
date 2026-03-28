import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders cheque printer heading", () => {
  render(<App />);
  expect(screen.getByText(/indian cheque printer/i)).toBeInTheDocument();
});
