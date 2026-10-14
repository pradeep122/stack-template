import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: (handler: unknown) => handler,
  createRouteMatcher: () => () => false,
}));

import { config } from "./proxy";

function runs(pathname: string) {
  return config.matcher.some((pattern) =>
    new RegExp(`^${pattern}$`).test(pathname),
  );
}

describe("proxy matcher", () => {
  it("skips /healthz so health checks never hit auth", () => {
    expect(runs("/healthz")).toBe(false);
  });

  it("still runs on app routes", () => {
    expect(runs("/")).toBe(true);
    expect(runs("/notes/abc")).toBe(true);
    expect(runs("/healthzz")).toBe(true);
  });
});
