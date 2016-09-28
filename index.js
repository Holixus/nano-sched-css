"use strict";

var csspack = require('nano-csspack'),
    Path = require('path');

module.exports = function (log, data) {
	if (data.encoding !== 'utf8')
		throw TypeError('data.encoding is not "utf8"');

	data.content = csspack(data.content);
};
