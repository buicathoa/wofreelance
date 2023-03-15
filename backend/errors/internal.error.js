class InternalError extends Error {
  constructor(message) {
    super();
    this.message = message
  }
}

module.exports = {InternalError};