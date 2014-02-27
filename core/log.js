/*

  Lightweight logger, print everything that is send to error, warn
  and messages to stdout (the terminal). If config.debug is set in config
  also print out everything send to debug.

*/

var moment = require('moment');
var fmt = require('util').format;
var _ = require('lodash');
var debug = require('./util').getConfig().debug;
var fs = require('fs');


var Log = function() {
  _.bindAll(this);
};

Log.prototype = {
  _write: function(method, args, name) {
    if(!name)
      name = method.toUpperCase();

    var message = moment().format('YYYY-MM-DD HH:mm:ss');
    message += ' (' + name + '):\t';
    message += fmt.apply(null, args);

    if (method == 'buy' || method == 'sell'){
        console['info'](message);
    } else if (method == 'methods') {
        console['info'](message);
    } else {
        console[method](message);
    }
    fs.appendFile('log/' + name.toLowerCase() + '.log', moment().format('YYYY-MM-DD HH:mm:ss') + ": " + fmt.apply(null,args) + "\n", function (err) {
    });
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
