/**
 * Custom hook for filtering park cells based on user criteria
 */

import { useMemo } from 'react';
import { isCellSafe, cellNeedsMaintenance } from '../domain/cell.js';
import { createPark, updateCell } from '../domain/park.js';

/**
 * Filters park cells based on provided filters
 * @param {Object} park - Park object with grid
 * @param {Object} filters - Filter criteria
 * @returns {Object} Filtered park object
 */
export function useFilteredPark(park, filters) {
  return useMemo(() => {
    if (!park) return null;

    // If no filters active, return original park
    if (!filters.showOnlyDangerous &&
        !filters.showOnlyNeedsMaintenance &&
        !filters.showOnlyOccupied &&
        !filters.dinoSearch) {
      return park;
    }

    // Create new park with filtered cells marked as hidden
    const filteredPark = {
      ...park,
      grid: park.grid.map((col) =>
        col.map((cell) => {
          let shouldInclude = true;

          // Apply dangerous filter
          if (filters.showOnlyDangerous && isCellSafe(cell)) {
            shouldInclude = false;
          }

          // Apply maintenance filter
          if (filters.showOnlyNeedsMaintenance && !cellNeedsMaintenance(cell)) {
            shouldInclude = false;
          }

          // Apply occupied filter
          if (filters.showOnlyOccupied && cell.dinos.length === 0) {
            shouldInclude = false;
          }

          // Apply dino search filter
          if (filters.dinoSearch) {
            const searchLower = filters.dinoSearch.toLowerCase();
            const hasDinoMatch = cell.dinos.some(dino =>
              dino.name.toLowerCase().includes(searchLower) ||
              dino.species.toLowerCase().includes(searchLower)
            );
            if (!hasDinoMatch) {
              shouldInclude = false;
            }
          }

          // Mark cell as hidden if it doesn't match filters
          return shouldInclude ? cell : { ...cell, hidden: true };
        })
      )
    };

    return filteredPark;
  }, [park, filters]);
}
