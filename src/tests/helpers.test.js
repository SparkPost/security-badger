const { formatVulnerabilityAlerts } = require('../helpers');

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

describe('helpers', () => {
  describe('formatVulnerabilityAlerts', () => {
    it('throws an error if no the data has no `repository` property', () => {
      const result = () => formatVulnerabilityAlerts({ something: 'else' });

      expect(result).toThrow('No repository found.');
    });

    it('returns Slack-friendly vulnerability alerts from the raw response from the GitHub GraphQL API', () => {
      const result = formatVulnerabilityAlerts(VULNERABILITY_ALERTS_FIXTURE);

      expect(result).toEqual([
        {
          permalink: 'https://github.com/advisories/GHSA-vh95-rmgr-6w4m',
          summary: 'Prototype Pollution in minimist',
          severity: 'LOW',
          publishedAt: '2020-04-03T21:48:32Z',
          versionRange: '>= 1.0.0, < 1.2.3',
        },
        {
          permalink: 'https://github.com/advisories/GHSA-5q6m-3h65-w53x',
          summary: 'Improper Neutralization of Special Elements used in an OS Command.',
          severity: 'MODERATE',
          publishedAt: '2021-03-11T22:26:09Z',
          versionRange: '>= 0.4.0, < 11.0.4',
        },
      ]);
    });

    it('returns an empty array if no `vulnerabilityAlerts` property exists on the `repository` property', () => {
      const result = formatVulnerabilityAlerts({ repository: { something: 'else' } });

      expect(result).toEqual([]);
    });
  });
});
