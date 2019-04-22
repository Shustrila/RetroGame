import themes from './themes';
import GameState from './GameState';
import * as utils from './utils';
import GameMechanics from './GameMechanics';
import GamePlay from './GamePlay';

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

      // mechanics
      this.gameMechanics = new GameMechanics(this.USC);

      // Game start
      this.gamePlay.drawUi(this.themes);
      this.gamePlay.redrawPositions(this.allSquad);
      this.gamePlay.selectCell(this.USC.position);
    } else {
      this.onNewGame();
    }

    if (state.nextPlayer === 'user') {
      this._actionComputer();
    }
  }

  _actionComputer() {
    let index = null;
    let mechanics = {};
    const purposes = [];

    for (let i = 0; i < this.computerSquad.length; i++) {
      mechanics = new GameMechanics(this.computerSquad[i]);

      this.userSquad
        .map(user => user.position)
        .forEach(item => {
          if (mechanics.allowedAttack.indexOf(item) !== -1) {
            index = i;
            purposes.push(item);
            return false;
          }
        });
    }

    if (index !== null) {
      const indexTarget = Math.floor(Math.random() * purposes.length);

      this.userSquad
        .filter(user => user.position === purposes[indexTarget])
        .forEach((item) => {
          const computer = this.computerSquad[index].character;

          this._attack(purposes[indexTarget], computer, item.character, 'computer');
        });
    } else {
      const busyIndexes = this.allSquad.map(item => item.position);

      index = Math.floor(Math.random() * this.computerSquad.length);
      mechanics = new GameMechanics(this.computerSquad[index]);

      const availableIndexes = mechanics.allowedMove.filter(item => !(item === busyIndexes));
      const randomIndex = Math.floor(Math.random() * availableIndexes.length);

      this.computerSquad[index].position = availableIndexes[randomIndex];
    }

    this.nextPlayer = 'computer';
    this.allSquad = [...this.userSquad, ...this.computerSquad];
    this.gamePlay.redrawPositions(this.allSquad);
    this.onSaveGame();
  }

  onCellClick(index) {
    // TODO: react to click
    const state = this.stateService.load();

    if (state.nextPlayer === 'computer') {
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
          const target = this.computerSquad.filter(item => item.position === index);

          this._attack(index, this.USC.character, target[0].character, 'user');
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
      this.nextPlayer = 'user';
    } else {
      GamePlay.showError('Wait for the computer to finish running!');
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const state = this.stateService.load();

    this.gamePlay.setCursor('not-allowed');

    if (state.nextPlayer === 'computer') {
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
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor('default');

    if (this.allSquad.indexOf(index) === -1 && this.USC.position !== index) {
      this.gamePlay.deselectCell(index);
    }
  }

  _levelUpCharacter(arr) {
    arr.forEach((item) => {
      item.level += 1;
      const calc = (1.8 - item.health / 100);
      const attack = Math.max(item.attack, item.attack * calc);
      const defence = Math.max(item.defence, item.defence * calc);

      item.attack = Math.floor(attack);
      item.defence = Math.floor(defence);
      item.health += 80;

      if (item.health >= 100) {
        item.health = 100;
      }
    });
  }

  _levelUp() {
    let generateComputer = [];
    const generateUser = [];

    this.level += 1;

    if (this.level > 4) {
      this.level = 1;
    }

    this.userSquad.forEach(item => generateUser.push(item.character));

    if (this.level === 1) {
      this._levelUpCharacter(generateUser);
      generateComputer = generateTeam(arrayCharacters, 2, generateUser.length);
      this.themes = themes.prairie;
    }

    if (this.level === 2) {
      generateUser.push(characterGenerator(arrayCharacters, 1).next().value);
      this._levelUpCharacter(generateUser);
      generateComputer = generateTeam(arrayCharacters, 2, generateUser.length);
      this._levelUpCharacter(generateComputer);
      this.themes = themes.arctic;
    }

    if (this.level === 3) {
      generateUser.push(characterGenerator(arrayCharacters, 2).next().value);
      this._levelUpCharacter(generateUser);
      generateComputer = generateTeam(arrayCharacters, 3, generateUser.length);
      this._levelUpCharacter(generateComputer);
      this.themes = themes.desert;
    }

    if (this.level === 4) {
      generateUser.push(characterGenerator(arrayCharacters, 3).next().value);
      this._levelUpCharacter(generateUser);
      generateComputer = generateTeam(arrayCharacters, 4, generateUser.length);
      this._levelUpCharacter(generateComputer);
      this.themes = themes.mountain;
    }

    this.userSquad = new User(generateUser).all;
    this.computerSquad = new Computer(generateComputer).all;
    this.allSquad = [...this.userSquad, ...this.computerSquad];
    this.USC = this.userSquad[this.selectCharacter];
    this.gameMechanics = new GameMechanics(this.USC);

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
      this.gamePlay.setCursor('default');
      this.gamePlay.deselectCell(index);
    }

    if (this.computerSquad.length === 0) {
      this._levelUp();
    }

    if (this.userSquad.length === 0) {
      GamePlay.showMessage('Game over!!!');
      this.onNewGame();
    }

    if (userCharacterLength > this.userSquad.length) {
      this.gamePlay.deselectCell(this.USC.position);
      this.selectCharacter = 0;
      this.USC = this.userSquad[this.selectCharacter];
      this.gamePlay.selectCell(this.USC.position);
    }
  }
}
