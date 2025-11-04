/**
 * Pure functional domain model for Park
 */

import { GRID_COLUMNS, GRID_ROWS } from '../utils/constants.js';
import { getColumnLetter, parseLocation } from '../utils/coordinates.js';
import { createCell } from './cell.js';

/**
 * Create a new park with empty grid
 * @returns {Object} Immutable park object
 */
export const createPark = () => ({
  grid: Array(GRID_COLUMNS).fill(null).map((_, col) =>
    Array(GRID_ROWS).fill(null).map((_, row) =>
      createCell(`${getColumnLetter(col)}${row + 1}`)
    )
  )
});

/**
 * Get a cell by its location string
 * @param {Object} park - Park to search
 * @param {string} location - Location string (e.g., "A1", "Z16")
 * @returns {Object} Cell at location
 */
export const getCellByLocation = (park, location) => {
  const { col, row } = parseLocation(location);
  return park.grid[col][row];
};

/**
 * Update a cell in the park
 * @param {Object} park - Park to update
 * @param {string} location - Cell location
 * @param {Object} newCell - New cell object
 * @returns {Object} New park with updated cell
 */
export const updateCell = (park, location, newCell) => {
  const { col, row } = parseLocation(location);

  const newGrid = park.grid.map((column, colIndex) => {
    if (colIndex !== col) return column;

    return column.map((cell, rowIndex) => {
      if (rowIndex !== row) return cell;
      return newCell;
    });
  });

  return {
    ...park,
    grid: newGrid
  };
};
