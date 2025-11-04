/**
 * Tests for useFilteredPark hook
 */

import { describe, it, beforeEach, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilteredPark } from './useFilteredPark.js';
import { createPark, updateCell } from '../domain/park.js';
import { addDinoToCell, setCellLastMaintained } from '../domain/cell.js';
import { createDino, feedDino } from '../domain/dino.js';

describe('useFilteredPark', () => {
  let park;
  let currentTime;

  beforeEach(() => {
    // Create a park with test data
    park = createPark();
    currentTime = new Date();

    // Add a dangerous cell with hungry dino at A1 (never fed)
    const hungryDino = createDino({
      id: 'dino-1',
      name: 'Rex',
      species: 'T-Rex',
      gender: 'male',
      digestionInHours: 2,
      herbivore: false
    });
    let cellA1 = park.grid[0][0];
    cellA1 = addDinoToCell(cellA1, hungryDino);
    park = updateCell(park, 'A1', cellA1);

    // Add a safe cell with digesting dino at B2 (fed recently, still digesting)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const digestingDino = feedDino(
      createDino({
        id: 'dino-2',
        name: 'Stego',
        species: 'Stegosaurus',
        gender: 'female',
        digestionInHours: 5,
        herbivore: true
      }),
      oneHourAgo // Fed 1 hour ago, still digesting for 4 more hours
    );
    let cellB2 = park.grid[1][1];
    cellB2 = addDinoToCell(cellB2, digestingDino);
    park = updateCell(park, 'B2', cellB2);

    // Add a cell needing maintenance at C3 (last maintained 31 days ago)
    const thirtyOneDaysAgo = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);
    let cellC3 = park.grid[2][2];
    cellC3 = setCellLastMaintained(cellC3, thirtyOneDaysAgo);
    park = updateCell(park, 'C3', cellC3);

    // Add a cell that doesn't need maintenance at D4 (recently maintained)
    const oneHourAgoMaintenance = new Date(now.getTime() - 60 * 60 * 1000);
    let cellD4 = park.grid[3][3];
    cellD4 = setCellLastMaintained(cellD4, oneHourAgoMaintenance);
    park = updateCell(park, 'D4', cellD4);
  });

  it('should return original park when no filters are active', () => {
    const filters = {
      showOnlyDangerous: false,
      showOnlyNeedsMaintenance: false,
      showOnlyOccupied: false,
      dinoSearch: ''
    };

    const { result } = renderHook(() => useFilteredPark(park, filters));

    expect(result.current).toBe(park);
  });

  it('should filter to show only dangerous cells', () => {
    const filters = {
      showOnlyDangerous: true,
      showOnlyNeedsMaintenance: false,
      showOnlyOccupied: false,
      dinoSearch: ''
    };

    const { result } = renderHook(() => useFilteredPark(park, filters));
    const filteredPark = result.current;

    // A1 should be visible (dangerous)
    expect(filteredPark.grid[0][0].hidden).toBeUndefined();

    // B2 should be hidden (safe - digesting dino)
    expect(filteredPark.grid[1][1].hidden).toBe(true);

    // Empty cells should be hidden
    expect(filteredPark.grid[4][4].hidden).toBe(true);
  });

  it('should filter to show only cells needing maintenance', () => {
    const filters = {
      showOnlyDangerous: false,
      showOnlyNeedsMaintenance: true,
      showOnlyOccupied: false,
      dinoSearch: ''
    };

    const { result } = renderHook(() => useFilteredPark(park, filters));
    const filteredPark = result.current;

    // C3 should be visible (needs maintenance)
    expect(filteredPark.grid[2][2].hidden).toBeUndefined();

    // D4 should be hidden (doesn't need maintenance)
    expect(filteredPark.grid[3][3].hidden).toBe(true);
  });

  it('should filter to show only occupied cells', () => {
    const filters = {
      showOnlyDangerous: false,
      showOnlyNeedsMaintenance: false,
      showOnlyOccupied: true,
      dinoSearch: ''
    };

    const { result } = renderHook(() => useFilteredPark(park, filters));
    const filteredPark = result.current;

    // A1 and B2 should be visible (have dinos)
    expect(filteredPark.grid[0][0].hidden).toBeUndefined();
    expect(filteredPark.grid[1][1].hidden).toBeUndefined();

    // Empty cells should be hidden
    expect(filteredPark.grid[2][2].hidden).toBe(true);
    expect(filteredPark.grid[4][4].hidden).toBe(true);
  });

  it('should filter by dino name search', () => {
    const filters = {
      showOnlyDangerous: false,
      showOnlyNeedsMaintenance: false,
      showOnlyOccupied: false,
      dinoSearch: 'rex'
    };

    const { result } = renderHook(() => useFilteredPark(park, filters));
    const filteredPark = result.current;

    // A1 should be visible (has Rex)
    expect(filteredPark.grid[0][0].hidden).toBeUndefined();

    // B2 should be hidden (has Stego, not matching search)
    expect(filteredPark.grid[1][1].hidden).toBe(true);

    // Empty cells should be hidden
    expect(filteredPark.grid[4][4].hidden).toBe(true);
  });

  it('should filter by dino species search', () => {
    const filters = {
      showOnlyDangerous: false,
      showOnlyNeedsMaintenance: false,
      showOnlyOccupied: false,
      dinoSearch: 'stego'
    };

    const { result } = renderHook(() => useFilteredPark(park, filters));
    const filteredPark = result.current;

    // A1 should be hidden (has T-Rex, not matching search)
    expect(filteredPark.grid[0][0].hidden).toBe(true);

    // B2 should be visible (has Stegosaurus)
    expect(filteredPark.grid[1][1].hidden).toBeUndefined();
  });

  it('should perform case-insensitive search', () => {
    const filters = {
      showOnlyDangerous: false,
      showOnlyNeedsMaintenance: false,
      showOnlyOccupied: false,
      dinoSearch: 'REX'
    };

    const { result } = renderHook(() => useFilteredPark(park, filters));
    const filteredPark = result.current;

    // A1 should be visible (case-insensitive match)
    expect(filteredPark.grid[0][0].hidden).toBeUndefined();
  });

  it('should combine multiple filters with AND logic', () => {
    const filters = {
      showOnlyDangerous: true,
      showOnlyOccupied: true,
      showOnlyNeedsMaintenance: false,
      dinoSearch: ''
    };

    const { result } = renderHook(() => useFilteredPark(park, filters));
    const filteredPark = result.current;

    // A1 should be visible (dangerous AND occupied)
    expect(filteredPark.grid[0][0].hidden).toBeUndefined();

    // B2 should be hidden (occupied but NOT dangerous)
    expect(filteredPark.grid[1][1].hidden).toBe(true);

    // Empty cells should be hidden
    expect(filteredPark.grid[4][4].hidden).toBe(true);
  });

  it('should handle null park', () => {
    const filters = {
      showOnlyDangerous: true,
      showOnlyNeedsMaintenance: false,
      showOnlyOccupied: false,
      dinoSearch: ''
    };

    const { result } = renderHook(() => useFilteredPark(null, filters));

    expect(result.current).toBeNull();
  });

  it('should update when filters change', () => {
    const filters1 = {
      showOnlyDangerous: true,
      showOnlyNeedsMaintenance: false,
      showOnlyOccupied: false,
      dinoSearch: ''
    };

    const { result, rerender } = renderHook(
      ({ park, filters }) => useFilteredPark(park, filters),
      { initialProps: { park, filters: filters1 } }
    );

    // Initially should hide safe cells
    expect(result.current.grid[1][1].hidden).toBe(true);

    // Change filters to show occupied
    const filters2 = {
      showOnlyDangerous: false,
      showOnlyNeedsMaintenance: false,
      showOnlyOccupied: true,
      dinoSearch: ''
    };

    rerender({ park, filters: filters2 });

    // Now B2 should be visible (it's occupied)
    expect(result.current.grid[1][1].hidden).toBeUndefined();
  });

  it('should preserve cell data when filtering', () => {
    const filters = {
      showOnlyDangerous: true,
      showOnlyNeedsMaintenance: false,
      showOnlyOccupied: false,
      dinoSearch: ''
    };

    const { result } = renderHook(() => useFilteredPark(park, filters));
    const filteredPark = result.current;

    // Verify cell data is preserved
    const cellA1 = filteredPark.grid[0][0];
    expect(cellA1.identifier).toBe('A1');
    expect(cellA1.dinos.length).toBe(1);
    expect(cellA1.dinos[0].name).toBe('Rex');
  });
});
