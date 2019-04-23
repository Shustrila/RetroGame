import * as utils from '../utils';

describe('TESTS: function calcTileType', () => {
  test('top-left', () => {
    const received = utils.calcTileType(0, 10);
    const expected = 'top-left';

    expect(received).toBe(expected);
  });

  test('top-right', () => {
    const received = utils.calcTileType(9, 10);
    const expected = 'top-right';

    expect(received).toBe(expected);
  });

  test('top', () => {
    const received = utils.calcTileType(5, 10);
    const expected = 'top';

    expect(received).toBe(expected);
  });

  test('bottom-left', () => {
    const received = utils.calcTileType(90, 10);
    const expected = 'bottom-left';

    expect(received).toBe(expected);
  });

  test('bottom-right', () => {
    const received = utils.calcTileType(99, 10);
    const expected = 'bottom-right';

    expect(received).toBe(expected);
  });

  test('bottom', () => {
    const received = utils.calcTileType(95, 10);
    const expected = 'bottom';

    expect(received).toBe(expected);
  });

  test('left', () => {
    const received = utils.calcTileType(50, 10);
    const expected = 'left';

    expect(received).toBe(expected);
  });

  test('right', () => {
    const received = utils.calcTileType(69, 10);
    const expected = 'right';

    expect(received).toBe(expected);
  });

  test('center', () => {
    const received = utils.calcTileType(45, 10);
    const expected = 'center';

    expect(received).toBe(expected);
  });
});

describe('TESTS: function calcHealthLevel', () => {
  test('critical', () => {
    const received = utils.calcHealthLevel(5);
    const expected = 'critical';

    expect(received).toBe(expected);
  });

  test('normal', () => {
    const received = utils.calcHealthLevel(45);
    const expected = 'normal';

    expect(received).toBe(expected);
  });

  test('high', () => {
    const received = utils.calcHealthLevel(70);
    const expected = 'high';

    expect(received).toBe(expected);
  });
});

describe('TESTS: function conversionIcon', () => {
  test('parameter not object', () => {
    const received = () => utils.conversionIcon('');
    const expected = 'parameter not object';

    expect(received).toThrow(expected);
  });

  test('parameter not passed', () => {
    const received = () => utils.conversionIcon();
    const expected = 'parameter not passed';

    expect(received).toThrow(expected);
  });

  test('conversion row', () => {
    const received = utils.conversionIcon({
      level: 1,
      attack: 10,
      defence: 40,
      health: 70,
      type: 'generic'
    });
    const expected = '🎖 1 ⚔ 10 🛡 40 ❤ 70';

    expect(received).toBe(expected);
  });
});
