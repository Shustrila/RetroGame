import GameStateService from '../GameStateService.js';

jest.fn('localStorage');

describe('TESTS: class GameStateService', () => {
  BeforeEach(() => {
    localStorage.get.mockResolvedValue({
      data: 'data'
    });
  });

  test('1', () => {
    console.log(new GameStateService(localStorage));
  });

  test('2', () => {

  });
});
