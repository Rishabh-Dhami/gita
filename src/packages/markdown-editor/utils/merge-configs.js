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
 * Merges two objects recursively, with the properties of the second object overwriting the first.
 * If a property is an array, it is copied instead of merged.
 *
 * @param {object} obj1 - The first object to merge.
 * @param {object} obj2 - The second object to merge.
 * @returns {object} A new object with the merged properties.
 */
function mergeObjects(obj1, obj2) {
  const result = {};
  Object.keys(obj1).forEach((key) => {
    if (obj2.hasOwnProperty(key)) {
      if (
        typeof obj1[key] === 'object' &&
        !Array.isArray(obj1[key]) &&
        typeof obj2[key] === 'object'
      ) {
        result[key] = mergeObjects(obj1[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    } else {
      result[key] = obj1[key];
    }
  });
  Object.keys(obj2).forEach((key) => {
    if (!obj1.hasOwnProperty(key)) {
      result[key] = obj2[key];
    }
  });
  return result;
}

/**
 * Merges a default configuration object with one or more additional configurations,
 * with the properties of the additional configurations overwriting the defaults.
 * If a property is an array, it is copied instead of merged.
 *
 * @param {object} defaultConfig - The default configuration object.
 * @param {...object} configs    - One or more additional configuration objects to
 *                                 merge.
 * @returns {object} A new object with the merged configuration properties.
 */
function mergeConfigs(defaultConfig, ...configs) {
  let mergedConfig = { ...defaultConfig };
  configs.forEach((config) => {
    if (
      typeof config === 'object' &&
      !(config === null || Array.isArray(config))
    ) {
      mergedConfig = mergeObjects(mergedConfig, config);
    }
  });
  return mergedConfig;
}

export default mergeConfigs;
