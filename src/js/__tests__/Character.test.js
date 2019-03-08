import Character from '../Character';
import Daemon from '../characters/Daemon';

describe('TESTS: class Character', () => {
  test('class caused by using "new"', () => {
    const character = () => new Character(1);

    expect(character).toThrow('class caused by using "new"');
  });

  test('Character called without constructor', () => {
    const character = new Daemon(1);
    const expected = {
      level: 1,
      attack: 10,
      defence: 40,
      health: 50,
      type: 'daemon'
    };

    expect(character).toEqual(expected);
  });
});
