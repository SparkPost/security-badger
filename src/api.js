const axios = require('axios');
const {
  GITHUB_API_URL,
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  SLACK_CHANNEL,
  SLACK_WEBHOOK_URL,
} = require('./constants.js');

function getSecurityVulnerabilities({
  githubRepo = GITHUB_REPOSITORY,
  githubToken = GITHUB_TOKEN,
} = {}) {
  if (!githubRepo) throw new Error('No `gitHubRepo` supplied - GitHub data cannot be retrieved.');

  if (!githubToken) throw new Error('No `githubToken` supplied - GitHub data cannot be retrieved.');

  const [owner, name] = githubRepo.split('/');
  const query = `query {
    repository(owner: "${owner.toLowerCase()}", name: "${name.toLowerCase()}") {
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
  console.log(query);

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
