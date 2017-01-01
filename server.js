//jshint esversion: 6

const http = require('http');
const PORT = process.env.PORT || 3000;
const fs = require('fs');

let resourceMapping = {
  '/': './public/index.html',
  '/hydrogen.html': './public/hydrogen.html',
  '/helium.html': './public/helium.html',
  '/index.html': './public/index.html',
  '/404.html': './public/404.html',
  '/css/styles.css': './public/css/styles.css',
  '/elements': '??'
};

function serverErrorHandler(res) {
  res.statusCode = 404;
  res.setHeader("content-Type", 'text/html');
  res.write("Could not find content...");
  res.end();
}

function sendContent(res, content) {
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200;
  res.write(content);
  res.end('connection closed');
}

let server = http.createServer( (req, res) => {

  let reqBody = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    reqBody += chunk;
  });
  console.log(reqBody);
  req.on('end', () => {

    console.log(reqBody);
    fs.readFile(resourceMapping[req.url] || '', (err, content) => {
      if(err){
        serverErrorHandler(res);
        return;
      }
        sendContent(res, content);
    });
  });

});

server.listen(PORT, () => {
  console.log('server is listening on port:' + PORT);
});
