var fs = require('fs');
var http = require('http');

var district_code_json = __dirname + '/districts.code.json';
var district_tree_json = __dirname + '/districts.tree.json';

var get_json = function(done) {
  http.get("http://www.taobao.com/home/js/sys/districtselector.js", function(res) {
    var body = '';
    res.on('data', function(data) {
      body += data;
    });
    res.on('end', function() {
      var json = /TB\.form\.DistrictSelector\._tb_ds_data=(.+?);/.exec(body)[1];
      json = JSON.parse(json);
      json = JSON.stringify(json, null, 2);
      json = json.replace(/\n\s{4}/g, ' ');
      json = json.replace(/\n\s{2}\]/g, ' ]');
      json += '\n';
      fs.writeFile(district_code_json, json, function(err) {
        console.log('File ' + district_code_json + ' was saved.');
        if (done) done();
      });
    });
  });
};

var read_json = function(done) {
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
    console.log('File ' + district_tree_json + ' was saved.');
    if (done) done();
  });
};

if (!fs.existsSync(district_code_json)) {
  get_json(function(){
    read_json();
  });
} else {
  read_json();
}
