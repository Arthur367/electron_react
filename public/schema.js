const logSchema = {
  title: {
    type: 'string'
  },
  titleDate: {
    type: 'date',
  },
  time: {
    type: 'string',
  },
  response: {
    type: 'object',
  },
  request: {
    type: 'object'
  }
}
module.exports = logSchema;
