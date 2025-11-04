/**
 * Pure functional domain model for Park Cell
 */

import { isDinoDigesting } from './dino.js';
import { needsMaintenanceCheck } from '../utils/dates.js';

/**
 * Create a new cell
 * @param {string} identifier - Cell identifier (e.g., "A1", "Z16")
 * @returns {Object} Immutable cell object
 */
export const createCell = (identifier) => ({
  identifier,
  lastMaintained: null,
  dinos: []
});

/**
 * Set the last maintenance time for a cell
 * @param {Object} cell - Cell to update
 * @param {Date|string} dateTime - Maintenance time
 * @returns {Object} New cell with updated lastMaintained
 */
export const setCellLastMaintained = (cell, dateTime) => ({
  ...cell,
  lastMaintained: new Date(dateTime)
});

/**
 * Add a dinosaur to a cell
 * @param {Object} cell - Cell to update
 * @param {Object} dino - Dinosaur to add
 * @returns {Object} New cell with added dinosaur
 */
export const addDinoToCell = (cell, dino) => ({
  ...cell,
  dinos: [...cell.dinos, dino]
});

/**
 * Remove a dinosaur from a cell
 * @param {Object} cell - Cell to update
 * @param {string} dinoId - ID of dinosaur to remove
 * @returns {Object} New cell with dinosaur removed
 */
export const removeDinoFromCell = (cell, dinoId) => ({
  ...cell,
  dinos: cell.dinos.filter(d => d.id !== dinoId)
});

/**
 * Check if a cell is safe
 * A cell is safe if it's empty OR all dinosaurs are digesting
 * @param {Object} cell - Cell to check
 * @param {Date} currentTime - Current time (defaults to now)
 * @returns {boolean} True if safe
 */
export const isCellSafe = (cell, currentTime = new Date()) => {
  if (cell.dinos.length === 0) {
    return true;
  }

  // Cell is safe only if ALL dinos are digesting
  return cell.dinos.every(dino => isDinoDigesting(dino, currentTime));
};

/**
 * Check if a cell needs maintenance
 * @param {Object} cell - Cell to check
 * @param {Date} currentTime - Current time (defaults to now)
 * @returns {boolean} True if needs maintenance
 */
export const cellNeedsMaintenance = (cell, currentTime = new Date()) => {
  return needsMaintenanceCheck(cell.lastMaintained, currentTime);
};
