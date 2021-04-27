const axios = require('axios');
const {
  GITHUB_API_URL,
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  SLACK_CHANNEL,
  SLACK_WEBHOOK_URL,
} = require('./constants.js');
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

function getSecurityVulnerabilities({
  githubRepo = GITHUB_REPOSITORY,
  githubToken = GITHUB_TOKEN,
} = {}) {
  if (!githubRepo) throw new Error('No `gitHubRepo` supplied - GitHub data cannot be retrieved.');

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

function postSlackMsg({
  text,
  blocks,
  slackChannel = SLACK_CHANNEL,
  slackWebhookUrl = SLACK_WEBHOOK_URL,
} = {}) {
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
  getSecurityVulnerabilities,
  postSlackMsg,
};
