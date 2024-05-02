import { useEffect, useState } from "react";
import process from "./processEvents.js";
import "./App.css";

// todo: handle error cases
const fetchEvents = () =>
  fetch(
    "https://5rz6r1it73.execute-api.eu-west-2.amazonaws.com/nudls/feed"
  ).then((r) => r.json());

function App() {
  const [events, setEvents] = useState([]);
  const [park, setPark] = useState({});

  useEffect(() => {
    fetchEvents()
      // sort events by time for chronological processing
      .then((events) => events.sort((a, b) => a.time.localeCompare(b.time)))
      .then((events) => setEvents(events));
  }, []);

  // poll the persistent event log.
  useEffect(() => {
    setPark(process(events));
  }, [events]);

  window.PARK = park;

  return (
    <>
      <div className="container">
        {/* TODO: A-Z & 1-16 lettering around cells */}
        {park.grid?.map((col) => (
          <div>
            {col.map((cell, index) => {
              const isSafe = cell.safe();
              const needsMaintenance = cell.needsMaintenance();
              return (
                <div
                  key={index}
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
