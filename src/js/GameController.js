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

  _state() {
    return GameState.from({
      selectCharacter: this.selectCharacter,
      nextPlayer: this.nextPlayer,
      userSquad: this.userSquad,
      computerSquad: this.computerSquad,
      level: this.level,
      themes: this.themes,
    })
  }

  onNewGame() {
    const user = new User([new Swordsman(1), new Bowman(1)]);
    const computer = new Computer(generateTeam(arrayCharacters, 1, 2));

    this.selectCharacter = 0;
    this.nextPlayer = 'computer';
    this.userSquad = user.all;
    this.computerSquad = computer.all;
    this.themes = themes.prairie;
    this.level = 1;

    this.onSaveGame();
    this.onLoadGame();
  }

  onSaveGame() {
    this.stateService.save(this._state());
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
      generateComputer = generateTeam(arrayCharacters, 2, generateUser.length);
      this.themes = themes.arctic;
    }

    if (this.level === 3) {
      generateUser.push(characterGenerator(arrayCharacters, 2).next().value);
      generateComputer = generateTeam(arrayCharacters, 3, generateUser.length);
      this.themes = themes.desert;
    }

    if (this.level === 4) {
      generateUser.push(characterGenerator(arrayCharacters, 3).next().value);
      generateComputer = generateTeam(arrayCharacters, 4, generateUser.length);
      this.themes = themes.mountain;
    }

    this._levelUpCharacter(generateUser);
    this._levelUpCharacter(generateComputer);

    this.userSquad = new User(generateUser).all;
    this.computerSquad = new Computer(generateComputer).all;
    this.allSquad = [...this.userSquad, ...this.computerSquad];
    this.USC = this.userSquad[this.selectCharacter];
    this.gameMechanics = new GameMechanics(this.USC);

    GamePlay.showMessage(`${this.level} level!`);
    this.onSaveGame();
    this.gamePlay.drawUi(this.themes);
    this.gamePlay.redrawPositions(this.allSquad);
    this.gamePlay.selectCell(this.USC.position);
  }

  _attack(index, attacker, target, player) {
    if (player === undefined) {
      throw new TypeError('unknown parameter');
    }

    const valA = attacker.attack - target.defence;
    const valB = attacker.attack * 0.1;
    const formula = Math.floor(Math.max(valA, valB));
    const userCharacterLength = this.computerSquad.length;

    if (target.health - formula > 0) {
      target.health -= formula;
    } else if (player === 'user') {
      this.gamePlay.deselectCell(index);
      this.computerSquad = this.computerSquad.filter(item => item.position !== index);
    } else {
      this.gamePlay.deselectCell(index);
      this.userSquad = this.userSquad.filter(item => item.position !== index);

      if (userCharacterLength > this.userSquad.length) {
        this.gamePlay.deselectCell(this.USC.position);
        this.selectCharacter = 0;
        this.USC = this.userSquad[this.selectCharacter];
        if (this.userSquad.length !== 0) GamePlay.showMessage(`${target.type} kill!`);
        this.onSaveGame();
      }
    }

    this.allSquad = [...this.userSquad, ...this.computerSquad];

    this.gamePlay.showDamage(index, formula).then(() => {
      this.gamePlay.selectCell(this.USC.position);
      this.gamePlay.setCursor('default');
      this.gamePlay.redrawPositions(this.allSquad);
      if (player === 'user') this._actionComputer();
    });

    if (this.computerSquad.length === 0) {
      this._levelUp();
    }

    if (this.userSquad.length === 0) {
      GamePlay.showMessage('Game over!!!');
      this.onNewGame();
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

      const availableIndexes = mechanics.allowedMove.filter(item => {
        return busyIndexes.indexOf(item) === -1;
      });
      const randomIndex = Math.floor(Math.random() * availableIndexes.length);

      this.computerSquad[index].position = availableIndexes[randomIndex];
      this.allSquad = [...this.userSquad, ...this.computerSquad];
      this.gamePlay.redrawPositions(this.allSquad);
    }

    this.nextPlayer = 'computer';
    this.onSaveGame()
  }

  onCellClick(index)  {
    // TODO: react to click
    const state = this.stateService.load();

    if (state.nextPlayer === 'computer') {
      const user = this.userSquad.map(item => item.position);
      const computer = this.computerSquad.map(item => item.position);
      const all = [...user, ...computer];
      const move = this.gameMechanics.allowedMove;
      const attack = this.gameMechanics.allowedAttack;

      if (move.indexOf(index) !== -1 && all.indexOf(index) === -1) {
        this.gamePlay.deselectCell(this.USC.position);
        this.USC.position = index;
        this.gamePlay.selectCell(this.USC.position);
        this.gamePlay.redrawPositions(this.allSquad);
        this._actionComputer();
      }

      if (attack.indexOf(index) !== -1 && computer.indexOf(index) !== -1) {
        const target = this.computerSquad.filter(item => item.position === index);

        this.gamePlay.deselectCell(index);
        this._attack(index, this.USC.character, target[0].character, 'user');
      }

      if (user.indexOf(index) !== -1 && this.USC.position !== index) {
        this.gamePlay.deselectCell(this.USC.position);

        this.userSquad.forEach((item, i) => {
          if (item.position === index) this.selectCharacter = i;
        });

        this.USC = this.userSquad[this.selectCharacter];
        this.gamePlay.selectCell(this.USC.position);
      }

      this.gameMechanics = new GameMechanics(this.USC);
      this.nextPlayer = 'user';
    } else {
      GamePlay.showError('Wait for the computer to finish running!');
    }
  }

  _generateCursor(index) {
    const mechanics = this.gameMechanics;
    const comuter = this.computerSquad.map(item => item.position);
    const user = this.userSquad.map(item => item.position);
    const move = mechanics.allowedMove.filter(item => comuter.indexOf(item) === -1);
    const attack = mechanics.allowedAttack.filter(item => comuter.indexOf(item) !== -1);

    if (user.indexOf(index) !== -1) {
      return 'pointer';
    }
    if (attack.indexOf(index) !== -1) {
      return 'crosshair';
    }
    if (move.indexOf(index) !== -1) {
      return 'pointer';
    }

    return 'not-allowed';
  }

  _generateInfo(index) {
    const all = this.allSquad.filter(item => item.position === index);
    const convert = utils.conversionIcon(all[0].character);

    this.gamePlay.showCellTooltip(convert, index);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const state = this.stateService.load();

    if (state.nextPlayer === 'computer') {
      const curcor = this._generateCursor(index);
      const all = this.allSquad.map(item => item.position);

      if (curcor === 'crosshair') {
        this.gamePlay.selectCell(index, 'red');
      }

      if (curcor === 'pointer' && all.indexOf(index) === -1)  {
        this.gamePlay.selectCell(index, 'green');
      }

      this.gamePlay.setCursor(curcor);

      if (all.indexOf(index) !== -1) {
        this._generateInfo(index);
      }
    } else {
      this.gamePlay.setCursor('not-allowed');
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
}
