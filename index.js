/**
 * Dependencie(s)
 */

const query = require('array-compose')


/**
 * Expose promise handler as default.
 */

module.exports = driver => {
  const async = promise(driver)
  async.stream = stream(driver)
  return async
}


/**
 * Run cypher queries as promises.
 *
 * @param {Object} driver
 * @return {Function} tagged template
 * @api public
 */

function promise (driver) {
  return (chunks, ...data) => {
    const session = driver.session()
    const params = parameters(data)
    const parts = Object.keys(params).map(key => params[key])
    return session.writeTransaction(tx => tx.run(query(chunks, parts), params))
      .then(result => {
        session.close()
        return result
      })
  }
}


/**
 * Run cypher queries as streams.
 *
 * @param {Object} driver
 * @return {Function} tagged template
 * @api public
 */

function stream (driver) {

}


/**
 * Transform template data into object.
 *
 * @param {Array} data
 * @return {Object}
 * @api private
 */

function parameters (data = []) {
  return data.reduce((result, item, index) => {
    result[index] = item
    return result
  }, {})
}
