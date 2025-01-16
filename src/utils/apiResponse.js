/**
 * Generates a consistent API response structure.
 * @param {number} status - The HTTP status code.
 * @param {boolean} success - Indicates whether the operation was successful.
 * @param {string} message - A message describing the response.
 * @param {object|null} [error=null] - Error details, if any.
 * @param {object|null} [data=null] - The response data.
 * @returns {object} - A structured API response.
 */
const apiResponse = ({ status, success, message, error = null, data = null, timeline = new Date() }) => {
    return { status, success, message, error, data, timeline }
}

module.exports = apiResponse;