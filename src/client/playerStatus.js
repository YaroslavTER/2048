const playerStatus = {
  playing: 'playing',
  win: 'win',
  loose: 'loose',
};

const updateCompetitorStatus = (inputCompetitorSet, id, statusName) => {
  const competitorSet = JSON.parse(JSON.stringify(inputCompetitorSet)),
    { [statusName]: status } = playerStatus;

  return { ...competitorSet[id], status };
};

export { playerStatus, updateCompetitorStatus };
