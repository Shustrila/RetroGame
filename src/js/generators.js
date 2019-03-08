import Team from './Team'
/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel = 1) {
  if (!Array.isArray(allowedTypes)) throw new TypeError('allowedTypes not array');

  while (true) {
    const index = Math.round(Math.random() * allowedTypes.length);
    const level = Math.round(Math.random() * maxLevel + 1);

    yield new allowedTypes[index](level);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  if (characterCount === undefined) throw new TypeError('parameter not passed characterCount');

  const characters  = characterGenerator(allowedTypes, maxLevel);
  let arrTeam = [];

  for (let i = 0; i < characterCount; i++){
    arrTeam.push(characters.next().value);
  }

  return new Team(arrTeam)
}
