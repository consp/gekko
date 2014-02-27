﻿// Everything is explained here:
// https://github.com/askmike/gekko/blob/master/docs/Configuring_gekko.md

var config = {};

// This is the preceding tag with which all logfiles are stored:
// E.g: btc-info.log or btc-warning.log. This is always lower case.
// The following logfiles will be written in log/
//
// [logtag]-warning.log     -> Contains warnings
// [logtag]-info.log        -> Contains info (normal)
// [logtag]-debug.log       -> Contains all debug messages if debug is enabled
// [logtag]-sell.log        -> Contains sell orders (completed and failed)
// [logtag]-buy.log         -> Contains buy orders (completed and failed)
// [logtag]-methods.log     -> Contains messages by methods (e.g. DEMA info)
//
// You can also use a function, like the date function shown below:
// The simpelest is the following:
// config.logtag = 'btc';
// config.logdir = '';
config.logdir = 'btc/' + (function() {
    return require('moment')().format('YYYY-MM-DD');
})();

config.logtag = ''

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                          GENERAL SETTINGS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Gekko stores historical history
config.history = {
  // in what directory should Gekko store
  // and load historical data from?
  directory: './history/'
}
config.debug = true; // for additional logging / debugging

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                         WATCHING A MARKET
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Monitor the live market
config.watch = {
  enabled: true,
  exchange: 'cryptsy', // 'MtGox', 'BTCe', 'Bitstamp', 'cexio', 'cryptsy' or 'kraken'
  key: '',
  secret: '',
  currency: 'BTC',
  asset: 'DOGE'
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING TRADING ADVICE
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.tradingAdvisor = {
  enabled: true,
  method: 'DEMA',
  candleSize: 60,
  historySize: 50
}

// Exponential Moving Averages settings:
config.DEMA = {
  // tradeOnStart: trade at the first position that advice is calculated for
  tradeOnStart: true, 

  // tradeAfterFlat: we want to initiate trades after the market goes 
  // flat (or only when new up or down happens)
  tradeAfterFlat: false,

  // EMA weight (α)
  // the higher the weight, the more smooth (and delayed) the line
  short: 11,
  long: 31,
  // amount of candles to remember and base initial EMAs on
  // the difference between the EMAs (to act as triggers)

  thresholds: {
    down: -0.025,
    up: 0.025
  }
};

// MACD settings:
config.MACD = {
  // tradeOnStart: trade at the first position that advice is calculated for
  tradeOnStart: true, 

  // tradeAfterFlat: we want to initiate trades after the market goes 
  // flat (or only when new up or down happens)
  tradeAfterFlat: false,

  // EMA weight (α)
  // the higher the weight, the more smooth (and delayed) the line
  short: 10,
  long: 21,
  signal: 9,
  // the difference between the EMAs (to act as triggers)
  thresholds: {
    down: -0.025,
    up: 0.025,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 1
  }
};

// PPO settings:
config.PPO = {
  // tradeOnStart: trade at the first position that advice is calculated for
  tradeOnStart: true, 

  // tradeAfterFlat: we want to initiate trades after the market goes 
  // flat (or only when new up or down happens)
  tradeAfterFlat: false,

  // EMA weight (α)
  // the higher the weight, the more smooth (and delayed) the line
  short: 12,
  long: 26,
  signal: 9,
  // the difference between the EMAs (to act as triggers)
  thresholds: {
    down: -0.025,
    up: 0.025,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 2
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING PLUGINS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Want Gekko to perform real trades on buy or sell advice?
// Enabling this will activate trades for the market being
// watched by config.watch
config.trader = {
  enabled: true,
  tradePercent: 10,
  lossAvoidant: false,
  key: '',
  secret: '',
  username: '' // your username, only fill in when using bitstamp or cexio
}

// want Gekko to send a mail on buy or sell advice?
config.mail = {
  enabled: false,
  key: '',
  secret: '',
  username: '' // your username, only fill in when using bitstamp or cexio
}

  // You don't have to set your password here, if you leave it blank we will ask it
  // when Gekko's starts.
  //
  // NOTE: Gekko is an open source project < https://github.com/askmike/gekko >,
  // make sure you looked at the code or trust the maintainer of this bot when you
  // fill in your email and password.
  //
  // WARNING: If you have NOT downloaded Gekko from the github page above we CANNOT
  // garantuee that your email address & password are safe!
  password: ''

config.adviceLogger = {
  enabled: true
}

// do you want Gekko to calculate the profit of its own advice?
config.profitSimulator = {
  enabled: true,
  // report the profit in the currency or the asset?
  reportInCurrency: true,
  // start balance, on what the current balance is compared with
  simulationBalance: {
    // these are in the unit types configured in the watcher.
    asset: 1,
    currency: 100,
  },
  // only want report after a sell? set to `false`.
  verbose: false,
  // how much fee in % does each trade cost?
  fee: 0.03,
  // how much slippage should Gekko assume per trade?
  slippage: 0.05
}

// want Gekko to send a mail on buy or sell advice?
config.mailer = {
  enabled: false,       // Send Emails if true, false to turn off
  sendMailOnStart: true,    // Send 'Gekko starting' message if true, not if false

  email: '',    // Your Gmail address

  // You don't have to set your password here, if you leave it blank we will ask it
  // when Gekko's starts.
  //
  // NOTE: Gekko is an open source project < https://github.com/askmike/gekko >,
  // make sure you looked at the code or trust the maintainer of this bot when you
  // fill in your email and password.
  //
  // WARNING: If you have NOT downloaded Gekko from the github page above we CANNOT
  // guarantuee that your email address & password are safe!

  password: '',       // Your Gmail Password - if not supplied Gekko will prompt on startup.

  tag: '[GEKKO] ',      // Prefix all email subject lines with this

            //       ADVANCED MAIL SETTINGS
            // you can leave those as is if you 
            // just want to use Gmail

  server: 'smtp.gmail.com',   // The name of YOUR outbound (SMTP) mail server.
  smtpauth: true,     // Does SMTP server require authentication (true for Gmail)
          // The following 3 values default to the Email (above) if left blank
  user: '',       // Your Email server user name - usually your full Email address 'me@mydomain.com'
  from: '',       // 'me@mydomain.com'
  to: '',       // 'me@somedomain.com, me@someotherdomain.com'
  ssl: true,        // Use SSL (true for Gmail)
  port: '',       // Set if you don't want to use the default port
  tls: false        // Use TLS if true
}


config.ircbot = {
  enabled: false,
  emitUpdats: false,
  channel: '#your-channel',
  server: 'irc.freenode.net',
  botName: 'gekkobot'
}

config.campfire = {
  enabled: false,
  emitUpdates: false,
  nickname: 'Gordon',
  roomId: null,
  apiKey: '',
  account: ''
}

config.redisBeacon = {
  enabled: false,
  port: 6379, // redis default
  host: '127.0.0.1', // localhost
    // On default Gekko broadcasts
    // events in the channel with
    // the name of the event, set
    // an optional prefix to the
    // channel name.
  channelPrefix: '',
  broadcast: [
    'small candle'
  ]
}

// not in a working state
// read: https://github.com/askmike/gekko/issues/156
config.webserver = {
  enabled: false,
  ws: {
    host: 'localhost',
    port: 1338,
  },
  http: {
    host: 'localhost',
    port: 1339,
  }
}

// not working, leave as is
config.backtest = {
  enabled: false
}

// set this to true if you understand that Gekko will 
// invest according to how you configured the indicators.
// None of the advice in the output is Gekko telling you
// to take a certain position. Instead it is the result 
// of running the indicators you configured automatically.
// 
// In other words: Gekko automates your trading strategies,
// it doesn't advice on itself, only set to true if you truly
// understand this.
// 
// Not sure? Read this first: https://github.com/askmike/gekko/issues/201
config['I understand that Gekko only automates MY OWN trading strategies'] = false;

module.exports = config;
