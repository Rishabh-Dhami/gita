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

import React, { createRef, useEffect, useState, useReducer } from 'react';
import PropTypes from 'prop-types';

import { v4 as uuidv4 } from 'uuid';

import { i18n } from '../i18n/index.js';
import mergeConfigs from '../utils/merge-configs.js';
import { decorateIt } from '../utils/decorate.js';
import { getUploadPlaceholder } from '../utils/uploadPlaceholder.js';
import { Divider as DividerPlugin } from '../plugins/index.jsx';
import { isKeyMatch, getLineAndCol } from '../utils/tools.js';
import Emitter, { globalEventEmitter } from '../share/emitter.js';
import { NavigationBar, Icon, Toolbar } from '../components/index.jsx';

import LOGGER from '../../../lib/logger/logger.js';
import { defaultConfigs } from './configs.js';

import HtmlRenderer from './preview/index.jsx';

import {
  MarkdownEditorContainer,
  MarkdownEditorContainerInner,
  MarkdownEditorPreviewContainer,
  MarkdownEditorTextAreaContainer,
} from './styles/styles.jsx';

// Global object for storing `MarkdownEditor` plugins.
//
// All plugins are stored in the form of {component, configs}, where component
// is the plugin itself and configs are its respective configurations.
//
// All of the `props` for the plugin component are stored in the `configs`
// object.
MarkdownEditor.Plugins = [];

/**
 * @function usePlugin() - Adds a plugin to the `MarkdownEditor`.
 *
 * If the function is called on the same component more than once then the
 * component will update itself in the `Plugins` list.
 */
MarkdownEditor.usePlugin = (component, configs = {}) => {
  for (let i = 0; i < MarkdownEditor.Plugins.length; ++i) {
    if (MarkdownEditor.Plugins[i].component === component) {
      MarkdownEditor.Plugins.splice(i, 1, { component, configs });
      return;
    }
  }
  MarkdownEditor.Plugins.push({ component, configs });
};

/**
 * @function unusePlugin() - Removes a plugin from the `Plugins` list.
 */
MarkdownEditor.unusePlugin = (component) => {
  for (let i = 0; i < MarkdownEditor.Plugins.length; ++i) {
    if (MarkdownEditor.Plugins[i].component === component) {
      MarkdownEditor.Plugins.splice(i, 1);
      return;
    }
  }
};

/**
 * @function unuseAllPlugins() - Removes all the plugins from the `Plugins` list.
 */
MarkdownEditor.unuseAllPlugins = () => {
  MarkdownEditor.Plugins = [];
};

// This object will help in emitting events globally and executing respective
// registered functions to those events.
//
// All of the event functions are registered using the `MarkdownEditor.on`
// function and can be un-registered with the `MarkdownEditor.off` function.
MarkdownEditor.emitter = new Emitter();

/**
 * @function _eventType() - Private function translates event string to `Emitter`
 *                          event.
 */
MarkdownEditor._eventType = (event) => {
  switch (event) {
    case 'change':
      return MarkdownEditor.emitter.EVENT_CHANGE;
    case 'fullscreen':
      return MarkdownEditor.emitter.EVENT_FULL_SCREEN;
    case 'viewchange':
      return MarkdownEditor.emitter.EVENT_VIEW_CHANGE;
    case 'keydown':
      return MarkdownEditor.emitter.EVENT_KEY_DOWN;
    case 'editor_keydown':
      return MarkdownEditor.emitter.EVENT_EDITOR_KEY_DOWN;
    case 'blur':
      return MarkdownEditor.emitter.EVENT_BLUR;
    case 'focus':
      return MarkdownEditor.emitter.EVENT_FOCUS;
    case 'scroll':
      return MarkdownEditor.emitter.EVENT_SCROLL;
    case 'lang_change':
      return MarkdownEditor.emitter.EVENT_LANG_CHANGE;
  }
};

/**
 * @function on() - Registry function for events with their respective callback.
 *
 * This function binds a event with the event listener function and calls that
 * function on the event emittion.
 */
MarkdownEditor.on = (event, callback) => {
  const eventType = MarkdownEditor._eventType(event);
  if (eventType) MarkdownEditor.emitter.on(eventType, callback);
};

/**
 * @function off() - Un-registers the event function.
 *
 * This function unbinds the event listener function from a event, so despite of
 * the event being emitted this function will not be executed.
 */
MarkdownEditor.off = (event, callback) => {
  const eventType = MarkdownEditor._eventType(event);
  if (eventType) MarkdownEditor.emitter.off(eventType, callback);
};

// Global list of keyboard listeners.
//
// A keyboard listener consists of the key to which it must respond and its key
// code, also it consists of list of keys that could be included with a keydown
// event and finally a callback that will respond to the keydown event.
//
// listener = {key, keyCode, aliasCommand, withKey, callback}
MarkdownEditor.keyboardListeners = [];

/**
 * @function onKeyboard() - Registers a listener in the `keyboardListeners` list.
 */
MarkdownEditor.onKeyboard = (listener) => {
  if (Array.isArray(listener)) {
    listener.forEach((it) => onKeyboard(it));
    return;
  }
  if (!MarkdownEditor.keyboardListeners.includes(listener)) {
    MarkdownEditor.keyboardListeners.push(listener);
  }
};

/**
 * @function offKeyboard() - Unregisters a listener from the `keyboardListeners`
 *                           list.
 */
MarkdownEditor.offKeyboard = (listener) => {
  if (Array.isArray(listener)) {
    listener.forEach((it) => offKeyboard(it));
    return;
  }
  const index = MarkdownEditor.keyboardListeners.indexOf(listener);
  if (index >= 0) {
    MarkdownEditor.keyboardListeners.splice(index, 1);
  }
};

MarkdownEditor.PluginApis = new Map();

MarkdownEditor.registerPluginApi = (name, callback) => {
  MarkdownEditor.PluginApis.set(name, callback);
};

MarkdownEditor.unregisterPluginApi = (name) => {
  MarkdownEditor.PluginApis.delete(name);
};

MarkdownEditor.callPluginApi = (name, ...props) => {
  const handler = MarkdownEditor.PluginApis.get(name);
  if (!handler) throw new Error(`API ${name} not found`);
  return handler(...props);
};

function MarkdownEditor({ ...props }) {
  const logger = new LOGGER(
    MarkdownEditor.name,
    props?.debug === true ? LOGGER.DEBUG : LOGGER.OFF
  );

  const configs = mergeConfigs(defaultConfigs, props?.configs);

  const [text, setText] = useState(props?.text || '');
  const [html, setHtml] = useState(props?.html);
  const [view, setView] = useState(props?.view);
  const [plugins, setPlugins] = useState(props?.plugins);
  const [fullScreen, setFullScreen] = useState(false);

  let composing = false;
  let hasContentChanged = true;

  const nodeMdText = createRef();
  const nodeMdPreview = createRef();
  const markdownEditor = createRef();
  const nodeMdPreviewWrapper = createRef();

  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleLocaleUpdate = () => {
    forceUpdate();
  };

  const displayPreview = () => {
    setView({ ...view, md: false, menu: false, html: true });
  };

  const renderHTML = (text) => {
    if (typeof props.renderHTML === 'undefined') {
      logger.error(
        'renderHTML prop is required to convert markdown to markup!\n' +
          `You can use the 'render' method from the 'markdown-it' library.`
      );
    }

    const html = props.renderHTML(text);
    setHtml(html);
  };

  const getPlugins = () => {
    let plugins = [];

    if (typeof props?.plugins !== 'undefined') {
      const addToPlugins = (name) => {
        if (name === DividerPlugin.pluginName) {
          plugins.push({
            component: DividerPlugin,
            configs: {},
          });
        }

        for (const plugin of MarkdownEditor.Plugins) {
          if (plugin?.component?.pluginName == name) {
            plugins.push(plugin);
            return;
          }
        }
      };

      for (const name of props.plugins) {
        if (name === 'fonts') {
          addToPlugins('font-bold');
          addToPlugins('font-italic');
          addToPlugins('font-underline');
          addToPlugins('font-strikethrough');
          addToPlugins('list-unordered');
          addToPlugins('list-ordered');
          addToPlugins('block-quote');
          addToPlugins('block-wrap');
          addToPlugins('block-code-inline');
          addToPlugins('block-code-block');
        } else {
          addToPlugins(name);
        }
      }
    } else {
      plugins = [...MarkdownEditor.Plugins];
    }

    const result = {};
    plugins.forEach((plugin) => {
      if (typeof result[plugin.component.align] === 'undefined') {
        result[plugin.component.align] = [];
      }

      const key =
        plugin.component.pluginName === 'divider'
          ? uuidv4()
          : plugin.component.pluginName;
      result[plugin.component.align].push(
        React.createElement(plugin.component, {
          editor: MarkdownEditor,
          editorConfigs: configs,
          configs: {
            ...(plugin.component.configs || {}),
            ...(plugin.configs || {}),
          },
          key,
          nodeMdText,
          nodeMdPreview,
          nodeMdPreviewWrapper,
          editorState: { text, html, view, plugins, fullScreen },
          editorHooks: { setText, setHtml, setView, setPlugins, setFullScreen },
        })
      );
    });
    return result;
  };

  const getSelection = () => {
    const source = nodeMdText.current;
    if (typeof source === 'undefined') return { start: 0, end: 0, text: '' };
    return {
      start: source.selectionStart,
      end: source.selectionEnd,
      text: (source.value || '').slice(
        source.selectionStart,
        source.selectionEnd
      ),
    };
  };

  const getHtmlValue = () => {
    if (typeof html === 'string') return html;
    if (nodeMdPreview.current) return nodeMdPreview.current.getHtml();
    return '';
  };

  const setSelection = (to) => {
    if (!nodeMdText.current) return;
    nodeMdText.current.setSelectionRange(to.start, to.end, 'forward');
    nodeMdText.current.focus();
  };

  const setMarkdownText = (value, event, selection = undefined) => {
    const onChangeTrigger = configs?.onChangeTrigger || 'both';

    if (text === value) return;
    value = value.replace(/↵/g, '\n');
    setText(value);

    if (
      props?.onChange &&
      (onChangeTrigger === 'both' || onChangeTrigger === 'beforeRender')
    ) {
      props.onChange({ text, html: getHtmlValue() }, event);
    }
    MarkdownEditor.emitter.emit(
      MarkdownEditor.emitter.EVENT_CHANGE,
      value,
      event,
      typeof event === 'undefined'
    );

    if (selection) setTimeout(() => setSelection(selection));
    if (hasContentChanged === false) hasContentChanged = true;

    if (onChangeTrigger === 'both' || onChangeTrigger === 'afterRender') {
      renderHTML(text);
      if (props?.onChange) {
        props.onChange({ text, html: getHtmlValue() }, event);
      }
    }
  };

  const insertMarkdownText = (
    value,
    replaceSelected,
    selection = undefined
  ) => {
    selection = getSelection();
    const beforeContent = text.slice(0, selection.start);
    const afterContent = text.slice(
      (replaceSelected && selection.end) || selection.start,
      text.length
    );

    setMarkdownText(
      `${beforeContent}${value}${afterContent}`,
      undefined,
      selection
        ? {
            start: selection.start + beforeContent.length,
            end: selection.end + beforeContent.length,
          }
        : { start: selection.start, end: selection.start }
    );
  };

  const insertMarkdown = (type, option = {}) => {
    const selection = getSelection();
    let decorateOption = (option && { ...option }) || {};

    switch (type) {
      case 'image': {
        decorateOption = {
          ...decorateOption,
          target: option.target || selection.text || '',
          imageUrl: option.imageUrl || configs.imageUrl,
        };
        break;
      }
      case 'link': {
        decorateOption = {
          ...decorateOption,
          linkUrl: configs.linkUrl,
        };
        break;
      }
      case 'tab': {
        if (selection.start == selection.end) break;
        const lineStart =
          nodeMdText.current.value.slice(0, selection.start).lastIndexOf('\n') +
          1;
        setSelection({ start: lineStart, end: selection.end });
        break;
      }
    }

    const decorate = decorateIt(selection.text, type, decorateOption);
    if (decorate.newBlock) {
      const startLineInfo = getLineAndCol(
        nodeMdText.current.value,
        selection.start
      );
      const { col, currentLine } = startLineInfo;
      if (col > 0 && currentLine.length > 0) {
        decorate.text = `\n${decorate.text}`;
        if (decorate.selection) {
          ++decorate.selection.start;
          ++decorate.selection.end;
        }
      }
      if (selection.start !== selection.end) {
        startLineInfo.afterText = getLineAndCol(
          nodeMdText.current.value,
          selection.end
        ).afterText;
      }
      if (
        startLineInfo.afterText.trim() !== '' &&
        startLineInfo.afterText.substr(0, 2) !== '\n\n'
      ) {
        if (startLineInfo.afterText.substr(0, 1) !== '\n') {
          decorate.text += '\n';
        }
        decorate.text += '\n';
      }
    }
    insertMarkdownText(decorate.text, true, decorate.selection);
  };
  MarkdownEditor.insertMarkdown = insertMarkdown;

  /**
   * @function focusEventHandler() - Executes `onFocus()` callback on the emittion
   *                                 of 'focus' event.
   *
   * The callback `onFocus()` is also passed the event context.
   */
  const focusEventHandler = (e) => {
    const { onFocus } = props;
    if (typeof onFocus === 'function') onFocus(e);
  };

  /**
   * @function blurEventHandler() - Executes `onBlur()` callback on the emittion
   *                                of 'blur' event.
   *
   * The callback `onBlur()` is also passed the event context.
   */
  const blurEventHandler = (e) => {
    const { onBlur } = props;
    if (typeof onBlur === 'function') onBlur(e);
  };

  /**
   * @function keydownEventHandler() - Handles the keydown events registered in
   *                                   the `keyboardListeners`.
   *
   * All the registered listeners are registered with a callback attached so, if
   * the current event corresponds to a key inside of a listener then that listener's
   * callback will be executed with the current event context.
   */
  const keydownEventHandler = (e) => {
    for (const listener of MarkdownEditor.keyboardListeners) {
      if (isKeyMatch(e, listener)) {
        e.preventDefault();
        listener.callback(e);
        return;
      }
    }
  };

  /**
   * @function editorKeyDownEventHandler() - Handles the keydown events of the
   *                                         text editor.
   *
   * Mainly this function handles formatting of ordered or un-ordered list while
   * not composing.
   */
  const editorKeyDownEventHandler = (e) => {
    const { keyCode, key, currentTarget } = e;
    if ((keyCode === 13 || key === 'Enter') && composing === false) {
      const currentPosition = currentTarget.selectionStart;
      const lineInfo = getLineAndCol(currentTarget.value, currentPosition);

      const emptyCurrentLine = () => {
        const newValue =
          currentTarget.value.substr(
            0,
            currentPosition - lineInfo.currentLine.length
          ) + currentTarget.value.substr(currentPosition);
        setMarkdownText(newValue, undefined, {
          start: currentPosition - lineInfo.currentLine.length,
          end: currentPosition - lineInfo.currentLine.length,
        });
        e.preventDefault();
      };

      const addSymbol = (symbol) => {
        insertMarkdownText(`\n${symbol}`, false, {
          start: symbol.length + 1,
          end: symbol.length + 1,
        });
        e.preventDefault();
      };

      // In case of a un-ordered list we add a list style marker '*' at the
      // beginning of the line when pressed the return key so to keep the user
      // adding more points to its list.
      const isSymbol = lineInfo.currentLine.match(/^(\s*?)\* /);
      if (isSymbol) {
        // We don't want any un-ordered list style marker if the line just ends
        // with it, we only add the symbol if the user intends to make it a list.
        if (/^(\s*?)\* $/.test(lineInfo.currentLine)) emptyCurrentLine();
        else addSymbol(isSymbol[0]);
        return;
      }

      // In case of a ordered list we add a list style marker 'N' at the beginning
      // of the line when pressed the return key so to keep the user adding more
      // points to its list.
      const isOrderList = lineInfo.currentLine.match(/^(\s*?)(\d+)\. /);
      if (isOrderList) {
        // We don't want any ordered list style marker if the line just ends
        // with it, we only add the symbol if the user intends to make it a list.
        if (/^(\s*?)(\d+)\. $/.test(lineInfo.currentLine)) {
          emptyCurrentLine();
        } else {
          addSymbol(`${isOrderList[1]}${parseInt(isOrderList[2], 10) + 1}. `);
        }
        return;
      }
    }
  };

  const uploadWithDataTransfer = (items) => {
    const { onImageUpload } = configs;

    const promiseQueue = [];
    Array.prototype.forEach.call(items, (item) => {
      if (
        item.kind === 'file' &&
        item.type.includes('image') &&
        configs.allowPasteImage &&
        typeof onImageUpload === 'function'
      ) {
        const file = item.getAsFile();
        if (typeof file === 'undefined') return;

        const placeholder = getUploadPlaceholder(file, onImageUpload);
        promiseQueue.push(Promise.resolve(placeholder.placeholder));

        placeholder.uploaded.then((string) => {
          const text_ = text.replace(placeholder.placeholder, string);
          const offset = string.length - placeholder.placeholder.length;
          const selection = getSelection();

          setMarkdownText(text_, undefined, {
            start: selection.start + offset,
            end: selection.end + offset,
          });
        });
      } else if (item.kind === 'string' && item.type === 'text/plain') {
        promiseQueue.push(
          new Promise((resolve) => {
            item.getAsString(resolve);
          })
        );
      }
    });

    Promise.all(promiseQueue).then((result) => {
      const text = result.join('');
      const selection = getSelection();

      insertMarkdownText(text, true, {
        start: selection.start === selection.end ? text.length : 0,
        end: text.length,
      });
    });
  };

  const handleClick = (e) => {
    if (e.detail === 2) setView({ ...view, md: true, menu: true, html: false });
  };

  const handleDrop = (e) => {
    if (!configs?.onImageUpload) return;
    const event = e.nativeEvent;
    if (!event?.dataTransfer || !event?.dataTransfer?.items) return;
    e.preventDefault();
    uploadWithDataTransfer(event.dataTransfer.items);
  };

  const handleChange = (e) => {
    e.persist();
    setMarkdownText(e.target.value, e);
  };

  const handlePaste = (e) => {
    const event = e.nativeEvent;
    const items = (event.clipboardData || window?.clipboardData).items;
    if (!items) return;
    e.preventDefault();
    uploadWithDataTransfer(items);
  };

  const handleToggleMenu = (e) => {
    setView({ ...view, menu: !view.menu });
  };

  const handleOnSave = (e) => {
    renderHTML(e.target.value);
    displayPreview();
    const { onSave } = props;
    if (typeof onSave === 'function') onSave({ text: e.target.value });
  };

  const keyboardListeners = [
    {
      key: 'Enter',
      keyCode: 13,
      aliasCommand: true,
      withKey: ['ctrlKey', 'shiftKey'],
      callback: handleOnSave,
    },
  ];

  useEffect(() => {
    Array.from(keyboardListeners).forEach((keyboardListener) =>
      MarkdownEditor.onKeyboard(keyboardListener)
    );

    return () => {
      Array.from(keyboardListeners).forEach((keyboardListener) =>
        MarkdownEditor.offKeyboard(keyboardListener)
      );
    };
  }, []);

  useEffect(() => {
    renderHTML(text);
    i18n.setUp();

    MarkdownEditor.on('lang_change', handleLocaleUpdate);
    MarkdownEditor.on('focus', focusEventHandler);
    MarkdownEditor.on('blur', blurEventHandler);
    MarkdownEditor.on('keydown', keydownEventHandler);
    MarkdownEditor.on('editor_keydown', editorKeyDownEventHandler);

    return () => {
      MarkdownEditor.off('lang_change', handleLocaleUpdate);
      MarkdownEditor.off('focus', focusEventHandler);
      MarkdownEditor.off('blur', blurEventHandler);
      MarkdownEditor.off('keydown', keydownEventHandler);
      MarkdownEditor.off('editor_keydown', editorKeyDownEventHandler);
    };
  }, []);

  useEffect(() => {
    if (typeof props.text === 'undefined' || props.text === text) return;

    let value = props.text;
    if (typeof value !== 'string') value = String(value).toString();

    value = value.replace(/↵/g, '\n');
    if (text !== value) {
      setText(value);
      renderHTML(value);
    }
  }, [props.text]);

  useEffect(() => {
    if (props.plugins === plugins) return;
    const plugins_ = getPlugins();
    setPlugins([...plugins_.left, ...plugins_.right]);
  }, [props.plugins]);

  useEffect(() => {
    const value = text.replace(/↵/g, '\n');
    if (text !== value) {
      setText(value);
      renderHTML(value);
    }

    nodeMdText.current.style.height = '';
    nodeMdText.current.style.height = `${nodeMdText.current.scrollHeight}px`;
  }, [text]);

  const isShowMenu = !!view.menu;
  const showHideMenu =
    configs.canView && configs.canView.hideMenu && !configs.canView.menu;

  return (
    <MarkdownEditorContainer
      ref={markdownEditor}
      className={fullScreen ? 'full' : ''}
      onKeyDown={(e) => {
        MarkdownEditor.emitter.emit(MarkdownEditor.emitter.EVENT_KEY_DOWN, e);
      }}
      onDrop={handleDrop}
    >
      {isShowMenu && (
        <NavigationBar
          left={getPlugins()?.left || []}
          right={getPlugins()?.right || []}
        />
      )}
      <MarkdownEditorContainerInner>
        {showHideMenu && (
          <Toolbar>
            <span
              title={isShowMenu ? 'Hide menu' : 'Show menu'}
              onClick={handleToggleMenu}
            >
              <Icon type={`expand-${isShowMenu ? 'less' : 'more'}`} />
            </span>
          </Toolbar>
        )}
        <MarkdownEditorTextAreaContainer
          className={view.md === true ? 'visible' : 'in-visible'}
        >
          <textarea
            ref={nodeMdText}
            readOnly={props?.readOnly}
            value={text}
            wrap="hard"
            onChange={handleChange}
            onKeyDown={(e) => {
              MarkdownEditor.emitter.emit(
                MarkdownEditor.emitter.EVENT_EDITOR_KEY_DOWN,
                e
              );
            }}
            onCompositionStart={() => (composing = true)}
            onCompositionEnd={() => (composing = false)}
            onPaste={handlePaste}
            onFocus={(e) => {
              MarkdownEditor.emitter.emit(
                MarkdownEditor.emitter.EVENT_FOCUS,
                e
              );
            }}
            onBlur={(e) => {
              MarkdownEditor.emitter.emit(MarkdownEditor.emitter.EVENT_BLUR, e);
            }}
          />
        </MarkdownEditorTextAreaContainer>
        <MarkdownEditorPreviewContainer
          className={view.html === true ? 'visible' : 'in-visible'}
          onClick={handleClick}
        >
          <div className="preview-wrapper" ref={nodeMdPreviewWrapper}>
            <HtmlRenderer html={html} innerRef={nodeMdPreview} />
          </div>
        </MarkdownEditorPreviewContainer>
      </MarkdownEditorContainerInner>
    </MarkdownEditorContainer>
  );
}

MarkdownEditor.propTypes = {
  theme: PropTypes.string,
  view: {
    menu: PropTypes.bool,
    md: PropTypes.bool,
    html: PropTypes.bool,
  },
  canView: {
    menu: PropTypes.bool,
    md: PropTypes.bool,
    html: PropTypes.bool,
    both: PropTypes.bool,
    fullScreen: PropTypes.bool,
    hideMenu: PropTypes.bool,
  },
  htmlClass: PropTypes.string,
  markdownClass: PropTypes.string,
  syncScrollMode: PropTypes.array,
  imageUrl: PropTypes.string,
  imageAccept: PropTypes.string,
  linkUrl: PropTypes.string,
  loggerMaxSize: PropTypes.number,
  loggerInterval: PropTypes.number,
  table: {
    maxRow: PropTypes.number,
    maxCol: PropTypes.number,
  },
  allowPasteImage: PropTypes.bool,
  onImageUpload: PropTypes.func,
  onCustomImageUpload: PropTypes.func,
  shortcuts: PropTypes.bool,
  onChangeTrigger: PropTypes.string,
};
MarkdownEditor.defaultProps = { ...defaultConfigs };

export default MarkdownEditor;
