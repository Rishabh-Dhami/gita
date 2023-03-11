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
import { render, fireEvent } from '@testing-library/react';

import { Toggle } from '../../plugins/index.jsx';

describe('Toggle', () => {
  it('renders with correct icon and title', () => {
    const editorConfigs = {
      canView: {
        html: true,
        md: true,
        both: true,
      },
      view: {
        html: false,
        md: true,
      },
    };
    const { getByTitle } = render(
      <Toggle
        editor={{ on: jest.fn(), off: jest.fn() }}
        editorConfigs={editorConfigs}
      />
    );
    expect(getByTitle('Only display editor')).toBeTruthy();
  });

  it('handles click events correctly', () => {
    const editorConfigs = {
      canView: {
        html: true,
        md: true,
        both: true,
      },
      view: {
        html: false,
        md: true,
      },
    };
    const editorState = {
      view: {
        html: false,
        md: true,
      },
    };
    const editorHooks = {
      setView: jest.fn(),
    };
    const { getByTitle } = render(
      <Toggle
        editor={{ on: jest.fn(), off: jest.fn() }}
        editorConfigs={editorConfigs}
        editorState={editorState}
        editorHooks={editorHooks}
      />
    );
    const button = getByTitle('Only display editor');
    expect(button).toBeTruthy();
    fireEvent.click(button);
    expect(editorHooks.setView).toHaveBeenCalledWith({
      html: true,
      md: false,
    });
  });
});
