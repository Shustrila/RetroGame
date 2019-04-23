import Character from '../Character';

import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

describe('TESTS: class Character', () => {
  test('class caused by using new', () => {
    const received = () => new Character(1);
    const expected = 'class caused by using "new"';

    expect(received).toThrow(expected);
  });
});

describe('TESTS: extends from the abstract class Character ', () => {
  test('class Bowman', () => {
    const received = new Bowman(1);
    const expected = {
      level: 1,
      attack: 25,
      defence: 25,
      health: 50,
      type: 'bowman',
      attackCells: 2,
      moveCells: 2,
    };

    expect(received).toEqual(expected);
  });

  test('class Daemon', () => {
    const received = new Daemon(1);
    const expected = {
      level: 1,
      attack: 10,
      defence: 40,
      health: 50,
      type: 'daemon',
      attackCells: 4,
      moveCells: 1,
    };

    expect(received).toEqual(expected);
  });

  test('class Magician', () => {
    const received = new Magician(1);
    const expected = {
      level: 1,
      attack: 10,
      defence: 40,
      health: 50,
      type: 'magician',
      attackCells: 4,
      moveCells: 1,
    };

    expect(received).toEqual(expected);
  });

  test('class Swordsman', () => {
    const received = new Swordsman(1);
    const expected = {
      level: 1,
      attack: 40,
      defence: 10,
      health: 50,
      type: 'swordsman',
      attackCells: 1,
      moveCells: 4,
    };

    expect(received).toEqual(expected);
  });

  test('class Undead', () => {
    const received = new Undead(1);
    const expected = {
      level: 1,
      attack: 25,
      defence: 25,
      health: 50,
      type: 'undead',
      attackCells: 1,
      moveCells: 4,
    };

    expect(received).toEqual(expected);
  });

  test('class Vampire', () => {
    const received = new Vampire(1);
    const expected = {
      level: 1,
      attack: 40,
      defence: 10,
      health: 50,
      type: 'vampire',
      attackCells: 2,
      moveCells: 2,
    };

    expect(received).toEqual(expected);
  });
});
