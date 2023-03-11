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

import React, { useState, useEffect, useReducer } from 'react';

import { Icon } from '../../components/index.jsx';
import { i18n } from '../../i18n/index.js';

import { Container } from './style/styles.jsx';

const MAX_LOG_SIZE = 100;

class LoggerAPI {
  #record = [];
  #recycle = [];
  #maxSize = null;

  initVal = '';

  constructor(props = {}) {
    const { maxSize = MAX_LOG_SIZE } = props;
    this.#maxSize = maxSize;
  }

  push(value) {
    const result = this.#record.push(value);
    while (this.#record.length > this.#maxSize) this.#record.shift();
    return result;
  }

  get() {
    return this.#record;
  }

  getLast() {
    const { length } = this.#record;
    return this.#record[length - 1];
  }

  undo(skipText) {
    const current = this.#record.pop();
    if (typeof current === 'undefined') return this.initVal;
    if (current !== skipText) {
      this.#recycle.push(current);
      return current;
    }

    const last = this.#record.pop();
    if (typeof last === 'undefined') {
      this.#recycle.push(current);
      return this.initVal;
    }
    this.#recycle.push(current);
    return last;
  }

  redo() {
    const history = this.#recycle.pop();
    if (typeof history !== 'undefined') {
      this.push(history);
      return history;
    }
    return undefined;
  }

  clenRedo() {
    this.#recycle = [];
  }

  getUndoCount() {
    return this.#record.length;
  }

  getRedoCount() {
    return this.#recycle.length;
  }
}

Logger.pluginName = 'logger';
Logger.align = 'left';

function Logger({ ...props }) {
  const logger = new LoggerAPI({ maxSize: props.editorConfigs.loggerMaxSize });
  const timerId = null;

  const [lastPop, setLastPop] = useState(null);

  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const pause = () => {
    if (timerId) {
      window.clearTimeout(timerId);
      timerId = 0;
    }
  };

  const handleUndo = () => {
    const last = logger.undo(props.editorState.text);
    if (typeof last === 'undefined') return;
    pause();
    setLastPop(last);
    props.editorHooks.setText(last);
  };

  const handleRedo = () => {
    const last = logger.redo();
    if (typeof last === 'undefined') return;
    setLastPop(last);
    props.editorHooks.setText(last);
  };

  props.editor.registerPluginApi('undo', handleUndo);
  props.editor.registerPluginApi('redo', handleRedo);

  const handleKeyboards = [
    { key: 'y', keyCode: 89, withKey: ['ctrlKey'], callback: handleRedo },
    {
      key: 'z',
      keyCode: 90,
      withKey: ['metaKey', 'shiftKey'],
      callback: handleRedo,
    },
    {
      key: 'z',
      keyCode: 90,
      aliasCommand: true,
      withKey: ['ctrlKey'],
      callback: handleUndo,
    },
  ];

  const handleChange = (value, e, isNotInput) => {
    if (logger.getLast() === value || (lastPop !== null && lastPop === null)) {
      return;
    }
    logger.clenRedo();
    if (isNotInput) {
      logger.push(value);
      setLastPop(null);
      return;
    }
    if (timerId) {
      window.clearTimeout(timerId);
      timerId = 0;
    }
    timerId = window.setTimeout(() => {
      if (logger.getLast() !== value) {
        logger.push(value);
        setLastPop(null);
        forceUpdate();
      }
      window.clearTimeout(timerId);
      timerId = 0;
    }, props.editorConfigs.loggerInterval);
  };

  useEffect(() => {
    props.editor.on('change', handleChange);
    handleKeyboards.forEach((keyboard) => props.editor.onKeyboard(keyboard));
    logger.initVal = props.editorState.text;
    forceUpdate();

    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
        timerId = 0;
      }
      props.editor.off('change', handleChange);
      props.editor.unregisterPluginApi('undo');
      props.editor.unregisterPluginApi('redo');
      handleKeyboards.forEach((keyboard) => props.editor.offKeyboard(keyboard));
    };
  }, []);

  const hasUndo =
    logger.getUndoCount() > 1 || logger.initValue !== props.editorState.text;
  const hasRedo = logger.getRedoCount() > 0;

  return (
    <>
      <Container
        className={hasUndo ? '' : 'disabled'}
        title={i18n.get('btnUndo')}
        onClick={handleUndo}
      >
        <Icon type="undo" />
      </Container>
      <Container
        className={hasRedo ? '' : 'disabled'}
        title={i18n.get('btnRedo')}
        onClick={handleRedo}
      >
        <Icon type="redo" />
      </Container>
    </>
  );
}

export default Logger;
