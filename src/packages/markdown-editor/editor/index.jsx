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
import Emitter, { globalEventEmitter } from '../share/emitter.js';
import { NavigationBar, Icon, Toolbar } from '../components/index.jsx';
import { isKeyMatch, isPromise, getLineAndCol } from '../utils/tools.js';

import LOGGER from '../../../lib/logger/logger.js';
import { defaultConfigs } from './configs.js';

import HtmlRenderer from './preview/index.jsx';

import {
  MarkdownEditorContainer,
  MarkdownEditorContainerInner,
  MarkdownEditorPreviewContainer,
  MarkdownEditorTextAreaContainer,
} from './styles/styles.jsx';

MarkdownEditor.Plugins = [];

MarkdownEditor.usePlugin = (component, configs = {}) => {
  for (let i = 0; i < MarkdownEditor.Plugins.length; ++i) {
    if (MarkdownEditor.Plugins[i].component === component) {
      MarkdownEditor.Plugins.splice(i, 1, { component, configs });
      return;
    }
  }
  MarkdownEditor.Plugins.push({ component, configs });
};

MarkdownEditor.unusePlugin = (component) => {
  for (let i = 0; i < MarkdownEditor.Plugins.length; ++i) {
    if (MarkdownEditor.Plugins[i].component === component) {
      MarkdownEditor.Plugins.splice(i, 1);
      return;
    }
  }
};

MarkdownEditor.unuseAllPlugins = () => {
  MarkdownEditor.Plugins = [];
};

MarkdownEditor.emitter = new Emitter();

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
  }
};

MarkdownEditor.on = (event, callback) => {
  const eventType = MarkdownEditor._eventType(event);
  if (eventType) MarkdownEditor.emitter.on(eventType, callback);
};

MarkdownEditor.off = (event, callback) => {
  const eventType = MarkdownEditor._eventType(event);
  if (eventType) MarkdownEditor.emitter.off(eventType, callback);
};

MarkdownEditor.keyboardListeners = [];

MarkdownEditor.onKeyboard = (data) => {
  if (Array.isArray(data)) {
    data.forEach((it) => onKeyboard(it));
    return;
  }
  if (!MarkdownEditor.keyboardListeners.includes(data)) {
    MarkdownEditor.keyboardListeners.push(data);
  }
};

MarkdownEditor.offKeyboard = (data) => {
  if (Array.isArray(data)) {
    data.forEach((it) => offKeyboard(it));
    return;
  }
  const index = MarkdownEditor.keyboardListeners.indexOf(data);
  if (index >= 0) {
    MarkdownEditor.keyboardListeners.splice(index, 1);
  }
};

MarkdownEditor.PluginApis = new Map();

MarkdownEditor.registerPluginApi = (name, cb) => {
  MarkdownEditor.PluginApis.set(name, cb);
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

  const handleKeyboard = {
    key: 'Enter',
    keyCode: 13,
    aliasCommand: true,
    withKey: ['ctrlKey', 'shiftKey'],
    callback: () => displayPreview(),
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isKeyMatch(e, handleKeyboard)) {
        e.preventDefault();
        handleKeyboard.callback(e);
        return;
      }
      MarkdownEditor.emitter.emit(MarkdownEditor.emitter.EVENT_KEY_DOWN, e);
    };
    typeof markdownEditor.current !== 'undefined' &&
      markdownEditor.current.addEventListener('keydown', handleKeyDown);
    return () => {
      typeof markdownEditor.current !== 'undefined' &&
        markdownEditor.current.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleFocus = (e) => {
    const { onFocus } = props;
    if (typeof onFocus === 'function') onFocus(e);
    MarkdownEditor.emitter.emit(MarkdownEditor.emitter.EVENT_FOCUS, e);
  };

  const handleBlur = (e) => {
    const { onBlur } = props;
    if (typeof onBlur === 'function') onBlur(e);
    MarkdownEditor.emitter.emit(MarkdownEditor.emitter.EVENT_BLUR, e);
  };

  const handleClick = (e) => {
    if (e.detail === 2) setView({ ...view, md: true, menu: true, html: false });
  };

  const setHtmlState = (html) => {
    return new Promise((resolve) => {
      setHtml(html);
      resolve(html);
    });
  };

  const renderHTML = (text) => {
    if (typeof props.renderHTML === 'undefined') {
      logger.error(
        'renderHTML prop is required to convert markdown to markup!\n' +
          `You can use the 'render' method from the 'markdown-it' library.`
      );
    }

    const html = props.renderHTML(text);
    if (isPromise(html)) html.then((html) => setHtmlState(html));
    else if (typeof html === 'function') return setHtmlState(html());
    else return setHtmlState(html);
  };

  useEffect(() => {
    renderHTML(text);
    globalEventEmitter.on(
      globalEventEmitter.EVENT_LANG_CHANGE,
      handleLocaleUpdate
    );
    i18n.setUp();

    return () => {
      globalEventEmitter.off(
        globalEventEmitter.EVENT_LANG_CHANGE,
        handleLocaleUpdate
      );
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
  }, [text, props.text]);

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

  useEffect(() => {
    if (props.plugins === plugins) return;
    const $plugins = getPlugins();
    setPlugins([...$plugins.left, ...$plugins.right]);
  }, [props.plugins]);

  const handleKeyDown = (e) => {
    for (const listener of MarkdownEditor.keyboardListeners) {
      if (isKeyMatch(e, listener)) {
        e.preventDefault();
        listener.callback(e);
        return;
      }
    }
    MarkdownEditor.emitter.emit(MarkdownEditor.emitter.EVENT_KEY_DOWN, e);
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
    const $text = value.replace(/↵/g, '\n');
    setText($text);

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

    const rendering = renderHTML(text);
    if (onChangeTrigger === 'both' || onChangeTrigger === 'afterRender') {
      rendering.then(() => {
        if (props?.onChange) {
          props.onChange({ text: text, html: getHtmlValue() }, event);
        }
      });
    }
  };

  const insertMarkdownText = (
    value,
    replaceSelected,
    selection = undefined
  ) => {
    const $selection = getSelection();
    const $beforeContent = text.slice(0, $selection.start);
    const $afterContent = text.slice(
      (replaceSelected && $selection.end) || $selection.start,
      text.length
    );

    setMarkdownText(
      `${$beforeContent}${value}${$afterContent}`,
      undefined,
      selection
        ? {
            start: selection.start + $beforeContent.length,
            end: selection.end + $beforeContent.length,
          }
        : { start: $selection.start, end: $selection.start }
    );
  };

  const insertMarkdown = (type, option = {}) => {
    const $selection = getSelection();
    let $decorateOption = (option && { ...option }) || {};

    switch (type) {
      case 'image': {
        $decorateOption = {
          ...$decorateOption,
          target: option.target || $selection.text || '',
          imageUrl: option.imageUrl || configs.imageUrl,
        };
        break;
      }
      case 'link': {
        $decorateOption = {
          ...$decorateOption,
          linkUrl: configs.linkUrl,
        };
        break;
      }
      case 'tab': {
        if ($selection.start == $selection.end) break;
        const $lineStart =
          nodeMdText.current.value
            .slice(0, $selection.start)
            .lastIndexOf('\n') + 1;
        setSelection({ start: $lineStart, end: $selection.end });
        break;
      }
    }

    const $decorate = decorateIt($selection.text, type, $decorateOption);
    if ($decorate.newBlock) {
      const $startLineInfo = getLineAndCol(
        nodeMdText.current.value,
        $selection.start
      );
      const { col, currentLine } = $startLineInfo;
      if (col > 0 && currentLine.length > 0) {
        $decorate.text = `\n${$decorate.text}`;
        if ($decorate.selection) {
          ++$decorate.selection.start;
          ++$decorate.selection.end;
        }
      }
      if ($selection.start !== $selection.end) {
        $startLineInfo.afterText = getLineAndCol(
          nodeMdText.current.value,
          $selection.end
        ).afterText;
      }
      if (
        $startLineInfo.afterText.trim() !== '' &&
        $startLineInfo.afterText.substr(0, 2) !== '\n\n'
      ) {
        if ($startLineInfo.afterText.substr(0, 1) !== '\n') {
          $decorate.text += '\n';
        }
        $decorate.text += '\n';
      }
    }
    insertMarkdownText($decorate.text, true, $decorate.selection);
  };
  MarkdownEditor.insertMarkdown = insertMarkdown;

  const uploadWithDataTransfer = (items) => {
    if (!configs?.onImageUpload) return;

    const { onImageUpload } = configs;

    const $promiseQueue = [];
    Array.prototype.forEach.call(items, (item) => {
      if (item.kind === 'file' && item.type.includes('image')) {
        const $file = item.getAsFile();
        if (typeof $file === 'undefined') return;

        const $placeholder = getUploadPlaceholder($file, onImageUpload);
        $promiseQueue.push(Promise.resolve($placeholder.placeholder));

        $placeholder.uploaded.then((string) => {
          const $text = text.replace($placeholder.placeholder, string);
          const $offset = string.length - $placeholder.placeholder.length;
          const $selection = getSelection();

          setMarkdownText($text, undefined, {
            start: $selection.start + $offset,
            end: $selection.end + $offset,
          });
        });
      } else if (item.kind === 'string' && item.type === 'text/plain') {
        $promiseQueue.push(
          new Promise((resolve) => {
            item.getAsString(resolve);
          })
        );
      }
    });

    Promise.all($promiseQueue).then((result) => {
      const $text = result.join('');
      const $selection = getSelection();

      insertMarkdownText($text, true, {
        start: $selection.start === $selection.end ? $text.length : 0,
        end: $text.length,
      });
    });
  };

  const handleDrop = (e) => {
    if (!configs?.onImageUpload) return;
    const event = e.nativeEvent;
    if (!event?.dataTransfer || !event?.dataTransfer?.items) return;
    e.preventDefault();
    uploadWithDataTransfer(event.dataTransfer.items);
  };

  let scrollScale = 1;
  let isSyncingScroll = false;
  let shouldSyncScroll = 'md';

  const handleSyncScroll = (type, e) => {
    if (type !== shouldSyncScroll) return;
    if (typeof props.onScroll === 'function') props.onScroll(e, type);
    MarkdownEditor.emitter.emit(MarkdownEditor.emitter.EVENT_SCROLL, e, type);

    const { syncScrollMode = [] } = configs;
    if (
      !syncScrollMode.includes(
        type === 'md' ? 'rightFollowLeft' : 'leftFollowRight'
      )
    ) {
      return;
    }
    if (
      hasContentChanged &&
      nodeMdText.current &&
      nodeMdPreviewWrapper.current
    ) {
      scrollScale =
        nodeMdText.current.scrollHeight /
        nodeMdPreviewWrapper.current.scrollHeight;
      hasContentChanged = false;
    }
    if (!isSyncingScroll) {
      isSyncingScroll = true;
      requestAnimationFrame(() => {
        if (nodeMdText.current && nodeMdPreviewWrapper.current) {
          if (type === 'md') {
            nodeMdPreviewWrapper.current.scrollTop =
              nodeMdText.current.scrollTop / scrollScale;
          } else {
            nodeMdText.current.scrollTop =
              nodeMdPreviewWrapper.current.scrollTop * scrollScale;
          }
        }
        isSyncingScroll = false;
      });
    }
  };

  useEffect(() => {
    nodeMdText.current.style.height = '';
    nodeMdText.current.style.height = `${nodeMdText.current.scrollHeight}px`;
  }, [text]);

  const handleChange = (e) => {
    e.persist();
    setMarkdownText(e.target.value, e);
  };

  const handleEditorKeyDown = (e) => {
    const { keyCode, key, currentTarget } = e;
    if ((keyCode === 13 || key === 'Enter') && composing === false) {
      const $text = currentTarget.value;
      const $currentPosition = currentTarget.selectionStart;
      const $lineInfo = getLineAndCol($text, $currentPosition);

      const emptyCurrentLine = () => {
        const $newValue =
          currentTarget.value.substr(
            0,
            $currentPosition - $lineInfo.currentLine.length
          ) + currentTarget.value.substr($currentPosition);
        setMarkdownText($newValue, undefined, {
          start: $currentPosition - $lineInfo.currentLine.length,
          end: $currentPosition - $lineInfo.currentLine.length,
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

      const $isSymbol = $lineInfo.currentLine.match(/^(\s*?)\* /);
      if ($isSymbol) {
        if (/^(\s*?)\* $/.test($lineInfo.currentLine)) emptyCurrentLine();
        else addSymbol($isSymbol[0]);
        return;
      }

      const $isOrderList = $lineInfo.currentLine.match(/^(\s*?)(\d+)\. /);
      if ($isOrderList) {
        if (/^(\s*?)(\d+)\. $/.test($lineInfo.currentLine)) {
          emptyCurrentLine();
        } else {
          addSymbol(`${$isOrderList[1]}${parseInt($isOrderList[2], 10) + 1}. `);
        }
        return;
      }
    }

    MarkdownEditor.emitter.emit(
      MarkdownEditor.emitter.EVENT_EDITOR_KEY_DOWN,
      e
    );
  };

  const handlePaste = (e) => {
    if (!configs?.allowPasteImage || !configs?.onImageUpload) return;
    const $event = e.nativeEvent;
    const $items = ($event.clipboardData || window?.clipboardData).items;
    if (!$items) return;
    e.preventDefault();
    uploadWithDataTransfer($items);
  };

  const handleToggleMenu = (e) => {
    setView({ ...view, menu: !view.menu });
  };

  const isShowMenu = !!view.menu;
  const showHideMenu =
    configs.canView && configs.canView.hideMenu && !configs.canView.menu;

  return (
    <MarkdownEditorContainer
      ref={markdownEditor}
      className={fullScreen ? 'full' : ''}
      onKeyDown={handleKeyDown}
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
            onScroll={(e) => handleSyncScroll('md', e)}
            onMouseOver={() => (shouldSyncScroll = 'md')}
            onKeyDown={handleEditorKeyDown}
            onCompositionStart={() => (composing = true)}
            onCompositionEnd={() => (composing = false)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </MarkdownEditorTextAreaContainer>
        <MarkdownEditorPreviewContainer
          className={view.html === true ? 'visible' : 'in-visible'}
          onClick={handleClick}
        >
          <div
            className="preview-wrapper"
            ref={nodeMdPreviewWrapper}
            onMouseOver={() => (shouldSyncScroll = 'html')}
            onScroll={(e) => handleSyncScroll('html', e)}
          >
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
