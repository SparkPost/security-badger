const { getVulnerabilities, postSlackMsg } = require('./api.js');
const { formatVulnerabilityAlerts, getDueInMsg, getIntroMsg } = require('./helpers.js');

// Allows for consumption of .env files
require('dotenv').config();

async function main() {
  const { data } = await getVulnerabilities({
    githubRepo: process.env.GITHUB_REPOSITORY,
    githubToken: process.env.GITHUB_TOKEN,
  });
  const vulnerabilityAlerts = formatVulnerabilityAlerts(data);

  if (Boolean(vulnerabilityAlerts) && vulnerabilityAlerts.length === 0)
    return console.log('No security vulnerabilities found.');

  const introMsg = getIntroMsg({
    numberOfVulnerabilities: vulnerabilityAlerts.length,
    githubRepo: process.env.GITHUB_REPOSITORY,
  });

  await postSlackMsg({
    slackChannel: process.env.SLACK_CHANNEL || process.env.INPUT_SLACKCHANNEL,
    slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*A wild Security Badger appeared!* \n ${introMsg}`,
        },
      },
      ...[].concat(
        ...vulnerabilityAlerts.map((alert) => {
          const { dueInDays, permalink, summary, severity } = alert;

          return [
            {
              type: 'divider',
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: permalink ? `*<${permalink}|${summary}>*` : `*${summary}*`,
              },
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: `*${severity}* vulnerability. ${getDueInMsg(dueInDays)}`,
                },
              ],
            },
          ];
        }),
      ),
    ],
  });
}

main();

// Exported for testing purposes
module.exports = { main };
