import { emailPattern, passwordPattern } from "../patterns";

describe("patterns", () => {
  describe("emailPattern", () => {
    it("powinien zaakceptować poprawny email", () => {
      const validEmails = [
        "user@example.com",
        "test.user@example.com",
        "user+tag@example.co.uk",
        "user_name@example.org",
        "123@example.com",
        "user@sub.example.com",
        "a@b.co",
      ];

      validEmails.forEach((email) => {
        expect(emailPattern.test(email)).toBe(true);
      });
    });

    it("powinien odrzucić niepoprawny email", () => {
      const invalidEmails = [
        "user",
        "@example.com",
        "user@",
        "user@.com",
        "user @example.com",
        "user@example",
        "user@example.",
        "",
        "user@exam ple.com",
      ];

      invalidEmails.forEach((email) => {
        expect(emailPattern.test(email)).toBe(false);
      });
    });

    it("powinien zaakceptować email z różnymi domenami najwyższego poziomu", () => {
      const emails = [
        "user@example.com",
        "user@example.org",
        "user@example.net",
        "user@example.co",
        "user@example.io",
        "user@example.tech",
      ];

      emails.forEach((email) => {
        expect(emailPattern.test(email)).toBe(true);
      });
    });

    it("powinien zaakceptować email ze znakami specjalnymi w nazwie", () => {
      const emails = [
        "user.name@example.com",
        "user_name@example.com",
        "user+tag@example.com",
        "user-name@example.com",
        "123user@example.com",
      ];

      emails.forEach((email) => {
        expect(emailPattern.test(email)).toBe(true);
      });
    });

    it("powinien odrzucić email ze znakami niedozwolonymi", () => {
      const emails = [
        "user name@example.com", // spacja
        "user#name@example.com", // #
        "user@exam ple.com", // spacja w domenie
      ];

      emails.forEach((email) => {
        expect(emailPattern.test(email)).toBe(false);
      });
    });
  });

  describe("passwordPattern", () => {
    it("powinien zaakceptować hasło o długości minimum 4 znaki", () => {
      const validPasswords = [
        "1234",
        "abcd",
        "Pass",
        "!@#$",
        "a b c",
        "12345678901234567890",
      ];

      validPasswords.forEach((password) => {
        expect(passwordPattern.test(password)).toBe(true);
      });
    });

    it("powinien odrzucić hasło krótsze niż 4 znaki", () => {
      const invalidPasswords = ["", "1", "12", "123", "ab", "a b"];

      invalidPasswords.forEach((password) => {
        expect(passwordPattern.test(password)).toBe(false);
      });
    });

    it("powinien zaakceptować hasło z dowolnymi znakami", () => {
      const passwords = [
        "Pass123!",
        "password with spaces",
        "!@#$%^&*()",
        "Zażółć gęślą jaźń", // polskie znaki
        "🔒🔑🔐🔓", // emoji (min 4 znaki)
      ];

      passwords.forEach((password) => {
        expect(passwordPattern.test(password)).toBe(true);
      });
    });

    it("powinien zaakceptować bardzo długie hasło", () => {
      const longPassword = "a".repeat(1000);
      expect(passwordPattern.test(longPassword)).toBe(true);
    });

    it("powinien zaakceptować hasło dokładnie 4-znakowe", () => {
      expect(passwordPattern.test("1234")).toBe(true);
      expect(passwordPattern.test("abcd")).toBe(true);
      expect(passwordPattern.test("!@#$")).toBe(true);
    });

    it("powinien odrzucić hasło dokładnie 3-znakowe", () => {
      expect(passwordPattern.test("123")).toBe(false);
      expect(passwordPattern.test("abc")).toBe(false);
      expect(passwordPattern.test("!@#")).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("emailPattern nie powinien zaakceptować null jako string", () => {
      expect(emailPattern.test("null")).toBe(false);
      expect(emailPattern.test("undefined")).toBe(false);
    });

    it("passwordPattern powinien zaakceptować hasło składające się tylko ze spacji (jeśli >= 4)", () => {
      expect(passwordPattern.test("    ")).toBe(true); // 4 spacje
      expect(passwordPattern.test("   ")).toBe(false); // 3 spacje
    });

    it("emailPattern powinien wymagać domeny z co najmniej 2 znakami", () => {
      expect(emailPattern.test("user@example.c")).toBe(false);
      expect(emailPattern.test("user@example.co")).toBe(true);
      expect(emailPattern.test("user@example.com")).toBe(true);
    });

    it("emailPattern powinien obsługiwać subdomenę", () => {
      expect(emailPattern.test("user@mail.example.com")).toBe(true);
      expect(emailPattern.test("user@sub.mail.example.com")).toBe(true);
    });
  });
});
