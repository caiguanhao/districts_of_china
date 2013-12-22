districts_of_china
==================

You can follow the **[Examples](http://caiguanhao.github.io/districts_of_china/)** to create your own district selector for your web pages.

If you want to serve the example page on your local host, you need to install node.js first. After that, go to the repository directory, run ``npm install`` to install Grunt.

The ``grunt serve`` command will serve the example page on localhost:3000.

The ``grunt make`` command will download the district selector JavaScript file used by Taobao.com (which is a list of code, see districts.code.json) and then convert it to an object and save it to districts.tree.json.
