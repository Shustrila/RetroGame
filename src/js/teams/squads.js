// team
import User from './User';
import Computer from './Computer';

// characters
import Swordsman from '../characters/Swordsman';
import Bowman from '../characters/Bowman';
import arrayCharacters from '../characters/arrayCharacters';
import { generateTeam } from '../generators';


export const userSquad = new User([new Swordsman(1), new Bowman(1)]);

export const computerSquad = new Computer(generateTeam(arrayCharacters, 1, 2));
