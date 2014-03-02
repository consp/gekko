
The updated logger will write to a loggin directory with the following properties:
* Default directory is the start directory/log
* All messages are logged in separate files
* Zipping/logrotate has to be done with another program

It has 3 options in config.js:

* logdir -> Directory to log to after the default/log
    * leave empty if you do not want to use another directory
* logdate -> Use per day directories (true/false)
* logtag -> Tag the files (if you want to keep easy track of them)
    * leave empty if you do not want to use a directory

The following logfiles will be written in (default) log/

[logtag]-warning.log     -> Contains warnings
[logtag]-info.log        -> Contains info (normal)
[logtag]-debug.log       -> Contains all debug messages if debug is enabled
[logtag]-sell.log        -> Contains sell orders (completed and failed)
[logtag]-buy.log         -> Contains buy orders (completed and failed)
[logtag]-methods.log     -> Contains messages by methods (e.g. DEMA info)

This results in files like:
./log/[logdir]/[date]/logtag]-info.log
./log/bitcoin_ltc/1970-01-01/btce-info.log


