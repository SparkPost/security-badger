const GITHUB_API_URL = 'https://api.github.com/graphql';

const REMEDIATION_DEADLINE_MAP = [
  {
    severity: 'critical',
    daysToResolve: 14,
  },
  {
    severity: 'high',
    daysToResolve: 30,
  },
  {
    severity: 'medium',
    daysToResolve: 60,
  },
  {
    severity: 'low',
    daysToResolve: 90,
  },
];

module.exports = {
  GITHUB_API_URL,
  REMEDIATION_DEADLINE_MAP,
};
