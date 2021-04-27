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

module.exports = {
  formatVulnerabilityAlerts,
};
