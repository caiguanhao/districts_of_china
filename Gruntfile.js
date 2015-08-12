module.exports = function(grunt) {

  grunt.registerTask('make', 'Make files.', function() {
    var finish = this.async();

    var fs = require('fs');
    var https = require('https');

    var district_code_json = __dirname + '/districts.code.json';
    var district_tree_json = __dirname + '/districts.tree.json';

    var get_json = function(done) {
      grunt.log.writeln('Downloading districtselector.js...');
      https.get('https://division-data.alicdn.com/simple/addr_3_001.js', function(res) {
        var body = '';
        res.on('data', function(data) {
          body += data;
        });
        res.on('end', function() {
          var districts = new Function('var window = {};\n' + body + ';\nreturn tdist;')();
          var json = JSON.stringify(districts, null, 2);
          json = json.replace(/\n\s{4}/g, ' ');
          json = json.replace(/\n\s{2}\]/g, ' ]');
          json += '\n';
          fs.writeFile(district_code_json, json, function(err) {
            grunt.log.ok('File ' + district_code_json + ' was saved.');
            if (done) done();
          });
        });
      });
    };

    var read_json = function(done) {
      grunt.log.writeln('Making ' + district_tree_json + '...');
      var new_json = {};
      var json = require(district_code_json);
      var find = function(parent_key, parent) {
        Object.keys(json).forEach(function(key) {
          var value = json[key];
          if (value[1] == parent_key) {
            parent[value[0]] = {};
            find(key, parent[value[0]]);
          }
        });
      };
      find(1, new_json);

      Object.keys(new_json).forEach(function(key) {
        Object.keys(new_json[key]).forEach(function(key2) {
          var count = 0;
          Object.keys(new_json[key][key2]).forEach(function(key3) {
            count += Object.keys(new_json[key][key2][key3]).length;
          });
          if (count == 0) {
            new_json[key][key2] = Object.keys(new_json[key][key2]);
          }
        });
      });

      new_json = JSON.stringify(new_json, null, 2);
      new_json = new_json.replace(/\n\s{6}/g, ' ');
      new_json = new_json.replace(/\n\s{4}\]/g, ' ]');
      new_json += '\n';
      fs.writeFile(district_tree_json, new_json, function(err) {
        grunt.log.ok('File ' + district_tree_json + ' was saved.');
        if (done) done();
      });
    };

    if (!fs.existsSync(district_code_json)) {
      get_json(function(){
        read_json(finish);
      });
    } else {
      read_json(finish);
    }
  });

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
