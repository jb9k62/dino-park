import * as React from 'react';
import { useEffect } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import { useParkEvents } from './hooks/useParkEvents.js';
import { useParkState } from './hooks/useParkState.js';
import { ParkGrid } from './components/ParkGrid.jsx';
import { ErrorFallback } from './components/ErrorFallback.jsx';
import "./App.css";

function ParkContainer() {
  const { events, loading, error, refetch } = useParkEvents();
  const park = useParkState(events);

  // Expose park for debugging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.PARK = park;
    }
  }, [park]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "20px", textAlign: "center" }}>
        <h2>Loading dinosaur park...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "20px", textAlign: "center" }}>
        <h2>Error loading park data</h2>
        <p>{error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <ParkGrid park={park} />
      <div className="App">{JSON.stringify(events)}</div>
    </>
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
