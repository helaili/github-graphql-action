const path = require('path')

Object.assign(process.env, {
  GITHUB_ACTION: 'github-graphql-action',
  GITHUB_ACTOR: 'helaili',
  GITHUB_EVENT_NAME: 'issues',
  GITHUB_EVENT_PATH: path.join(__dirname, 'fixtures', 'labeled.event.json'),
  GITHUB_REF: 'master',
  GITHUB_REPOSITORY: 'helaili/github-graphql-action',
  GITHUB_SHA: '123abc',
  GITHUB_TOKEN: '456def',
  GITHUB_WORKFLOW: 'my-workflow',
  GITHUB_WORKSPACE: path.join(__dirname, 'fixtures', 'workspaces'),
  HOME: '?'
})