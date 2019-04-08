import PositionedCharacter from './PositionedCharacter';

export default class Team {
  constructor(arr) {
    this.characters = arr;
    this.fields = [];
    this.positionedCharacter = [];
  }

  positioned() {
    const uniquePositions = [];

    while (uniquePositions.length < this.characters.length) {
      const rand = Math.floor(Math.random() * this.fields.length);

      if (uniquePositions.indexOf(rand) < 0) uniquePositions.push(this.fields[rand]);
    }

    this.characters.forEach((item, index) => {
      this.positionedCharacter.push(new PositionedCharacter(item, uniquePositions[index]));
    });

    return this.positionedCharacter;
  }


}
