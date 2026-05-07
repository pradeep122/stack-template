import { describe, it, expect } from "vitest";
import { greeting } from "./index";

describe("greeting", () => {
  it("returns hello + the topic", () => {
    expect(greeting("world")).toBe("hello world");
  });

  it("preserves multi-word topics", () => {
    expect(greeting("agentic engineering")).toBe("hello agentic engineering");
  });
});
