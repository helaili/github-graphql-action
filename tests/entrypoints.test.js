const { Toolkit } = require('actions-toolkit')
const axios = require('axios')

jest.mock('axios');

describe('GitHub GraphQL Action', () => {
  let action, tools

  // Mock Toolkit.run to define `action` so we can call it
  Toolkit.run = jest.fn((actionFn) => { action = actionFn })
  // Load up our entrypoint file
  require('../entrypoint.js')

  beforeEach(() => {
    process.env.INPUT_QUERY = '../samples/repository-static.query.yaml'
    // Create a new Toolkit instance
    tools = new Toolkit()
    // Mock methods on it!
    tools.exit.success = jest.fn()
  })

  it('exits successfully', async () => {
    const data = {
      data: {
        message: 'Awww yisss'
      }
    }

    axios.post.mockImplementationOnce(() => Promise.resolve(data));

    await action(tools)
    expect(tools.exit.success).toHaveBeenCalled()
    expect(tools.exit.success).toHaveBeenCalledWith('Sweet success')
  })
})
