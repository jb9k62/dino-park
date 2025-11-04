import { useEffect, useState } from "react";
import process from "./processEvents.js";
import "./App.css";

const fetchEvents = async () => {
  const response = await fetch(
    "https://5rz6r1it73.execute-api.eu-west-2.amazonaws.com/nudls/feed"
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

function App() {
  const [events, setEvents] = useState([]);
  const [park, setPark] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEvents();
        // sort events by time for chronological processing
        const sorted = data.sort((a, b) => a.time.localeCompare(b.time));
        setEvents(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // poll the persistent event log.
  useEffect(() => {
    setPark(process(events));
  }, [events]);

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
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        {/* TODO: A-Z & 1-16 lettering around cells */}
        {park.grid?.map((col, colIndex) => (
          <div key={`col-${colIndex}`}>
            {col.map((cell) => {
              const isSafe = cell.safe();
              const needsMaintenance = cell.needsMaintenance();
              return (
                <div
                  key={cell.identifier}
                  className={`box ${isSafe ? "safe" : "danger"}`}
                >
                  <span>{cell.identifier}</span>
                  {needsMaintenance ? (
                    <img src="dino-parks-wrench.png" style={{ width: "50%" }} />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="App">{JSON.stringify(events)}</div>
    </>
  );
}

export default App;
