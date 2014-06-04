/*
 * jqLog - jQuery logging for javascript
 *
 * Version: 0.0.3
 * Build: 98
 * Copyright 2011 Alex Tkachev
 *
 * Dual licensed under MIT or GPLv2 licenses
 *   http://en.wikipedia.org/wiki/MIT_License
 *   http://en.wikipedia.org/wiki/GNU_General_Public_License
 *
 * Date: 19 Aug 2013 17:13:42
 */

(function($) {

  $.jqLog = {
    classes: {}
  };


})(jQuery);
(function($) {

  $.jqLog.Level = {
    TRACE: {num: 1, name: 'TRACE'},
    DEBUG: {num: 2, name: 'DEBUG'},
    INFO: {num: 3, name: 'INFO'},
    WARN: {num: 4, name: 'WARN'},
    ERROR: {num: 5, name: 'ERROR'},
    FATAL: {num: 6, name: 'FATAL'},

    // note that levelThatRestricts can be undefined, if it is undefined the it restricts
    isLower: function(levelToCheck, levelThatRestricts){
      if(levelThatRestricts && levelThatRestricts.num){
        return levelToCheck.num < levelThatRestricts.num;
      }
      return false;
    },

    // return true if given levelToCheck is restricted by given levelThatRestricts
    isRestricted: function(levelToCheck, levelThatRestricts){
      return levelToCheck.num < levelThatRestricts.num;
    }


  };

})(jQuery);
(function($) {

  $.jqLog.classes.Layouter = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.Layouter.prototype, {

    /*
     Formats the logging message according to given pattern and date pattern. Pattern can include the following placeholders:
     %{level} - log level
     %{name} - log name
     %{date} - log date (formatted according to date pattern)
     %{msg} - the message that was logged

     config.pattern - string of the pattern, like: "%{level} [%{name}] %{msg}"
     config.datePattern - %{date} placeholder in the pattern will be replaced with date formatted by this pattern
     */
    initialize: function(pattern, datePattern) {
      this.datePattern = '%d-%m-%y %H:%M:%S';
      this.pattern = '%{level} %{msg}';

      if(arguments.length > 0) this.pattern = pattern;
      if(arguments.length > 1) this.datePattern = datePattern;

      if(typeof this.pattern != 'string') throw 'Layouter pattern parameter must be string';
      if(typeof this.datePattern != 'string') throw 'Layouter datePattern parameter must be string';
    },

    eventToString: function(event){
      return this.pattern.replace("%{level}", event.level.name.lpad(5, ' ')).replace("%{name}", event.logger.name).replace("%{date}", event.date.strftime(this.datePattern)).replace("%{msg}", event.message);
    }

  });

})(jQuery);
(function($) {

  $.jqLog.classes.Logger = function(){
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.Logger.prototype, {

    initialize: function(config){
      $.extend(this, config);
    },

    log: function(level, message, params){
      if(this.jqLog.isLevelEnabled(this, level)){
        if(arguments.length == 3 && typeof params == 'object'){ //last parameter is parameters hash
          for(var key in params){
            message = message.replace("%{"+key+"}", params[key]).replace("{"+key+"}", params[key]);
          }
        } else if(arguments.length > 2){ //treat last arguments as array notation has, like: .info("my message {0}, {1} and {2}", 'p1', 'p2', 'p3')
          for(var i=2; i<arguments.length; i++){
            message = message.replace("%{"+(i-2)+"}", arguments[i]).replace("{"+(i-2)+"}", arguments[i]);
          }
        }
        this.jqLog.doAppend(this, level, message);
      }
    }

  });

  ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].each(function(name){
    $.jqLog.classes.Logger.prototype[name] = function(){
      Array.prototype.unshift.call(arguments, $.jqLog.Level[name.toUpperCase()]);
      this.log.apply(this, arguments);
    };
  });

})(jQuery);
(function($) {

  $.jqLog.classes.LoggersManager = function() {
    this.initialize.apply(this, arguments);
  };
  $.extend($.jqLog.classes.LoggersManager.prototype, {

    loggers: null,
    rootLogger: null,

    initialize: function(jqLog) {
      this.jqLog = jqLog;
      this.reset();
    },

    reset: function() {
      this.loggers = {};
      //create root logger
      this.rootLogger = this.loggers._logger = new $.jqLog.classes.Logger({jqLog: this.jqLog, name: '', nameArr: [], level: $.jqLog.Level.DEBUG});
    },

    configure: function(options) {
      if(options.root){
        this.rootLogger.level = options.root.level;
      }
      //other loggers
      for(var name in options){
        if(name != 'root'){
          var loggerConfig = options[name];
          var logger = this.logger(name);
          if(loggerConfig.level) {
            logger.level = loggerConfig.level;
          }
        }
      }
    },

    logger: function(name) {
      if (!name || name.length === 0) {
        return this.rootLogger;
      }
      var nameArr = name.split('.');
      var tree = this.loggers;
      nameArr.each(function(key){
        if (!tree[key]) {
          tree[key] = {_logger: null};
        }
        tree = tree[key];
      });

      if (tree._logger === null) {
        tree._logger = new $.jqLog.classes.Logger({jqLog: this.jqLog, name: name, nameArr: nameArr});
      }
      return tree._logger;
    },

    // return level for this logger that is inherited from its parents (all the way up to rootLogger)
    inheritedLoggerLevel: function(logger){
      if(logger == this.rootLogger) return this.rootLogger.level;
      //search parent loggers levels
      var tree = this.loggers;
      for (var i = 0; i < logger.nameArr.length; i++) {
        var key = logger.nameArr[i];
        if (tree[key]._logger && tree[key]._logger.level) { //has parent, and parent logger level is set
          return tree[key]._logger.level
        }
        tree = tree[key];
      }
      return this.rootLogger.level;
    },

    //If logger has its own level set, limit by that level
    //If logger has no level set, limit by parent level logger (or root logger if no parent has a specific level set)
    isLevelEnabled: function(logger, level) {
      if(logger.level) return !$.jqLog.Level.isRestricted(level, logger.level); //loger has its own level set

      return !$.jqLog.Level.isRestricted(level, this.inheritedLoggerLevel(logger)); //logger has no own level set, restrict by its parents
    }

  });

})(jQuery);
(function($) {

  $.jqLog.classes.ArrayConsole = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.ArrayConsole.prototype, {

    enabled: true,

    initialize: function() {
      this.buffer = [];
    },

    log: function(method, message) {
      this[method](message);
    }
  });

  ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].each(function(name) {
    $.jqLog.classes.ArrayConsole.prototype[name] = function(message) {
      this.buffer.push({method: name, message: message});
    };
  });

})(jQuery);
(function($) {

  $.jqLog.classes.BrowserConsole = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.BrowserConsole.prototype, {
    initialize: function() {
      this.console = window.console;
      this.enabled = typeof(this.console) !== 'undefined' && this.console !== null;
    },

    log: function(method, message) {
      this[method](message);
    }
  });

  ['trace', 'debug', 'info', 'warn', 'error'].each(function(name) {
    $.jqLog.classes.BrowserConsole.prototype[name] = function(message) {
      if(this.console[name]){
        this.console[name](message);
      } else {
        this.console.log(name + ": " + message);
      }
    };
  });
  $.jqLog.classes.BrowserConsole.prototype.fatal = $.jqLog.classes.BrowserConsole.prototype.error; //browser console doesn't have fatal level

})(jQuery);
(function($) {

  $.jqLog.classes.ConsoleAppender = function() {
    this.__class_name__ = '$.jqLog.classes.ConsoleAppender';
    this.initialize.apply(this, arguments);
  };

  var Level = $.jqLog.Level;
  var map = {};
  ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].each(function(name){ map[Level[name.toUpperCase()].name] = name; });
  $.jqLog.classes.ConsoleAppender.loggingMethodForLevel = function(level){
    return map[level.name];
  };

  $.extend($.jqLog.classes.ConsoleAppender.prototype, {

    console: null,

    initialize: function(config) {
      $.extend(this, config);
      if(!this.console) this.console = new $.jqLog.classes.BrowserConsole();
    },

    getLayouter: function(){
      return this.layouter || $.jqLog.rootLayouter();
    },

    doAppend: function(event){
      if(!this.console.enabled) return false;

      var loggingMethod = $.jqLog.classes.ConsoleAppender.loggingMethodForLevel(event.level);
      var msg = this.getLayouter().eventToString(event);
      this.console[loggingMethod](msg); //perform actual log
      return true;
    }

  });

})(jQuery);
(function($) {

  $.jqLog.classes.AjaxAppender = function() {
    this.__class_name__ = '$.jqLog.classes.AjaxAppender';
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.AjaxAppender.prototype, {

    url: null, //url to which logger statements will be posted
    flushSize: 100, //messages will be sent when buffer is full (has 100 messages)
    messagesPerRequestLimit: 1000, //max number of messages that will be sent in one request (in case there was no internet, and accumulated a lot of messages, don't send them at once, split the buffer)
    bufferLocked: false, //if buffer is locked after ajax request by slicing the buffer
    failedAjaxDisablePeriod: 5*60*1000, // wait period in which no ajax request will be tried if previous ajax failed

    initialize: function(config) {
      if(!config.url) throw "config.url must be present in ajax appender config"
      $.extend(this, config);

      this.buffer = [];
      this.pauseAjaxUntil = null; //if failed to send ajax request, wait until this time before sending again (to prevent flood of ajax requests)
    },

    getLayouter: function(){
      return this.layouter || $.jqLog.rootLayouter();
    },

    doAppend: function(event){
      var msg = this.getLayouter().eventToString(event);
      this._safePushToBuffer(msg);
      if(this.buffer.length >= this.flushSize) this.flush();
      return true;
    },

    _safePushToBuffer: function(msg){
      var self = this;
      if(this.bufferLocked){
        window.setTimeout(function(){ self._safePushToBuffer(msg); }, 5);
      } else {
        this.buffer.push(msg);
      }
    },

    // send all messages in buffer to server
    flush: function(){
      var self = this;
      if(this.flushing) return;  //do not send multiple requests
      if(this.pauseAjaxUntil && (new Date().getTime()) < this.pauseAjaxUntil) return;  //do not send multiple requests

      this.flushing = true;
      var messages = this.buffer.clone(); //we clone it since buffer might continue to fill up as we sending ajax request
      if(messages.length > this.messagesPerRequestLimit) messages = messages.slice(0, this.messagesPerRequestLimit); //trim messages array to max allowed messages size per request
      $.ajax({
        url: this.url,
        type: 'post',
        data: $.param({log_messages: messages}),
        success: function(){
          self.bufferLocked = true;
          try{
            self.buffer = self.buffer.slice(messages.length);
          }catch(e){
          }finally{
            self.bufferLocked = false;
            self.pauseAjaxUntil = null;
          }
        },
        error: function(xhr){
          self.pauseAjaxUntil = new Date().getTime() + self.failedAjaxDisablePeriod; //do not try to flush again for the next 5 minutes (it is timestamp)
        },
        complete: function(){
          self.flushing = false;
        }
      });
    }

  });

})(jQuery);
(function($) {

  $.jqLog.classes.JQLog = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.JQLog.prototype, {

    manager: null, //loggers manager
    appenders: null, //array of appenders
    rootLogger: null, //reference to root logger

    defaultConfig: null, //reference to default configuration that will be applied on reset

    initialize: function(config) {
      this.defaultConfig = config;
      this.reset();
    },

    reset: function() {
      this.manager = new $.jqLog.classes.LoggersManager(this);
      this.rootLogger = this.manager.rootLogger;
      this.appenders = [];
      this.configure(this.defaultConfig);
    },

    isLevelEnabled: function(logger, level) {
      return this.manager.isLevelEnabled(logger, level);
    },

    doAppend: function(logger, level, message) {
      var event = {date: new Date(), logger: logger, level: level, message: message};
      this.appenders.each(function(appender) {
        appender.doAppend(event);
      });
    },

    logger: function(name) {
      return this.manager.logger(name);
    },

    configure: function(options) {
      if (options.loggers) {
        this.manager.configure(options.loggers);
      }
      if (options.appenders) {
        this.appenders = options.appenders;
      }
      if (options.layouter) {
        this.layouter = options.layouter;
      }
    }
  });

  $.extend($.jqLog, {
    defaults: {
      layouter: new $.jqLog.classes.Layouter(),
      appenders: [new $.jqLog.classes.ConsoleAppender()],
      loggers: {
        root: {level: $.jqLog.Level.DEBUG}
      }
    }
  });

  var API = (function() {
    var instance = new $.jqLog.classes.JQLog($.jqLog.defaults);

    return {
      _instance: instance,

      rootLayouter: function(){
        return instance.layouter;
      },

      rootLogger: function() {
        return instance.rootLogger;
      },

      logger: function(name) {
        return instance.logger(name);
      },

      configure: function(options) {
        instance.configure(options);
      }
    };
  })();

  $.extend($.jqLog, API);


})(jQuery);

