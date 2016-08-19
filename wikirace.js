var request      = require('request');
var cheerio      = require('cheerio');
var URL          = require('url-parse');

var args = JSON.parse(process.argv.slice(2));
var start = args.start;
var end = args.end;
var hasVisited = {};
var url = new URL(start);
var baseUrl = url.protocol + "//" + url.hostname;
var path = [];
var currUrl;
var $;
var links;
var trigger = false;

function getLinks (currUrl, linksQueue, parentNode) {
  request(currUrl, function(error, response, body) {
    if (error) return console.log('error in requesting link');
    if(body && response.statusCode === 200) {
      $ = cheerio.load(body);
      links = $("a[href^='/wiki/']");
      parentNode = currUrl;
      for (var i = 0; i < links.length; i++) {
        if (!links[i].attribs.href.match(/\bwiki\/Category\b|\bwiki\/Portal\b|\bwiki\/Special\b|\bwiki\/Help\b|\bwiki\/Wikipedia\b|\bwiki\/Help\b|\bwiki\/Talk\b|\bwiki\/Main_Page\b|jpg|gif|svg/ig) &&
          !hasVisited[links[i].attribs.href]) {
          if (currUrl === end) console.log('match found from getLinks', currUrl);
          hasVisited[links[i].attribs.href] = true;
          linksQueue.push(baseUrl + links[i].attribs.href);
        }     
      }
    }
    crawl(linksQueue, parentNode);
    if (!trigger) {
      console.log("wikiracer running, please sit tight...");
      trigger = true;
    } 
  });
}

function crawl (linksQueue, parentNode) {
  linksQueue = linksQueue || [start];
  parentNode = parentNode || null;
  while (linksQueue.length > 0) {
    currUrl = linksQueue.shift();
    hasVisited[currUrl] = true;
    path.push([currUrl, parentNode]);
    if (currUrl === end) {
      console.log('Sucess: Path found!');
      createPath(path, currUrl, start, end);
      process.exit();
    } else {
      getLinks(currUrl, linksQueue, parentNode);
    }    
  }
}
  
function createPath (path, target, start, end) {
  var result = {
    start: start,
    end: end,
    path: null
  };
  var route = [end];
  var parent;
  for (var i = path.length - 1; i>=0; i--) {
    if (path[i][0] === target) {
      parent = path[i][1];
      route.push(parent);
      continue;
    }
    if (path[i][0] === parent) {
      route.push(path[i][1]);
      target = path[i][1];
    }
  }
  result.path = route.reverse().slice(1);
  return console.log(JSON.stringify(result));

}

console.log(crawl());
