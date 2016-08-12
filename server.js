var request      = require('request');
var cheerio      = require('cheerio');
var URL          = require('url-parse');
var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var fs           = require('fs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var Graph = function() {
  this._nodes = {};
};

Graph.prototype.addNode = function(node) {
  this._nodes[node] = this._nodes[node] || { edges: {} };
};

Graph.prototype.contains = function(node) {
  return !!this._nodes[node];
};

Graph.prototype.removeNode = function(node) {
  if (this.contains(node)) {
    for (var targetNode in this._nodes[node].edges) {
      this.removeEdge(node, targetNode);
    }
    delete this._nodes[node];
  }
};

Graph.prototype.hasEdge = function(fromNode, toNode) {
  if (!this.contains(fromNode)) {
    return false;
  }
  return !!this._nodes[fromNode].edges[toNode];
};

Graph.prototype.addEdge = function(fromNode, toNode) {
  if (!this.contains(fromNode) || !this.contains(toNode)) {
    return;
  }
  this._nodes[fromNode].edges[toNode] = toNode;
  this._nodes[toNode].edges[fromNode] = fromNode;
};

Graph.prototype.removeEdge = function(fromNode, toNode) {
  if (!this.contains(fromNode) || !this.contains(toNode)) {
    return;
  }
  delete this._nodes[fromNode].edges[toNode];
  delete this._nodes[toNode].edges[fromNode];
};

Graph.prototype.forEachNode = function(cb) {
  for (var node in this._nodes) {
    cb(node);
  }
};

var racer = new Graph();
var start = "https://en.wikipedia.org/wiki/BMW_M3";
var end = "https://en.wikipedia.org/wiki/Porsche_911";
var LIMIT = 100;
var hasVisited = {};
var visitCount = 0;
var pagesToVisit = [];
var url = new URL(start);
var baseUrl = url.protocol + "//" + url.hostname;
var path = [];

function init () {
  racer.addNode(start);
  pagesToVisit.push(start);
  crawl();
}

init();

function crawl() {
  if(visitCount >= LIMIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.shift();
  if (nextPage in hasVisited) {
    crawl();
  } else {
    visitPage(nextPage, crawl);
  }
}

function visitPage(url, callback) {
  hasVisited[url] = true;
  path.push(url);
  visitCount++;

  console.log("Visiting page " + url);
  request(url, function(error, response, body) {
     if(response.statusCode !== 200) {
       callback();
       return;
     }
     console.log("Status code: " + response.statusCode);
     var $ = cheerio.load(body);
     if (url === end) {
      console.log('found a match', url);
      console.log('path is', path);
      console.log('graph is', racer);
      console.log(racer.hasEdge(start, 'https://en.wikipedia.org/wiki/moon'));
     } else {
       retrieveLinks($);
       callback();
     }
  });
}

function retrieveLinks($) {
  var links = $("a[href^='/']");
  // console.log('links', links);
  // console.log("Found " + links.length + " relative links on page");
  links.each(function() {
    pagesToVisit.push(baseUrl + $(this).attr('href'));
    racer.addNode(baseUrl + $(this).attr('href'));
    racer.addEdge(start, baseUrl + $(this).attr('href'));
  });
}


