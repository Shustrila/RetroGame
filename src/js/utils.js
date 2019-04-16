export function calcTileType(index, boardSize) {
  if (index === 0) {
    return 'top-left';
  } if (index === (boardSize - 1)) {
    return 'top-right';
  } if (index < boardSize) {
    return 'top';
  } if (index === ((boardSize * boardSize) - boardSize)) {
    return 'bottom-left';
  } if (index === ((boardSize * boardSize) - 1)) {
    return 'bottom-right';
  } if (index > ((boardSize * boardSize) - boardSize)) {
    return 'bottom';
  } if (!(index % boardSize)) {
    return 'left';
  } if ((index % boardSize) === (boardSize - 1)) {
    return 'right';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function conversionIcon(obj) {
  if (obj === undefined) throw new TypeError('parameter not passed');
  if (typeof obj !== 'object') throw new TypeError('parameter not object');

  const codes = {
    level: 0x1f396, attack: 0x2694, defence: 0x1f6e1, health: 0x2764,
  };
  let massege = '';

  for (const i of Object.keys(obj)) {
    if (codes[i] !== undefined) {
      massege += ` ${String.fromCodePoint(codes[i])} ${obj[i]}`;
    }
  }

  return massege.trim();
}
