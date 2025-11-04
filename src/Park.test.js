import { describe, it, beforeEach, expect } from "vitest";
import Park from "./Park.js";
import Cell from "./Cell.js";

describe("Park", () => {
  let park;
  beforeEach(() => {
    park = new Park();
  });

  it("instantiates correctly", () => {
    expect(park.grid.length).toBe(26);
    for (const col of park.grid) {
      expect(col.length).toBe(16);
      for (const row of col) {
        expect(row).toBeInstanceOf(Cell);
      }
    }
  });

  it("can retrieve cells by location", () => {
    const cellA1 = park.cellByLocation("A1");
    expect(cellA1).toBeInstanceOf(Cell);
    expect(cellA1.identifier).toBe("A1");

    const cellZ16 = park.cellByLocation("Z16");
    expect(cellZ16).toBeInstanceOf(Cell);
    expect(cellZ16.identifier).toBe("Z16");
  });
});
