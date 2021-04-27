function securityVulnerabilityQuery({ owner, name }) {
  return `query {
    repository(owner: "${owner}", name: "${name}") {
      vulnerabilityAlerts(first: 99) {
        edges {
          node {
            securityAdvisory {
              permalink
              summary
              severity
              publishedAt
              vulnerabilities(first: 99) {
              	edges {
                  node {
                    package {
                      name
                    }
                    vulnerableVersionRange
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;
}

module.exports = {
  securityVulnerabilityQuery,
};
