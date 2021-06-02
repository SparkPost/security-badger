const { main } = require('../index');
const { getVulnerabilities, postSlackMsg } = require('../api');
const { VULNERABILITY_ALERTS_FIXTURE, VULNERABILITY_ALERTS_EMPTY_FIXTURE } = require('./fixtures');
jest.mock('../api');

describe('index', () => {
  describe('main', () => {
    it('logs to the console when no vulnerabilities are found', async () => {
      const log = jest.spyOn(global.console, 'log');
      const mockGitHubReq = jest.fn(() =>
        Promise.resolve({ data: VULNERABILITY_ALERTS_EMPTY_FIXTURE }),
      );
      const slackReq = jest.fn(() => Promise.resolve({}));
      getVulnerabilities.mockImplementation(mockGitHubReq);
      postSlackMsg.mockImplementation(slackReq);

      await main();

      expect(mockGitHubReq).toHaveBeenCalledWith({
        githubRepo: process.env.GITHUB_REPOSITORY,
        githubToken: process.env.GITHUB_TOKEN,
      });
      expect(slackReq).not.toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith('No security vulnerabilities found.');
    });

    it('posts vulnerability alerts to Slack', async () => {
      const mockGitHubReq = jest.fn(() => Promise.resolve({ data: VULNERABILITY_ALERTS_FIXTURE }));
      const slackReq = jest.fn(() => Promise.resolve({}));
      getVulnerabilities.mockImplementation(mockGitHubReq);
      postSlackMsg.mockImplementation(slackReq);

      await main();

      expect(mockGitHubReq).toHaveBeenCalledWith({
        githubRepo: process.env.GITHUB_REPOSITORY,
        githubToken: process.env.GITHUB_TOKEN,
      });
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
                '*<https://github.com/advisories/GHSA-vh95-rmgr-6w4m|Prototype Pollution in minimist>*',
              type: 'mrkdwn',
            },
            type: 'section',
          },
          {
            elements: [
              {
                text: '*LOW* vulnerability. :rotating_light: Overdue by 269 days.',
                type: 'mrkdwn',
              },
            ],
            type: 'context',
          },
          { type: 'divider' },
          {
            text: {
              text:
                '*<https://github.com/advisories/GHSA-5q6m-3h65-w53x|Improper Neutralization of Special Elements used in an OS Command.>*',
              type: 'mrkdwn',
            },
            type: 'section',
          },
          {
            elements: [
              {
                text: '*MODERATE* vulnerability. :rotating_light: Overdue by 299 days.',
                type: 'mrkdwn',
              },
            ],
            type: 'context',
          },
        ],
        slackChannel: process.env.SLACK_CHANNEL,
        slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
      });
    });
  });
});
