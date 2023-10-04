export default class Key {
  id;
  column;
  row;
  hand;
  finger;

  constructor(data = {}) {
    this.id = data.id;
    this.column = data.column;
    this.row = data.row;
    this.hand = data.hand;
    this.finger = data.finger;
  }
}
