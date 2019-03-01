import { calcTileType } from '../utils.js'

describe('TESTS: function calcTileType', () => {
  test('top-left', () => {
    const tileType  = calcTileType(0, 10);

    expect(tileType).toBe('top-left');
  });

  test('top-right', () => {
    const tileType  = calcTileType(9, 10);

    expect(tileType).toBe('top-right');
  });

  test('top', () => {
    const tileType  = calcTileType(5, 10);

    expect(tileType).toBe('top');
  });

  test('bottom-left', () => {
    const tileType  = calcTileType(90, 10);

    expect(tileType).toBe('bottom-left');
  });

  test('bottom-right', () => {
    const tileType  = calcTileType(99, 10);

    expect(tileType).toBe('bottom-right');
  });

  test('bottom', () => {
    const tileType  = calcTileType(95, 10);

    expect(tileType).toBe('bottom');
  });

  test('left', () => {
    const tileType  = calcTileType( 50, 10);

    expect(tileType).toBe('left');
  });

  test('right', () => {
    const tileType  = calcTileType(69, 10);

    expect(tileType).toBe('right');
  });

  test('center', () => {
    const tileType  = calcTileType(45, 10);

    expect(tileType).toBe('center');
  });
});
