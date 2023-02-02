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
 * @description A JavaScript keyboard shortcut singleton to handle key events.
 *
 * The Shortcut class provides a singleton object that can be used to set custom keyboard
 * shortcuts for web applications.
 * You can register a key shortcut by providing a string representation of the key
 * combination (e.g. "Ctrl+A") and a callback function to react to the shortcut event.
 * The class offers methods to pause or resume callbacks for a specific event or all events.
 *
 * @param {Object} [options={}]                 - Options for the Shortcut singleton instance,
 *                                                optional.
 * @param {String} [options.keyEvent='keydown'] - The type of key event to listen for.
 * @param {Boolean} [options.autoRepeat=true]   - Whether to auto repeat the event if the key
 *                                                is held down for 'keydown' and 'keypress'
 *                                                events.
 * @returns {Object} The Shortcut singleton instance.
 */
class Shortcut {
  constructor(options = {}) {
    if (Shortcut.instance) {
      return Shortcut.instance;
    }
    Shortcut.instance = this;
    if (
      typeof options.keyEvent !== 'string' ||
      ['keydown', 'keyup', 'keypress'].indexOf(options.keyEvent) === -1
    ) {
      options.keyEvent = 'keydown';
    }
    if (typeof options.autoRepeat !== 'boolean') {
      options.autoRepeat = true;
    }
    if (typeof options.noPrevention !== 'boolean') {
      options.noPrevention = false;
    }
    /** @private @member {string} - Key event to use on keyboard event listener. */
    this._keyEvent = options.keyEvent;
    /** @private @member {boolean} - The auto repeat of an event when key is held on push. */
    this._autoRepeat = options.autoRepeat;
    /** @private @member {boolean} - Do not call prevent default on key event flag. */
    this._noPrevention = options.noPrevention;
    /** @private @member {object[]} - Single key saved shortcuts. */
    this._singleKey = [];
    /** @private @member {object[]} - Multi keys saved shortcuts. */
    this._multiKey = [];
    /** @public @member {string} - Component version. */
    this.version = '1.0.0';
    // Save singleton scope for testShortcuts method to be able to properly remove event on demand
    this._testShortcuts = this._testShortcuts.bind(this);

    return this;
  }

  /**
   * @description Shortcut destructor - deletes the singleton instance, its events and its
   *              properties.
   */
  destroy() {
    this._removeEvents();
    Object.keys(this).forEach((key) => {
      delete this[key];
    });
    Shortcut.instance = null;
  }

  /**
   * @description Private method to subscribe to DOM key stroke event, depending on which
   *              key event was set in constructor, or using the `updateKeyEvent()` method.
   *              The key event is then calls back the `_testShortcuts()` method to check
   *              if any event has to be fired.
   */
  _addEvents() {
    document.addEventListener(this._keyEvent, this._testShortcuts);
  }

  /**
   * @description Internal private method to revoke DOM subscription to a key stroke even,
   *              depending on which key was set in constructor, or using the
   *              `updateKeyEvent()` method. The key event won't call back the
   *              `_testShortcuts()` method.
   */
  _removeEvents() {
    document.removeEventListener(this._keyEvent, this._testShortcuts);
  }

  /**
   * @description This method needs to be called when a key event has been detected. It
   *              takes as a parameter the JavaScript event object, which contains
   *              required information. It will then crawl the registered shortcuts to
   *              check if one needs to be fired and call back the application. It handle
   *              both single key and multi-key shortcuts. Finally it will not fire any
   *              event if `repeat` flag is at `true`, and the singleton is not in auto
   *              repeat event.
   *
   * @param {event} event - The keyboard event ('keydown', 'keypress', 'keyup').
   */
  _testShortcuts(event) {
    if (this._autoRepeat === false && event.repeat === true) {
      event.preventDefault();
      return;
    }
    if (event.ctrlKey || event.altKey || event.shiftKey) {
      this._multiKeyEvent(event);
    } else {
      this._singleKeyEvent(event);
    }
  }

  /**
   * @description This method will parse all single key events registered in its internal
   *              attributes, and will fire the call back if its registered key matches the
   *              event key. It also prevent defaults on the event only if a match is found
   *              to keep browser behaviour in case there is no registered shortcut.
   *
   * @param {event} event - The keyboard event ('keydown', 'keypress', 'keyup').
   */
  _singleKeyEvent(event) {
    for (const shortcut of this._singleKey) {
      if (!shortcut.pause && event.key.toLowerCase() === shortcut.key) {
        if (this._noPrevention === false) {
          event.preventDefault();
        }

        shortcut.fire(this);
      }
    }
  }

  /**
   * @description This method will parse all multi-key events registered in its internal
   *              attributes, and will fire the call back if its registered key matches the
   *              event key. Multi key events are made using Ctrl, Alt, and Shift modifiers.
   *              It also prevent defaults on the event only if a match is found to keep
   *              browser behaviour in case there is no registered shortcut.
   *
   * @param {event} event - The keyboard event ('keydown', 'keypress', 'keyup').
   */
  _multiKeyEvent(event) {
    for (const shortcut of this._multiKey) {
      if (!shortcut.pause && event.key.toLowerCase() === shortcut.key) {
        switch (shortcut.modifierCount) {
          /** @for 2 key strokes. */
          case 1:
            if (
              (shortcut.modifiers.ctrlKey && event.ctrlKey) ||
              (shortcut.modifiers.altKey && event.altKey) ||
              (shortcut.modifiers.shiftKey && event.shiftKey)
            ) {
              if (this._noPrevention === false) {
                event.preventDefault();
              }
              shortcut.fire();
            }
            break;
          /** @for 3 key strokes. */
          case 2:
            if (
              (shortcut.modifiers.ctrlKey &&
                event.ctrlKey &&
                shortcut.modifiers.altKey &&
                event.altKey) ||
              (shortcut.modifiers.ctrlKey &&
                event.ctrlKey &&
                shortcut.modifiers.shiftKey &&
                event.shiftKey) ||
              (shortcut.modifiers.altKey &&
                event.altKey &&
                shortcut.modifiers.shiftKey &&
                event.shiftKey)
            ) {
              if (this._noPrevention === false) {
                event.preventDefault();
              }
              shortcut.fire();
            }
            break;
          /** @for 4 key strokes. */
          case 3:
            if (
              shortcut.modifiers.ctrlKey &&
              event.ctrlKey &&
              shortcut.modifiers.altKey &&
              event.altKey &&
              shortcut.modifiers.shiftKey &&
              event.shiftKey
            ) {
              if (this._noPrevention === false) {
                event.preventDefault();
              }
              shortcut.fire();
            }
            break;
        }
      }
    }
  }

  /**
   * @description Shorthand method to count modifiers in a given shortcut string. It uses
   *              regex expressions that are case insensitive to avoid multi-testing and
   *              JavaScript {Number} and {Boolean} addition.
   *
   * @param {string} keyString - The raw shortcut string that is defined when registering
   *                             an event.
   */
  _getModifiersCount(keyString) {
    const modifiers = {
      altKey: /alt/i.test(keyString),
      ctrlKey: /ctrl/i.test(keyString),
      shiftKey: /shift/i.test(keyString),
    };
    let count = 0;
    Object.values(modifiers).reduce((a, item) => (count = a + item), 0);
    return count;
  }

  /**
   * @description Parse all registered event and make them listen or unlisten to any
   *              keyevent.
   *
   * @param {boolean} value - The state to set, to pause/resume all registered shortcuts.
   */
  _setAllPauseFlag(value) {
    for (const { keyString } of this._singleKey) {
      this._setOnePauseFlag(keyString, value);
    }

    for (const { keyString } of this._multiKey) {
      this._setOnePauseFlag(keyString, value);
    }
  }

  /**
   * @description Parse all registered event and make the one that matches the key string
   *              listen or unlisten to any key event.
   *
   * @param {string} keyString - The raw shortcut string that is defined when registering
   *                             an event.
   * @param {boolean} value    - The state to set, to pause/resume all registered shortcuts.
   */
  _setOnePauseFlag(keyString, value) {
    if (this._getModifiersCount(keyString) === 0) {
      for (const shortcut of this._singleKey) {
        if (shortcut.keyString === keyString) {
          shortcut.pause = value;
        }
      }
    } else {
      for (const shortcut of this._multiKey) {
        if (shortcut.keyString === keyString) {
          shortcut.pause = value;
        }
      }
    }
  }

  /**
   * @description Internal method to test if a given key string isn't already related to
   *              a registered shortcut.
   *
   * @param {string} keyString - The raw shortcut string that is defined when registering
   *                             an event.
   * @returns {boolean} The existence state of given key string.
   */
  _shortcutAlreadyExist(keyString) {
    if (this._getModifiersCount(keyString) === 0) {
      for (const shortcut of this._singleKey) {
        if (shortcut.keyString === keyString) {
          return true;
        }
      }
    } else {
      for (const shortcut of this._multiKey) {
        if (shortcut.keyString === keyString) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * @description This method is the entry point to register a shortcut. The caller must
   *              send the key combination as a string (i.e., `F`, `Ctrl+Shift+R`). The
   *              shortcut singleton is case insensitive, which means you can write it
   *              with the case you want. For modifiers, please use `Ctrl`, `Alt`, and
   *              `Shift` strings. Then the given callback will be called each time the
   *              key stroke matches the shortcut key string.
   *
   * @param {string} keyString - The raw shortcut string that is defined when registering
   *                             an event.
   * @param {function} fire    - The callback to attach to the shortcut.
   */
  register(keyString, fire) {
    if (typeof keyString !== 'string' || typeof fire !== 'function') {
      return;
    }

    if (!this._shortcutAlreadyExist(keyString)) {
      /** First shortcut to be registered; listen to keyboard key down event. */
      if (this._singleKey.length === 0 && this._multiKey.length === 0) {
        this._addEvents();
      }

      const shortcut = {
        keyString: keyString,
        modifiers: {
          ctrlKey: /ctrl/i.test(keyString),
          altKey: /alt/i.test(keyString),
          shiftKey: /shift/i.test(keyString),
        },
        modifierCount: this._getModifiersCount(keyString),
        key: keyString
          .toLowerCase()
          .replace('ctrl', '')
          .replace('alt', '')
          .replace('shift', '')
          .replaceAll(' ', '')
          .replaceAll('+', ''),
        paused: false,
        fire: fire,
      };

      if (this._getModifiersCount(keyString) === 0) {
        this._singleKey.push(shortcut);
      } else {
        this._multiKey.push(shortcut);
      }
    }
  }

  /**
   * @description This method will remove a registered shortcut using its key string.
   *
   * @param {string} keyString - The raw shortcut string that is defined when registering
   *                             an event.
   */
  remove(keyString) {
    if (typeof keyString !== 'string') {
      return;
    }

    if (this._getModifiersCount(keyString) === 0) {
      for (let i = this._singleKey.length - 1; i >= 0; i--) {
        if (this._singleKey[i].keyString === keyString) {
          this._singleKey.splice(i, 1);
        }
      }
    } else {
      for (let i = this._multiKey.length - 1; i >= 0; i--) {
        if (this._multiKey[i].keyString === keyString) {
          this._multiKey.splice(i, 1);
        }
      }
    }

    /** In case there are no remaining shortcut, we remove listener on keyboard's event. */
    if (this._singleKey.length === 0 && this._multiKey.length === 0) {
      this._removeEvents();
    }
  }

  /**
   * @description Remove all registered shortcut events.
   */
  removeAll() {
    this._singleKey = [];
    this._multiKey = [];
    this._removeEvents();
  }

  /**
   * @description This method will pause a registered shortcut using its key string. The
   *              shortcut won't then fire the callback when the shortcut is used.
   *
   * @param {string} keyString - The raw shortcut string that is defined when registering
   *                             an event.
   */
  pause(keyString) {
    if (typeof keyString === 'string') {
      this._setOnePauseFlag(keyString, true);
    }
  }

  /**
   * @description This method will resume a registered shortcut using its key string. The
   *              shortcut won't then fire the callback when the shortcut is used.
   *
   * @param {string} keyString - The raw shortcut string that is defined when registering
   *                             an event.
   */
  resume(keyString) {
    if (typeof keyString === 'string') {
      this._setOnePauseFlag(keyString, false);
    }
  }

  /**
   * @description This method will pause all registered shortcuts.
   *
   * @param {string} keyString - The raw shortcut string that is defined when registering
   *                             an event.
   */
  pauseAll() {
    this._setAllPauseFlag(true);
  }

  /**
   * @description This method will resume all registered shortcuts.
   *
   * @param {string} keyString - The raw shortcut string that is defined when registering
   *                             an event.
   */
  resumeAll() {
    this._setAllPauseFlag(false);
  }

  /**
   * @description This method will update the singleton's listener for a given keyboard event.
   *
   * @param {string} keyEvent - The key event to apply to the DOM listener in
   *                            ('keydown', 'keypress', 'keyup').
   */
  updateKeyEvent(keyEvent) {
    if (
      typeof keyEvent !== 'string' ||
      ['keydown', 'keyup', 'keypress'].indexOf(keyEvent) === -1
    ) {
      keyEvent = 'keydown';
    }
    this._removeEvents();
    this._keyEvent = keyEvent;
    this._addEvents();
  }

  /**
   * @description This method will update the auto repeat flag that makes an event
   *              continuously callback when the kye is held pushed.
   *
   * @param {boolean} autoRepeat - The auto repeat state to set.
   */
  updateAutoRepeat(autoRepeat) {
    if (typeof autoRepeat !== 'boolean') {
      autoRepeat = true;
    }
    this._autoRepeat = autoRepeat;
  }
}

export default Shortcut;
