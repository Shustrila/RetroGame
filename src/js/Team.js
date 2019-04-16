import PositionedCharacter from './PositionedCharacter';

export default class Team {
  constructor() {
    this.type = null;
    this.all = [];
    this.fields = [];
    this.uniqueIndexs = new Set();
  }

  _positioned(arr) {
    const arrUniqueIndexs = [];

    while (this.uniqueIndexs.size < arr.length) {
      const random = Math.floor(Math.random() * this.fields.length);

      if (!this.uniqueIndexs.has(this.fields[random])) {
        this.uniqueIndexs.add(this.fields[random]);
        arrUniqueIndexs.push(this.fields[random]);
      }
    }

    arrUniqueIndexs.forEach((item, i) => {
      this.all.push(new PositionedCharacter(arr[i], item));
    });
  }
}
