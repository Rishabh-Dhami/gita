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

import React from 'react';

import MarkdownIt from 'markdown-it';

import {
  Link,
  Bold,
  Close,
  Clear,
  Table,
  Quote,
  Logger,
  Italic,
  Header,
  BlockWrap,
  Underline,
  BlockCode,
  InlineCode,
  OrderedList,
  StrikeThrough,
  UnOrderedList,
} from '../../packages/markdown-editor/plugins/index.jsx';
import MarkdownEditor from '../../packages/markdown-editor/editor/index.jsx';

import { TextAreaContainer } from './styles/styles.jsx';

const mdParser = new MarkdownIt();

function TextEditor({ text, view, onChange, onSave, onCloseTextEditor }) {
  MarkdownEditor.usePlugin(Header);
  MarkdownEditor.usePlugin(Bold);
  MarkdownEditor.usePlugin(Italic);
  MarkdownEditor.usePlugin(Underline);
  MarkdownEditor.usePlugin(StrikeThrough);
  MarkdownEditor.usePlugin(OrderedList);
  MarkdownEditor.usePlugin(UnOrderedList);
  MarkdownEditor.usePlugin(Quote);
  MarkdownEditor.usePlugin(BlockWrap);
  MarkdownEditor.usePlugin(InlineCode);
  MarkdownEditor.usePlugin(BlockCode);
  MarkdownEditor.usePlugin(Table);
  MarkdownEditor.usePlugin(Link);
  MarkdownEditor.usePlugin(Clear);
  MarkdownEditor.usePlugin(Logger);
  MarkdownEditor.usePlugin(Close, { onCloseTextEditor });

  return (
    <TextAreaContainer>
      <MarkdownEditor
        text={text}
        renderHTML={(text) => mdParser.render(text)}
        view={{ md: true, menu: true, html: false, ...view }}
        onChange={onChange}
        onSave={onSave}
      />
    </TextAreaContainer>
  );
}

export default TextEditor;
