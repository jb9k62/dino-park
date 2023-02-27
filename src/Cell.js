export default class Cell {
  identifier = null;
  lastMaintained = null;
  nextMaintenance = null;
  dinosInCell = new Map();

  constructor(identifier) {
    this.identifier = identifier;
  }

  setLastMaintained(dateTime) {
    this.lastMaintained = dateTime;
    this._calcNextMaintenance();
  }

  _calcNextMaintenance() {
    const lastMaintained = new Date(this.lastMaintained);
    this.nextMaintenance = lastMaintained.setDate(
      lastMaintained.getDate() + 30
    );
  }

  addDino(dino) {
    this.dinosInCell.set(dino.id, dino);
  }

  removeDino(id) {
    this.dinosInCell.delete(id);
  }

  safe() {
    if (this.dinosInCell.size === 0) {
      return true;
    }

    // check if any of the dinos are not digesting
    const anyDigesting = Array.from(this.dinosInCell.values()).some((dino) =>
      dino.isDigesting()
    );

    return anyDigesting;

    // safe when
    /*
     * no dino
     * if dino
     *   dino is digesting
     * */
    // this.dinosInCell;
  }

  maintain() {
    return new Date().toISOString().localeCompare(this.lastMaintained);
  }
}
