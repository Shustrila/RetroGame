import Team from '../Team';

export default class User extends Team {
  constructor(arr) {
    super();
    this.type = 'user';
    this.fields = [
      0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
    ];

    this._positioned(arr);
  }
}
