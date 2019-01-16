const axios = require('axios')
const yaml = require('node-yaml')
const { Toolkit } = require('actions-toolkit')
const tools = new Toolkit()

let options = {
  headers: {
    Authorization: `bearer ${tools.token}`
  }
}

let url = 'https://api.github.com/graphql'
if (tools.arguments.url) {
  url = tools.arguments.url
}

let body = {}

if (!tools.arguments.query) {
  console.error('Configuration error: missing query argument')
  process.exit(-1)
} else {
  let yamlContent = yaml.parse(tools.getFile(tools.arguments.query))
  body.query = yamlContent.query

  if (yamlContent.variables) {
    body.variables = yamlContent.variables
  }
}

if (tools.arguments.accept) {
  options.headers.Accept = tools.arguments.accept
}

axios.post(url, body, options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  })
