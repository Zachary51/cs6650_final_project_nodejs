const http = require('http'),
    { parse } = require('querystring')
      url = require('url');

const requestListener = function (req, res){
    res.writeHead(200);
    var urlParts = url.parse(req.url);
    req.urlParts = urlParts, reqPath = urlParts.pathname.split('/');
    console.log(reqPath);
    // console.log(reqPath[2]);
    // console.log(reqPath[4]);
    // console.log(reqPath[6]);
    // console.log(reqPath[8]);
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () =>{
        msg = parse(body);
        console.log(msg.time);
        console.log(msg.liftID);
        res.end('ok')
    });
}

const server = http.createServer(requestListener);
server.listen(8080);