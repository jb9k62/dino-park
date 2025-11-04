/**
 * Custom hook for deriving statistics from park state
 */

import { useMemo } from 'react';
import { isCellSafe, cellNeedsMaintenance } from '../domain/cell.js';
import { isDinoDigesting } from '../domain/dino.js';

/**
 * Calculate park statistics
 * @param {Object} park - Park state
 * @returns {Object} Statistics object
 */
export function useParkStatistics(park) {
  return useMemo(() => {
    if (!park || !park.grid) {
      return {
        totalCells: 0,
        safeCells: 0,
        dangerousCells: 0,
        cellsNeedingMaintenance: 0,
        totalDinos: 0,
        digestingDinos: 0,
        hungryDinos: 0,
        herbivores: 0,
        carnivores: 0
      };
    }

    const allCells = park.grid.flat();
    const allDinosMap = new Map();

    // Collect unique dinos across all cells
    allCells.forEach(cell => {
      cell.dinos.forEach(dino => {
        allDinosMap.set(dino.id, dino);
      });
    });

    const allDinos = Array.from(allDinosMap.values());

    return {
      totalCells: allCells.length,
      safeCells: allCells.filter(cell => isCellSafe(cell)).length,
      dangerousCells: allCells.filter(cell => !isCellSafe(cell)).length,
      cellsNeedingMaintenance: allCells.filter(cell => cellNeedsMaintenance(cell)).length,
      totalDinos: allDinos.length,
      digestingDinos: allDinos.filter(dino => isDinoDigesting(dino)).length,
      hungryDinos: allDinos.filter(dino => !isDinoDigesting(dino)).length,
      herbivores: allDinos.filter(dino => dino.herbivore).length,
      carnivores: allDinos.filter(dino => !dino.herbivore).length
    };
  }, [park]);
}
