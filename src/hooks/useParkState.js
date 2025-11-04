/**
 * Custom hook for processing events into park state
 */

import { useMemo } from 'react';
import processEvents from '../domain/processEvents.js';

/**
 * Process events into park state
 * @param {Array} events - Array of events to process
 * @returns {Object} Park state
 */
export function useParkState(events) {
  return useMemo(() => {
    if (!events || events.length === 0) {
      return null;
    }
    return processEvents(events);
  }, [events]);
}
