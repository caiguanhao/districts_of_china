module.exports = function(grunt) {

  grunt.registerTask('serve', 'Serve example pages.', function() {
    this.async();

    var http = require('http');
    var fs = require('fs');

    http.createServer(function(req, res) {
      switch (req.url) {
      case '/districts.tree.json':
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(fs.readFileSync('districts.tree.json'));
        break;
      case '/':
      case '/index.html':
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('index.html'));
        break;
      default:
        res.statusCode = 404;
        res.end();
      }
    }).listen(3000, function() {
      grunt.log.ok('Listening on port 3000.');
    });
  });

};
