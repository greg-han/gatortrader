var express = require('express');
var router = express.Router();

async function dbsearch(search,filter){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    let rows;
    let likesearch = ("%" + search + "%");
    if(!filter){
        rows = await connection.execute('SELECT * FROM `Item` WHERE `Description` LIKE ?' ,[likesearch]);
    }
    else{
        rows = await connection.execute('SELECT * FROM `Item` WHERE `Categories` = ? and `Description` LIKE ?' ,[filter,likesearch]);
    }
    await connection.end();
    return rows;
}

router.post('/searches', async function(req,res,next){
    var user = req.session.user;
    var filterMap = new Map();
    filterMap.set('E',"ELECTRONICS");
    filterMap.set('B',"books");
    filterMap.set('F',"furniture");
    filterMap.set('O',"Others");

    var search = await req.body.search;
    var filter = await req.body.filter;

    filter = filterMap.get(filter);
    if(filter === "All"){
        filter = '';
    }

    console.log("Search",search);
    console.log("Filter",filter);
    let dbsearchresult = await dbsearch(search,filter);
    //This is how to access returned objects
    console.log("Result: ", dbsearchresult[0]);
    res.render('searchresults', { results : dbsearchresult[0], user : user });
});

module.exports = router;
