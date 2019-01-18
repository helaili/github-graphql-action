# github-graphql-action

An action that acts a client for GitHub's GraphQL API and can be chained. It means you can use a first instance to execute a GraphQL query and use its output to execute a GraphQL mutation.

Check [a sample workflow](https://github.com/helaili/github-graphql-action/blob/master/.github/main.workflow) and [sample GraphqQL queries](https://github.com/helaili/github-graphql-action/tree/master/.github/graphql_action)

### Parameters
| Argument   | Description |
|--------|-------------|
| query  | Query file path within the repo. _Required_  |
| output   | The name of the file, relative to `GITHUB_WORKSPACE`, where the output will be stored. Defaults to `github-graphql-action.json` |
| url    | GraphQL endpoint URL. Defaults to `https://api.github.com/graphql`  |
| accept | `Accept` header to set in the query. _Optional_   |
| log    | Set this argument to any value to enable logging to the console. _Optional_  |


### Query file
The query file contains the GraphQL query or mutation to execute. Format is YAML based.

#### Static parameters

```yaml
query:
  query($owner:String!, $name:String!) {
    repository(owner:$owner, name:$name) {
  	 name
   }
  }
variables:
  owner: helaili
  name: github-graphql-action
```


```js
action "GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  args = "--query .github/graphql_action/repository-static.query.yaml"
}
```

#### Command line based parameters

Variables values can also come from a command line argument.

```yaml
query:
  query($owner:String!, $name:String!) {
    repository(owner:$owner, name:$name) {
  	 name
   }
  }
variables:
  owner:
    type: arg
    name: owner
  name:
    type: arg
    name: name
```

```js
action "GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  args = "--query .github/graphql_action/repository-args.query.yaml --owner helaili --name hello-vue"
}
```

#### File based parameters

Variable values can also come from a file, typically `event.json` which contains the event which triggered the action workflow (in `../workflow`) or an arbitrary file (relative to `/github/workspace`) containing the result from a previous action (declared using the `output` command line parameter). This file is then processed by [a jq query](https://stedolan.github.io/jq/) in order to extract the scalar value needed for the GraphQL query.

You can optionally add a `cast` parameter in order to convert the jq output to an `Int`, `Float` or `Boolean`

```yaml
query:
  query($owner:String!, $name:String!) {
    repository(owner:$owner, name:$name) {
      name
    }
  }
variables:
  owner:
    type: jq
    file: ../workflow/event.json
    query: '.repository.owner.login'
  name:
    type: jq
    file: ../workflow/event.json
    query: '.repository.name'
```

```js
action "GraphQL query" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  needs = "Repo Query Args"
  args = "--query .github/graphql_action/repository-jq.query.yaml --log true"
}
```

#### Mutation 
