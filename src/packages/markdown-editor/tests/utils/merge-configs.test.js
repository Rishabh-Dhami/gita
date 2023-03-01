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

import mergeConfigs from '../../utils/merge-configs.js';

describe('mergeConfigs', () => {
  const defaultConfigs = {
    name: 'Rupika Nautiyal',
    age: 19,
    address: {
      street: 'G.M.S Road',
      city: 'Dehradun',
      state: 'Uttarakhand',
    },
    hobbies: ['tiktok', 'snapchat'],
  };

  const configs1 = {
    name: 'Sakshi Nautiyal',
    address: {
      street: 'G.M.S Road',
    },
    hobbies: ['cooking'],
  };

  const configs2 = {
    age: 20,
    address: {
      city: 'Lost World',
    },
    hobbies: ['NAH'],
  };

  const mergedConfigs = mergeConfigs(defaultConfigs, configs1, configs2);

  describe('mergedConfigs', () => {
    it('contains all properties from defaultConfigs and both additional configs', () => {
      expect(mergedConfigs.name).toBe('Sakshi Nautiyal');
      expect(mergedConfigs.age).toBe(20);
      expect(mergedConfigs.address.street).toBe('G.M.S Road');
      expect(mergedConfigs.address.city).toBe('Lost World');
      expect(mergedConfigs.address.state).toBe('Uttarakhand');
      expect(mergedConfigs.hobbies).toEqual(['NAH']);
    });

    it('handles null and undefined values', () => {
      const nullConfigs = null;
      const undefinedConfigs = undefined;
      const mergedNullConfigs = mergeConfigs(defaultConfigs, nullConfigs);
      const mergedUndefinedConfigs = mergeConfigs(
        defaultConfigs,
        undefinedConfigs
      );
      expect(mergedNullConfigs).toEqual(defaultConfigs);
      expect(mergedUndefinedConfigs).toEqual(defaultConfigs);
    });

    it('handles non-object values', () => {
      const stringConfig = 'this is not an object';
      const numberConfig = 123;
      const booleanConfig = true;
      const arrayConfigs = [1, 2, 3];
      const mergedStringConfig = mergeConfigs(defaultConfigs, stringConfig);
      const mergedNumberConfig = mergeConfigs(defaultConfigs, numberConfig);
      const mergedBooleanConfig = mergeConfigs(defaultConfigs, booleanConfig);
      const mergedArrayConfigs = mergeConfigs(defaultConfigs, arrayConfigs);
      expect(mergedStringConfig).toEqual(defaultConfigs);
      expect(mergedNumberConfig).toEqual(defaultConfigs);
      expect(mergedBooleanConfig).toEqual(defaultConfigs);
      expect(mergedArrayConfigs).toEqual(defaultConfigs);
    });
  });
});
