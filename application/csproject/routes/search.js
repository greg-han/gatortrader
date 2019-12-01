var express = require('express');
var router = express.Router();

async function dbsearch(search,filter){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    let rows;
    let likesearch = ("%" + search + "%");
    if(!filter){
        rows = await connection.execute('SELECT * FROM `Item` WHERE `Description` LIKE ? AND Status = ?' ,[likesearch,1]);
    }
    else{
        rows = await connection.execute('SELECT * FROM `Item` WHERE `Categories` = ? and `Description` LIKE ? AND Status= ?' ,[filter,likesearch,1]);
    }
    await connection.end();
    return rows;
}

router.post('/searches', async function(req,res,next){
    var user = req.session.user;
    var filterMap = new Map();
    let filterparam = await req.body.filter;
    filterMap.set('A', "All");
    filterMap.set('E',"ELECTRONICS");
    filterMap.set('B',"books");
    filterMap.set('F',"furniture");
    filterMap.set('O',"Others");
    console.log(filterparam);
    let filter = filterMap.get(filterparam);
    var search = await req.body.search;
    console.log(filter);
    if(filter === "All"){
        console.log("I'm in here");
        filter = '';
    }
    //Store these in the session for price filtering, we will need to match the search
    req.session.currentcategory = filter;
    req.session.search = search;
    // console.log("Search",search);
    // console.log("Filter",filter);
    let dbsearchresult = await dbsearch(search,filter);
    let numitems = dbsearchresult[0].length;
    //This is how to access returned objects
    //console.log("Result: ", dbsearchresult[0]);
    res.render('searchresults', { results : dbsearchresult[0], user : user, itemcount : numitems});
});

router.post('/pricefilter', async function(req,res,next) {
   let user = req.session.user;
   let filter = req.session.currentcategory;
   let search = req.session.search;
    /*
     Write a db query has <= or >= price filter. if mysql doesn't offer the option, sort from low to high.
     return result, and return page like in search above with results.
    * */
   //remember to clear it out aftewards
   req.session.filter = '';
   req.session.search = '';
   //res.render('searchresults', { results : dbsearchresult[0], user : user, itemcount : numitems});
});;
module.exports = router;
