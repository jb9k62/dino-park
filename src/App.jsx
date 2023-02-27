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
      .then((events) => events.sort((a, b) => a.time.localeCompare(b.time)))
      .then((events) => setEvents(events));
  }, []);

  // poll the persistent event log.
  useEffect(() => {
    setPark(process(events));
  }, [events]);

  return (
    <>
      <div className="container">
        {park.grid?.map((col) =>
          col.map((cell, index) => {
            const isSafe = cell.safe();
            return (
              <div key={index} className={`box ${isSafe ? "safe" : "danger"}`}>
                {JSON.stringify()}
              </div>
            );
          })
        )}
      </div>
      <div className="App">{JSON.stringify(events)}</div>
    </>
  );
}

export default App;
