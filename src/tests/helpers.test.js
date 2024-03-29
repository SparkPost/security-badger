const { formatVulnerabilityAlerts, getDueInDays, getDueInMsg, getIntroMsg } = require('../helpers');
const { VULNERABILITY_ALERTS_FIXTURE } = require('./fixtures');

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
          dueInDays: -269,
          permalink: 'https://github.com/advisories/GHSA-vh95-rmgr-6w4m',
          summary: 'Prototype Pollution in minimist',
          severity: 'LOW',
          publishedAt: '2020-04-03T21:48:32Z',
          versionRange: '>= 1.0.0, < 1.2.3',
        },
        {
          dueInDays: -299,
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

  describe('getIntroMsg', () => {
    it('returns an intro message according to the number of passed-in vulnerabilities and the GitHub repository', () => {
      const result = getIntroMsg({ numberOfVulnerabilities: 3, githubRepo: 'SparkPost/2web2ui' });

      expect(result).toBe(
        `There are 3 vulnerabilities that still need to be addressed for the repo *SparkPost/2web2ui*.`,
      );
    });

    it('returns a different message when there is a single vulnerability', () => {
      const result = getIntroMsg({ numberOfVulnerabilities: 1, githubRepo: 'SparkPost/2web2ui' });

      expect(result).toBe(
        'There is 1 security vulnerability that needs to be addressed for the repo *SparkPost/2web2ui*.',
      );
    });
  });

  describe('getDueInDays', () => {
    it('returns the remaining days before a deadline for a security remediation', () => {
      const result = getDueInDays({
        currentDate: new Date('March 3, 2020 00:00:00'),
        createdAt: '2020-01-03T21:48:32Z',
        severity: 'LOW',
      });

      expect(result).toBe(30);
    });

    it('returns a negative number of days when the deadline has passed', () => {
      const result = getDueInDays({
        currentDate: new Date('March 3, 2021 00:00:00'),
        createdAt: '2020-12-01T21:48:32Z',
        severity: 'LOW',
      });

      expect(result).toBe(-1);
    });
  });

  describe('getDueInMsg', () => {
    it('returns an appropriate message when a remediation is overdue', () => {
      const result = getDueInMsg(-45);

      expect(result).toBe(':rotating_light: Overdue by 45 days.');
    });

    it('returns an appropriate message when a remediation is not yet due', () => {
      const result = getDueInMsg(45);

      expect(result).toBe('Due in 45 days.');
    });
  });
});
