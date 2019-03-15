import themes from './themes.js';
import {generateTeam } from './generators.js';
import arrayCharacters from './characters/arrayCharacters'
import * as utils from './utils'


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.temaUser = generateTeam(arrayCharacters, 1, 2);
    this.teamComputer = generateTeam(arrayCharacters, 1, 2);
    this.characters = []
  }

  init() {
    this.gamePlay.drawUi(themes['prairie']);
    this.temaUser.characters = 0;
    this.teamComputer.characters = 1;
    this.characters = [...this.temaUser.characters, ...this.teamComputer.characters];
    this.gamePlay.redrawPositions(this.characters);


    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellClick.bind(this));
    this.gamePlay.addCellClickListener(this.onCellLeave.bind(this));

    // TODO: load saved stated from stateServic
  }

  onCellClick(index) {
    // TODO: react to click
    // for (const i of this.positions) {
    //   if (index  === i.position) {
    //     this.gamePlay.selectCell(index);
    //     console.log('здесь есть персонаж');
    //   }
    // }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    for (const i of this.characters) {
      if (index  === i.position) {
        this.gamePlay.showCellTooltip(utils.conversionIcon(i.character), index);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }
}
