const { GITHUB_REPOSITORY } = require('./constants.js');

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
