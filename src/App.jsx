import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

// todo: handle error cases
const pollPersistentEvents = () =>
  fetch(
    "https://5rz6r1it73.execute-api.eu-west-2.amazonaws.com/nudls/feed"
  ).then((r) => r.json());

const getCell = (col, row, park) => park[col][row];

const getColumnIndex = (char) =>
  [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ].findIndex((alphabetChar) => char.toLowerCase() === alphabetChar);

// create a new 2d park array, with new objects in each cell, spreading objects' properties one-level deep, to have a sense
// of immutability.
const setCellInNewPark = (colIndex, rowIndex, park, data) => {
  console.debug("data", data);
  const newParkArray = initPark();

  for (let colI = 0; colI < park.length; colI++) {
    for (let rowI = 0; rowI < park[colI].length; rowI++) {
      if (colIndex === colI && Number(rowIndex - 1) === rowI) {
        console.debug(`Setting ${data} to cell ${colIndex} ${rowIndex}`);
        newParkArray[colI][rowI] = data;
      } else {
        newParkArray[colI][rowI] = { ...getCell(colI, rowI, park) };
      }
    }
  }

  return newParkArray;
};

const initPark = () => Array(26).fill(Array(16).fill());

function App() {
  const [events, setEvents] = useState([]);
  const [park, setPark] = useState({});
  const [dinos, setDinos] = useState({});

  // one-time initiailisation for park, assume park id 1.
  useEffect(() => {
    setPark({ 1: initPark() });
  }, []);

  const fetchEvents = () =>
    pollPersistentEvents()
      .then((events) => events.sort((a, b) => a.time.localeCompare(b.time)))
      .then((events) => setEvents(events));

  // poll the persistent event "log".
  useEffect(() => {
    fetchEvents();
    const timer = setInterval(() => fetchEvents, 5 * 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => console.log(events), [events]);

  // iterate all events and process.
  useEffect(() => {
    events.forEach((ev) => {
      switch (ev.kind) {
        case "dino_added":
          console.log("dino_added", ev);
          // which zone
          // which park
          // time
          setDinos({
            ...dinos,
            ...{
              [ev.id]: {
                id: ev.id,
                name: ev.name,
                species: ev.species,
                gender: ev.gender,
                digestionPeriod: ev.digestion_period_in_hours,
                isHerbivore: ev.herbivore,
                parkId: ev.park_id,
              },
            },
          });
          break;

        case "dino_location_updated":
          console.log("dino_location_updated", ev);
          setPark({
            [ev.park_id]: setCellInNewPark(
              getColumnIndex(ev.location.substring(0, 1)),
              ev.location.substring(1, 2),
              park[ev.park_id],
              ev
            ),
          });
          break;
        default:
          break;
      }
    });
  }, [events]);

  return (
    <>
      <div className="container">
        {park[1]?.map((col) =>
          col.map((row, index) => (
            <div key={index} className="box">
              {JSON.stringify(row)}
            </div>
          ))
        )}
      </div>
      <div className="App">{JSON.stringify(events)}</div>
    </>
  );
}

export default App;
