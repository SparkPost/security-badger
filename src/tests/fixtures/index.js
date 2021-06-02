const VULNERABILITY_ALERTS_FIXTURE = {
  repository: {
    vulnerabilityAlerts: {
      edges: [
        {
          node: {
            securityAdvisory: {
              permalink: 'https://github.com/advisories/GHSA-vh95-rmgr-6w4m',
              summary: 'Prototype Pollution in minimist',
              severity: 'LOW',
              publishedAt: '2020-04-03T21:48:32Z',
              vulnerabilities: {
                edges: [
                  {
                    node: {
                      package: {
                        name: 'minimist',
                      },
                      vulnerableVersionRange: '>= 1.0.0, < 1.2.3',
                    },
                  },
                  {
                    node: {
                      package: {
                        name: 'minimist',
                      },
                      vulnerableVersionRange: '< 0.2.1',
                    },
                  },
                ],
              },
            },
          },
        },
        {
          node: {
            securityAdvisory: {
              permalink: 'https://github.com/advisories/GHSA-5q6m-3h65-w53x',
              summary: 'Improper Neutralization of Special Elements used in an OS Command.',
              severity: 'MODERATE',
              publishedAt: '2021-03-11T22:26:09Z',
              vulnerabilities: {
                edges: [
                  {
                    node: {
                      package: {
                        name: 'react-dev-utils',
                      },
                      vulnerableVersionRange: '>= 0.4.0, < 11.0.4',
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

const VULNERABILITY_ALERTS_EMPTY_FIXTURE = {
  repository: {
    vulnerabilityAlerts: {
      edges: [],
    },
  },
};

module.exports = { VULNERABILITY_ALERTS_FIXTURE, VULNERABILITY_ALERTS_EMPTY_FIXTURE };
