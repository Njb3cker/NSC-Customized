function getPurificationLevelMult(level) {
  return Math.min(12, Math.floor(level / 5) * 2);
}

export function getPurificationCost(curseValue, level, playerCount) {
  const levelMult = getPurificationLevelMult(level);
  return Math.floor(curseValue * levelMult * Math.sqrt(playerCount));
}
