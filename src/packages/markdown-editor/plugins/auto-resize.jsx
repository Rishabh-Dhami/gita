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

import { getConfig } from './plugins.js';

AutoResize.pluginName = 'auto-resize';
AutoResize.align = 'left';
AutoResize.defaultConfigs = { min: 200, max: Infinity, useTimer: false };

function AutoResize({ ...props }) {
  const $timer = null;
  const $useTimer =
    getConfig('useTimer', AutoResize.defaultConfigs.useTimer, { ...props }) ||
    typeof requestAnimationFrame === 'undefined';

  const resize = () => {
    const resizeEl = (e) => {
      e.style.height = 'auto';
      const $height = Math.min(
        Math.max(getConfig('min'), e.scrollHeight),
        getConfig('max')
      );
      e.style.height = `${$height}px`;
      return $height;
    };

    $timer = null;
    const $el = props?.nodeMdText;
    const $view = props?.editorConfigs?.view;
    const $previewer = props?.nodeMdPreview;
    if ($el && $view.md) {
      if ($previewer) $previewer.style.height = `${resizeEl($el)}px`;
      return;
    }
    if ($previewer && $view.html) resizeEl($previewer);
  };

  const handleChange = () => {
    if ($timer !== null) return;
    if ($useTimer === true) $timer = window.setTimeout(resize);
    else $timer = requestAnimationFrame(resize);
  };

  useEffect(() => {
    props?.editor.on('change', handleChange);
    props?.editor.on('viewchange', handleChange);
    handleChange();

    return () => {
      props?.editor.off('change', handleChange);
      props?.editor.off('viewchange', handleChange);

      if ($timer !== null && $useTimer) {
        window.clearTimeout($timer);
        $timer = null;
      }
    };
  }, []);

  return <span />;
}

export default AutoResize;
