
const asyncErrorWrapper = require('express-async-handler');
const { searchHelper,populateHelper,querySortHelper,paginationHelper } = require('./queryMiddlewareHelper');
const Question = require('../../models/Question');

const questionQueryMiddleware = function (model, options) {

    return asyncErrorWrapper(async function (req, res, next) {
        // Initial Query
        let query = model.find();

        //Search
        query = searchHelper("title",query,req)

        //populate
        if(options && options.population){
            query = populateHelper(query,options.population);
        }
        //sortable
        query = querySortHelper(query, req);

        //pagination
        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total,query,req);

        query = paginationResult.query;
        const pagination = paginationResult.pagination;

        const queryResults = await query; 
        res.queryResult = {
            success : true,
            count : queryResults.length,
            pagination : pagination, 
            data: queryResults
        };
        next();
    });
}

module.exports = questionQueryMiddleware;