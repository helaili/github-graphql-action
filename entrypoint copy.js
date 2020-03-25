const axios = require('axios')
const yaml = require('node-yaml')
const fs = require('fs')
const { execSync } = require('child_process')
const { Toolkit } = require('actions-toolkit')


Toolkit.run(async tools => {
  tools.exit.success('Sweet success')
})