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

import Shortcut from '../../../lib/shortcut.js/shortcut.js';

let AppShortcut = null;

describe('Shortcut Jest', () => {
  afterEach(() => {
    AppShortcut.destroy();
    AppShortcut = null;
  });

  it('Component construction', (done) => {
    AppShortcut = new Shortcut();
    // Component existence
    expect(AppShortcut).not.toEqual(undefined);
    expect(AppShortcut).not.toEqual(null);
    expect(AppShortcut).toEqual(Shortcut.instance);
    // Component proper construction
    expect(AppShortcut._keyEvent).toEqual('keydown');
    expect(AppShortcut._autoRepeat).toEqual(true);
    expect(AppShortcut._singleKey).toEqual([]);
    expect(AppShortcut._multiKey).toEqual([]);
    expect(AppShortcut.version).toEqual('1.0.0');

    done();
  });

  it('Component construction with invalid parameters', (done) => {
    AppShortcut = new Shortcut({
      keyEvent: () => {},
      autoRepeat: () => {},
    });
    // Component existence
    expect(AppShortcut).not.toEqual(undefined);
    expect(AppShortcut).not.toEqual(null);
    expect(AppShortcut).toEqual(Shortcut.instance);
    // Component proper construction
    expect(AppShortcut._keyEvent).toEqual('keydown');
    expect(AppShortcut._autoRepeat).toEqual(true);

    done();
  });

  it('Component construction for singleton pattern', (done) => {
    AppShortcut = new Shortcut();
    // Component existence
    expect(AppShortcut).not.toEqual(undefined);
    expect(AppShortcut).not.toEqual(null);
    // Component proper construction
    expect(AppShortcut._keyEvent).toEqual('keydown');
    expect(AppShortcut._autoRepeat).toEqual(true);
    // Reinstantiation, will not update any properties
    AppShortcut = new Shortcut({
      keyEvent: 'keyup',
      autoRepeat: false,
    });
    // Component existence
    expect(AppShortcut).not.toEqual(undefined);
    expect(AppShortcut).not.toEqual(null);
    // Component same set of argument as first instantiation
    expect(AppShortcut._keyEvent).toEqual('keydown');
    expect(AppShortcut._autoRepeat).toEqual(true);

    done();
  });

  /**
   * No need to test destroy as if it didn't work, previous test would have failed.
   */
  it('Private method _addEvents', (done) => {
    jest.spyOn(document, 'addEventListener').mockImplementation((keyEvent) => {
      expect(keyEvent).toEqual('keydown');
      done();
    });

    AppShortcut = new Shortcut();
    AppShortcut._addEvents();
  });

  it('Private method _addEvents with custom key event', (done) => {
    jest.spyOn(document, 'addEventListener').mockImplementation((keyEvent) => {
      expect(keyEvent).toEqual('keyup');
      done();
    });

    AppShortcut = new Shortcut({
      keyEvent: 'keyup',
    });
    AppShortcut._addEvents();
  });

  it('Private method _addEvents with unsupported key event', (done) => {
    jest.spyOn(document, 'addEventListener').mockImplementation((keyEvent) => {
      expect(keyEvent).toEqual('keydown');
      done();
    });

    AppShortcut = new Shortcut({
      keyEvent: 'keybottom',
    });
    AppShortcut._addEvents();
  });

  it('Private method _removeEvents', (done) => {
    jest
      .spyOn(document, 'removeEventListener')
      .mockImplementation((keyEvent) => {
        expect(keyEvent).toEqual('keydown');
        done();
      });

    AppShortcut = new Shortcut();
    AppShortcut._addEvents();
    AppShortcut._removeEvents();
  });

  it('Private method _removeEvents with custom key event', (done) => {
    jest
      .spyOn(document, 'removeEventListener')
      .mockImplementation((keyEvent) => {
        expect(keyEvent).toEqual('keyup');
        done();
      });

    AppShortcut = new Shortcut({
      keyEvent: 'keyup',
    });
    AppShortcut._addEvents();
    AppShortcut._removeEvents();
  });

  it('Private method _removeEvents with unsupported key event', (done) => {
    jest
      .spyOn(document, 'removeEventListener')
      .mockImplementation((keyEvent) => {
        expect(keyEvent).toEqual('keydown');
        done();
      });

    AppShortcut = new Shortcut({
      keyEvent: 'keybottom',
    });
    AppShortcut._addEvents();
    AppShortcut._removeEvents();
  });

  it('Private method _testShortcuts', (done) => {
    const virtualEvent = {
      repeat: false,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
    };

    AppShortcut = new Shortcut();

    jest.spyOn(AppShortcut, '_singleKeyEvent').mockImplementation((event) => {
      expect(event).toEqual(virtualEvent);
      expect(AppShortcut._multiKeyEvent).not.toHaveBeenCalled();
      done();
    });
    jest.spyOn(AppShortcut, '_multiKeyEvent');

    AppShortcut._testShortcuts(virtualEvent);
  });

  it('Private method _testShortcuts with auto repeat', (done) => {
    const virtualEvent = {
      repeat: true,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      preventDefault: () => {
        expect(AppShortcut._singleKeyEvent).not.toHaveBeenCalled();
        expect(AppShortcut._multiKeyEvent).not.toHaveBeenCalled();
        done();
      },
    };

    AppShortcut = new Shortcut({
      autoRepeat: false,
    });

    jest.spyOn(AppShortcut, '_singleKeyEvent');
    jest.spyOn(AppShortcut, '_multiKeyEvent');

    AppShortcut._testShortcuts(virtualEvent);
  });

  it('Private method _singleKeyEvent', (done) => {
    const virtualEvent = {
      key: 'F',
      preventDefault: () => {},
    };

    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {
      expect(virtualEvent.preventDefault).toHaveBeenCalled();
      expect(AppShortcut._singleKeyEvent).toHaveBeenCalled();
      expect(AppShortcut._multiKeyEvent).not.toHaveBeenCalled();
      done();
    });

    jest.spyOn(virtualEvent, 'preventDefault');
    jest.spyOn(AppShortcut, '_singleKeyEvent');
    jest.spyOn(AppShortcut, '_multiKeyEvent');

    AppShortcut._singleKeyEvent(virtualEvent);
  });

  it('Private method _singleKeyEvent with paused shortcut', (done) => {
    const virtualEvent = {
      key: 'F',
      preventDefault: () => {
        expect(false).toEqual(true); // Should not pass here.
      },
    };

    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {
      expect(false).toEqual(true); // Should not pass here either.
    });
    AppShortcut.pause('F');

    jest.spyOn(virtualEvent, 'preventDefault');
    jest.spyOn(AppShortcut, '_singleKeyEvent');
    jest.spyOn(AppShortcut, '_multiKeyEvent');

    AppShortcut._singleKeyEvent(virtualEvent);

    window.setTimeout(() => {
      expect(virtualEvent.preventDefault).not.toHaveBeenCalled();
      expect(AppShortcut._singleKeyEvent).toHaveBeenCalled();
      expect(AppShortcut._multiKeyEvent).not.toHaveBeenCalled();
      done();
    });
  });

  it('Private method _multiKeyEvent', (done) => {
    const virtualEvent = {
      key: 'F',
      ctrlKey: true,
      altKey: false,
      shiftKey: false,
      preventDefault: () => {},
    };

    AppShortcut = new Shortcut();
    AppShortcut.register('Ctrl+F', () => {
      expect(virtualEvent.preventDefault).toHaveBeenCalled();
      expect(AppShortcut._singleKeyEvent).not.toHaveBeenCalled();
      expect(AppShortcut._multiKeyEvent).toHaveBeenCalled();
      done();
    });

    jest.spyOn(virtualEvent, 'preventDefault');
    jest.spyOn(AppShortcut, '_singleKeyEvent');
    jest.spyOn(AppShortcut, '_multiKeyEvent');

    AppShortcut._multiKeyEvent(virtualEvent);
  });

  it('Private method _multiKeyEvent with 2 modifiers', (done) => {
    const virtualEvent = {
      key: 'F',
      ctrlKey: true,
      altKey: true,
      shiftKey: false,
      preventDefault: () => {},
    };

    AppShortcut = new Shortcut();
    AppShortcut.register('Ctrl+Alt+F', () => {
      expect(virtualEvent.preventDefault).toHaveBeenCalled();
      expect(AppShortcut._singleKeyEvent).not.toHaveBeenCalled();
      expect(AppShortcut._multiKeyEvent).toHaveBeenCalled();
      done();
    });

    jest.spyOn(virtualEvent, 'preventDefault');
    jest.spyOn(AppShortcut, '_singleKeyEvent');
    jest.spyOn(AppShortcut, '_multiKeyEvent');

    AppShortcut._multiKeyEvent(virtualEvent);
  });

  it('Private method _multiKeyEvent with 3 modifiers', (done) => {
    const virtualEvent = {
      key: 'F',
      ctrlKey: true,
      altKey: true,
      shiftKey: true,
      preventDefault: () => {},
    };

    AppShortcut = new Shortcut();
    AppShortcut.register('Ctrl+Alt+Shift+F', () => {
      expect(virtualEvent.preventDefault).toHaveBeenCalled();
      expect(AppShortcut._singleKeyEvent).not.toHaveBeenCalled();
      expect(AppShortcut._multiKeyEvent).toHaveBeenCalled();
      done();
    });

    jest.spyOn(virtualEvent, 'preventDefault');
    jest.spyOn(AppShortcut, '_singleKeyEvent');
    jest.spyOn(AppShortcut, '_multiKeyEvent');

    AppShortcut._multiKeyEvent(virtualEvent);
  });

  it('Private method _multiKeyEvent with paused shortcut', (done) => {
    const virtualEvent = {
      key: 'F',
      ctrlKey: true,
      altKey: true,
      shiftKey: true,
      preventDefault: () => {
        expect(false).toEqual(true); // Should not pass here.
      },
    };

    AppShortcut = new Shortcut();
    AppShortcut.register('Ctrl+Alt+Shift+F', () => {
      expect(false).toEqual(true); // Should not pass here either.
    });
    AppShortcut.pause('Ctrl+Alt+Shift+F');

    jest.spyOn(virtualEvent, 'preventDefault');
    jest.spyOn(AppShortcut, '_singleKeyEvent');
    jest.spyOn(AppShortcut, '_multiKeyEvent');

    AppShortcut._multiKeyEvent(virtualEvent);

    window.setTimeout(() => {
      expect(virtualEvent.preventDefault).not.toHaveBeenCalled();
      expect(AppShortcut._singleKeyEvent).not.toHaveBeenCalled();
      expect(AppShortcut._multiKeyEvent).toHaveBeenCalled();
      done();
    });
  });

  it('Private method _getModifiersCount', (done) => {
    AppShortcut = new Shortcut();
    expect(AppShortcut._getModifiersCount('F')).toEqual(0);
    expect(AppShortcut._getModifiersCount('aLt')).toEqual(1);
    expect(AppShortcut._getModifiersCount('ctrl+shift')).toEqual(2);
    expect(AppShortcut._getModifiersCount('Ctrl+Alt+Shift')).toEqual(3);
    expect(AppShortcut._getModifiersCount('CtRlAlTsHiFt')).toEqual(3);
    expect(AppShortcut._getModifiersCount('CtrlAltShit')).toEqual(2);
    done();
  });

  it('Private method _setAllPauseFlag', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {});
    AppShortcut.register('Ctrl+F', () => {});

    jest.spyOn(AppShortcut, '_setOnePauseFlag');

    AppShortcut._setAllPauseFlag(true);
    expect(AppShortcut._singleKey[0].pause).toEqual(true);
    expect(AppShortcut._multiKey[0].pause).toEqual(true);
    expect(AppShortcut._setOnePauseFlag).toHaveBeenCalled();
    AppShortcut._setAllPauseFlag(false);
    expect(AppShortcut._singleKey[0].pause).toEqual(false);
    expect(AppShortcut._multiKey[0].pause).toEqual(false);
    done();
  });

  it('Private method _setOnePauseFlag for single key shortcut', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {});

    jest.spyOn(AppShortcut, '_getModifiersCount');

    AppShortcut._setOnePauseFlag('F', true);
    expect(AppShortcut._singleKey[0].pause).toEqual(true);
    expect(AppShortcut._getModifiersCount).toHaveBeenCalled();
    AppShortcut._setOnePauseFlag('F', false);
    expect(AppShortcut._singleKey[0].pause).toEqual(false);
    done();
  });

  it('Private method _setOnePauseFlag for multi key shortcut', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('Ctrl+F', () => {});

    jest.spyOn(AppShortcut, '_getModifiersCount');

    AppShortcut._setOnePauseFlag('Ctrl+F', true);
    expect(AppShortcut._multiKey[0].pause).toEqual(true);
    expect(AppShortcut._getModifiersCount).toHaveBeenCalled();
    AppShortcut._setOnePauseFlag('Ctrl+F', false);
    expect(AppShortcut._multiKey[0].pause).toEqual(false);
    done();
  });

  it('Private method _shortcutAlreadyExist', (done) => {
    AppShortcut = new Shortcut();
    jest.spyOn(AppShortcut, '_getModifiersCount');
    expect(AppShortcut._shortcutAlreadyExist('F')).toEqual(false);
    AppShortcut.register('F', () => {});
    expect(AppShortcut._shortcutAlreadyExist('F')).toEqual(true);
    expect(AppShortcut._shortcutAlreadyExist('Ctrl+F')).toEqual(false);
    AppShortcut.register('Ctrl+F', () => {});
    expect(AppShortcut._shortcutAlreadyExist('Ctrl+F')).toEqual(true);
    expect(AppShortcut._getModifiersCount).toHaveBeenCalled();
    done();
  });

  it('Public method register', (done) => {
    AppShortcut = new Shortcut();
    jest.spyOn(AppShortcut, '_shortcutAlreadyExist');
    jest.spyOn(AppShortcut, '_addEvents');
    jest.spyOn(AppShortcut, '_getModifiersCount');

    const method = () => {};

    AppShortcut.register('F', method);

    expect(AppShortcut._shortcutAlreadyExist).toHaveBeenCalled();
    expect(AppShortcut._addEvents).toHaveBeenCalled();
    expect(AppShortcut._getModifiersCount).toHaveBeenCalled();
    expect(AppShortcut._singleKey[0]).toEqual({
      keyString: 'F',
      modifiers: {
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
      },
      modifierCount: 0,
      key: 'f',
      paused: false,
      fire: method,
    });

    AppShortcut.removeAll();
    AppShortcut.register('Ctrl+F', method);

    expect(AppShortcut._multiKey[0]).toEqual({
      keyString: 'Ctrl+F',
      modifiers: {
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
      },
      modifierCount: 1,
      key: 'f',
      paused: false,
      fire: method,
    });

    AppShortcut.removeAll();
    AppShortcut.register('Alt+F', method);

    expect(AppShortcut._multiKey[0]).toEqual({
      keyString: 'Alt+F',
      modifiers: {
        ctrlKey: false,
        altKey: true,
        shiftKey: false,
      },
      modifierCount: 1,
      key: 'f',
      paused: false,
      fire: method,
    });

    AppShortcut.removeAll();
    AppShortcut.register('Shift+F', method);

    expect(AppShortcut._multiKey[0]).toEqual({
      keyString: 'Shift+F',
      modifiers: {
        ctrlKey: false,
        altKey: false,
        shiftKey: true,
      },
      modifierCount: 1,
      key: 'f',
      paused: false,
      fire: method,
    });

    done();
  });

  it('Public method register with invalid parameters', (done) => {
    AppShortcut = new Shortcut();

    jest.spyOn(AppShortcut, '_shortcutAlreadyExist');
    jest.spyOn(AppShortcut, '_addEvents');
    jest.spyOn(AppShortcut, '_getModifiersCount');

    const method = () => {};

    AppShortcut.register();

    expect(AppShortcut._shortcutAlreadyExist).not.toHaveBeenCalled();
    expect(AppShortcut._addEvents).not.toHaveBeenCalled();
    expect(AppShortcut._getModifiersCount).not.toHaveBeenCalled();
    expect(AppShortcut._singleKey.length).toEqual(0);
    expect(AppShortcut._multiKey.length).toEqual(0);

    AppShortcut.register('F');

    expect(AppShortcut._shortcutAlreadyExist).not.toHaveBeenCalled();
    expect(AppShortcut._addEvents).not.toHaveBeenCalled();
    expect(AppShortcut._getModifiersCount).not.toHaveBeenCalled();
    expect(AppShortcut._singleKey.length).toEqual(0);
    expect(AppShortcut._multiKey.length).toEqual(0);

    AppShortcut.register(false, () => {});

    expect(AppShortcut._shortcutAlreadyExist).not.toHaveBeenCalled();
    expect(AppShortcut._addEvents).not.toHaveBeenCalled();
    expect(AppShortcut._getModifiersCount).not.toHaveBeenCalled();
    expect(AppShortcut._singleKey.length).toEqual(0);
    expect(AppShortcut._multiKey.length).toEqual(0);

    AppShortcut.register('F', 'gg=G');

    expect(AppShortcut._shortcutAlreadyExist).not.toHaveBeenCalled();
    expect(AppShortcut._addEvents).not.toHaveBeenCalled();
    expect(AppShortcut._getModifiersCount).not.toHaveBeenCalled();
    expect(AppShortcut._singleKey.length).toEqual(0);
    expect(AppShortcut._multiKey.length).toEqual(0);

    done();
  });

  it('Public method remove', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {});

    jest.spyOn(AppShortcut, '_getModifiersCount');
    jest.spyOn(AppShortcut, '_removeEvents');
    expect(AppShortcut._singleKey.length).toEqual(1);
    expect(AppShortcut._multiKey.length).toEqual(0);

    AppShortcut.remove('F');

    expect(AppShortcut._getModifiersCount).toHaveBeenCalled();
    expect(AppShortcut._removeEvents).toHaveBeenCalled();
    expect(AppShortcut._singleKey.length).toEqual(0);
    expect(AppShortcut._multiKey.length).toEqual(0);

    AppShortcut.register('Ctrl+F', () => {});

    expect(AppShortcut._singleKey.length).toEqual(0);
    expect(AppShortcut._multiKey.length).toEqual(1);

    AppShortcut.remove('Ctrl+F');

    expect(AppShortcut._singleKey.length).toEqual(0);
    expect(AppShortcut._multiKey.length).toEqual(0);

    done();
  });

  it('Public method remove with wrong arguments', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {});

    jest.spyOn(AppShortcut, '_getModifiersCount');
    jest.spyOn(AppShortcut, '_removeEvents');
    expect(AppShortcut._singleKey.length).toEqual(1);
    expect(AppShortcut._multiKey.length).toEqual(0);

    AppShortcut.remove();

    expect(AppShortcut._getModifiersCount).not.toHaveBeenCalled();
    expect(AppShortcut._removeEvents).not.toHaveBeenCalled();
    expect(AppShortcut._singleKey.length).toEqual(1);
    expect(AppShortcut._multiKey.length).toEqual(0);

    AppShortcut.remove(() => {});

    expect(AppShortcut._singleKey.length).toEqual(1);
    expect(AppShortcut._multiKey.length).toEqual(0);

    done();
  });

  it('Public method removeAll', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {});
    AppShortcut.register('Ctrl+F', () => {});

    jest.spyOn(AppShortcut, '_removeEvents');
    expect(AppShortcut._singleKey.length).toEqual(1);
    expect(AppShortcut._multiKey.length).toEqual(1);

    AppShortcut.removeAll();

    expect(AppShortcut._removeEvents).toHaveBeenCalled();
    expect(AppShortcut._singleKey.length).toEqual(0);
    expect(AppShortcut._multiKey.length).toEqual(0);

    done();
  });

  it('Public method pause', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {});

    AppShortcut.pause('F');

    expect(AppShortcut._singleKey[0].pause).toEqual(true);

    AppShortcut.resume('F');

    jest
      .spyOn(AppShortcut, '_setOnePauseFlag')
      .mockImplementation((keyString, value) => {
        expect(keyString).toEqual('F');
        expect(value).toEqual(true);
        done();
      });

    AppShortcut.pause('F');
  });

  it('Public method pause with wrong parameters', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {});

    jest.spyOn(AppShortcut, '_setOnePauseFlag');

    AppShortcut.pause();

    expect(AppShortcut._setOnePauseFlag).not.toHaveBeenCalled();

    AppShortcut.pause(() => {});

    expect(AppShortcut._setOnePauseFlag).not.toHaveBeenCalled();
    done();
  });

  it('Public method resume', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {});

    AppShortcut.pause('F');
    AppShortcut.resume('F');

    expect(AppShortcut._singleKey[0].pause).toEqual(false);

    AppShortcut.pause('F');

    jest
      .spyOn(AppShortcut, '_setOnePauseFlag')
      .mockImplementation((keyString, value) => {
        expect(keyString).toEqual('F');
        expect(value).toEqual(false);
        done();
      });

    AppShortcut.resume('F');
  });

  it('Public method resume with wrong parameters', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {});

    jest.spyOn(AppShortcut, '_setOnePauseFlag');

    AppShortcut.resume();

    expect(AppShortcut._setOnePauseFlag).not.toHaveBeenCalled();

    AppShortcut.resume(() => {});

    expect(AppShortcut._setOnePauseFlag).not.toHaveBeenCalled();
    done();
  });

  it('Public method pauseAll', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {});
    AppShortcut.register('Ctrl+F', () => {});

    AppShortcut.pauseAll();

    expect(AppShortcut._singleKey[0].pause).toEqual(true);
    expect(AppShortcut._multiKey[0].pause).toEqual(true);

    AppShortcut.resumeAll();

    jest.spyOn(AppShortcut, '_setAllPauseFlag').mockImplementation((value) => {
      expect(value).toEqual(true);
      done();
    });

    AppShortcut.pauseAll();
  });

  it('Public method resumeAll', (done) => {
    AppShortcut = new Shortcut();
    AppShortcut.register('F', () => {});
    AppShortcut.register('Ctrl+F', () => {});

    AppShortcut.pauseAll();
    AppShortcut.resumeAll();

    expect(AppShortcut._singleKey[0].pause).toEqual(false);
    expect(AppShortcut._multiKey[0].pause).toEqual(false);

    AppShortcut.pauseAll();

    jest.spyOn(AppShortcut, '_setAllPauseFlag').mockImplementation((value) => {
      expect(value).toEqual(false);
      done();
    });

    AppShortcut.resumeAll();
  });

  it('Public method updateKeyEvent', (done) => {
    AppShortcut = new Shortcut();

    jest.spyOn(document, 'addEventListener').mockImplementation((keyEvent) => {
      expect(keyEvent).toEqual('keyup');
      done();
    });

    AppShortcut.updateKeyEvent('keyup');
  });

  it('Public method updateKeyEvent with wrong parameters', (done) => {
    AppShortcut = new Shortcut();

    jest.spyOn(document, 'addEventListener').mockImplementation((keyEvent) => {
      expect(keyEvent).toEqual('keydown');
    });

    AppShortcut.updateKeyEvent();
    AppShortcut.updateKeyEvent(() => {});
    AppShortcut.updateKeyEvent('keybottom');

    done();
  });

  it('Public method updateAutoRepeat', (done) => {
    AppShortcut = new Shortcut();
    expect(AppShortcut._autoRepeat).toEqual(true);
    AppShortcut.updateAutoRepeat(false);
    expect(AppShortcut._autoRepeat).toEqual(false);
    AppShortcut.updateAutoRepeat(true);
    expect(AppShortcut._autoRepeat).toEqual(true);
    done();
  });

  it('Public method updateAutoRepeat with wrong parameters', (done) => {
    AppShortcut = new Shortcut();
    expect(AppShortcut._autoRepeat).toEqual(true);
    AppShortcut.updateAutoRepeat();
    expect(AppShortcut._autoRepeat).toEqual(true);
    AppShortcut.updateAutoRepeat(() => {});
    expect(AppShortcut._autoRepeat).toEqual(true);
    done();
  });
});
