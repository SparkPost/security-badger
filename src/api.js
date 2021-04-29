const axios = require('axios');
const { GITHUB_API_URL } = require('./constants.js');
const { securityVulnerabilityQuery } = require('./queries.js');

/**
 * @description returns structured query data derived from the GitHub repo string
 * @param {string} githubRepo - GitHub repo string, e.g. 'SparkPost/2web2ui'
 * @returns {Object}
 */
function toQueryFriendly(githubRepo) {
  const [owner, name] = githubRepo.split('/');

  return {
    owner: owner.toLowerCase(),
    name: name.toLowerCase(),
  };
}

/**
 * @description asynchronously gets [repository-specific vulnerability alerts](https://docs.github.com/en/graphql/reference/objects#repositoryvulnerabilityalert) via the GitHub GraphQL API
 * @param {string} githubRepo - GitHub repo string, e.g. 'SparkPost/2web2ui'
 * @param {string} githubToken - GitHub personal access token with relevant permissions for requesting data from the [GitHub GraphQL API](https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql)
 * @returns {Promise}
 */
function getVulnerabilities({ githubRepo, githubToken }) {
  if (!githubRepo) throw new Error('No `githubRepo` supplied - GitHub data cannot be retrieved.');

  if (!githubToken) throw new Error('No `githubToken` supplied - GitHub data cannot be retrieved.');

  const { owner, name } = toQueryFriendly(githubRepo);
  const query = securityVulnerabilityQuery({ owner, name });

  return axios({
    url: GITHUB_API_URL,
    method: 'POST',
    data: { query },
    headers: {
      Authorization: `bearer ${githubToken}`,
    },
  })
    .then(({ data }) => data)
    .catch((err) => console.log(err));
}

/**
 * @description asynchronously posts to Slack [via a webhook](https://api.slack.com/messaging/webhooks)
 * @param {string} text text content to post to a Slack Channel
 * @param {Array} blocks array of text content, rendering as a list in a Slack message
 * @param {string} slackChannel Slack Channel to target, e.g., '#front-end-guild'
 * @param {string} slackWebhookUrl Slack webhook URL that receives incoming message data - this URL can be found via the app configuration that will post the message - https://api.slack.com/apps/<app-id>/incoming-webhooks
 * @returns {Promise}
 */
function postSlackMsg({ text, blocks, slackChannel, slackWebhookUrl }) {
  if (!slackWebhookUrl)
    throw new Error('No `slackWebhookUrl` supplied - messages cannot be posted.');

  if (!slackChannel) throw new Error('No `slackChannel` supplied - messages cannot be posted.');

  return axios({
    method: 'POST',
    url: slackWebhookUrl,
    data: {
      channel: slackChannel,
      username: 'Security Badger',
      text,
      blocks,
    },
  }).catch((err) => console.log(err));
}

module.exports = {
  getVulnerabilities,
  postSlackMsg,
};
