export const modeRules = {
  normal: {
    id: 'normal',
    name: 'Impostor Mode',
    description: 'Find the impostor among players.',
    hiddenRole: 'impostor',
    visibleRole: 'civilian',
    countLabel: 'Impostors',
    setupTitle: 'Game Setup',
    votePromptSingular: 'Who is the Impostor?',
    votePromptPlural: 'Who are the Impostors?',
    resultCaughtMessage: 'The impostor was caught!',
    resultEscapedMessage: 'The impostor escaped! Wrong player was voted out.',
    roleInfoLabelSingular: 'The Impostor',
    roleInfoLabelPlural: 'The Impostors',
    caughtWinner: 'civilians',
    escapedWinner: 'impostor',
    confirmVoteVariant: 'danger',
  },
  civilian: {
    id: 'civilian',
    name: 'Civilian Mode',
    description: 'Find the civilian among impostors.',
    hiddenRole: 'civilian',
    visibleRole: 'impostor',
    countLabel: 'Civilians',
    setupTitle: 'Civilian Mode Setup',
    votePromptSingular: 'Who is the Civilian?',
    votePromptPlural: 'Who are the Civilians?',
    resultCaughtMessage: 'The civilian was caught!',
    resultEscapedMessage: 'The civilian escaped! Wrong player was voted out.',
    roleInfoLabelSingular: 'The Civilian',
    roleInfoLabelPlural: 'The Civilians',
    caughtWinner: 'impostor',
    escapedWinner: 'civilians',
    confirmVoteVariant: 'success',
  },
};

export function getModeRule(modeId) {
  return modeRules[modeId] || modeRules.normal;
}
