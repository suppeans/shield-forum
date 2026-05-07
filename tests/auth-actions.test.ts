import { describe, expect, it } from "vitest";
import { authErrorMessage } from "@/lib/actions/auth";

describe("auth action helpers", () => {
  it("explains Supabase email quota errors", () => {
    expect(authErrorMessage("email rate limit exceeded")).toContain(
      "Registration email quota is temporarily exhausted",
    );
  });

  it("keeps unknown auth errors unchanged", () => {
    expect(authErrorMessage("Invalid login credentials")).toBe(
      "Invalid login credentials",
    );
  });
});
