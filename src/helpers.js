const { GITHUB_REPOSITORY } = require('./constants.js');

/**
 * @description Formats raw JSON response from GitHub GraphQL API to a friendlier format for rendering Slack message blocks
 * @param {Object} data - JSON response from GitHub GraphQL API. See `src/tests/fixtures` for example structure
 * @returns {Array} array of Slack message-friendly vulnerability alerts
 */
function formatVulnerabilityAlerts(data) {
  const { repository } = data;

  if (!repository) throw new Error('No repository found.');

  const { vulnerabilityAlerts } = repository;

  if (!vulnerabilityAlerts) return [];

  const { edges } = vulnerabilityAlerts;

  return edges.map((edge) => {
    const advisory = edge.node.securityAdvisory;
    const { vulnerabilities, ...rest } = advisory;
    const firstVulnerabilityNode = vulnerabilities.edges[0].node;
    const vulnerableVersionRange = firstVulnerabilityNode.vulnerableVersionRange;

    return {
      ...rest,
      versionRange: vulnerableVersionRange,
    };
  });
}

function getIntroMsg({ numberOfVulnerabilities, githubRepo = GITHUB_REPOSITORY }) {
  if (numberOfVulnerabilities === 1)
    return `There is 1 security vulnerability that needs to be addressed for the repo *${githubRepo}*.`;

  return `There are ${numberOfVulnerabilities} vulnerabilities that still need to be addressed for the repo *${githubRepo}*.`;
}

module.exports = {
  formatVulnerabilityAlerts,
  getIntroMsg,
};
