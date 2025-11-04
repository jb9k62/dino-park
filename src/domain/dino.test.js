import { describe, it, expect } from 'vitest';
import { createDino, feedDino, isDinoDigesting } from './dino.js';

describe('Dino', () => {
  describe('createDino', () => {
    it('creates a dino with all properties', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      expect(dino.id).toBe('dino1');
      expect(dino.name).toBe('Rex');
      expect(dino.species).toBe('T-Rex');
      expect(dino.gender).toBe('male');
      expect(dino.digestionInHours).toBe(24);
      expect(dino.herbivore).toBe(false);
    });

    it('initializes with null lastFed', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      expect(dino.lastFed).toBeNull();
    });

    it('creates a herbivore dino', () => {
      const herbivore = createDino({
        id: 'dino2',
        name: 'Trike',
        species: 'Triceratops',
        gender: 'female',
        digestionInHours: 48,
        herbivore: true
      });

      expect(herbivore.herbivore).toBe(true);
    });
  });

  describe('feedDino', () => {
    it('sets lastFed to the provided date', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const feedTime = new Date('2024-01-01T12:00:00Z');
      const fedDino = feedDino(dino, feedTime.toISOString());

      expect(fedDino.lastFed).toBeInstanceOf(Date);
      expect(fedDino.lastFed.getTime()).toBe(feedTime.getTime());
    });

    it('updates lastFed when fed multiple times', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const firstFeed = new Date('2024-01-01T12:00:00Z');
      const secondFeed = new Date('2024-01-02T12:00:00Z');

      let fedDino = feedDino(dino, firstFeed.toISOString());
      expect(fedDino.lastFed.getTime()).toBe(firstFeed.getTime());

      fedDino = feedDino(fedDino, secondFeed.toISOString());
      expect(fedDino.lastFed.getTime()).toBe(secondFeed.getTime());
    });

    it('accepts ISO 8601 date strings', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const fedDino = feedDino(dino, '2024-01-01T12:00:00Z');
      expect(fedDino.lastFed).toBeInstanceOf(Date);
    });

    it('does not mutate original dino', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      feedDino(dino, new Date().toISOString());
      expect(dino.lastFed).toBeNull();
    });
  });

  describe('isDinoDigesting', () => {
    it('returns false when never fed', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      expect(isDinoDigesting(dino)).toBe(false);
    });

    it('returns true immediately after feeding', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const fedDino = feedDino(dino, new Date().toISOString());
      expect(isDinoDigesting(fedDino)).toBe(true);
    });

    it('returns true within digestion window', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const feedTime = new Date();
      feedTime.setHours(feedTime.getHours() - 12); // Fed 12 hours ago
      const fedDino = feedDino(dino, feedTime.toISOString());

      // Digestion period is 24 hours, so should still be digesting
      expect(isDinoDigesting(fedDino)).toBe(true);
    });

    it('returns false after digestion window has passed', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const feedTime = new Date();
      feedTime.setHours(feedTime.getHours() - 25); // Fed 25 hours ago
      const fedDino = feedDino(dino, feedTime.toISOString());

      // Digestion period is 24 hours, so should not be digesting
      expect(isDinoDigesting(fedDino)).toBe(false);
    });

    it('returns true when fed in the future', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const futureFeed = new Date();
      futureFeed.setHours(futureFeed.getHours() + 1); // Fed 1 hour in the future
      const fedDino = feedDino(dino, futureFeed.toISOString());

      expect(isDinoDigesting(fedDino)).toBe(true);
    });

    it('handles different digestion periods correctly', () => {
      const shortDigestion = createDino({
        id: 'dino2',
        name: 'Blue',
        species: 'Velociraptor',
        gender: 'female',
        digestionInHours: 6,
        herbivore: false
      });

      const feedTime = new Date();
      feedTime.setHours(feedTime.getHours() - 7); // Fed 7 hours ago
      const fedDino = feedDino(shortDigestion, feedTime.toISOString());

      // 7 hours > 6 hour digestion period
      expect(isDinoDigesting(fedDino)).toBe(false);
    });

    it('returns true at the edge of digestion window', () => {
      const dino = createDino({
        id: 'dino1',
        name: 'Rex',
        species: 'T-Rex',
        gender: 'male',
        digestionInHours: 24,
        herbivore: false
      });

      const feedTime = new Date();
      // Fed exactly 24 hours ago minus 1 second
      feedTime.setHours(feedTime.getHours() - 24);
      feedTime.setSeconds(feedTime.getSeconds() + 1);
      const fedDino = feedDino(dino, feedTime.toISOString());

      expect(isDinoDigesting(fedDino)).toBe(true);
    });

    it('handles long digestion periods', () => {
      const longDigestion = createDino({
        id: 'dino3',
        name: 'Bronto',
        species: 'Brontosaurus',
        gender: 'male',
        digestionInHours: 72,
        herbivore: true
      });

      const feedTime = new Date();
      feedTime.setHours(feedTime.getHours() - 48); // Fed 48 hours ago
      const fedDino = feedDino(longDigestion, feedTime.toISOString());

      // 48 hours < 72 hour digestion period
      expect(isDinoDigesting(fedDino)).toBe(true);
    });
  });
});
