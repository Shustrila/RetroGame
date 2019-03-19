import themes from './themes.js';
import { generateTeam } from './generators.js';
import GameState from './GameState';
import arrayCharacters from './characters/arrayCharacters'
import * as utils from './utils'


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.temaUser = generateTeam(arrayCharacters, 1, 2);
    this.teamComputer = generateTeam(arrayCharacters, 1, 2);
    this.course = 0
  }

  init() {
    this.temaUser.characters = 0;
    this.teamComputer.characters = 1;
    this.characters = [...this.temaUser.characters, ...this.teamComputer.characters];
    this.gameState = GameState.from(this.characters);

    this.gamePlay.drawUi(themes['prairie']);
    this.gamePlay.redrawPositions(this.characters);
    this.gamePlay.selectCell(this.gameState.position);

    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    // TODO: load saved stated from stateServic
  }

  onCellClick(index) {
    // TODO: react to click
    const positions = this.characters.map(item => item.position);

    if (positions.indexOf(index) === -1) {
      this.gamePlay.deselectCell(this.gameState.position);

      this.characters = this.characters.map(item => {
         if(item.position === this.gameState.position) item.position = index;
         return item
      });

      this.gamePlay.redrawPositions(this.characters);
      this.gamePlay.selectCell(this.gameState.position);
    }


    if (positions.indexOf(index) !== -1 && [...this.temaUser.uniquePositions].indexOf(index) === -1) {
      this.gamePlay.showDamage(index, 30).catch(e => {
        throw new TypeError(e)
      }).finally(() => {
        this.characters.forEach(item => {
          if(item === index) {
            item.health -= 30;
          }
        });

        this.gamePlay.redrawPositions(this.characters)
      });
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const positions = this.characters.map(item => item.position);

    for (const i of this.characters) {
      if (index === i.position) {
        this.gamePlay.showCellTooltip(utils.conversionIcon(i.character), index);
      }
    }

    if([...this.teamComputer.uniquePositions].indexOf(index) === -1) {
      this.gamePlay.setCursor('pointer');
    } else {
      this.gamePlay.setCursor('no-drop');
    }

    if(positions.indexOf(index) === -1){
      this.gamePlay.selectCell(index, 'green');
    }

    if([...this.teamComputer.uniquePositions].indexOf(index) !== -1){
      this.gamePlay.setCursor('crosshair');
      this.gamePlay.selectCell(index, 'red')
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor('default');

    if (index !== this.gameState.position){
      this.gamePlay.deselectCell(index);
    }
  }
}
