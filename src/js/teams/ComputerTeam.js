import Team from '../Team';

export default class ComputerTeam extends Team {
  constructor(arr) {
    super(arr);
    this.fields = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
    ];
  }
}
