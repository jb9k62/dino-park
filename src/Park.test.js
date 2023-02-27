import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

import Park from "./Park.js";
import Cell from "./Cell.js";

describe("Park", () => {
  let park;
  beforeEach(() => {
    park = new Park();
  });

  it("instantiates correctly", () => {
    assert.strictEqual(park.grid.length, 26);
    for (const col of park.grid) {
      for (const row of col) {
        console.log(row);
        assert.equal(row instanceof Cell, true);
      }
    }
  });
});
