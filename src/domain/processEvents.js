/**
 * Pure functional event processing
 */

import { createPark, getCellByLocation, updateCell } from './park.js';
import { createDino, feedDino } from './dino.js';
import { addDinoToCell, removeDinoFromCell, setCellLastMaintained } from './cell.js';

/**
 * Process events and return final park state
 * @param {Array} events - Array of events to process
 * @returns {Object} Final park state
 */
export default function processEvents(events) {
  let park = createPark();
  const dinos = new Map(); // dinoId -> dino object
  const dinoLocations = new Map(); // dinoId -> cell location string

  for (const event of events) {
    switch (event.kind) {
      case "dino_added": {
        const newDino = createDino({
          id: event.id,
          name: event.name,
          species: event.species,
          gender: event.gender,
          digestionInHours: event.digestion_period_in_hours,
          herbivore: event.herbivore,
        });
        dinos.set(event.id, newDino);
        break;
      }

      case "dino_fed": {
        const dino = dinos.get(event.dinosaur_id);
        if (dino) {
          const fedDino = feedDino(dino, event.time);
          dinos.set(event.dinosaur_id, fedDino);

          // Update dino in cell if it's located somewhere
          const location = dinoLocations.get(event.dinosaur_id);
          if (location) {
            const cell = getCellByLocation(park, location);
            const updatedCell = {
              ...cell,
              dinos: cell.dinos.map(d => d.id === event.dinosaur_id ? fedDino : d)
            };
            park = updateCell(park, location, updatedCell);
          }
        }
        break;
      }

      case "dino_location_updated": {
        const dino = dinos.get(event.dinosaur_id);
        if (dino) {
          // Remove from old location if exists
          const oldLocation = dinoLocations.get(event.dinosaur_id);
          if (oldLocation) {
            const oldCell = getCellByLocation(park, oldLocation);
            const updatedOldCell = removeDinoFromCell(oldCell, event.dinosaur_id);
            park = updateCell(park, oldLocation, updatedOldCell);
          }

          // Add to new location
          const newCell = getCellByLocation(park, event.location);
          const updatedNewCell = addDinoToCell(newCell, dino);
          park = updateCell(park, event.location, updatedNewCell);

          // Update location tracking
          dinoLocations.set(event.dinosaur_id, event.location);
        }
        break;
      }

      case "dino_removed": {
        // Remove from tracked location
        const location = dinoLocations.get(event.dinosaur_id);
        if (location) {
          const cell = getCellByLocation(park, location);
          const updatedCell = removeDinoFromCell(cell, event.dinosaur_id);
          park = updateCell(park, location, updatedCell);
          dinoLocations.delete(event.dinosaur_id);
        }
        break;
      }

      case "maintenance_performed": {
        const cell = getCellByLocation(park, event.location);
        const updatedCell = setCellLastMaintained(cell, event.time);
        park = updateCell(park, event.location, updatedCell);
        break;
      }

      default:
        break;
    }
  }

  return park;
}
