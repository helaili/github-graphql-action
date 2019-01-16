#github-graphql-action

An action that acts a client for GitHub's GraphQL API

### Parameters
| Name  | Description |
|-------|-------------|
| url   | GraphQL endpoint URL. Defaults to `https://api.github.com/graphql`  |
| query | Query file path within the repo. _Required_  |
| accept | `Accept` header to set in the query. _Optional_   |


### Query file

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
