//jshint esversion: 6

const http = require('http');
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const qs = require('querystring');

let resourceMapping = {
  '/': './public/index.html',
  '/hydrogen.html': './public/hydrogen.html',
  '/helium.html': './public/helium.html',
  '/index.html': './public/index.html',
  '/404.html': './public/404.html',
  '/css/styles.css': './public/css/styles.css',
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

  req.on('end', () => {

    if(req.url === '/elements' && req.method === 'POST'){
      let reqBodyQS = qs.parse(reqBody);
    console.log(reqBody);
    console.log(reqBodyQS);
    //create files now
    let createdHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - Helium</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${reqBodyQS.elementName}</h1>
  <h2>${reqBodyQS.elementSymbol}</h2>
  <h3>Atomic number ${reqBodyQS.elementAtomicNumber}</h3>
  <p>${reqBodyQS.elementDescription}</p>
  <p><a href="/">back</a></p>
</body>
</html>`;
      fs.writeFile(`./public/${reqBodyQS.elementName}.html`, createdHTML, (err) => {
        if(err) throw err;
        console.log('created file');
      });
    }

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
