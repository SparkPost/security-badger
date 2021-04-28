/**
 * @description returns GraphQL query for [repository-specific vulnerability alerts](https://docs.github.com/en/graphql/reference/objects#repositoryvulnerabilityalert)
 * @param {string} owner - GitHub repo owner or organization, e.g., 'SparkPost'
 * @param {string} name - GitHub repo name, e.g., '2web2ui'
 * @returns {string} GraphQL query
 */

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
