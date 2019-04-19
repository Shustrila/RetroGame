class GameMechanics {
  constructor(character) {
    this.border = 8;
    this.position = character.position;
    this.y = Math.floor(this.position / this.border);
    this.x = this.position % this.border;
    this.attackCells = character.character.attackCells;
    this.moveCells = character.character.moveCells;

    this.allowedAttack = this._fieldsForAttack();
    this.allowedMove = this._fieldsForMove();
  }

  _generateArr(arr) {
    const array = [];

    arr.forEach(item => array.push(...item));

    return array.map((item, i) => (item > 0 ? i : undefined))
      .filter(item => item !== undefined);
  }

  _fieldsForAttack() {
    const map = [];

    for (let n = 0; n < this.border; n++) {
      const arr = [];

      if (n >= this.y - this.attackCells && n <= this.y + this.attackCells) {
        for (let i = 0; i < this.border; i++) {
          let number = 0;

          if (n === this.y && i === this.x) {
            number = 0;
          } else if (i >= this.x - this.attackCells && i <= this.x + this.attackCells) {
            number = 1;
          }

          arr.push(number);
        }

        map.push(arr);
      } else {
        map.push([0, 0, 0, 0, 0, 0, 0, 0]);
      }
    }

    return this._generateArr(map);
  }

  _fieldsForMove() {
    const map = [];

    for (let n = 0; n < this.border; n++) {
      const arr = [];
      if (n >= this.y - this.moveCells && n <= this.y + this.moveCells) {
        for (let i = 0; i < this.border; i++) {
          let number = 0;

          if (n === this.y && i === this.x) {
            number = 0;
          } else if (i === this.x + (n - this.y) || i === this.x - (n - this.y)) {
            number = 1;
          } else if (i === this.x) {
            number = 1;
          } else if (n === this.y && i >= this.x - this.moveCells && i <= this.x + this.moveCells) {
            number = 1;
          }

          arr.push(number);
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
