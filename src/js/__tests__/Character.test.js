import Character from '../Character';
import Daemon from '../characters/Daemon';

describe('TESTS: class Character', () => {
  test('class caused by using new', () => {
    const received = () => new Character(1);
    const expected = 'class caused by using "new"';

    expect(received).toThrow(expected);
  });

  test('Character called without constructor', () => {
    const received = new Daemon(1);
    const expected = {
      level: 1,
      attack: 10,
      defence: 40,
      health: 50,
      type: 'daemon'
    };

    expect(received).toEqual(expected);
  });
});
