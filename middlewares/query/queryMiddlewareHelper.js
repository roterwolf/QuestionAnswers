const { query } = require("express");
const asyncErrorWrapper = require('express-async-handler');

const searchHelper = (searchKey,query,req) =>{
    if(req.query.search){
        const searchObject = {};
        const regex = new RegExp(req.query.search,"i");
        searchObject[searchKey] = regex;
        return query = query.where(searchObject);
    }
    return query;
};

const populateHelper= (query,population) =>{
    return query.populate(population);
};

const querySortHelper = (query,req) =>{
    const sortKey = req.query.sortBy;
    if(sortKey === "most-answered")
        return query.sort("-answerCount -createdAt") 
    // önünde - olursa büyükten küçüğe sıralar birden fazla filter için boşluk bırakıp devam edilebilir.
    else if(sortKey === "most-liked"){
        return query.sort("-likeCount -createdAt")
    } else {
        return query.sort("-createdAt")
    }
}

const paginationHelper = async (totalCount,query,req) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    startIndex = (page -1) * limit ;
    endIndex = page * limit;

    const pagination = {};
    const total = totalCount;
    
    if(startIndex > 0){ //Eğer bir sonraki sayfaya geçilmiş ise önceki sayfası vardır.
        pagination.previous = {
            page : page - 1,
            limit : limit
        }
    } 

    if(endIndex < total){
        pagination.next = {
            page : page + 1,
            limit : limit

        }
    }     
    return {
        query : query === undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination : pagination,
        startIndex,
        limit
    };
};

module.exports = {
    searchHelper,
    populateHelper,
    querySortHelper,
    paginationHelper

}