const axios = require('axios')
const yaml = require('node-yaml')
const fs = require('fs')
const { execSync } = require('child_process')
const { Toolkit } = require('actions-toolkit')
const tools = new Toolkit()

tools.log.config({
  logLevel: tools.inputs.logLevel
})

const url = tools.inputs.url
const outputFile = tools.inputs.output
const accept = tools.inputs.accept
const options = {
  headers: {
    Authorization: `bearer ${tools.token}`
  }
}

let body = {}

let yamlContent = yaml.parse(tools.getFile(tools.inputs.query))
body.query = yamlContent.query

if (yamlContent.variables) {
  body.variables = yamlContent.variables

  // Looking at the variables values to check if they are scalar or pointers to args/jq
  for (const key in body.variables) {
    let value = body.variables[key]

    if (typeof value === 'object') {
      if (value.type === 'arg') {
        // Value is coming from the command line
        body.variables[key] = tools.inputs[value.name]
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
      }
    }
  }
  tools.log.info(`GraphQL Variables:\n ${JSON.stringify(body.variables)}`)
}

if (accept) {
  options.headers.Accept = accept
}

axios.post(url, body, options)
  .then(function (response) {
    let jsonStringData = JSON.stringify(response.data)

    const result = await tools.runInWorkspace('echo', `::set-output name=queryResult::${jsonStringData}`)

    if (outputFile) {
      fs.writeFile(`${tools.workspace}/${outputFile}`, jsonStringData, (err) => {
        if (err) throw err
        tools.log.info(`GraphQL response saved to ${outputFile}`)
      })
    }

    tools.log.info(`GraphQL Query response:\n ${jsonStringData}`)
  })
  .catch(function (error) {
    console.log(error)
    process.exit(-1)
  })
