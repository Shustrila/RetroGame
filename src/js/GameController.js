import themes from './themes';
import GameState from './GameState';
import * as utils from './utils';
import GameMechanics from './GameMechanics';

import { userSquad, computerSquad } from './teams/squads';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    // squads in game
    this.selectCharacter = 0;
    this.nextPlayer = 'computer';
    this.userSquad = userSquad.all;
    this.computerSquad = computerSquad.all;
    this.allSquad = [];
    // level
    this.level = themes.prairie;
    // game mechanics
    this.gameMechanics = {};
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

    // TODO: load saved stated from stateServic
    this.onLoadGame();
  }

  onNewGame() {
    this.selectCharacter = 0;
    this.nextPlayer = 'computer';
    this.userSquad = userSquad.all;
    this.computerSquad = computerSquad.all;
    this.allSquad = [];
    this.level = themes.prairie;

    this.onSaveGame();
    this.onLoadGame();
  }

  onSaveGame() {
    this.stateService.save(GameState.from({
      selectCharacter: this.selectCharacter,
      nextPlayer: this.nextPlayer,
      userSquad: this.userSquad,
      computerSquad: this.computerSquad,
      level: this.level,
    }));
  }

  onLoadGame() {
    const state = this.stateService.load();

    if (state !== null) {
      this.selectCharacter = state.selectCharacter;
      this.nextPlayer = state.nextPlayer;
      this.userSquad = state.userSquad;
      this.computerSquad = state.computerSquad;
      this.level = state.level;
      this.allSquad = [...this.userSquad, ...this.computerSquad];
      this.gameMechanics = new GameMechanics(this.userSquad[this.selectCharacter]);

      this.gamePlay.drawUi(this.level);
      this.gamePlay.redrawPositions(this.allSquad);
      this.gamePlay.selectCell(this.userSquad[this.selectCharacter].position);
    } else {
      this.onNewGame();
    }
  }

  async attack(index, attacker, target) {
    const formula = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);

    target.health -= formula;

    await this.gamePlay.showDamage(index, formula);
  }

  onCellClick(index) {
    // TODO: react to click
    this.gameMechanics.fieldsForMove().forEach((item) => {
      const position = this.allSquad.map(item => item.position);

      if (item === index && position.indexOf(index) === -1) {


        this.nextPlayer = (this.nextPlayer === 'computer') ? 'user' : 'computer';
        this.gamePlay.deselectCell(this.userSquad[this.selectCharacter].position);
        this.userSquad[this.selectCharacter].position = index;
        this.gamePlay.selectCell(this.userSquad[this.selectCharacter].position);
      }
    });

    this.gameMechanics.fieldsForAttack().forEach((item) => {
      const computer = this.computerSquad.map(item => item.position);

      if (item === index && computer.indexOf(index) !== -1) {
        const attacker = this.userSquad[this.selectCharacter].character;
        const target = this.computerSquad.filter(item => item.position === index);

        this.attack(index, attacker, target[0].character);
      }
    });

    this.userSquad.forEach((item, i, arr) => {
      if (item.position === index && this.userSquad[this.selectCharacter].position !== index) {
        arr.forEach((item, i) => {
          this.gamePlay.deselectCell(this.userSquad[this.selectCharacter].position);
          if (item.position === index) this.selectCharacter = i;
          this.gamePlay.selectCell(this.userSquad[this.selectCharacter].position);
        });
      }
    });

    this.gameMechanics = new GameMechanics(this.userSquad[this.selectCharacter]);
    this.gamePlay.redrawPositions(this.allSquad);
    this.onSaveGame();
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.gameMechanics.fieldsForMove().forEach((item) => {
      const position = this.allSquad.map(item => item.position);

      if (item === index && position.indexOf(index) === -1) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
      }
    });

    this.gameMechanics.fieldsForAttack().forEach((item) => {
      const computer = this.computerSquad.map(item => item.position);

      if (item === index && computer.indexOf(index) !== -1) {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
      }
    });

    this.allSquad.forEach((item) => {
      if (index === item.position) {
        this.gamePlay.showCellTooltip(utils.conversionIcon(item.character), index);
      }
    });

    this.userSquad.forEach((item) => {
      if (item.position === index && this.userSquad[this.selectCharacter].position !== index) {
        this.gamePlay.setCursor('pointer');
      }
    });
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor('default');

    if (this.allSquad.indexOf(index) === -1
        && this.userSquad[this.selectCharacter].position !== index) {
      this.gamePlay.deselectCell(index);
    }
  }
}
