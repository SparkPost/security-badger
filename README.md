# Security Badger

## Installation

Note, in order for this to work, be sure to have a token available with required permissions to
leverage the GitHub GraphQL API:
[Authenticating with GraphQL](https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql)

### Example Usage

```yml
name: Security Badger

on:
  schedule:
    # Every weekday every 2 hours during working hours, send notification
    - cron: '0 8-17/2 * * 1-5'

jobs:
  pr-reviews-reminder:
    runs-on: ubuntu-latest
    steps:
      uses: SparkPost/security-badger@main
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_API_TOKEN }}
        GITHUB_REPOSITORY: ${{ github.repository }}
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
      with:
        slackChannel: '#general'
```

## ES Modules

Though Node now supports ES Modules, custom GitHub actions do not yet support them as the runner is
restricted to using the Node version 12.

See relevant
[GitHub support thread](https://github.community/t/using-es6-modules-as-github-custom-action/126949).
