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

import React, { useEffect, useState } from 'react';

import { i18n } from '../i18n/index.js';
import { Icon } from '../components/index.jsx';

FullScreen.pluginName = 'full-screen';
FullScreen.align = 'right';

function FullScreen({ ...props }) {
  const [enable, setEnable] = useState(props.editorState.fullScreen);

  const handleClick = () => {
    props.editorHooks.setFullScreen(!enable);
  };

  const handleChange = (enable) => {
    setEnable(enable);
  };

  useEffect(() => {
    props.editor.on('fullscreen', handleChange);
    return () => {
      props.editor.off('fullscreen', handleChange);
    };
  }, []);

  return props.editorConfigs?.canView?.fullScreen ? (
    <span
      title={i18n.get(enable ? 'btnExitFullScreen' : 'btnFullScreen')}
      onClick={handleClick}
    >
      <Icon type={enable ? 'fullscreen-exit' : 'fullscreen'} />
    </span>
  ) : (
    <></>
  );
}

export default FullScreen;
