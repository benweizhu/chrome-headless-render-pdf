#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var updateNotifier = require('update-notifier');
var pkg = void 0;
try {
    pkg = require('../package.json');
} catch (e) {
    pkg = require('../../package.json');
}

updateNotifier({ pkg: pkg }).notify();

var RenderPDF = require('../index');
var argv = require('minimist')(process.argv.slice(2), {
    string: ['url', 'pdf', 'chrome-binary'],
    boolean: ['no-margins', 'include-background', 'landscape ']
});

if (argv['help'] || !argv['pdf'] || !argv['url']) {
    printHelp();
    process.exit();
}

var urls = typeof argv['url'] === 'string' ? [argv['url']] : argv['url'];
var pdfs = typeof argv['pdf'] === 'string' ? [argv['pdf']] : argv['pdf'];

if (pdfs.length !== urls.length) {
    console.error('ERROR: Unpaired --url or --pdf found\n');
    printHelp();
    process.exit();
}

var chromeBinary = null;
if (typeof argv['chrome-binary'] === 'string') {
    chromeBinary = argv['chrome-binary'];
}

var landscape = void 0;
if (argv['landscape']) {
    landscape = true;
}

var noMargins = void 0;
if (argv['margins'] !== undefined) {
    noMargins = !argv['margins'];
}

var includeBackground = void 0;
if (argv['include-background']) {
    includeBackground = true;
}

(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var jobs;
    return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.prev = 0;
                    jobs = generateJobList(urls, pdfs);
                    _context.next = 4;
                    return RenderPDF.generateMultiplePdf(jobs, {
                        printLogs: true,
                        landscape: landscape,
                        noMargins: noMargins,
                        includeBackground: includeBackground,
                        chromeBinary: chromeBinary
                    });

                case 4:
                    _context.next = 9;
                    break;

                case 6:
                    _context.prev = 6;
                    _context.t0 = _context['catch'](0);

                    console.error(_context.t0);

                case 9:
                    _context.prev = 9;

                    process.exit();
                    return _context.finish(9);

                case 12:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, undefined, [[0, 6, 9, 12]]);
}))();

function generateJobList(urls, pdfs) {
    var jobs = [];
    for (var j = 0; j < urls.length; j++) {
        jobs.push({
            url: urls[j],
            pdf: pdfs[j]
        });
    }
    return jobs;
}

function printHelp() {
    console.log('chrome-headless-render-pdf [OPTIONS] --url=URL --pdf=OUTPUT-FILE [--url=URL2 --pdf=OUTPUT-FILE2] ...');
    console.log('  Options:');
    console.log('    --help                   this screen');
    console.log('    --url                    url to load, for local files use: file:///path/to/file');
    console.log('    --pdf                    output for generated file can be relative to current directory');
    console.log('    --chrome-binary          set chrome location (use this options when autodetection fail)');
    console.log('    --no-margins             disable default 1cm margins');
    console.log('    --include-background     include elements background');
    console.log('    --landscape              generate pdf in landscape orientation');
    console.log('');
    console.log('  Example:');
    console.log('    Render single pdf file');
    console.log('      chrome-headless-render-pdf --url http://google.com --pdf test.pdf');
    console.log('    Render pdf from local file');
    console.log('      chrome-headless-render-pdf --url file:///tmp/example.html --pdf test.pdf');
    console.log('    Render multiple pdf files');
    console.log('      chrome-headless-render-pdf --url http://google.com --pdf test.pdf --url file:///tmp/example.html --pdf test.pdf');
}