#graphql-action


### Parameters
| Name  | Description |
|-------|-------------|
| url   | GraphQL endpoint URL. _Required_  |
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
  name: graphql-action
```
