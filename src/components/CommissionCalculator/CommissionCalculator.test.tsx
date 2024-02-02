import { fireEvent, render, screen } from "@testing-library/react";
import { assert, expect, test } from "vitest";
import CommissionCalculator from "./CommissionCalculator";

test("CalculateCommission renders correctly", () => {
  render(<CommissionCalculator />);
  expect(screen.getByText("Commission Calculator")).toBeDefined();
});

test("CalculateCommission calculates the correct commission", async () => {
  render(<CommissionCalculator />);
  const input = screen.getByLabelText("£");
  const button = screen.getByText("Calculate");

  fireEvent.change(input, { target: { value: "1000" } });
  fireEvent.click(button);

  await screen.findByText("Total Commission: £0.00");
});

test("Reset button clears values correctly", async () => {
  render(<CommissionCalculator />);
  const input = screen.getByLabelText("£") as HTMLInputElement;
  const button = screen.getByText("Calculate");
  const resetButton = screen.getByText("Reset");

  fireEvent.change(input, { target: { value: "1000" } });
  fireEvent.click(button);

  await screen.findByText("Total Commission: £0.00");

  fireEvent.click(resetButton);

  expect(screen.queryByText("Total Commission: £0.00")).toBeNull();

  assert.equal(input.value, "");
});
