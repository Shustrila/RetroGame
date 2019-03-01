import * as utils from '../utils.js'

describe('TESTS: function calcTileType', () => {
  test('top-left', () => {
    const tileType  = utils.calcTileType(0, 10);

    expect(tileType).toBe('top-left');
  });

  test('top-right', () => {
    const tileType  = utils.calcTileType(9, 10);

    expect(tileType).toBe('top-right');
  });

  test('top', () => {
    const tileType  = utils.calcTileType(5, 10);

    expect(tileType).toBe('top');
  });

  test('bottom-left', () => {
    const tileType  = utils.calcTileType(90, 10);

    expect(tileType).toBe('bottom-left');
  });

  test('bottom-right', () => {
    const tileType  = utils.calcTileType(99, 10);

    expect(tileType).toBe('bottom-right');
  });

  test('bottom', () => {
    const tileType  = utils.calcTileType(95, 10);

    expect(tileType).toBe('bottom');
  });

  test('left', () => {
    const tileType  = utils.calcTileType( 50, 10);

    expect(tileType).toBe('left');
  });

  test('right', () => {
    const tileType  = utils.calcTileType(69, 10);

    expect(tileType).toBe('right');
  });

  test('center', () => {
    const tileType  = utils.calcTileType(45, 10);

    expect(tileType).toBe('center');
  });
});

describe('TESTS: function calcHealthLevel', () => {
  test('critical', () => {
    const healthLevel = utils.calcHealthLevel(5);

    expect(healthLevel).toBe('critical');
  });

  test('normal', () => {
    const healthLevel = utils.calcHealthLevel(45);

    expect(healthLevel).toBe('normal');
  });

  test('high', () => {
    const healthLevel = utils.calcHealthLevel(70);

    expect(healthLevel).toBe('high');
  });
});
