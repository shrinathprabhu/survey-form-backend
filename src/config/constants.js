let constants = {};

constants.mongoUrl = process.env.MONGO_URL;
constants.port = process.env.PORT;
constants.cookieSecret = process.env.COOKIE_SECRET;
constants.testingProtection = true;
constants.ssl = {
    key: process.env.SSL_KEY_PATH,
    cert: process.env.SSL_CERT_PATH
}
constants.hour = 60 * 60 * 1000;
constants.day = 24 * constants.hour;
constants.cookieMaxAge = 4 * 365 * constants.day;
constants.website = process.env.WEBSITE_BASE
/**
 * 
 * @param {Number} page 
 * @param {Number} limit
 * @returns {Number} skipValue 
 */
constants.calculateSkipValue = function (page, limit) {
    return (page * limit) - limit;
}

/**
 * 
 * @param {Number} page 
 * @param {Number} limit 
 * @param {Number} totalRecords 
 * @param {Array} list 
 * @returns {{currentPage: Number, recordsFetched: Number, totalRecords: Number, totalPages: Number, list: Array}}
 */
constants.paginate = function (page, limit, totalRecords, list) {
    return {
        page,
        size: list.length,
        totalRecords,
        pages: Math.ceil(totalRecords / limit),
        list
    }
}

export default constants;