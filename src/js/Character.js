class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.attackСells = 0;
    this.moveCells = 0;
    // TODO: throw error if user use "new Character()"
    if (new.target.name === 'Character') {
      throw new TypeError('class caused by using "new"');
    }
  }

  levelUp() {
    this.level += 1;
    this.health = 100;
  }

  fieldsForСourse(cells, index) {
    console.log(cells, index);
  }

  // fieldToAttack(){
  //
  // }

}

export default Character;
