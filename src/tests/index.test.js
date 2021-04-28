const { main } = require('../index');
const { getSecurityVulnerabilities, postSlackMsg } = require('../api');
const { VULNERABILITY_ALERTS_FIXTURE, VULNERABILITY_ALERTS_EMPTY_FIXTURE } = require('./fixtures');
jest.mock('../constants');
jest.mock('../api');

describe('index', () => {
  describe('main', () => {
    it('logs to the console when no vulnerabilities are found', async () => {
      const log = jest.spyOn(global.console, 'log');
      const mockGitHubReq = jest.fn(() =>
        Promise.resolve({ data: VULNERABILITY_ALERTS_EMPTY_FIXTURE }),
      );
      const slackReq = jest.fn(() => Promise.resolve({}));
      getSecurityVulnerabilities.mockImplementation(mockGitHubReq);
      postSlackMsg.mockImplementation(slackReq);

      await main();

      expect(mockGitHubReq).toHaveBeenCalled();
      expect(slackReq).not.toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith('No security vulnerabilities found.');
    });

    it('posts vulnerability alerts to Slack', async () => {
      const mockGitHubReq = jest.fn(() => Promise.resolve({ data: VULNERABILITY_ALERTS_FIXTURE }));
      const slackReq = jest.fn(() => Promise.resolve({}));
      getSecurityVulnerabilities.mockImplementation(mockGitHubReq);
      postSlackMsg.mockImplementation(slackReq);

      await main();

      expect(mockGitHubReq).toHaveBeenCalled();
      expect(postSlackMsg).toHaveBeenCalledWith({
        blocks: [
          {
            text: {
              text: `*A wild Security Badger appeared!* \n There are 2 vulnerabilities that still need to be addressed for the repo *${process.env.GITHUB_REPOSITORY}*.`, // GitHub sets this env variable dynamically - referencing the variable explicitly reduces the brittleness of the test
              type: 'mrkdwn',
            },
            type: 'section',
          },
          { type: 'divider' },
          {
            text: {
              text:
                '*<https://github.com/advisories/GHSA-vh95-rmgr-6w4m|:rotating_light: Prototype Pollution in minimist>*',
              type: 'mrkdwn',
            },
            type: 'section',
          },
          {
            elements: [
              {
                text: '*LOW* severity vulnerability within version range >= 1.0.0, < 1.2.3.',
                type: 'mrkdwn',
              },
            ],
            type: 'context',
          },
          { type: 'divider' },
          {
            text: {
              text:
                '*<https://github.com/advisories/GHSA-5q6m-3h65-w53x|:rotating_light: Improper Neutralization of Special Elements used in an OS Command.>*',
              type: 'mrkdwn',
            },
            type: 'section',
          },
          {
            elements: [
              {
                text: '*MODERATE* severity vulnerability within version range >= 0.4.0, < 11.0.4.',
                type: 'mrkdwn',
              },
            ],
            type: 'context',
          },
        ],
        slackChannel: undefined,
        slackWebhookUrl: undefined,
      });
    });
  });
});