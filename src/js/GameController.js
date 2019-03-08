import themes from './themes.js';
import {characterGenerator, generateTeam} from './generators.js';
import arrayCharacters from './characters/arrayCharacters'
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    const team = generateTeam(arrayCharacters, 1, 2);
    const enemyTeam = generateTeam(arrayCharacters, 1, 2);

    console.log(team, enemyTeam);
    this.gamePlay.drawUi(themes['prairie']);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
