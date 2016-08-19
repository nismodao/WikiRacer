# WikiRacer
This program will find the path between starting and ending wikipedia links.
Input: JSON object with start and end links.
Output: JSON object with start, end, and path values;

Example input: '{"start": "https://en.wikipedia.org/wiki/BMW_M3", "end": "https://en.wikipedia.org/wiki/Sicily"}'

Example output: {"start":"https://en.wikipedia.org/wiki/BMW_M3","end":"https://en.wikipedia.org/wiki/Sicily","path":["https://en.wikipedia.org/wiki/BMW_M3","https://en.wikipedia.org/wiki/FR_layout","https://en.wikipedia.org/wiki/Targa_top","https://en.wikipedia.org/wiki/Sicily"]}

# Instructions

1.  Clone this repo
2.  Run npm install
3.  Run node wikiracer [JSON input]
Example run:  

node wikirace '{"start": "https://en.wikipedia.org/wiki/BMW_M3", "end": "https://en.wikipedia.org/wiki/Sicily"}'

# Algorithm
This program uses the request Node module to scrape links from Wikipedia, and performs a breadth first search traversal of the links to find the target link.  For each link visited, its parent node is also stored.  Upon finding the target link, its path is determined by tracing the parent node of the target link to the starting link.

# Future Improvements
Because Wikipedia is such a large site, traversal time can be long.  A future improvement would be to use a bi-directional BFS algorithm.  Another approach is to access Wikipedia through the downloadable file, and perhaps input that into a graph database (Neo4j), instead of scraping for links.  A front end client with visualizations for the graph connections is in the works as well.    


