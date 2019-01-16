workflow "New workflow" {
  on = "push"
  resolves = ["GraphQL query"]
}

action "GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  args = "--url https://api.github.com/graphql --query .github/graphql_action/repository.query.yaml"
}
