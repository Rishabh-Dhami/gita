#!/usr/bin/env node

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

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const [, , Command, ...args] = process.argv;
const SourceDirectory = path.resolve(__dirname, '../src');

const ES6Syntax2NodeModule = {
  'import.meta.url': "require('url').pathToFileURL(__filename).toString()",
};

/**
 * @description Logs a message to the console.
 *
 * @param {string} level                     - The log level (e.g. "error", "warning").
 * @param {string} message                   - The log message.
 * @param {object} options                   - Optional parameters for the log function.
 * @param {boolean} [options.enableLogLevel] - A flag indicating whether to include the log
 *                                             level in the output.
 */
const _log = (
  level,
  message,
  { enableLogLevel } = { enableLogLevel: true }
) => {
  if (enableLogLevel === true) {
    console.error(`${level.toUpperCase()}: ${message}`);
  } else {
    console.error(message);
  }
};

/**
 * @description Function to get a list of all JavaScript files in a directory, including
 *              subdirectories.
 *
 * @param {string} sourceDirectory - The directory to search in.
 * @returns {Array} - An array of file paths.
 */
const getJavaScriptFiles = (sourceDirectory) => {
  let files = [];
  const items = fs.readdirSync(sourceDirectory, { withFileTypes: true });
  items.forEach((item) => {
    if (
      item.isFile() &&
      (item.name.endsWith('.js') || item.name.endsWith('.jsx'))
    ) {
      files.push(path.join(sourceDirectory, item.name));
    } else if (item.isDirectory()) {
      files = files.concat(
        getJavaScriptFiles(path.join(sourceDirectory, item.name))
      );
    }
  });
  return files;
};

/**
 * @description This is mainly to replace browser based JavaScript expressions with ES6
 *              syntax to make it compatible with node environment when using jest and in
 *              the browser environment to set up a build for production.
 *
 * @param {String} mode         ('build', 'test').
 * @param {String} directory    Directory to use files from for search and replace
 *                              operation.
 * @param {String} searchValue  The value to search for replace.
 * @param {String} replaceValue The value to use for replace.
 * @param {Function} callback   Function to call after performing the search and replace
 *                              operation.
 */
const replaceInSourceDirectory = (
  mode,
  directory,
  searchValue,
  replaceValue,
  callback
) => {
  getJavaScriptFiles(directory)
    .filter((file) => !file.endsWith('.test.js'))
    .forEach((filePath) => {
      _log(
        'INFO',
        `${
          mode === 'build' ? 'BUILD' : 'TEST'
        }: Replacing '${searchValue}' with '${replaceValue}' in file ${filePath}...`,
        { enableLogLevel: false }
      );
      const data = fs.readFileSync(filePath, 'utf8').toString();
      const result = data.replace(searchValue, replaceValue);
      fs.writeFileSync(filePath, result, 'utf8');
    });
  callback();
};

/**
 * @description This function is used to run a command in the shell.
 *
 * @param {string} command - The shell command to be executed.
 * @returns {Promise}      - A Promise that resolves if the command execution is
 *                           successful and rejects if it encounters an error.
 */
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, { shell: true, stdio: 'inherit' });
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command ${command} exited with code ${code}`));
      }
    });
  });
};

/**
 * @description This function is used to count the number of javascript files in the
 *              given directory.
 *
 * @param {string} directory  - The directory to count the javascript files from.
 * @param {...option} verbose - Verbose output.
 * @returns {Number}          - Number of javascript files.
 */
const countJavaScriptFiles = (directory, { verbose }) => {
  if (verbose) {
    _log('INFO', 'Counting JavaScript files...', { enableLogLevel: true });
  }
  return getJavaScriptFiles(directory).length;
};

/**
 * @description This function is used to count the number of code lines inside of the
 *              javascript files.
 *
 * @param {string} directory  - The directory to get the javascript files from.
 * @param {...option} verbose - Verbose output.
 * @returns {Number}          - Number of javascript code lines.
 */
const countJavaScriptCodeLines = (directory, { verbose }) => {
  let lines = 0;
  getJavaScriptFiles(directory).forEach((filePath) => {
    if (verbose) {
      _log(
        'INFO',
        `Found ${
          fs.readFileSync(filePath, 'utf8').toString().split('\n').length
        } lines in file ${filePath}...`,
        {
          enableLogLevel: true,
        }
      );
    }
    lines += fs.readFileSync(filePath, 'utf8').toString().split('\n').length;
  });
  return lines;
};

switch (Command) {
  case 'build':
    for (const [es6Syntax, nodeModule] of Object.entries(
      ES6Syntax2NodeModule
    )) {
      replaceInSourceDirectory(
        'build',
        SourceDirectory,
        nodeModule,
        es6Syntax,
        () => {
          runCommand('npm run build')
            .then(() => {
              _log('INFO', `The command 'npm run build' has completed`);
            })
            .catch((error) => {
              _log('ERROR', error);
            });
        }
      );
    }
    break;
  case 'test':
    for (const [es6Syntax, nodeModule] of Object.entries(
      ES6Syntax2NodeModule
    )) {
      replaceInSourceDirectory(
        'test',
        SourceDirectory,
        es6Syntax,
        nodeModule,
        () => {
          runCommand('npm run test')
            .then(() => {
              _log('INFO', `The command 'npm run test' has completed`);
            })
            .catch((error) => {
              _log('ERROR', error);
            });
        }
      );
    }
    break;
  case 'count':
    if (args.length === 0) {
      _log(
        'ERROR',
        `Invalid command: ${Command} can not be used with 0 arguments`,
        { enableLogLevel: false }
      );
      process.exit(1);
    }
    const [arg1, arg2] = args;
    switch (arg1) {
      case '-f':
        _log(
          'INFO',
          countJavaScriptFiles(SourceDirectory, {
            verbose: arg2 === '-v' ? true : false,
          }),
          {
            enableLogLevel: false,
          }
        );
        break;
      case '-l':
        _log(
          'INFO',
          countJavaScriptCodeLines(SourceDirectory, {
            verbose: arg2 === '-v' ? true : false,
          }),
          {
            enableLogLevel: false,
          }
        );
        break;
      default:
        _log('ERROR', `Invalid argument: ${arg}`, { enableLogLevel: false });
        process.exit(1);
    }
    break;
  default:
    _log('ERROR', `Invalid command: ${Command}`, { enableLogLevel: false });
    process.exit(1);
}
