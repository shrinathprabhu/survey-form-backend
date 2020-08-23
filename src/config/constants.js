let constants = {};

constants.mongoUrl = process.env.MONGO_URL;
constants.port = process.env.PORT;
constants.cookieSecret = process.env.COOKIE_SECRET;
constants.cookieMaxAge = 1000 * 60 * 60 * 24 * 365 * 10;
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
        currentPage: page,
        recordsFetched: list.length,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        list
    }
}

export default constants;