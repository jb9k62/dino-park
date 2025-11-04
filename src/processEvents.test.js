import { describe, it, expect } from 'vitest';
import processEvents from './processEvents.js';

describe('processEvents', () => {
  describe('dino_added event', () => {
    it('creates a new park', () => {
      const events = [];
      const park = processEvents(events);

      expect(park).toBeDefined();
      expect(park.grid).toBeDefined();
      expect(park.grid.length).toBe(26); // 26 columns (A-Z)
      expect(park.grid[0].length).toBe(16); // 16 rows (1-16)
    });

    it('processes dino_added events', () => {
      const events = [
        {
          kind: 'dino_added',
          id: 'dino1',
          name: 'Rex',
          species: 'T-Rex',
          gender: 'male',
          digestion_period_in_hours: 24,
          herbivore: false,
          time: '2024-01-01T00:00:00Z'
        }
      ];

      const park = processEvents(events);
      expect(park).toBeDefined();
      // Dino is created but not placed in any cell yet
    });

    it('processes multiple dino_added events', () => {
      const events = [
        {
          kind: 'dino_added',
          id: 'dino1',
          name: 'Rex',
          species: 'T-Rex',
          gender: 'male',
          digestion_period_in_hours: 24,
          herbivore: false,
          time: '2024-01-01T00:00:00Z'
        },
        {
          kind: 'dino_added',
          id: 'dino2',
          name: 'Blue',
          species: 'Velociraptor',
          gender: 'female',
          digestion_period_in_hours: 12,
          herbivore: false,
          time: '2024-01-01T01:00:00Z'
        }
      ];

      const park = processEvents(events);
      expect(park).toBeDefined();
    });
  });

  describe('dino_location_updated event', () => {
    it('places a dino in the specified cell', () => {
      const events = [
        {
          kind: 'dino_added',
          id: 'dino1',
          name: 'Rex',
          species: 'T-Rex',
          gender: 'male',
          digestion_period_in_hours: 24,
          herbivore: false,
          time: '2024-01-01T00:00:00Z'
        },
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino1',
          location: 'A1',
          time: '2024-01-01T01:00:00Z'
        }
      ];

      const park = processEvents(events);
      const cell = park.cellByLocation('A1');

      expect(cell.dinosInCell.size).toBe(1);
      expect(cell.dinosInCell.has('dino1')).toBe(true);
    });

    it('moves a dino from one cell to another', () => {
      const events = [
        {
          kind: 'dino_added',
          id: 'dino1',
          name: 'Rex',
          species: 'T-Rex',
          gender: 'male',
          digestion_period_in_hours: 24,
          herbivore: false,
          time: '2024-01-01T00:00:00Z'
        },
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino1',
          location: 'A1',
          time: '2024-01-01T01:00:00Z'
        },
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino1',
          location: 'B2',
          time: '2024-01-01T02:00:00Z'
        }
      ];

      const park = processEvents(events);
      const cellA1 = park.cellByLocation('A1');
      const cellB2 = park.cellByLocation('B2');

      expect(cellA1.dinosInCell.size).toBe(0);
      expect(cellB2.dinosInCell.size).toBe(1);
      expect(cellB2.dinosInCell.has('dino1')).toBe(true);
    });

    it('handles multiple dinos in the same cell', () => {
      const events = [
        {
          kind: 'dino_added',
          id: 'dino1',
          name: 'Rex',
          species: 'T-Rex',
          gender: 'male',
          digestion_period_in_hours: 24,
          herbivore: false,
          time: '2024-01-01T00:00:00Z'
        },
        {
          kind: 'dino_added',
          id: 'dino2',
          name: 'Blue',
          species: 'Velociraptor',
          gender: 'female',
          digestion_period_in_hours: 12,
          herbivore: false,
          time: '2024-01-01T00:00:00Z'
        },
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino1',
          location: 'A1',
          time: '2024-01-01T01:00:00Z'
        },
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino2',
          location: 'A1',
          time: '2024-01-01T02:00:00Z'
        }
      ];

      const park = processEvents(events);
      const cell = park.cellByLocation('A1');

      expect(cell.dinosInCell.size).toBe(2);
      expect(cell.dinosInCell.has('dino1')).toBe(true);
      expect(cell.dinosInCell.has('dino2')).toBe(true);
    });
  });

  describe('dino_fed event', () => {
    it('marks a dino as fed', () => {
      const now = new Date();
      const events = [
        {
          kind: 'dino_added',
          id: 'dino1',
          name: 'Rex',
          species: 'T-Rex',
          gender: 'male',
          digestion_period_in_hours: 24,
          herbivore: false,
          time: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
        },
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino1',
          location: 'A1',
          time: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
          kind: 'dino_fed',
          dinosaur_id: 'dino1',
          time: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
        }
      ];

      const park = processEvents(events);
      const cell = park.cellByLocation('A1');
      const dino = cell.dinosInCell.get('dino1');

      expect(dino.lastFed).toBeInstanceOf(Date);
      expect(dino.isDigesting()).toBe(true);
    });
  });

  describe('dino_removed event', () => {
    it('removes a dino from the park', () => {
      const events = [
        {
          kind: 'dino_added',
          id: 'dino1',
          name: 'Rex',
          species: 'T-Rex',
          gender: 'male',
          digestion_period_in_hours: 24,
          herbivore: false,
          time: '2024-01-01T00:00:00Z'
        },
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino1',
          location: 'A1',
          time: '2024-01-01T01:00:00Z'
        },
        {
          kind: 'dino_removed',
          dinosaur_id: 'dino1',
          time: '2024-01-01T02:00:00Z'
        }
      ];

      const park = processEvents(events);
      const cell = park.cellByLocation('A1');

      expect(cell.dinosInCell.size).toBe(0);
    });

    it('handles removing dino that was never placed', () => {
      const events = [
        {
          kind: 'dino_added',
          id: 'dino1',
          name: 'Rex',
          species: 'T-Rex',
          gender: 'male',
          digestion_period_in_hours: 24,
          herbivore: false,
          time: '2024-01-01T00:00:00Z'
        },
        {
          kind: 'dino_removed',
          dinosaur_id: 'dino1',
          time: '2024-01-01T01:00:00Z'
        }
      ];

      const park = processEvents(events);
      // Should not throw error
      expect(park).toBeDefined();
    });
  });

  describe('maintenance_performed event', () => {
    it('sets maintenance date for a cell', () => {
      const now = new Date();
      const maintenanceTime = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(); // 1 hour ago
      const events = [
        {
          kind: 'maintenance_performed',
          location: 'A1',
          time: maintenanceTime
        }
      ];

      const park = processEvents(events);
      const cell = park.cellByLocation('A1');

      expect(cell.lastMaintained).toBe(maintenanceTime);
      expect(cell.needsMaintenance()).toBe(false);
    });
  });

  describe('event processing order', () => {
    it('processes events chronologically', () => {
      // Events passed in out-of-order (should be sorted by processEvents caller)
      const events = [
        {
          kind: 'dino_added',
          id: 'dino1',
          name: 'Rex',
          species: 'T-Rex',
          gender: 'male',
          digestion_period_in_hours: 24,
          herbivore: false,
          time: '2024-01-01T00:00:00Z'
        },
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino1',
          location: 'A1',
          time: '2024-01-01T01:00:00Z'
        },
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino1',
          location: 'B2',
          time: '2024-01-01T02:00:00Z'
        },
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino1',
          location: 'C3',
          time: '2024-01-01T03:00:00Z'
        }
      ];

      const park = processEvents(events);

      // Final location should be C3 (last event chronologically)
      expect(park.cellByLocation('A1').dinosInCell.size).toBe(0);
      expect(park.cellByLocation('B2').dinosInCell.size).toBe(0);
      expect(park.cellByLocation('C3').dinosInCell.size).toBe(1);
      expect(park.cellByLocation('C3').dinosInCell.has('dino1')).toBe(true);
    });
  });

  describe('unknown event kinds', () => {
    it('handles unknown event kinds gracefully', () => {
      const events = [
        {
          kind: 'unknown_event',
          foo: 'bar',
          time: '2024-01-01T00:00:00Z'
        }
      ];

      expect(() => processEvents(events)).not.toThrow();
    });
  });

  describe('complex scenarios', () => {
    it('handles a complete park simulation', () => {
      const now = new Date();
      const events = [
        // Add dinos
        {
          kind: 'dino_added',
          id: 'dino1',
          name: 'Rex',
          species: 'T-Rex',
          gender: 'male',
          digestion_period_in_hours: 24,
          herbivore: false,
          time: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
        },
        {
          kind: 'dino_added',
          id: 'dino2',
          name: 'Blue',
          species: 'Velociraptor',
          gender: 'female',
          digestion_period_in_hours: 12,
          herbivore: false,
          time: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
        },
        // Place dinos
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino1',
          location: 'A1',
          time: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
        },
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino2',
          location: 'B2',
          time: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
        },
        // Feed dinos
        {
          kind: 'dino_fed',
          dinosaur_id: 'dino1',
          time: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        // Move dino
        {
          kind: 'dino_location_updated',
          dinosaur_id: 'dino1',
          location: 'B2',
          time: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
        },
        // Maintain cell
        {
          kind: 'maintenance_performed',
          location: 'A1',
          time: new Date(now.getTime() - 30 * 60 * 1000).toISOString() // 30 minutes ago
        },
        // Remove dino
        {
          kind: 'dino_removed',
          dinosaur_id: 'dino2',
          time: new Date(now.getTime() - 15 * 60 * 1000).toISOString() // 15 minutes ago
        }
      ];

      const park = processEvents(events);

      // Cell A1 should be empty and maintained
      const cellA1 = park.cellByLocation('A1');
      expect(cellA1.dinosInCell.size).toBe(0);
      expect(cellA1.needsMaintenance()).toBe(false);

      // Cell B2 should have only dino1 (dino2 was removed)
      const cellB2 = park.cellByLocation('B2');
      expect(cellB2.dinosInCell.size).toBe(1);
      expect(cellB2.dinosInCell.has('dino1')).toBe(true);

      // dino1 should be digesting (was fed 2 hours ago, digestion is 24 hours)
      const dino1 = cellB2.dinosInCell.get('dino1');
      expect(dino1.isDigesting()).toBe(true);
    });
  });
});
