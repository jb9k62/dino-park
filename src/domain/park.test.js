import { describe, it, expect } from "vitest";
import { createPark, getCellByLocation } from "./park.js";

describe("Park", () => {
  it("creates park with correct grid dimensions", () => {
    const park = createPark();

    expect(park.grid.length).toBe(26); // 26 columns (A-Z)
    for (const col of park.grid) {
      expect(col.length).toBe(16); // 16 rows (1-16)
      for (const cell of col) {
        expect(cell).toHaveProperty('identifier');
        expect(cell).toHaveProperty('dinos');
        expect(cell).toHaveProperty('lastMaintained');
      }
    }
  });

  it("can retrieve cells by location", () => {
    const park = createPark();

    const cellA1 = getCellByLocation(park, "A1");
    expect(cellA1.identifier).toBe("A1");

    const cellZ16 = getCellByLocation(park, "Z16");
    expect(cellZ16.identifier).toBe("Z16");

    const cellM8 = getCellByLocation(park, "M8");
    expect(cellM8.identifier).toBe("M8");
  });

  it("creates cells with correct identifiers", () => {
    const park = createPark();

    // Test first column (A)
    expect(getCellByLocation(park, "A1").identifier).toBe("A1");
    expect(getCellByLocation(park, "A16").identifier).toBe("A16");

    // Test last column (Z)
    expect(getCellByLocation(park, "Z1").identifier).toBe("Z1");
    expect(getCellByLocation(park, "Z16").identifier).toBe("Z16");

    // Test middle
    expect(getCellByLocation(park, "M8").identifier).toBe("M8");
  });
});
