const axios = require('axios')
const yaml = require('node-yaml')
const fs = require('fs')
const { execSync } = require('child_process')
const { Toolkit } = require('actions-toolkit')
const tools = new Toolkit()


console.log('##################################')
console.log(tools.context.payload)
console.log('##################################')

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

    // Looking at the variables values to check if they are scalar or pointers to args/jq
    for (const key in body.variables) {
      let value = body.variables[key]

      if (typeof value === 'object') {
        if (value.type === 'arg') {
          // Value is coming from the command line
          body.variables[key] = tools.arguments[value.name]
        } else if (value.type === 'jq') {
          // Need to apply jq to a file to retrieve a value
          let jsonFile = value.file
          let jqQuery = value.query

          let result = execSync(`cat ${tools.workspace}/${jsonFile} | jq -j '${jqQuery}'`,  {stdio: [this.stdin, this.stdout, this.stderr]})
          if (value.cast === 'Int') {
            body.variables[key] = parseInt(result)
          } else if (value.cast === 'Float') {
            body.variables[key] = parseFloat(result)
          } else if (value.cast === 'Boolean') {
            body.variables[key] = (result.toLowerCase() == 'true');
          } else {
            body.variables[key] = result.toString()
          }
          console.log(`jq query result: ${result}`)
        }
      }
    }
    console.log(body.variables)
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
      if (err) throw err
      console.log(`GraphQL response saved to ${outputFile}`)
    })
  })
  .catch(function (error) {
    console.log(error)
    process.exit(-1)
  })
