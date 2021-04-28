const {
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  SLACK_CHANNEL,
  SLACK_WEBHOOK_URL,
} = require('./constants.js');
const { getSecurityVulnerabilities, postSlackMsg } = require('./api.js');
const { formatVulnerabilityAlerts, getIntroMsg } = require('./helpers.js');

async function main() {
  const { data } = await getSecurityVulnerabilities({
    githubRepo: GITHUB_REPOSITORY,
    githubToken: GITHUB_TOKEN,
  });
  const vulnerabilityAlerts = formatVulnerabilityAlerts(data);

  if (Boolean(vulnerabilityAlerts) && vulnerabilityAlerts.length === 0)
    return console.log('No security vulnerabilities found.');

  const introMsg = getIntroMsg({
    numberOfVulnerabilities: vulnerabilityAlerts.length,
    githubRepo: GITHUB_REPOSITORY,
  });

  await postSlackMsg({
    slackChannel: SLACK_CHANNEL,
    slackWebhookUrl: SLACK_WEBHOOK_URL,
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
          const { permalink, summary, severity, versionRange } = alert;
          const summaryContent = permalink
            ? `*<${permalink}|:rotating_light: ${summary}>*`
            : `*:rotating_light: ${summary}*`;
          const contextContent = versionRange
            ? `*${severity}* severity vulnerability within version range ${versionRange}.`
            : `*${severity}* vulnerability.`;

          return [
            {
              type: 'divider',
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: summaryContent,
              },
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: contextContent,
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
module.exports = {
  main,
};
