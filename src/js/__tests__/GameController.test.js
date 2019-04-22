import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

const stateService = new GameStateService(localStorage);
const gamePlay = new GamePlay();
const gameController = new GameController(gamePlay, stateService);

gameController.userSquad = [{
  character: {},
  position: 0
}];

gameController.computerSquad = [{
  character: {},
  position: 4
}];

describe('TESTS: GameController', () => {
  test('Choose another character', () => {
    const received = gamePlay.setCursor('pointer');
    const expected = gameController.onCellEnter(0);

    expect(received).toEqual(expected);
  });

  test('Move to another cell', () => {
    const received = gamePlay.setCursor('pointer');
    const expected = gameController.onCellEnter(0);

    expect(received).toEqual(expected);
  });

  test('Attack enemy', () => {
    const received = gamePlay.setCursor('crosshair');
    const expected = gameController.onCellEnter(0);

    expect(received).toEqual(expected);
  });

  test('Invalid action', () => {
    const received = gamePlay.setCursor('not-allowed');
    const expected = gameController.onCellEnter(0);

    expect(received).toEqual(expected);
  });
});
