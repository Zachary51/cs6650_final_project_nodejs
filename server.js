var http = require('http'),
    url = require('url'),
    qs = require('querystring'),
    mysql = require('mysql'),
    pool = mysql.createPool({host:'final-project-database.cm6ghr047azj.us-west-2.rds.amazonaws.com', user:'admin', password:'criminal51', database:'skiDatabase'}),
    port = 8080,
    postQuery = "INSERT INTO skiRecords(recordId, skierId, resortId, season, dayId, skiTime, LiftId, vertical)" +
        " VALUES (?,?,?,?,?,?,?,?)",
    getQuery = "",
    uuidv4 = require('uuid/v4'),
    express = require('express'),
    bodyParser = require('body-parser');


http.createServer(function(req, res){
        parseData(req, res, function(){
            switch(req.method){
                case "POST":
                    postReq(req, res);
                    break;
                case "GET":
                    getReq(req, res);
                    break;
            }
        });
}).listen(port);


function parseData(req, res, cb){
    var body = '';
    req.on('data', function(data){
        body += data;
    });
    req.on('end', function(){
       req.body = JSON.parse(body);
       cb(req, res)
    });
}


function mysqlResponseHandler(err, result, req, res){
    if (err) {
        console.log(err);
        res.writeHead(400, {'Content-type':'text/plain'});
        res.end(req.method + " failed!");
    } else {
        res.writeHead(200, {'Content-type':'application/json'});
        res.end(JSON.stringify(result));
    }
}


function postReq(req, res){
    var urlParts = url.parse(req.url);
    req.urlParts = urlParts, reqPath = urlParts.pathname.split('/');
    var recordId = uuidv4();
    var skierId = reqPath[2];
    var seasonId = reqPath[4];
    var dayId = reqPath[6];
    var resortId = reqPath[8];
    var skiTime = req.body.time;
    var liftId = req.body.liftID;
    var vertical = liftId * 10;
    var resultList = [recordId, skierId, resortId, seasonId, dayId, skiTime, liftId, vertical]
    var q = mysql.format(postQuery, [recordId, skierId, resortId, seasonId, dayId, skiTime, liftId, vertical]);
    pool.query(q, function(err, result){
       mysqlResponseHandler(err, result, req, res)
    });
}
