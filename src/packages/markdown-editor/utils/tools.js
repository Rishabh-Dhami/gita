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

/**
 * Repeats the given object n times.
 * @param {string | object} o             - The object to repeat.
 * @param {number} n                      - The number of times to repeat the object.
 * @param {Object} [options]              - An optional object with configuration options.
 * @param {boolean} [options.extend=true] - Whether to extend the repeated object or
 *                                          replace it with the original object.
 * @returns {string | object}             - The repeated object.
 */
export function repeat(o, n, { extend } = { extend: true }) {
  let r = null;
  if (typeof o === 'string') {
    r = '';
    Array.from({ length: n }, (_, _) => {
      r += o;
    });
  } else if (typeof o === 'object' && Array.isArray(o)) {
    r = [];
    Array.from({ length: n }, (_, _) => {
      r = extend === true ? [...r, ...o] : [...r, o];
    });
  } else if (typeof o === 'object') {
    r = {};
    Array.from({ length: n }, (_, index) => {
      r = extend === true ? { ...r, ...o } : { ...r, [index]: o };
    });
  }
  return r;
}

/**
 * Determines if the given object is a Promise or has a then function.
 * @param {any} o     - The object to be checked.
 * @returns {boolean} - Returns true if the object is a Promise or has a then function,
 *                      otherwise returns false.
 */
export function isPromise(o) {
  return (
    o &&
    (o instanceof Promise ||
      ((typeof o === 'object' || typeof o === 'function') &&
        typeof o.then === 'function'))
  );
}
