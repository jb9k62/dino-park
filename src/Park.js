import Cell from "./Cell.js";

const alphabet = [
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
];

const getCharsAlphabetIndex = (char) =>
  alphabet.findIndex((alphabetChar) => char.toLowerCase() === alphabetChar);

const getAlphabetCharacter = (index) => alphabet[index];

export default class Park {
  id = null;
  grid = [];
  constructor(id) {
    this.id = id;

    const grid = [];

    for (let col = 0; col < 26; col++) {
      const column = [];

      for (let row = 0; row < 16; row++) {
        column.push(
          new Cell(`${getAlphabetCharacter(col).toUpperCase()}${row + 1}`)
        );
      }

      grid.push(column);
    }

    this.grid = grid;
  }

  cellByLocation(location) {
    return this.grid[getCharsAlphabetIndex(location.substring(0, 1))][
      Number(location.substring(1, 2) - 1)
    ];
  }
}
