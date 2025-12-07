import {
  isTokenValid,
  getTokenExpiresIn,
  getAccessToken,
  isUserValid,
} from "../tokenUtils";
import { GoTrueUser } from "../tokenUtils";

describe("tokenUtils", () => {
  describe("isTokenValid", () => {
    it("powinien zwrócić false dla wygasłego tokena", () => {
      const user: GoTrueUser = {
        token: {
          expires_at: Date.now() - 1000, // wygasł sekundę temu
        },
      };
      expect(isTokenValid(user)).toBe(false);
    });

    it("powinien zwrócić true dla ważnego tokena", () => {
      const user: GoTrueUser = {
        token: {
          expires_at: Date.now() + 3600000, // wygaśnie za godzinę
        },
      };
      expect(isTokenValid(user)).toBe(true);
    });

    it("powinien uwzględnić bufor 60 sekund", () => {
      // Token wygaśnie za 30 sekund
      const user: GoTrueUser = {
        token: {
          expires_at: Date.now() + 30000,
        },
      };
      // Z buforem 60s token powinien być uznany za wygasły
      expect(isTokenValid(user)).toBe(false);
    });

    it("powinien zwrócić false dla null/undefined", () => {
      expect(isTokenValid(null)).toBe(false);
      expect(isTokenValid(undefined)).toBe(false);
    });

    it("powinien zwrócić false dla użytkownika bez tokena", () => {
      const user: GoTrueUser = {
        id: "test-id",
        email: "test@example.com",
      };
      expect(isTokenValid(user)).toBe(false);
    });

    it("powinien zaakceptować custom bufor", () => {
      // Token wygaśnie za 2 minuty
      const user: GoTrueUser = {
        token: {
          expires_at: Date.now() + 120000,
        },
      };
      // Z domyślnym buforem 60s - powinien być ważny
      expect(isTokenValid(user)).toBe(true);
      // Z buforem 3 minut - powinien być wygasły
      expect(isTokenValid(user, 180000)).toBe(false);
    });
  });

  describe("getTokenExpiresIn", () => {
    it("powinien zwrócić pozostały czas w milisekundach", () => {
      const futureTime = Date.now() + 60000; // za 1 minutę
      const user: GoTrueUser = {
        token: {
          expires_at: futureTime,
        },
      };
      const remaining = getTokenExpiresIn(user);
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(60000);
    });

    it("powinien zwrócić 0 dla wygasłego tokena", () => {
      const user: GoTrueUser = {
        token: {
          expires_at: Date.now() - 1000,
        },
      };
      expect(getTokenExpiresIn(user)).toBe(0);
    });

    it("powinien zwrócić 0 dla null/undefined", () => {
      expect(getTokenExpiresIn(null)).toBe(0);
      expect(getTokenExpiresIn(undefined)).toBe(0);
    });

    it("powinien zwrócić 0 dla użytkownika bez tokena", () => {
      const user: GoTrueUser = {
        id: "test-id",
      };
      expect(getTokenExpiresIn(user)).toBe(0);
    });
  });

  describe("getAccessToken", () => {
    it("powinien zwrócić access token z obiektu użytkownika", () => {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
      const user: GoTrueUser = {
        token: {
          access_token: token,
        },
      };
      expect(getAccessToken(user)).toBe(token);
    });

    it("powinien zwrócić null gdy brak tokena", () => {
      const user: GoTrueUser = {
        id: "test-id",
      };
      expect(getAccessToken(user)).toBeNull();
    });

    it("powinien zwrócić null dla null/undefined", () => {
      expect(getAccessToken(null)).toBeNull();
      expect(getAccessToken(undefined)).toBeNull();
    });
  });

  describe("isUserValid", () => {
    it("powinien zwrócić true dla prawidłowego obiektu użytkownika", () => {
      const user: GoTrueUser = {
        id: "test-id",
        email: "test@example.com",
        token: {
          access_token: "token123",
          expires_at: Date.now() + 3600000,
        },
      };
      expect(isUserValid(user)).toBe(true);
    });

    it("powinien zwrócić false bez id", () => {
      const user: GoTrueUser = {
        email: "test@example.com",
        token: {
          access_token: "token123",
        },
      };
      expect(isUserValid(user)).toBe(false);
    });

    it("powinien zwrócić false bez email", () => {
      const user: GoTrueUser = {
        id: "test-id",
        token: {
          access_token: "token123",
        },
      };
      expect(isUserValid(user)).toBe(false);
    });

    it("powinien zwrócić false bez tokena", () => {
      const user: GoTrueUser = {
        id: "test-id",
        email: "test@example.com",
      };
      expect(isUserValid(user)).toBe(false);
    });

    it("powinien zwrócić false dla null/undefined", () => {
      expect(isUserValid(null)).toBe(false);
      expect(isUserValid(undefined)).toBe(false);
    });
  });
});
