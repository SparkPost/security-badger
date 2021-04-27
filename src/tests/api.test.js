const axios = require('axios');
const { GITHUB_API_URL } = require('../constants');
const { getSecurityVulnerabilities, postSlackMsg } = require('../api');
const { securityVulnerabilityQuery } = require('../queries');

describe('api', () => {
  describe('getSecurityVulnerabilities', () => {
    it('throws an error if no `githubRepo` is passed', () => {
      process.env.GITHUB_REPOSITORY = undefined;

      const result = () =>
        getSecurityVulnerabilities({ githubRepo: undefined, githubToken: 'my-fake-github-token' });

      expect(result).toThrow('No `gitHubRepo` supplied - GitHub data cannot be retrieved.');
    });

    it('throws an error if no `githubToken` is passed', () => {
      const result = () =>
        getSecurityVulnerabilities({ githubRepo: 'my/fake/repo', githubToken: undefined });

      expect(result).toThrow('No `githubToken` supplied - GitHub data cannot be retrieved.');
    });

    it('requests security vulnerabilities via the repo owner and project name', () => {
      const mockRequest = jest.fn(() => Promise.resolve({}));
      axios.mockImplementation(mockRequest);

      getSecurityVulnerabilities({
        githubRepo: 'sparkpost/2web2ui',
        githubToken: 'fake-token',
      });

      expect(mockRequest).toHaveBeenCalledWith({
        url: GITHUB_API_URL,
        method: 'POST',
        data: {
          query: securityVulnerabilityQuery({ owner: 'sparkpost', name: '2web2ui' }),
        },
        headers: {
          Authorization: 'bearer fake-token',
        },
      });
    });

    it('formats the GitHub org/owner and repo name before making the request to GitHub', () => {
      const mockRequest = jest.fn(() => Promise.resolve({}));
      axios.mockImplementation(mockRequest);

      getSecurityVulnerabilities({
        githubRepo: 'SparkPost/2Web2UI',
        githubToken: 'fake-token',
      });

      expect(mockRequest).toHaveBeenCalledWith({
        url: GITHUB_API_URL,
        method: 'POST',
        data: {
          query: securityVulnerabilityQuery({ owner: 'sparkpost', name: '2web2ui' }),
        },
        headers: {
          Authorization: 'bearer fake-token',
        },
      });
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

    it('passes data to Slack via a webhook', () => {
      const mockRequest = jest.fn(() => Promise.resolve({}));
      axios.mockImplementation(mockRequest);

      postSlackMsg({
        text: 'is someone getting the',
        blocks: ['best the best the best the best of you?'],
        slackChannel: '#foo-fighters-fans-only',
        slackWebhookUrl: '/fake/webhook/url',
      });

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/fake/webhook/url',
        data: {
          channel: '#foo-fighters-fans-only',
          username: 'Security Badger',
          text: 'is someone getting the',
          blocks: ['best the best the best the best of you?'],
        },
      });
    });
  });
});
