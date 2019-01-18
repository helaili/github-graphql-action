workflow "Pin Latest Duplicate Issue" {
  resolves = ["Pin Issue", "Repo Query jq"]
  on = "issues"
}

action "Repo Query Static" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  args = "--url https://api.github.com/graphql --query .github/graphql_action/repository-static.query.yaml --log true"
}

action "Repo Query Args" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  needs = "Repo Query Static"
  args = "--url https://api.github.com/graphql --query .github/graphql_action/repository-args.query.yaml --owner helaili --name github-graphql-action --log true"
}

action "Repo Query jq" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  needs = "Repo Query Args"
  args = "--url https://api.github.com/graphql --query .github/graphql_action/repository-jq.query.yaml --log true"
}


action "List Pinned Issues" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  needs = "Filters label duplicate"
  args = "--accept application/vnd.github.elektra-preview+json --query .github/graphql_action/pinnedissues.query.yaml --output pinnedIssues.json"
}

action "Unpin Issue" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  needs = ["List Pinned Issues"]
  args = "--accept application/vnd.github.elektra-preview+json --query .github/graphql_action/unpinissue.query.yaml"
}

action "Pin Issue" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  needs = ["Unpin Issue"]
  args = "--accept application/vnd.github.elektra-preview+json --query .github/graphql_action/pinissue.query.yaml"
}

action "Introspection GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  args = "--accept application/vnd.github.elektra-preview+json --query .github/graphql_action/introspection.query.yaml"
}

action "Filters Labeled Issues" {
  uses = "actions/bin/filter@master"
  args = "action labeled"
}

action "Filters label duplicate" {
  uses = "actions/bin/filter@master"
  needs = ["Filters Labeled Issues"]
  args = "label duplicate"
}
