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
import Editor, { Plugins } from 'react-markdown-editor-lite';

import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

Editor.use(Plugins.AutoResize, { min: 40 });
Editor.unuse(Plugins.ModeToggle);

function TextEditor() {
  return (
    <Editor
      renderHTML={(text) => mdParser.render(text)}
      onChange={({ html, text }) => console.log(html, text)}
      view={{ md: true, menu: true, html: false }}
    />
  );
}

export default TextEditor;
