import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');

    this.attack = 25;
    this.defence = 25;
    this.attackCells = 1;
    this.moveCells = 4;
  }
}
