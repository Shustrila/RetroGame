import themes from './themes.js';
import { generateTeam } from './generators.js';
import GameState from './GameState';
import * as utils from './utils';

//team
import UserTeam from './teams/UserTeam';
import ComputerTeam from './teams/ComputerTeam';

// characters
import Swordsman from './characters/Swordsman';
import Bowman from './characters/Bowman';
import arrayCharacters from './characters/arrayCharacters';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.temaUser = new UserTeam([new Swordsman(1), new Bowman(1)]);
    this.teamComputer = new ComputerTeam(generateTeam(arrayCharacters, 1, 2));
    this.characterUsed = 0;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.redrawPositions([
      ...this.temaUser.positioned(),
      ...this.teamComputer.positioned(),
    ]);
    this.gamePlay.selectCell(this.temaUser.positionedCharacter[0].position, 'yellow');

    console.log(this.stateService);

    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    // TODO: load saved stated from stateServic
  }

  onCellClick(index) {
    // TODO: react to click
    const temaUser = this.temaUser.positionedCharacter;
    const teamComputer = this.teamComputer.positionedCharacter;

    temaUser.forEach((item, i) => {
      if (index === item.position) {
        this.characterUsed = i;
      } else {
        this.gamePlay.deselectCell(index);
      }
    });

    teamComputer.forEach((item) => {
      if (index === item.position) {
        console.log('attack');
      }
    });

    // const positions = this.characters.map(item => item.position);
    //
    // if (positions.indexOf(index) === -1) {
    //   this.gamePlay.deselectCell(this.gameState.position);
    //
    //   this.characters = this.characters.map((item) => {
    //     if (item.position === this.gameState.position) item.position = index;
    //     return item;
    //   });
    //
    //   this.gamePlay.redrawPositions(this.characters);
    //   this.gamePlay.selectCell(this.gameState.position);
    // }
    //
    //
    // if (positions.indexOf(index) !== -1 && [...this.temaUser.uniquePositions].indexOf(index) === -1) {
    //   this.gamePlay.showDamage(index, 30).catch((e) => {
    //     throw new TypeError(e);
    //   }).finally(() => {
    //     this.characters.forEach((item) => {
    //       if (item === index) {
    //         item.health -= 30;
    //       }
    //     });
    //
    //     this.gamePlay.redrawPositions(this.characters);
    //   });
    // }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const temaUser = this.temaUser.positionedCharacter;
    const teamComputer = this.teamComputer.positionedCharacter;
    const characters = [...temaUser, ...teamComputer];

    this.gamePlay.selectCell(index, 'green');
    this.gamePlay.setCursor('pointer');

    characters.forEach((item) => {
      if (index === item.position) {
        this.gamePlay.showCellTooltip(utils.conversionIcon(item.character), index);
      }
    });


    temaUser.forEach((item) => {
      if (index === item.position) {
        this.gamePlay.selectCell(index, 'yellow');
      }
    });


    teamComputer.forEach((item) => {
      if (index === item.position) {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
      }
    });
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor('default');

    if (index !== this.temaUser.positionedCharacter[this.characterUsed].position){
      this.gamePlay.deselectCell(index);
    }
  }
}
