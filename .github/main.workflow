workflow "New workflow" {
  on = "push"
  resolves = ["GraphQL query"]
}

action "GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
}
