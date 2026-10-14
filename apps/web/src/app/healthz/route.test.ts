import { describe, expect, it } from "vitest";
import { GET, dynamic } from "./route";

describe("GET /healthz", () => {
  it("returns 200 ok", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("ok");
  });

  it("is never statically cached", () => {
    expect(dynamic).toBe("force-dynamic");
  });
});
