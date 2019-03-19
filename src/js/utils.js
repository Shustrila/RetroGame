export function calcTileType(index, boardSize) {
  if (index === 0) {
    return 'top-left';
  } else if (index === (boardSize - 1)) {
    return 'top-right';
  } else if (index < boardSize) {
    return 'top';
  } else if (index === ((boardSize * boardSize) - boardSize)) {
    return 'bottom-left';
  } else if (index === ((boardSize * boardSize) - 1)) {
    return 'bottom-right'
  } else if (index > ((boardSize * boardSize) - boardSize)) {
    return 'bottom'
  } else if (!(index % boardSize)) {
    return 'left';
  } else if ((index % boardSize) === (boardSize - 1)) {
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
  if(obj === undefined) throw new TypeError('parameter not passed');
  if(typeof obj !== 'object') throw new TypeError('parameter not object');

  const codes = {level: 0x1f396, attack: 0x2694, defence: 0x1f6e1, health: 0x2764};
  let massege = '';

  for (const i of Object.keys(obj)) {
    if (codes[i] !== undefined) {
      massege += ` ${String.fromCodePoint(codes[i])} ${obj[i]}`;
    }
  }

  return massege.trim();
}
