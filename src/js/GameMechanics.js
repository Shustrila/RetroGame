class GameMechanics {
  constructor(character) {
    this.border = 8;
    this.cell = character.position;
    this.y = Math.floor(this.cell / this.border);
    this.ci = Math.floor((this.cell / this.border - this.y) * 10);
    this.x = (this.ci > 3) ? this.ci - 1 : this.ci;
    this.attackCells = character.character.attackCells;
    this.moveCells = character.character.moveCells;
  }

  _generateArr(arr) {
    const array = [];

    arr.forEach(item => array.push(...item));

    return array.map((item, i) => (item > 0 ? i : undefined))
      .filter(item => item !== undefined);
  }

  fieldsForAttack() {
    const map = [];

    for (let n = 0; n < this.border; n++) {
      const arr = [];

      if (n >= this.y - this.attackCells && n <= this.y + this.attackCells) {
        for (let i = 0; i < this.border; i++) {
          arr.push((() => {
            if (n === this.y && i === this.x) return 0;
            if (i >= this.x - this.attackCells && i <= this.x + this.attackCells) return 1;
            return 0;
          })());
        }

        map.push(arr);
      } else {
        map.push([0, 0, 0, 0, 0, 0, 0, 0]);
      }
    }

    return this._generateArr(map);
  }

  fieldsForMove() {
    const map = [];

    for (let n = 0; n < this.border; n++) {
      const arr = [];

      if (n >= this.y - this.moveCells && n <= this.y + this.moveCells) {
        for (let i = 0; i < this.border; i++) {
          arr.push((() => {
            if (n === this.y && i === this.x) return 0;
            if (i === this.x) return 1;
            // if (i === (this.ci - this.moveCells) + n) return 1;
            // if (i === (this.ci + this.moveCells) - n) return 1;
            if (n === this.y
                && i >= this.x - this.moveCells
                && i <= this.x + this.moveCells) return 1;
            return 0;
          })());
        }

        map.push(arr);
      } else {
        map.push([0, 0, 0, 0, 0, 0, 0, 0]);
      }
    }

    return this._generateArr(map);
  }
}

export default GameMechanics;
