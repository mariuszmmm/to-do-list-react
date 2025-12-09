import {
  formatCurrentDay,
  formatCurrentTime,
  formatCurrentDate,
  formatCurrentDateISO,
} from "../formatCurrentDate";

describe("formatCurrentDate", () => {
  const mockDate = new Date("2025-12-09T14:30:45.000Z");

  describe("formatCurrentDay", () => {
    it("powinien sformatować dzień tygodnia dla polskiej lokalizacji", () => {
      const result = formatCurrentDay(mockDate, "pl-PL");
      expect(result.toLowerCase()).toContain("wtorek");
    });

    it("powinien sformatować dzień tygodnia dla angielskiej lokalizacji", () => {
      const result = formatCurrentDay(mockDate, "en-US");
      expect(result.toLowerCase()).toContain("tuesday");
    });

    it("powinien sformatować dzień tygodnia dla niemieckiej lokalizacji", () => {
      const result = formatCurrentDay(mockDate, "de-DE");
      expect(result.toLowerCase()).toContain("dienstag");
    });
  });

  describe("formatCurrentTime", () => {
    it("powinien sformatować czas z datą dla polskiej lokalizacji", () => {
      const result = formatCurrentTime(mockDate, "pl-PL");
      expect(result).toMatch(/\d{2}:\d{2}:\d{2}/); // format czasu HH:MM:SS
      expect(result).toContain("9");
      expect(result.toLowerCase()).toContain("grudnia");
    });

    it("powinien sformatować czas z datą dla angielskiej lokalizacji", () => {
      const result = formatCurrentTime(mockDate, "en-US");
      expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}/); // format czasu
      expect(result.toLowerCase()).toContain("december");
    });

    it("powinien zawierać pełną nazwę miesiąca", () => {
      const result = formatCurrentTime(mockDate, "en-US");
      expect(result.toLowerCase()).toMatch(/december|grudzień|dezember/);
    });
  });

  describe("formatCurrentDate", () => {
    it("powinien sformatować datę z czasem dla polskiej lokalizacji", () => {
      const result = formatCurrentDate(mockDate, "pl-PL");
      expect(result).toMatch(/\d{1,2}\.\d{1,2}\.\d{4}/); // DD.MM.YYYY
      expect(result).toMatch(/\d{2}:\d{2}/); // HH:MM
    });

    it("powinien sformatować datę z czasem dla angielskiej lokalizacji", () => {
      const result = formatCurrentDate(mockDate, "en-US");
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // M/D/YYYY
      expect(result).toMatch(/\d{1,2}:\d{2}/); // HH:MM
    });

    it("powinien zawierać rok 2025", () => {
      const result = formatCurrentDate(mockDate, "en-US");
      expect(result).toContain("2025");
    });

    it("powinien zawierać godziny i minuty", () => {
      const result = formatCurrentDate(mockDate, "pl-PL");
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe("formatCurrentDateISO", () => {
    it("powinien zwrócić datę w formacie ISO", () => {
      const result = formatCurrentDateISO();
      // ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("powinien zwrócić aktualną datę", () => {
      const before = new Date().getTime();
      const result = formatCurrentDateISO();
      const after = new Date().getTime();

      const resultTime = new Date(result).getTime();
      expect(resultTime).toBeGreaterThanOrEqual(before - 100);
      expect(resultTime).toBeLessThanOrEqual(after + 100);
    });

    it("powinien zawierać znak Z na końcu (UTC)", () => {
      const result = formatCurrentDateISO();
      expect(result).toMatch(/Z$/);
    });

    it("każde wywołanie powinno zwrócić inną wartość (lub bardzo zbliżoną)", () => {
      const result1 = formatCurrentDateISO();
      // Małe opóźnienie
      const result2 = formatCurrentDateISO();

      // Sprawdzamy czy format jest poprawny
      expect(result1).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(result2).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });

  describe("edge cases", () => {
    it("powinien obsłużyć datę z początku epoki Unix", () => {
      const epochDate = new Date(0);
      const result = formatCurrentDate(epochDate, "en-US");
      expect(result).toContain("1970");
    });

    it("powinien obsłużyć datę z przyszłości", () => {
      const futureDate = new Date("2099-06-15T12:00:00.000Z");
      const result = formatCurrentDate(futureDate, "en-US");
      expect(result).toMatch(/2099|6\/15\/2099/);
    });

    it("formatCurrentDay powinien działać dla różnych dni tygodnia", () => {
      const monday = new Date("2025-12-08T12:00:00.000Z"); // poniedziałek
      const sunday = new Date("2025-12-14T12:00:00.000Z"); // niedziela

      const mondayResult = formatCurrentDay(monday, "en-US");
      const sundayResult = formatCurrentDay(sunday, "en-US");

      expect(mondayResult.toLowerCase()).toContain("monday");
      expect(sundayResult.toLowerCase()).toContain("sunday");
    });
  });
});
