/*

  Lightweight logger, print everything that is send to error, warn
  and messages to stdout (the terminal). If config.debug is set in config
  also print out everything send to debug.

*/

var async = require('async');
// create single task queue (e.g. in order)
var queue = async.queue(function (task, callback) {
        task();
        callback();
}, 1);
var moment = require('moment');
var fmt = require('util').format;
var _ = require('lodash');
var debug = require('./util').getConfig().debug;

var fs = require('fs');
var mkdirp = require('mkdirp');
var logtag = undefined;
var logdir = undefined;
var logdate = undefined;
var olddir = '';
 
var Log = function() {
  _.bindAll(this)
};


Log.prototype = {
  _write: function(method, args, name) {
    if(!name)
      name = method.toUpperCase();

    if (typeof(logtag) === 'undefined' || typeof(logdir) === 'undefined' || typeof(logdate) === 'undefined') {
        this.loadConfig();
    }


    var message = moment().format('YYYY-MM-DD HH:mm:ss');
    var dirdate = moment().format('YYYY-MM-DD');

    message += ' (' + name + '):\t';
    message += fmt.apply(null, args);

    if (method == 'buy' || method == 'sell'){
        console['info'](message);
    } else if (method == 'methods') {
        console['info'](message);
    } else {
        console[method](message);
    }
    var logname = logtag;
    var logstorage = 'log/';
    // Add the logtag if not empty
    if (logtag != '')
        logname = logtag.toLowerCase() + '-';

    if (logdir != '') {

        logstorage = logstorage + logdir;
        // check and append trailing /
        if (logdir.slice(-1) != '/')
            logstorage += '/';
    }

    if (logdate) {
        logstorage += dirdate + '/';
    }
    
    
    var logfile = logstorage + logname + name.toLowerCase() + '.log';
    
    // string compare (might differ in node versions use >= 10), cheaper than synchronized io
    if (logstorage != olddir) {
        olddir = logstorage;
        queue.push(function () {
                    
            // stat and create each recurring dir
            // need sync? probably ...
            if (! fs.existsSync(logstorage)) {
                // doesn't exist, create
                mkdirp.sync(logstorage);
            }
        }, function() {});
    }

    // store directory to check later.
    olddir = logstorage;

    queue.push(function() {
                fs.appendFile(logfile, moment().format('YYYY-MM-DD HH:mm:ss') + ": " + fmt.apply(null,args) + "\n",
                    function( error) {
                        if (error)console.log('Failed to log.');
                                            });
            }, 
            function() {});
  },
  loadConfig: function() {
       logtag = require('./util').getConfig().logtag;
       if (typeof(logtag) === 'undefined') {
           console.log("LOG: Not using any logtag.");
           logtag = '';
       } else {
           console.log("LOG: Setting logtag: ", logtag);
       }
       
       logdir = require('./util').getConfig().logdir;
       if (typeof(logdir) === 'undefined') {
           if (logtag === 'undefined') {
               console.log("Failed to set either logdir or logtag, please enter one or both.");
               // exit? or in config?
           }
           logdir = '';
       } else {
           console.log("LOG: Setting logdir: ", logdir);
       }

       logdate = require('./util').getConfig().logdate;
       if (typeof(logdate) === 'undefined') {
           logdate = false;
       } else {
           console.log("LOG: Logging into dated directory.");
       }
  },
  error: function() {
    this._write('error', arguments);
  },
  warn: function() {
    this._write('warn', arguments);
  },
  info: function() {
    this._write('info', arguments);
  },
  buy: function() {
      this._write('buy', arguments);
  },
  sell: function() {
      this._write('sell', arguments);
  },
  methods: function() {
      this._write('methods', arguments);
  }
}


if(debug)
  Log.prototype.debug = function() {
    this._write('info', arguments, 'DEBUG');  
  }
else
  Log.prototype.debug = function() {};

module.exports = new Log;
