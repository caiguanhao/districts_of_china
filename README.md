districts_of_china
==================

You can follow the **[example](http://caiguanhao.github.io/districts_of_china/)**
to create your own district selector for your web pages.

Run ``grunt serve`` command will serve the example page on localhost:3000.

Run ``grunt make`` command will download the district selector JavaScript file used
by Taobao.com (which is a list of code, see `districts.code.json`) and then convert
it to an object and save it to `districts.tree.json`.

JS files to use in different version:

0.x: <http://www.taobao.com/home/js/sys/districtselector.js>

1.x: <https://division-data.alicdn.com/simple/addr_3_001.js>
