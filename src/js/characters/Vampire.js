import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');

    this.attack = 40;
    this.defence = 10;
    this.attackСells = 2;
    this.moveCells = 2;
  }
}
