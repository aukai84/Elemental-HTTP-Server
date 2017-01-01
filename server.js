//jshint esversion: 6
const http = require('http');
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const qs = require('querystring');

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

  let newURL = req.url.slice(1);
  let reqBody = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    reqBody += chunk;
  });

  req.on('end', () => {

    if(req.url === '/elements' && req.method === 'POST'){
      let reqBodyQS = qs.parse(reqBody);
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
  <p><a href="index.html">back</a></p>
</body>
</html>`;
      fs.writeFile(`./public/${reqBodyQS.elementName}.html`, createdHTML, (err) => {
        if(err) throw err;
        console.log(`${reqBodyQS.elementName}.html was created`);
      });

      fs.readFile('./public/index.html',{encoding: 'utf8'}, (err, content) => {
        let updatedIndex = content.replace(`<p id="new-list"></p>`, `<li><a href="${reqBodyQS.elementName}.html">${reqBodyQS.elementName}</a></li>
<p id="new-list"></p>`);
        fs.writeFile(`./public/index.html`, updatedIndex, (err) => {
          if(err) throw err;
        });
      });

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.write(`{"success" : true}`);
      res.end();
    }

    if(req.method === 'PUT'){
      fs.readFile(resourceMapping[req.url] || '', (err, content) => {
        if(err){
          res.statusCode = 500;
          res.setHeader("content-Type", 'application/json');
          res.write(`{"error : resource ${req.url} does not exist"}`);
          res.end();
          return;
        }
          sendContent(res, content);
      });
    }

    if(req.method === 'GET'){
      if(req.url === '/css/styles.css'){
        fs.readFile('./public/css/styles.css' || '', (err, content) => {
          if(err){
              serverErrorHandler(res);
              return;
            }
              sendContent(res, content);
        });
      }
      fs.readdir('./public', (err, content) => {
        console.log(content);
        if(content.indexOf(newURL) > -1){
          fs.readFile(`./public/${newURL}` || '', (err, content) => {
            if(err){
              serverErrorHandler(res);
              return;
            }
              sendContent(res, content);
          });
        }
      });

    }
  });

});

server.listen(PORT, () => {
  console.log('server is listening on port:' + PORT);
});
