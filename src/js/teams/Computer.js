import Team from '../Team';

export default class Computer extends Team {
  constructor(arr) {
    super(arr);
    this.type = 'computer';
    this.fields = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
    ];

    this._positioned(arr);
  }
}
