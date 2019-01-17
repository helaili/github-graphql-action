const axios = require('axios')
const yaml = require('node-yaml')
const fs = require('fs')
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

let outputFile = 'github-graphql-action.json'
if (tools.arguments.file) {
  outputFile = tools.arguments.file
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
    for (const key in body.variables) {
      console.log(`inspecting ${body.variables[key]}`)
      let regex = /\${(.*)}/g
      
      var found = regex.exec(body.variables[key])
      if (found) {
        body.variables[key] = tools.arguments[found[1]]
      }
      console.log(found);
    }
  }
}

if (tools.arguments.accept) {
  options.headers.Accept = tools.arguments.accept
}

axios.post(url, body, options)
  .then(function (response) {
    let jsonStringData = JSON.stringify(response.data)
    console.log(jsonStringData)
    fs.writeFile(`${tools.workspace}/${outputFile}`, jsonStringData, (err) => {
      if (err) throw err;
      console.log(`GraphQL response saved to ${outputFile}`);
    })
    //GITHUB_WORKSPACE
  })
  .catch(function (error) {
    console.log(error)
  })
