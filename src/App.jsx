import * as React from 'react';
import { useEffect, useState } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import { useParkEvents } from './hooks/useParkEvents.js';
import { useParkState } from './hooks/useParkState.js';
import { useFilteredPark } from './hooks/useFilteredPark.js';
import { ParkGrid } from './components/ParkGrid.jsx';
import { ParkStats } from './components/ParkStats.jsx';
import { ParkFilters } from './components/ParkFilters.jsx';
import { CellDetails } from './components/CellDetails.jsx';
import { ErrorFallback } from './components/ErrorFallback.jsx';
import "./App.css";

function ParkContainer() {
  const { events, loading, error, refetch } = useParkEvents();
  const park = useParkState(events);
  const [selectedCell, setSelectedCell] = useState(null);
  const [filters, setFilters] = useState({
    showOnlyDangerous: false,
    showOnlyNeedsMaintenance: false,
    showOnlyOccupied: false,
    dinoSearch: ''
  });

  // Apply filters to park
  const filteredPark = useFilteredPark(park, filters);

  // Expose park for debugging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.PARK = park;
    }
  }, [park]);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading dinosaur park...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading park data</h2>
        <p>{error}</p>
        <button onClick={refetch} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🦕 Dino Park Management System</h1>
        <div className="app-description">
          <p><strong>Real-time event-driven park monitoring.</strong> Fetches persistent event log from external API, processes 5 event types chronologically (dino_added, dino_fed, dino_location_updated, dino_removed, maintenance_performed), renders 26×16 grid (416 cells) with live safety status.</p>
          <p><strong>Features:</strong> Dynamic safety calculation (cell safe if empty OR all dinos digesting), 30-day maintenance tracking, multi-filter system (danger/maintenance/occupancy/dino name search), cell details panel showing occupants and maintenance status.</p>
          <p><strong>Portfolio value:</strong> Demonstrates event sourcing, pure functional programming with immutable data structures, separation of concerns (domain/hooks/components/utils), comprehensive test coverage, API integration, complex filtering logic.</p>
          <p><strong>Stack:</strong> React 18 + Vite, custom hooks (useParkEvents for API, useParkState for event processing, useFilteredPark for filters, useParkStatistics for metrics), pure functional domain layer (park/cell/dino modules), utility modules (constants/coordinates/dates), Node test runner, error boundaries, CSS Grid layout.</p>
        </div>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <ParkStats park={park} />
          <ParkFilters filters={filters} onFiltersChange={setFilters} />
        </aside>

        <main className="main-content">
          <ParkGrid
            park={filteredPark}
            onCellClick={setSelectedCell}
            selectedCell={selectedCell}
          />
        </main>

        {selectedCell && (
          <aside className="details-sidebar">
            <CellDetails cell={selectedCell} onClose={() => setSelectedCell(null)} />
          </aside>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ParkContainer />
    </ErrorBoundary>
  );
}

export default App;
