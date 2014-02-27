/*
  
  RSI - cykedev 14/02/2014

  (updated a couple of times since, check git history)

 */
// helpers
var _ = require('lodash');
var log = require('../core/log.js');

var config = require('../core/util.js').getConfig();
var settings = config.RSI;

var RSI = require('./indicators/RSI.js');

// let's create our own method
var method = {};

var lastadvice = "none"
var checkswitch = false;

// prepare everything our method needs
method.init = function() {
  this.trend = {
    direction: 'none',
    duration: 0,
    persisted: false,
    adviced: false
  };

  this.requiredHistory = config.tradingAdvisor.historySize;

  // define the indicators we need
  this.addIndicator('rsi', 'RSI', settings.interval);
}

// for debugging purposes log the last 
// calculated parameters.
method.log = function() {
  var digits = 8;
  var rsi = this.indicators.rsi;

  log.methods('calculated RSI properties for candle:');
  log.methods('\t', 'rsi:', rsi.rsi.toFixed(digits));
  log.methods('\t', 'price:', this.lastPrice.toFixed(digits));
}

method.check = function() {
  var rsi = this.indicators.rsi;
  var rsiVal = rsi.rsi;

  if(rsiVal > settings.thresholds.high) {

    // new trend detected
    if(this.trend.direction !== 'high')
      this.trend = {
        duration: 0,
        persisted: false,
        direction: 'high',
        adviced: false
      };

    this.trend.duration++;

    log.methods('In high since', this.trend.duration, 'candle(s)');

    if(this.trend.duration >= settings.thresholds.persistence)
      this.trend.persisted = true;

    if(this.trend.persisted && !this.trend.adviced) {
      //this.trend.adviced = true;
      //this.advice('short');
      this.lastadvice = "short";
      this.checkswitch = true;
    }  
    this.advice();
    
  } else if(rsiVal < settings.thresholds.low) {

    // new trend detected
    if(this.trend.direction !== 'low')
      this.trend = {
        duration: 0,
        persisted: false,
        direction: 'low',
        adviced: false
      };

    this.trend.duration++;

    log.methods('In low since', this.trend.duration, 'candle(s)');

    if(this.trend.duration >= settings.thresholds.persistence)
      this.trend.persisted = true;

    if(this.trend.persisted && !this.trend.adviced) {
      this.checkswitch = true;
      this.lastadvice = "long";
    }  
    this.advice();

  } else {

    if (this.checkswitch) {
      this.trend.adviced = true;
      this.advice(this.lastadvise);
      this.checkswitch = false;
      log.methods("Advising ", this.lastadvice);
    } else {
        log.methods('In no trend');
        this.advice();
    }
  }
}

module.exports = method;
