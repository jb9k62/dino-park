import { describe, it, expect } from 'vitest';
import {
  createCell,
  addDinoToCell,
  removeDinoFromCell,
  setCellLastMaintained,
  isCellSafe,
  cellNeedsMaintenance
} from './cell.js';
import { createDino, feedDino } from './dino.js';

describe('Cell', () => {
  describe('createCell', () => {
    it('creates a cell with identifier', () => {
      const cell = createCell('A1');
      expect(cell.identifier).toBe('A1');
    });

    it('initializes with null lastMaintained', () => {
      const cell = createCell('A1');
      expect(cell.lastMaintained).toBeNull();
    });

    it('initializes with empty dinos array', () => {
      const cell = createCell('A1');
      expect(cell.dinos).toEqual([]);
    });
  });

  describe('setCellLastMaintained', () => {
    it('sets the lastMaintained date', () => {
      const cell = createCell('A1');
      const date = new Date('2024-01-01T00:00:00Z');
      const updatedCell = setCellLastMaintained(cell, date);

      expect(updatedCell.lastMaintained).toBeInstanceOf(Date);
      expect(updatedCell.lastMaintained.getTime()).toBe(date.getTime());
    });

    it('does not mutate original cell', () => {
      const cell = createCell('A1');
      const date = new Date('2024-01-01T00:00:00Z');
      setCellLastMaintained(cell, date);

      expect(cell.lastMaintained).toBeNull();
    });
  });

  describe('cellNeedsMaintenance', () => {
    it('returns true when never maintained', () => {
      const cell = createCell('A1');
      expect(cellNeedsMaintenance(cell)).toBe(true);
    });

    it('returns false when maintained within 30 days', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 15); // 15 days ago
      const cell = setCellLastMaintained(createCell('A1'), recentDate);
      expect(cellNeedsMaintenance(cell)).toBe(false);
    });

    it('returns true when maintained over 30 days ago', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31); // 31 days ago
      const cell = setCellLastMaintained(createCell('A1'), oldDate);
      expect(cellNeedsMaintenance(cell)).toBe(true);
    });

    it('returns false when maintained exactly today', () => {
      const cell = setCellLastMaintained(createCell('A1'), new Date());
      expect(cellNeedsMaintenance(cell)).toBe(false);
    });
  });

  describe('addDinoToCell', () => {
    it('adds a dino to the cell', () => {
      const cell = createCell('A1');
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const updatedCell = addDinoToCell(cell, dino);
      expect(updatedCell.dinos.length).toBe(1);
      expect(updatedCell.dinos[0]).toBe(dino);
    });

    it('adds multiple dinos to the cell', () => {
      const cell = createCell('A1');
      const dino1 = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });
      const dino2 = createDino({
        id: 'dino2',
        name: 'Blue',
        species: 'Velociraptor',
        gender: 'female',
        digestionInHours: 12,
        herbivore: false
      });

      let updatedCell = addDinoToCell(cell, dino1);
      updatedCell = addDinoToCell(updatedCell, dino2);

      expect(updatedCell.dinos.length).toBe(2);
      expect(updatedCell.dinos[0]).toBe(dino1);
      expect(updatedCell.dinos[1]).toBe(dino2);
    });

    it('does not mutate original cell', () => {
      const cell = createCell('A1');
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      addDinoToCell(cell, dino);
      expect(cell.dinos.length).toBe(0);
    });
  });

  describe('removeDinoFromCell', () => {
    it('removes a dino from the cell', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const cell = addDinoToCell(createCell('A1'), dino);
      const updatedCell = removeDinoFromCell(cell, 'dino1');

      expect(updatedCell.dinos.length).toBe(0);
    });

    it('does nothing if dino does not exist', () => {
      const cell = createCell('A1');
      const updatedCell = removeDinoFromCell(cell, 'nonexistent');
      expect(updatedCell.dinos.length).toBe(0);
    });

    it('does not mutate original cell', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const cell = addDinoToCell(createCell('A1'), dino);
      removeDinoFromCell(cell, 'dino1');

      expect(cell.dinos.length).toBe(1);
    });
  });

  describe('isCellSafe', () => {
    it('returns true for empty cell', () => {
      const cell = createCell('A1');
      expect(isCellSafe(cell)).toBe(true);
    });

    it('returns true when all dinos are digesting', () => {
      const dino1 = feedDino(createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      }), new Date());

      const dino2 = feedDino(createDino({
        id: 'dino2',
        name: 'Blue',
        species: 'Velociraptor',
        gender: 'female',
        digestionInHours: 12,
        herbivore: false
      }), new Date());

      let cell = createCell('A1');
      cell = addDinoToCell(cell, dino1);
      cell = addDinoToCell(cell, dino2);

      expect(isCellSafe(cell)).toBe(true);
    });

    it('returns false when any dino is hungry (not digesting)', () => {
      const digestingDino = feedDino(createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      }), new Date());

      const hungryDino = createDino({
        id: 'dino2',
        name: 'Blue',
        species: 'Velociraptor',
        gender: 'female',
        digestionInHours: 12,
        herbivore: false
      });

      let cell = createCell('A1');
      cell = addDinoToCell(cell, digestingDino);
      cell = addDinoToCell(cell, hungryDino);

      expect(isCellSafe(cell)).toBe(false);
    });

    it('returns false when all dinos are hungry', () => {
      const dino1 = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const dino2 = createDino({
        id: 'dino2',
        name: 'Blue',
        species: 'Velociraptor',
        gender: 'female',
        digestionInHours: 12,
        herbivore: false
      });

      let cell = createCell('A1');
      cell = addDinoToCell(cell, dino1);
      cell = addDinoToCell(cell, dino2);

      expect(isCellSafe(cell)).toBe(false);
    });

    it('returns false when single dino is hungry', () => {
      const hungryDino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const cell = addDinoToCell(createCell('A1'), hungryDino);
      expect(isCellSafe(cell)).toBe(false);
    });

    it('returns true when single dino is digesting', () => {
      const digestingDino = feedDino(createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      }), new Date());

      const cell = addDinoToCell(createCell('A1'), digestingDino);
      expect(isCellSafe(cell)).toBe(true);
    });
  });
});
