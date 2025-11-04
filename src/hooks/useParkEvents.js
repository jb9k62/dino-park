/**
 * Custom hook for fetching and managing park events
 */

import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINT } from '../utils/constants.js';

/**
 * Fetch events from API and manage loading/error states
 * @returns {Object} Events, loading state, error state, and refetch function
 */
export function useParkEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINT);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // Sort events by time for chronological processing
      const sorted = data.sort((a, b) => a.time.localeCompare(b.time));
      setEvents(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}
