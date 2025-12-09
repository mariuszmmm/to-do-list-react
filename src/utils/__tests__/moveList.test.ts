import { moveListUp, moveListDown } from "../moveList";
import { List } from "../../types";

const createMockList = (id: string, name: string): List => ({
  id,
  name,
  date: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: null,
  taskList: [],
});

describe("moveList", () => {
  describe("moveListUp", () => {
    it("powinien przenieść element w górę", () => {
      const lists = [
        createMockList("1", "First"),
        createMockList("2", "Second"),
        createMockList("3", "Third"),
      ];

      const result = moveListUp(1, lists);

      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("1");
      expect(result[2].id).toBe("3");
    });

    it("nie powinien zmienić listy gdy index to 0 (pierwszy element)", () => {
      const lists = [
        createMockList("1", "First"),
        createMockList("2", "Second"),
      ];

      const result = moveListUp(0, lists);

      expect(result).toEqual(lists);
    });

    it("powinien zwrócić oryginalną listę gdy index jest ujemny", () => {
      const lists = [createMockList("1", "First")];

      const result = moveListUp(-1, lists);

      expect(result).toEqual(lists);
    });

    it("powinien zwrócić oryginalną listę gdy index jest poza zakresem", () => {
      const lists = [createMockList("1", "First")];

      const result = moveListUp(5, lists);

      expect(result).toEqual(lists);
    });

    it("powinien przenieść ostatni element w górę", () => {
      const lists = [
        createMockList("1", "First"),
        createMockList("2", "Second"),
        createMockList("3", "Third"),
      ];

      const result = moveListUp(2, lists);

      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("3");
      expect(result[2].id).toBe("2");
    });

    it("powinien działać z listą dwuelementową", () => {
      const lists = [
        createMockList("1", "First"),
        createMockList("2", "Second"),
      ];

      const result = moveListUp(1, lists);

      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("1");
    });
  });

  describe("moveListDown", () => {
    it("powinien przenieść element w dół", () => {
      const lists = [
        createMockList("1", "First"),
        createMockList("2", "Second"),
        createMockList("3", "Third"),
      ];

      const result = moveListDown(0, lists);

      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("1");
      expect(result[2].id).toBe("3");
    });

    it("nie powinien zmienić listy gdy index to ostatni element", () => {
      const lists = [
        createMockList("1", "First"),
        createMockList("2", "Second"),
      ];

      const result = moveListDown(1, lists);

      expect(result).toEqual(lists);
    });

    it("powinien zwrócić oryginalną listę gdy index jest ujemny", () => {
      const lists = [createMockList("1", "First")];

      const result = moveListDown(-1, lists);

      expect(result).toEqual(lists);
    });

    it("powinien zwrócić oryginalną listę gdy index jest poza zakresem", () => {
      const lists = [createMockList("1", "First")];

      const result = moveListDown(5, lists);

      expect(result).toEqual(lists);
    });

    it("powinien przenieść środkowy element w dół", () => {
      const lists = [
        createMockList("1", "First"),
        createMockList("2", "Second"),
        createMockList("3", "Third"),
      ];

      const result = moveListDown(1, lists);

      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("3");
      expect(result[2].id).toBe("2");
    });

    it("powinien działać z listą dwuelementową", () => {
      const lists = [
        createMockList("1", "First"),
        createMockList("2", "Second"),
      ];

      const result = moveListDown(0, lists);

      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("1");
    });
  });

  describe("edge cases", () => {
    it("moveListUp powinien obsłużyć pustą listę", () => {
      const result = moveListUp(0, []);
      expect(result).toEqual([]);
    });

    it("moveListDown powinien obsłużyć pustą listę", () => {
      const result = moveListDown(0, []);
      expect(result).toEqual([]);
    });

    it("moveListUp i moveListDown powinny być odwrotne", () => {
      const lists = [
        createMockList("1", "First"),
        createMockList("2", "Second"),
        createMockList("3", "Third"),
      ];

      const movedDown = moveListDown(0, lists);
      const movedBackUp = moveListUp(1, movedDown);

      expect(movedBackUp).toEqual(lists);
    });
  });
});
