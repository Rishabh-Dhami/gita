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

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { Logger } from '../../plugins/index.jsx';

describe('Logger', () => {
  it('should render the Undo and Redo buttons', () => {
    const editorConfigs = {
      loggerMaxSize: 100,
      loggerInterval: 1000,
    };
    const editorState = {
      text: '',
    };
    const editorHooks = {
      setText: jest.fn(),
    };
    const editor = {
      registerPluginApi: jest.fn(),
      unregisterPluginApi: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      onKeyboard: jest.fn(),
      offKeyboard: jest.fn(),
    };
    const { getByTitle } = render(
      <Logger
        editorConfigs={editorConfigs}
        editorState={editorState}
        editorHooks={editorHooks}
        editor={editor}
      />
    );
    expect(getByTitle('Undo')).toBeInTheDocument();
    expect(getByTitle('Redo')).toBeInTheDocument();
  });
});
