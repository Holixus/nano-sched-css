"use strict";

var test = require('tape'),
    Promise = require('nano-promise'),
    util = require('util');


/* ------------------------------------------------------------------------ */
function Logger(stage, job) {

	var context = job.sched.name + ':' + job.name + '#' + stage;

	this.stage = stage;
	this.job = job;
	this.acc = [];
	this.dumps = [];

	this.log = function (code, format, a, b, etc) {
		acc.push(util.format('  %s: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.trace = function () {
		this.log.apply(this, Array.prototype.concat.apply(['trace'], arguments));
	};

	this.warn = function (code, format, a, b, etc) {
		acc.push(util.format('W.%s: warning: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.error = function (format, a, b, etc) {
		acc.push(util.format('E.%s: error: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.fail = function (format, a, b, etc) {
		acc.push(util.format('F.%s: FAIL: %s', context, util.format.apply(util.format, arguments)));
	};

	this.writeListing = function (name, data) {
		this.dumps.push({
			name: name, 
			data: data
		});

		return Promise.resolve();
	};
}

Logger.prototype = {
};


var css_plugin = require('../index.js'),
    opts = {
    	globals: {
    		a:'/a/',
    		o:'#o#'
    	}
    },
    job = {
		name: 'test',
		sched: {
			name: 'test',
			opts: opts
		}
	};

test('fine', function (t) {
	t.plan(1);

	var log = new Logger('css', job),
	    data = {
				opts: {},
				encoding: 'utf8',
				content: ' div { width: 0px; }',
				result: 'div{width:0}'
			};

	Promise.resolve(log, data)
		.then(css_plugin)
		.then(function () {
			t.equal(data.content, data.result);
			t.end();
		}).catch(function (e) {
			t.end(e);
		});
});

test('bad encoding', function (t) {
	var log = new Logger('css', job),
	    data = {
				opts: opts,
				encoding: 'utf',
				content: ' div { width: 0px; }',
				result: 'div{width:0}'
			};

	Promise.resolve(log, data)
		.then(css_plugin)
		.then(function () {
			t.end(Error('not failed'));
		}, function (e) {
			t.end();
		}).catch(function (e) {
			t.end(e);
		});
});
