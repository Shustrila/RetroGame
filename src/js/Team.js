import PositionedCharacter from './PositionedCharacter';

export default class Team {
  constructor(arrTeam) {
    this._characters = arrTeam;
    this.uniquePositions = new Set();
    this.positions = [
      [0, 1, 7, 8, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57],
      [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63]
    ]
  }

  set characters(num){
    const fields = this.positions[num];
    const values = this.uniquePositions.values();
    let arrCharacters = [];

    while(this.uniquePositions.size < this._characters.length) {
      const random = Math.floor(Math.random() * fields.length);
      this.uniquePositions.add(fields[random]);
    }

    for(let i = 0; i < this.uniquePositions.size; i++){
      const obj = new PositionedCharacter(this._characters[i] ,values.next().value);

      arrCharacters.push(obj);
    }

    this._characters = arrCharacters;
  }

  get characters(){
    return this._characters;
  }
}
