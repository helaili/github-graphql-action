workflow "Pin Issue" {
  resolves = [
    "Unpin Issue GraphQL query"]
  on = "issues"
}

action "Repo GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  args = "--url https://api.github.com/graphql --query .github/graphql_action/repository.query.yaml"
}

action "Pinned Issues GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  needs = "Filters Labeled Issues"
  args = "--accept application/vnd.github.elektra-preview+json --query .github/graphql_action/pinnedissues.query.yaml --file pinnedIssues.json --owner helaili --name github-graphql-action"
}

action "Unpin Issue GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  needs = ["Pinned Issues GraphQL query"]
  args = "--accept application/vnd.github.elektra-preview+json --query .github/graphql_action/unpinissue.query.yaml --owner helaili --name github-graphql-action"
}

action "Introspection GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  args = "--accept application/vnd.github.elektra-preview+json --query .github/graphql_action/introspection.query.yaml"
}

action "Filters Labeled Issues" {
  uses = "actions/bin/filter@4a6d223ba761a7331715748a8f5d3dd07c373519"
  args = "action labeled"
}
