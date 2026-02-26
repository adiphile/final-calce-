import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Calculator from "../components/Calculator";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});

describe("Calculator component", () => {
  it("performs basic addition", () => {
    render(<Calculator />);
    const display = screen.getByText("0");
    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText("="));
    expect(display.textContent).toBe("3");
  });

  it("toggles scientific mode and shows extra keys", () => {
    render(<Calculator />);
    expect(screen.queryByText("sin")).toBeNull();
    fireEvent.click(screen.getByText("Scientific"));
    expect(screen.getByText("sin")).toBeTruthy();
    // back to basic
    fireEvent.click(screen.getByText("Basic"));
    expect(screen.queryByText("sin")).toBeNull();
  });

  it("uses scientific power operator", () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText("Scientific"));
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText("^"));
    fireEvent.click(screen.getByText("3"));
    fireEvent.click(screen.getByText("="));
    const display = screen.getByText("8");
    expect(display).toBeTruthy();
  });
});
