workflow "New workflow" {
  on = "push"
  resolves = ["Repo GraphQL query", "Pinned Issues GraphQL query", "Introspection GraphQL query"]
}

action "Repo GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  args = "--url https://api.github.com/graphql --query .github/graphql_action/repository.query.yaml"
}

action "Pinned Issues GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  args = "--accept application/vnd.github.elektra-preview+json --query .github/graphql_action/pinnedissues.query.yaml --file pinnedIssues.json --owner helaili --name hello-vue"
}

action "Introspection GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  args = "--accept application/vnd.github.elektra-preview+json --query .github/graphql_action/introspection.query.yaml"
}
