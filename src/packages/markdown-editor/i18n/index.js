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

import { globalEventEmitter } from '../share/emitter.js';

import { enUS } from './lang/en-US.js';

/**
 * Internationalization (i18n) helper class.
 */
class I18n {
  #langs = { enUS };
  #current = 'enUS';

  /**
   * Creates a new instance of the i18n helper class.
   * @param {Object} [langs={enUS}]   - A dictionary of language keys and corresponding
   *                                    translation dictionaries.
   * @param {string} [current='enUS'] - The key of the currently active language.
   */
  constructor() {
    this.setUp();
  }

  /**
   * Sets up the current language based on the user's browser settings.
   */
  setUp() {
    if (typeof window === 'undefined') return;

    let locale = this.#current;
    if (typeof navigator.language !== 'undefined') {
      const it = navigator.language.split('-');
      locale = it[0];
      if (it.length !== 1) locale += it[it.length - 1].toUpperCase();
    }

    if (typeof navigator.browserLanguage !== 'undefined') {
      const it = navigator.browserLanguage.split('-');
      locale = it[0];
      if (it.length !== 1) locale += it[1].toUpperCase();
    }

    if (this.#current !== locale && this.#isAvailable(locale)) {
      this.#current = locale;
      globalEventEmitter.emit(
        globalEventEmitter.EVENT_LANG_CHANGE,
        this,
        locale,
        this.#langs[locale]
      );
    }
  }

  /**
   * Determines whether the given language is available.
   * @param {string} langName - The name of the language to check.
   * @returns {boolean} `true` if the language is available, `false` otherwise.
   * @private
   */
  #isAvailable(langName) {
    return this.#langs[langName] === 'undefined';
  }

  /**
   * Adds a new language to the language dictionary.
   * @param {string} langName - The name of the language to add.
   * @param {Object} lang     - The translation dictionary for the language.
   */
  add(langName, lang) {
    this.#langs[langName] = lang;
  }

  /**
   * Sets the currently active language.
   * @param {string} langName - The name of the language to set as active.
   * @throws {Error} Throws an error if the language does not exist.
   */
  setCurrent(langName) {
    if (!this.#isAvailable(langName)) {
      throw new Error(`Language '${langName}' does not exist!`);
    }
    if (this.#current !== langName) {
      this.#current = langName;
      globalEmitter.emit(
        globalEmitter.EVENT_LANG_CHANGE,
        this,
        langName,
        this.#langs[langName]
      );
    }
  }

  /**
   * Returns the translation for the given key in the currently active language.
   * @param {string} key            - The translation key.
   * @param {Object} [placeholders] - An optional dictionary of placeholders to
   *                                  substitute in the translation.
   * @returns {string} The translated string.
   */
  get(key, placeholders) {
    let str = this.#langs[this.#current][key] || '';
    if (placeholders) {
      Object.keys(placeholders).forEach((k) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), placeholders[k]);
      });
    }
    return str;
  }

  /**
   * Returns the current language being used by the I18n instance.
   * @returns {string} The language code for the current language.
   */
  getCurrent() {
    return this.#current;
  }
}

export const i18n = new I18n();
