workflow "Pin Issue" {
  resolves = ["Unpin Issue GraphQL query"]
  on = "label"
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

action "Unpin Issue GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  needs = ["Pinned Issues GraphQL query"]
  args = "--accept application/vnd.github.elektra-preview+json --query .github/graphql_action/unpinissue.query.yaml --owner helaili --name hello-vue"
}

action "Introspection GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  args = "--accept application/vnd.github.elektra-preview+json --query .github/graphql_action/introspection.query.yaml"
}
