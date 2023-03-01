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

import { i18n } from '../../i18n/index.js';

describe('i18n', () => {
  test('adds a new translation dictionary and language to the language dictionary', () => {
    const langName = 'frFR';
    const lang = { hello: 'Bonjour' };
    i18n.add(langName, lang);
    i18n.setCurrent(langName);
    expect(i18n.get('hello')).toBe('Bonjour');
  });

  test('throws an error if the language does not exist', () => {
    const langName = 'deDE';
    expect(() => i18n.setCurrent(langName)).toThrowError(
      `Language '${langName}' does not exist!`
    );
  });

  test('returns the current language being used by the i18n instance', () => {
    const langName = 'frFR';
    const lang = { hello: 'Bonjour' };
    i18n.add(langName, lang);
    i18n.setCurrent(langName);
    expect(i18n.getCurrent()).toBe(langName);
  });
});
