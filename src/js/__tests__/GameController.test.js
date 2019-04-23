import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import GameMechanics from '../GameMechanics';

const stateService = new GameStateService(localStorage);
const gamePlay = new GamePlay();
const gameController = new GameController(gamePlay, stateService);

const character = {
  type: 'bowman',
  attack: 25,
  defence: 25,
  attackCells: 2,
  moveCells: 2
};

gameController.userSquad = [{ character, position: 2 }, { character, position: 16 }];
gameController.computerSquad = [{ character, position: 3 }];
gameController.gameMechanics = new GameMechanics(gameController.userSquad[0]);

describe('TESTS: curcsor', () => {
  test('Choose another character', () => {
    const received = gameController._generateCursor(2);
    const expected = 'pointer';

    expect(received).toBe(expected);
  });

  test('Move to another cell', () => {
    const received = gameController._generateCursor(16);
    const expected = 'pointer';

    expect(received).toBe(expected);
  });

  test('Attack enemy', () => {
    const received = gameController._generateCursor(3);
    const expected = 'crosshair';

    expect(received).toBe(expected);
  });

  test('Invalid action', () => {
    const received = gameController._generateCursor(63);
    const expected = 'not-allowed';

    expect(received).toBe(expected);
  });
});
