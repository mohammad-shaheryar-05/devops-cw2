var http = require('http');
var requests = 0;
var podname = process.env.HOSTNAME || 'default-hostname';  // Fallback in case HOSTNAME is undefined
var startTime;
var host;

var handleRequest = function(request, response) {
  response.setHeader('Content-Type', 'text/plain');
  response.writeHead(200);
  response.write("DevOps Coursework 2! | Running on: ");
  response.write(host);
  response.end(" | v=1\n");
  
  console.log("Running On:", host, "| Total Requests:", ++requests, "| App Uptime:", (new Date() - startTime) / 1000, "seconds", "| Log Time:", new Date());
};

var www = http.createServer(handleRequest);

www.listen(8080, '0.0.0.0', function() {  // Ensure it listens on all interfaces
  startTime = new Date();
  host = process.env.HOSTNAME || 'default-hostname';  // Fallback value if not available
  console.log("Started At:", startTime, "| Running On:", host, "\n");
});
