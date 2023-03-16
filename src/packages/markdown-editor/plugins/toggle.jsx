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

import React, { useState, useEffect } from 'react';

import { Icon } from '../components/index.jsx';
import { i18n } from '../i18n/index.js';

Toggle.pluginName = 'toggle';
Toggle.align = 'right';

function Toggle({ ...props }) {
  const [view, setView] = useState(props.editorConfigs?.view);

  const isDisplay = () => {
    const { canView } = props.editorConfigs;
    if (typeof canView !== 'undefined') {
      return (
        [canView.html, canView.md, canView.both].filter((it) => it).length >= 2
      );
    }
    return false;
  };

  const next = () => {
    const actions = ['ShowAll', 'ShowMd', 'ShowHtml'];

    const { canView } = props.editorConfigs;
    if (typeof canView !== 'undefined' && canView !== null) {
      if (!canView.both) actions.splice(actions.indexOf('ShowAll'), 1);
      if (!canView.md) actions.splice(actions.indexOf('ShowMd'), 1);
      if (!canView.html) actions.splice(actions.indexOf('ShowHtml'), 1);
    }

    let current = 'ShowMd';
    if (view.html) current = 'ShowHtml';
    if (view.html && view.md) current = 'ShowAll';

    if (actions.length === 0) return current;
    if (actions.length === 1) return actions[0];

    const index = actions.indexOf(current);
    return index < actions.length - 1 ? actions[index + 1] : actions[0];
  };

  const handleClick = (e) => {
    switch (next()) {
      case 'ShowAll':
        props.editorHooks.setView({
          ...props.editorState.view,
          html: true,
          md: true,
        });
        break;
      case 'ShowMd':
        props.editorHooks.setView({
          ...props.editorState.view,
          html: false,
          md: true,
        });
        break;
      case 'ShowHtml':
        props.editorHooks.setView({
          ...props.editorState.view,
          html: true,
          md: false,
        });
        break;
    }
  };

  const handleChange = (v) => {
    setView({ ...view, html: v.html, md: v.md });
  };

  useEffect(() => {
    props.editor.on('viewchange', handleChange);
    return () => props.editor.off('viewchange', handleChange);
  }, []);

  const getDisplayInfo = () => {
    switch (next()) {
      case 'ShowAll':
        return { icon: 'view-split', title: 'All' };
      case 'ShowMd':
        return { icon: 'visibility', title: 'Preview' };
      case 'ShowHtml':
        return { icon: 'keyboard', title: 'Editor' };
    }
  };

  const { icon, title } = getDisplayInfo();

  return (
    isDisplay() && (
      <span
        className="button"
        title={i18n.get(`btnMode${title}`)}
        onClick={handleClick}
      >
        <Icon type={icon} />
      </span>
    )
  );
}

export default Toggle;
