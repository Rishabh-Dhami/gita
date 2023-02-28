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

import React, { useEffect } from 'react';

import { Icon } from '../components/index.jsx';
import { i18n } from '../i18n/index.js';

Link.pluginName = 'link';
Link.align = 'left';

function Link({ ...props }) {
  const handleKeyboard = {
    key: 'k',
    keyCode: 75,
    aliasCommand: true,
    withKey: ['ctrlKey'],
    callback: () => props.editor.insertMarkdown('link'),
  };

  useEffect(() => {
    if (props.editorConfigs?.shortcuts) props.editor.onKeyboard(handleKeyboard);
    return () => {
      props.editor.offKeyboard(handleKeyboard);
    };
  }, []);

  return (
    <span
      title={i18n.get('btnLink')}
      onClick={() => props.editor.insertMarkdown('link')}
    >
      <Icon type="link" />
    </span>
  );
}

export default Link;
