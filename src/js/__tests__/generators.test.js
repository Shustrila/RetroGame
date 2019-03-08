import { characterGenerator, generateTeam } from '../generators';
import arrayCharacters from '../characters/arrayCharacters';
import Team from '../Team';

describe('TEST: function characterGenerator', () => {
  test('the first character from the array', () => {
    const character = characterGenerator(arrayCharacters, 3);
    const result = () => typeof character.next().value === 'object';

    expect(result).toBeTruthy()
  });

  test('allowedTypes not array', () => {
    const character = characterGenerator({}, 3);
    const result = () => character.next();

    expect(result).toThrow()
  });
});


describe('TEST: function generateTeam', () => {
  test('generateTeam instanceof Team', () => {
    const team = generateTeam(arrayCharacters, 3, 20);

    expect(team instanceof Team).toBeTruthy()
  });

  test('generateTeam instanceof Team', () => {
    const team = generateTeam(arrayCharacters, 3, 0);
    const expected = {
      characters: []
    };

    expect(team).toEqual(expected);
  });

  test('generateTeam instanceof Team', () => {
    const team = () => generateTeam(arrayCharacters, 3);

    expect(team).toThrow();
  });
});
