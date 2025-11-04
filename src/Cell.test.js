import { describe, it, expect, beforeEach } from 'vitest';
import Cell from './Cell.js';
import Dino from './Dino.js';

describe('Cell', () => {
  let cell;

  beforeEach(() => {
    cell = new Cell('A1');
  });

  describe('constructor', () => {
    it('creates a cell with identifier', () => {
      expect(cell.identifier).toBe('A1');
    });

    it('initializes with null lastMaintained', () => {
      expect(cell.lastMaintained).toBeNull();
    });

    it('initializes with empty dinosInCell Map', () => {
      expect(cell.dinosInCell).toBeInstanceOf(Map);
      expect(cell.dinosInCell.size).toBe(0);
    });
  });

  describe('setLastMaintained', () => {
    it('sets the lastMaintained date', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      cell.setLastMaintained(date);
      expect(cell.lastMaintained).toBe(date);
    });
  });

  describe('needsMaintenance', () => {
    it('returns true when never maintained', () => {
      expect(cell.needsMaintenance()).toBe(true);
    });

    it('returns false when maintained within 30 days', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 15); // 15 days ago
      cell.setLastMaintained(recentDate);
      expect(cell.needsMaintenance()).toBe(false);
    });

    it('returns true when maintained over 30 days ago', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31); // 31 days ago
      cell.setLastMaintained(oldDate);
      expect(cell.needsMaintenance()).toBe(true);
    });

    it('returns false when maintained exactly today', () => {
      cell.setLastMaintained(new Date());
      expect(cell.needsMaintenance()).toBe(false);
    });
  });

  describe('addDino', () => {
    it('adds a dino to the cell', () => {
      const dino = new Dino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      cell.addDino(dino);
      expect(cell.dinosInCell.size).toBe(1);
      expect(cell.dinosInCell.get('dino1')).toBe(dino);
    });

    it('adds multiple dinos to the cell', () => {
      const dino1 = new Dino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const dino2 = new Dino({
        id: 'dino2',
        name: 'Blue',
        species: 'Velociraptor',
        gender: 'female',
        digestionInHours: 12,
        herbivore: false
      });

      cell.addDino(dino1);
      cell.addDino(dino2);
      expect(cell.dinosInCell.size).toBe(2);
      expect(cell.dinosInCell.get('dino1')).toBe(dino1);
      expect(cell.dinosInCell.get('dino2')).toBe(dino2);
    });
  });

  describe('removeDino', () => {
    it('removes a dino from the cell', () => {
      const dino = new Dino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      cell.addDino(dino);
      expect(cell.dinosInCell.size).toBe(1);

      cell.removeDino('dino1');
      expect(cell.dinosInCell.size).toBe(0);
    });

    it('does nothing if dino does not exist', () => {
      cell.removeDino('nonexistent');
      expect(cell.dinosInCell.size).toBe(0);
    });
  });

  describe('safe', () => {
    it('returns true for empty cell', () => {
      expect(cell.safe()).toBe(true);
    });

    it('returns true when all dinos are digesting', () => {
      const dino1 = new Dino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });
      dino1.feed(new Date());

      const dino2 = new Dino({
        id: 'dino2',
        name: 'Blue',
        species: 'Velociraptor',
        gender: 'female',
        digestionInHours: 12,
        herbivore: false
      });
      dino2.feed(new Date());

      cell.addDino(dino1);
      cell.addDino(dino2);

      expect(cell.safe()).toBe(true);
    });

    it('returns false when any dino is hungry (not digesting)', () => {
      const digestingDino = new Dino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });
      digestingDino.feed(new Date());

      const hungryDino = new Dino({
        id: 'dino2',
        name: 'Blue',
        species: 'Velociraptor',
        gender: 'female',
        digestionInHours: 12,
        herbivore: false
      });
      // Don't feed hungryDino - it will be hungry

      cell.addDino(digestingDino);
      cell.addDino(hungryDino);

      expect(cell.safe()).toBe(false);
    });

    it('returns false when all dinos are hungry', () => {
      const dino1 = new Dino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const dino2 = new Dino({
        id: 'dino2',
        name: 'Blue',
        species: 'Velociraptor',
        gender: 'female',
        digestionInHours: 12,
        herbivore: false
      });

      cell.addDino(dino1);
      cell.addDino(dino2);

      expect(cell.safe()).toBe(false);
    });

    it('returns false when single dino is hungry', () => {
      const hungryDino = new Dino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      cell.addDino(hungryDino);

      expect(cell.safe()).toBe(false);
    });

    it('returns true when single dino is digesting', () => {
      const digestingDino = new Dino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });
      digestingDino.feed(new Date());

      cell.addDino(digestingDino);

      expect(cell.safe()).toBe(true);
    });
  });
});
