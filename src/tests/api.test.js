const { getSecurityVulnerabilities, postSlackMsg } = require('../api');

describe('api', () => {
  describe('getSecurityVulnerabilities', () => {
    it('throws an error if no `githubRepo` is passed', () => {
      const result = () =>
        getSecurityVulnerabilities({ githubRepo: undefined, githubToken: 'my-fake-github-token' });

      expect(result).toThrow('No `gitHubRepo` supplied - GitHub data cannot be retrieved.');
    });

    it('throws an error if no `githubToken` is passed', () => {
      const result = () =>
        getSecurityVulnerabilities({ githubRepo: 'my/fake/repo', githubToken: undefined });

      expect(result).toThrow('No `githubToken` supplied - GitHub data cannot be retrieved.');
    });
  });

  describe('postSlackMsg', () => {
    it('throws an error if no `slackWebhookUrl` is passed', () => {
      const result = () =>
        postSlackMsg({
          text: 'hello!',
          blocks: [],
          slackWebhookUrl: undefined,
          slackChannel: 'my-fake-slack-channel',
        });

      expect(result).toThrow('No `slackWebhookUrl` supplied - messages cannot be posted.');
    });

    it('throws an error if `slackChannel` is passed', () => {
      const result = () =>
        postSlackMsg({
          text: 'hello!',
          blocks: [],
          slackWebhookUrl: '/my-fake/webhook/url',
          slackChannel: undefined,
        });

      expect(result).toThrow('No `slackChannel` supplied - messages cannot be posted.');
    });
  });
});
