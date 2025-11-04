import { describe, it, expect, beforeEach } from 'vitest';
import Dino from './Dino.js';

describe('Dino', () => {
  let dino;

  beforeEach(() => {
    dino = new Dino({
      id: 'dino1',
      name: 'Rex',
      species: 'T-Rex',
      gender: 'male',
      digestionInHours: 24,
      herbivore: false
    });
  });

  describe('constructor', () => {
    it('creates a dino with all properties', () => {
      expect(dino.id).toBe('dino1');
      expect(dino.name).toBe('Rex');
      expect(dino.species).toBe('T-Rex');
      expect(dino.gender).toBe('male');
      expect(dino.digestionInHours).toBe(24);
      expect(dino.herbivore).toBe(false);
    });

    it('initializes with null lastFed', () => {
      expect(dino.lastFed).toBeNull();
    });

    it('creates a herbivore dino', () => {
      const herbivore = new Dino({
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

  describe('feed', () => {
    it('sets lastFed to the provided date', () => {
      const feedTime = new Date('2024-01-01T12:00:00Z');
      dino.feed(feedTime.toISOString());

      expect(dino.lastFed).toBeInstanceOf(Date);
      expect(dino.lastFed.getTime()).toBe(feedTime.getTime());
    });

    it('updates lastFed when fed multiple times', () => {
      const firstFeed = new Date('2024-01-01T12:00:00Z');
      const secondFeed = new Date('2024-01-02T12:00:00Z');

      dino.feed(firstFeed.toISOString());
      expect(dino.lastFed.getTime()).toBe(firstFeed.getTime());

      dino.feed(secondFeed.toISOString());
      expect(dino.lastFed.getTime()).toBe(secondFeed.getTime());
    });

    it('accepts ISO 8601 date strings', () => {
      dino.feed('2024-01-01T12:00:00Z');
      expect(dino.lastFed).toBeInstanceOf(Date);
    });
  });

  describe('isDigesting', () => {
    it('returns false when never fed', () => {
      expect(dino.isDigesting()).toBe(false);
    });

    it('returns true immediately after feeding', () => {
      dino.feed(new Date().toISOString());
      expect(dino.isDigesting()).toBe(true);
    });

    it('returns true within digestion window', () => {
      const feedTime = new Date();
      feedTime.setHours(feedTime.getHours() - 12); // Fed 12 hours ago
      dino.feed(feedTime.toISOString());

      // Digestion period is 24 hours, so should still be digesting
      expect(dino.isDigesting()).toBe(true);
    });

    it('returns false after digestion window has passed', () => {
      const feedTime = new Date();
      feedTime.setHours(feedTime.getHours() - 25); // Fed 25 hours ago
      dino.feed(feedTime.toISOString());

      // Digestion period is 24 hours, so should not be digesting
      expect(dino.isDigesting()).toBe(false);
    });

    it('returns true when fed in the future', () => {
      const futureFeed = new Date();
      futureFeed.setHours(futureFeed.getHours() + 1); // Fed 1 hour in the future
      dino.feed(futureFeed.toISOString());

      expect(dino.isDigesting()).toBe(true);
    });

    it('handles different digestion periods correctly', () => {
      const shortDigestion = new Dino({
        id: 'dino2',
        name: 'Blue',
        species: 'Velociraptor',
        gender: 'female',
        digestionInHours: 6,
        herbivore: false
      });

      const feedTime = new Date();
      feedTime.setHours(feedTime.getHours() - 7); // Fed 7 hours ago
      shortDigestion.feed(feedTime.toISOString());

      // 7 hours > 6 hour digestion period
      expect(shortDigestion.isDigesting()).toBe(false);
    });

    it('returns true at the edge of digestion window', () => {
      const feedTime = new Date();
      // Fed exactly 24 hours ago minus 1 second
      feedTime.setHours(feedTime.getHours() - 24);
      feedTime.setSeconds(feedTime.getSeconds() + 1);
      dino.feed(feedTime.toISOString());

      expect(dino.isDigesting()).toBe(true);
    });

    it('handles long digestion periods', () => {
      const longDigestion = new Dino({
        id: 'dino3',
        name: 'Bronto',
        species: 'Brontosaurus',
        gender: 'male',
        digestionInHours: 72,
        herbivore: true
      });

      const feedTime = new Date();
      feedTime.setHours(feedTime.getHours() - 48); // Fed 48 hours ago
      longDigestion.feed(feedTime.toISOString());

      // 48 hours < 72 hour digestion period
      expect(longDigestion.isDigesting()).toBe(true);
    });
  });
});
