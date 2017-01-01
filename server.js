//jshint esversion: 6

const http = require('http');
const PORT = process.env.PORT || 3000;
const fs = require('fs');

let resourceMapping = {
  '/': '/public/index.html',
  '/hydrogen.html': '/public/hydrogen.html',
  '/helium.html': '/public/helium.html',
  '/404.html': '/public/404.html',
  '/css/styles.css': '/public/css/styles.css',
  '/elements': '??'
};

function serverErrorHandler(res) {
  res.statusCode = 404;
  res.setHeader("content-Type", 'text/plain');
  res.write("Could not find content...");
  res.end();
}

function sendContent(res, content) {
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200;
  res.write(content);
  res.end('connection closed');
}