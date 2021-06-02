const { GITHUB_REPOSITORY, REMEDIATION_DEADLINE_MAP } = require('./constants.js');
const { addDays, differenceInDays, parseISO } = require('date-fns');

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
    const { securityAdvisory: advisory, createdAt } = edge.node;
    const { vulnerabilities, severity, ...rest } = advisory;
    const firstVulnerabilityNode = vulnerabilities.edges[0].node;
    const vulnerableVersionRange = firstVulnerabilityNode.vulnerableVersionRange;

    return {
      ...rest,
      dueInDays: getDueInDays({ currentDate: new Date(), createdAt, severity }),
      severity,
      versionRange: vulnerableVersionRange,
    };
  });
}

/**
 * @description returns returns number of days in which remediation is due for a security vulnerability
 * @param {Date} currentDate - the current date
 * @param {string} createdAt - date string on which, e.g., '2020-04-03T21:48:32Z'. The date the security vulnerability was published to the Dependabot registry
 * @param {string} severity - [severity](https://docs.github.com/en/graphql/reference/enums#securityadvisoryseverity) of the vulnerability
 * @returns {number}
 */
function getDueInDays({ currentDate, createdAt, severity }) {
  const createdAtDate = parseISO(createdAt);
  const { maxDaysToResolve } = REMEDIATION_DEADLINE_MAP.find((item) => item.severity === severity);
  const dueDate = addDays(createdAtDate, maxDaysToResolve);
  const remainingDays = differenceInDays(dueDate, currentDate);

  return remainingDays;
}

/**
 * @description returns message describing the due date of security vulnerability remediation for a particular vulnerability
 * @param {number} dueInDays - maximum number of days remaining to remediate a vulnerability
 * @param {string} severity - [severity](https://docs.github.com/en/graphql/reference/enums#securityadvisoryseverity) of the vulnerability
 * @returns {number}
 */
function getDueInMsg(dueInDays) {
  if (dueInDays < 0) {
    return `:rotating_light: Overdue by ${Math.abs(dueInDays)} days.`;
  }

  return `Due in ${dueInDays} days.`;
}

/**
 * @description returns Security Badger introductory message content according to the GitHub repo and the number of vulnerabilities reported
 * @param {number} numberOfVulnerabilities - Count of security vulnerabilities returned from the GitHub GraphQL API
 * @param {string} githubRepo - path to GitHub repo, e.g., `SparkPost/2web2ui`
 * @returns {string}
 */
function getIntroMsg({ numberOfVulnerabilities, githubRepo = GITHUB_REPOSITORY }) {
  if (numberOfVulnerabilities === 1)
    return `There is 1 security vulnerability that needs to be addressed for the repo *${githubRepo}*.`;

  return `There are ${numberOfVulnerabilities} vulnerabilities that still need to be addressed for the repo *${githubRepo}*.`;
}

module.exports = {
  formatVulnerabilityAlerts,
  getDueInDays,
  getDueInMsg,
  getIntroMsg,
};
