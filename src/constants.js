const GITHUB_API_URL = 'https://api.github.com/graphql';

const REMEDIATION_DEADLINE_MAP = [
  {
    severity: 'CRITICAL',
    maxDaysToResolve: 14,
  },
  {
    severity: 'HIGH',
    maxDaysToResolve: 30,
  },
  {
    severity: 'MODERATE',
    maxDaysToResolve: 60,
  },
  {
    severity: 'LOW',
    maxDaysToResolve: 90,
  },
];

module.exports = {
  GITHUB_API_URL,
  REMEDIATION_DEADLINE_MAP,
};
