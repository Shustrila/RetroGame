import themes from './themes';
import GameState from './GameState';
import * as utils from './utils';
import GameMechanics from './GameMechanics';

// team
import User from './teams/User';
import Computer from './teams/Computer';

// characters
import Swordsman from './characters/Swordsman';
import Bowman from './characters/Bowman';
import arrayCharacters from './characters/arrayCharacters';
import { generateTeam, characterGenerator } from './generators';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    // Persisted properties
    this.selectCharacter = 0;
    this.nextPlayer = '';
    this.userSquad = {};
    this.computerSquad = {};
    this.level = 1;
    this.themes = '';

    this.allSquad = [];
    this.USC = {}; // properties UserSelectCharacter
    this.CSC = {}; // properties ComputerSelectCharacter

    // Game mechanics
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
    const user = new User([new Swordsman(1), new Bowman(1)]);
    const computer = new Computer(generateTeam(arrayCharacters, 1, 2));

    this.selectCharacter = 0;
    this.nextPlayer = 'computer';
    this.userSquad = user.all;
    this.computerSquad = computer.all;
    this.themes = themes.prairie;

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
      themes: this.themes,
    }));
  }

  onLoadGame() {
    const state = this.stateService.load();

    if (state !== null) {
      // load state
      this.selectCharacter = state.selectCharacter;
      this.nextPlayer = state.nextPlayer;
      this.userSquad = state.userSquad;
      this.computerSquad = state.computerSquad;
      this.level = state.level;
      this.themes = state.themes;

      this.allSquad = [...this.userSquad, ...this.computerSquad];
      this.USC = this.userSquad[this.selectCharacter];
      this.CSC = this.computerSquad[this.selectCharacter];

      // mechanics
      this.gameMechanics = new GameMechanics(this.USC);

      // Game start
      this.gamePlay.drawUi(this.themes);
      this.gamePlay.redrawPositions(this.allSquad);
      this.gamePlay.selectCell(this.USC.position);
    } else {
      this.onNewGame();
    }
  }

  _levelUp() {
    let generateComputer = [];
    let generateUser = [];

    this.level += 1;

    if (this.level > 4) {
      this.level = 1;
    }

    this.userSquad.forEach(item => generateUser.push(item.character));

    if (this.level === 1) {
      generateUser = new User([new Swordsman(1), new Bowman(1)]);
      generateComputer = generateTeam(arrayCharacters, 2, generateUser.length);
      this.themes = themes.prairie;
    }

    if (this.level === 2) {
      generateUser.push(characterGenerator(arrayCharacters, 1).next().value);
      generateComputer = generateTeam(arrayCharacters, 2, this.userSquad.length);
      this.themes = themes.arctic;
    }

    if (this.level === 3) {
      generateUser.push(characterGenerator(arrayCharacters, 2).next().value);
      generateComputer = generateTeam(arrayCharacters, 3, this.userSquad.length);
      this.themes = themes.desert;
    }

    if (this.level === 4) {
      generateUser.push(characterGenerator(arrayCharacters, 3).next().value);
      generateComputer = generateTeam(arrayCharacters, 4, this.userSquad.length);
      this.themes = themes.mountain;
    }

    this.userSquad = new User(generateUser).all;
    this.computerSquad = new Computer(generateComputer).all;
    this.allSquad = [...this.userSquad, ...this.computerSquad];

    this.gamePlay.drawUi(this.themes);
    this.gamePlay.redrawPositions(this.allSquad);
    this.gamePlay.selectCell(this.USC.position);
    this.onSaveGame();
  }

  _attack(index, attacker, target, player = 'user') {
    const valA = attacker.attack - target.defence;
    const valB = attacker.attack * 0.1;
    const formula = Math.max(valA, valB);
    const userCharacterLength = this.computerSquad.length;

    this.gamePlay.showDamage(index, formula);

    if (target.health - formula > 0) {
      target.health -= formula;
    } else {
      if (player === 'user') {
        this.computerSquad = this.computerSquad.filter(item => item.position !== index);
      } else {
        this.userSquad = this.userSquad.filter(item => item.position !== index);
      }

      this.allSquad = [...this.userSquad, ...this.computerSquad];
      this.gamePlay.redrawPositions(this.allSquad);
    }

    if (this.computerSquad.length === 0) {
      this._levelUp();
    }

    if (this.userSquad.length === 0) {
      this.onNewGame();
    }

    if (userCharacterLength > this.userSquad.length) {
      this.selectCharacter = 0;
      this.USC = this.userSquad[this.selectCharacter];
      this.gamePlay.selectCell(this.USC.position);
    }
  }

  _actionComputer() {
    const randomCharacter = Math.floor(Math.random() * this.computerSquad.length);
    const computer = this.computerSquad[randomCharacter];
    const mechanics = new GameMechanics(computer);

    for (const userCharacter of this.userSquad) {
      if (mechanics.allowedAttack.indexOf(userCharacter.position) !== -1) {
        const index = userCharacter.position;
        const target = this.userSquad.filter(item => item.position === index);

        this._attack(index, computer.character, target[0].character, 'computer');
      } else {
        let occupiedIndexs = [];

        occupiedIndexs = mechanics.allowedMove.filter((item) => {
          const userIndexs = this.userSquad.map(item => item.position).indexOf(item);
          const comuterIndexs = this.computerSquad.map(item => item.position).indexOf(item);

          return !!((userIndexs === -1 || comuterIndexs === -1));
        });

        const randomIndex = Math.floor(Math.random() * occupiedIndexs.length);

        computer.position = occupiedIndexs[randomIndex];
      }
    }
  }

  onCellClick(index) {
    // TODO: react to click

    this.gameMechanics.allowedMove.forEach((item) => {
      const position = this.allSquad.map(item => item.position);

      if (item === index && position.indexOf(index) === -1) {
        this.nextPlayer = (this.nextPlayer === 'computer') ? 'user' : 'computer';
        this.gamePlay.deselectCell(this.USC.position);
        this.USC.position = index;
        this.gamePlay.selectCell(this.USC.position);
        this._actionComputer();
      }
    });

    this.gameMechanics.allowedAttack.forEach((item) => {
      const computer = this.computerSquad.map(item => item.position);

      if (item === index && computer.indexOf(index) !== -1) {
        const attacker = this.USC.character;
        const target = this.computerSquad.filter(item => item.position === index);

        this._attack(index, attacker, target[0].character);
        this._actionComputer();
      }
    });

    this.userSquad.forEach((item, i, arr) => {
      if (item.position === index && this.USC.position !== index) {
        arr.forEach((item, i) => {
          this.gamePlay.deselectCell(this.USC.position);
          if (item.position === index) this.selectCharacter = i;
          this.USC = this.userSquad[this.selectCharacter];
          this.gamePlay.selectCell(this.USC.position);
        });
      }
    });

    this.gameMechanics = new GameMechanics(this.USC);
    this.gamePlay.redrawPositions(this.allSquad);
    this.onSaveGame();
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.gameMechanics.allowedMove.forEach((item) => {
      const position = this.allSquad.map(item => item.position);

      if (item === index && position.indexOf(index) === -1) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
      }
    });

    this.gameMechanics.allowedAttack.forEach((item) => {
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
      if (item.position === index && this.USC.position !== index) {
        this.gamePlay.setCursor('pointer');
      }
    });
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor('default');

    if (this.allSquad.indexOf(index) === -1 && this.USC.position !== index) {
      this.gamePlay.deselectCell(index);
    }
  }
}
