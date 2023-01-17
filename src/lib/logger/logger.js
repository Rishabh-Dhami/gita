// Copyright 2023 The Gita Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Each log message has an associated log level that gives a rough guide to the
// importance and urgency of the message. Each level has an associated integer
// value usable by rules that monitor system messages. Higher values indicate
// higher priorities. As such, a rule might look for WARN and ERROR messages by
// looking for values greater than or equal to 5 (Level >= 5).
const LOGGING_LEVELS = {
  // No logging.
  OFF: 99,

  // Error events of considerable importance that will prevent normal program
  // execution, but might still allow the application to continue running.
  ERROR: 8,

  // Potentially harmful situation of interest to end users or system managers
  // that indicate potential problems.
  WARN: 5,

  // Informational messages that might make sense to the end users and system
  // administrators, and highlight the progress of the application.
  INFO: 3,

  // Relatively detailed tracing used by the application developers.
  DEBUG: 2,

  // A detailed stack trace of error (if console.trace supports it).
  TRACE: 1,
};

// We omit `OFF` logging level, since the message is not displayed in that
// level.
const LOGGING_LEVELS_TO_NAME_MAP = {
  [LOGGING_LEVELS.ERROR]: 'ERROR',
  [LOGGING_LEVELS.WARN]: 'WARN',
  [LOGGING_LEVELS.INFO]: 'INFO',
  [LOGGING_LEVELS.DEBUG]: 'DEBUG',
  [LOGGING_LEVELS.TRACE]: 'TRACE',
};

/**
 * Helper function to create a Logging level instance - {value, name}.
 */
const defineLogLevel = (level) => {
  return { value: level, name: LOGGING_LEVELS_TO_NAME_MAP[level] };
};

// List of all the `LOGGER` instances that gets created throughout the program.
var LoggerInstances = [];

/**
 * Creates an instance for logging with the given name and logging level.
 * Each newly created instance of `LOGGER` must have a unique name otherwise
 * in case of a duplicate name an error is thrown out of this function.
 */
function LOGGER(name, filename, level, serverUrl = null) {
  this.name = name;
  this.level = level;
  this.filename = filename;
  this.serverUrl = serverUrl;
  this.systemContext = {};

  for (let instance in LoggerInstances) {
    if (instance.name === this.name) {
      throw Error(`${this.name} is already in use.`);
    }
  }
  LoggerInstances.push(this);
}

LOGGER.OFF = defineLogLevel(LOGGING_LEVELS.OFF);
LOGGER.ERROR = defineLogLevel(LOGGING_LEVELS.ERROR);
LOGGER.WARN = defineLogLevel(LOGGING_LEVELS.WARN);
LOGGER.INFO = defineLogLevel(LOGGING_LEVELS.INFO);
LOGGER.DEBUG = defineLogLevel(LOGGING_LEVELS.DEBUG);
LOGGER.TRACE = defineLogLevel(LOGGING_LEVELS.TRACE);

/**
 * Set the logging level for the current logger, if the level is not given
 * or if it is "null" or "undefined" the default "INFO" level is used.
 */
LOGGER.prototype.setLevel = function (level) {
  if (level == null) {
    this.level = LOGGER.INFO;
  } else {
    this.level = level;
  }
};

/**
 * Add the context to the LOGGER's context variable.
 *
 * @param {Object} context Context to add to the context variable.
 * @returns {void}
 */
LOGGER.prototype.setSystemContext = function (context) {
  this.systemContext = { ...this.systemContext, ...context };
};

/**
 * Generate system information and add it to the context variable.
 *
 * @function _generateSystemContext() Generates system information and add it
 * to the context variable. The context variable is an object that contains
 * additional information about the system where the log messages are generated.
 *
 * @returns {void}
 */
LOGGER.prototype._generateSystemContext = function () {
  if (typeof window === 'undefined') {
    this.warn('navigator is not supported outside of the browser');
    return;
  }
  const browser = navigator.userAgent;
  const os = navigator.platform;
  const screenResolution = {
    width: `${screen.width}px`,
    height: `${screen.height}px`,
  };
  this.systemContext = { ...this.systemContext, browser, os, screenResolution };
};

/**
 * Returns `true` if the current LOGGER instance is active for the given
 * logging level.
 */
LOGGER.prototype._isActive = function (level) {
  return this.level.value >= level.value;
};

/** Display error messages if the "ERROR" level is active. */
LOGGER.prototype.error = function (message, ...args) {
  this._log(LOGGER.ERROR, message, ...args);
};

/** Display warning messages if the "WARN" level is active. */
LOGGER.prototype.warn = function (message, ...args) {
  this._log(LOGGER.WARN, message, ...args);
};

/** Display information messages if the "INFO" level is active. */
LOGGER.prototype.info = function (message, ...args) {
  this._log(LOGGER.INFO, message, ...args);
};

/** Display debugging messages if the "DEBUG" level is active. */
LOGGER.prototype.debug = function (message, ...args) {
  this._log(LOGGER.DEBUG, message, ...args);
};

/** Display stack traces if "TRACE" level is active. */
LOGGER.prototype.trace = function (message, ...args) {
  this._log(LOGGER.TRACE, message, ...args);
};

/**
 * Appends the level name before the message and prints the log message
 * to a dedicated `console` stream according to the logging level given.
 */
LOGGER.prototype._log = function (level, message, ...args) {
  if (!this._isActive(level)) {
    return;
  }

  let logger = null;
  switch (level.value) {
    case LOGGING_LEVELS.OFF:
      return;
    case LOGGING_LEVELS.ERROR:
      logger = console?.error || console.log;
      break;
    case LOGGING_LEVELS.WARN:
      logger = console?.warn || console.log;
      break;
    case LOGGING_LEVELS.INFO:
      logger = console?.info || console.log;
      break;
    case LOGGING_LEVELS.DEBUG:
      logger = console?.debug || console.log;
      break;
    case LOGGING_LEVELS.TRACE:
      logger = console?.trace || console.log;
      break;
  }

  // Clones the given object either using the "structured clone" algorithm
  // or manually copying each attribute to a new object in case the
  // browser does not support the "structured clone" algorithm.
  const clone = (o) => {
    if (typeof structuredClone !== 'undefined') {
      return structuredClone(o);
    }

    if (o == null || typeof o !== 'object') {
      return o;
    }

    let copy = o.constructor();
    for (let attr in o) {
      // Only copy the object's own property - not something that is
      // inherited.
      if (o.hasOwnProperty(attr)) {
        copy[attr] = o[attr];
      }
    }
    return copy;
  };

  const context = clone(args?.context);
  if (context) {
    delete args.context;
  }
  const timestamp = new Date().toISOString();
  message = `[${this.name}] [${this.filename}] [${timestamp}] [${
    level.name
  }] [${message}] [${JSON.stringify(context)}] [${JSON.stringify(
    this.systemContext
  )}]`;
  logger(message, ...args);
};

/**
 * Logs a message over the network to the server specified by
 * `this.serverUrl`.
 *
 * @param {Object} level     - The log level object, containing a name and
 *                             a value.
 * @param {string} message   - The log message.
 * @param {Object} context   - Additional context information related to the
 *                             log message.
 * @param {string} timestamp - The timestamp of the log.
 * @returns {void}
 */
LOGGER.prototype._logOverNetwork = function (
  level,
  message,
  context,
  timestamp
) {
  if (!this.serverUrl) {
    this.warn('No server URL set, unable to log over network');
    return;
  }

  fetch(this.serverUrl, {
    method: 'POST',
    body: JSON.stringify({
      name: this.name,
      filename: this.filename,
      timestamp,
      level: level.name,
      message,
      context,
      systemContext: this.systemContext,
    }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to send log message: ${response.statusText}`);
      }
    })
    .catch((error) => {
      this.error(`Failed to send log message: ${error.message}`);
    });
};

export default LOGGER;
