import { formatTokenTime } from "../formatTokenTime";

describe("formatTokenTime", () => {
  it("powinien sformatować 0 milisekund", () => {
    expect(formatTokenTime(0)).toBe("0h 00m 00s");
  });

  it("powinien sformatować tylko sekundy", () => {
    expect(formatTokenTime(45000)).toBe("0h 00m 45s"); // 45 sekund
  });

  it("powinien sformatować sekundy z paddingiem", () => {
    expect(formatTokenTime(5000)).toBe("0h 00m 05s"); // 5 sekund
  });

  it("powinien sformatować minuty i sekundy", () => {
    expect(formatTokenTime(125000)).toBe("0h 02m 05s"); // 2 minuty 5 sekund
  });

  it("powinien sformatować pełną godzinę", () => {
    expect(formatTokenTime(3600000)).toBe("1h 00m 00s"); // 1 godzina
  });

  it("powinien sformatować godziny, minuty i sekundy", () => {
    expect(formatTokenTime(3723000)).toBe("1h 02m 03s"); // 1h 2m 3s
  });

  it("powinien sformatować wiele godzin", () => {
    expect(formatTokenTime(7200000)).toBe("2h 00m 00s"); // 2 godziny
  });

  it("powinien sformatować maksymalny typowy czas tokenu (24h)", () => {
    expect(formatTokenTime(86400000)).toBe("24h 00m 00s"); // 24 godziny
  });

  it("powinien obsłużyć wartości ujemne (zwrócić 0)", () => {
    expect(formatTokenTime(-5000)).toBe("0h 00m 00s");
  });

  it("powinien zaokrąglić w dół milisekundy do pełnych sekund", () => {
    expect(formatTokenTime(5999)).toBe("0h 00m 05s"); // 5.999s -> 5s
  });

  it("powinien poprawnie obsłużyć graniczne wartości", () => {
    expect(formatTokenTime(59000)).toBe("0h 00m 59s"); // 59 sekund
    expect(formatTokenTime(60000)).toBe("0h 01m 00s"); // 60 sekund = 1 minuta
    expect(formatTokenTime(3599000)).toBe("0h 59m 59s"); // 59m 59s
  });

  it("powinien sformatować typowy czas wygaśnięcia tokenu (1h)", () => {
    expect(formatTokenTime(3600000)).toBe("1h 00m 00s");
  });

  it("powinien sformatować krótki czas (ostatnie 5 minut)", () => {
    expect(formatTokenTime(300000)).toBe("0h 05m 00s"); // 5 minut
    expect(formatTokenTime(60000)).toBe("0h 01m 00s"); // 1 minuta
    expect(formatTokenTime(30000)).toBe("0h 00m 30s"); // 30 sekund
  });
});
