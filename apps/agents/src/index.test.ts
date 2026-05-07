import { describe, it, expect } from "vitest";
import { greeting } from "@packages/lib";

describe("agents entry", () => {
  it("composes a greeting from the shared lib", () => {
    expect(greeting("agentic engineering")).toContain("agentic engineering");
  });
});
