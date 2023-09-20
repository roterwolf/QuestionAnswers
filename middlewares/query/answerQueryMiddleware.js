
const asyncErrorWrapper = require('express-async-handler');
const { populateHelper, paginationHelper } = require('./queryMiddlewareHelper');

const answerQueryMiddleware = function (model, options) {

    return asyncErrorWrapper(async function (req, res, next) {
        const questionId = req.params.questionId;

        const arrayName = "answers";

        const total = (await model.findById(questionId))["answerCount"];

        //pagination
        const paginationResult = await paginationHelper(total, undefined, req);

        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;

        let queryObject = {};
        queryObject[arrayName] = { $slice: [startIndex, limit] };

        let query = model.find({ _id: questionId }, queryObject);

        query = populateHelper(query,options.population);
        
        const queryResults = await query;
        res.queryResult = {
            success: true,
            pagination: paginationResult.pagination,
            data: queryResults
        };
        next();
    });
}

module.exports = answerQueryMiddleware;