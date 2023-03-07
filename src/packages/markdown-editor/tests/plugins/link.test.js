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

import { i18n } from '../../i18n/index.js';
import { Link } from '../../plugins/index.jsx';

describe('Link', () => {
  test('renders a link icon', () => {
    const offKeyboard = jest.fn();
    const { getByTitle } = render(<Link editor={{ offKeyboard }} />);
    expect(getByTitle(i18n.get('btnLink'))).toBeInTheDocument();
  });

  test('calls insertMarkdown on click', () => {
    const offKeyboard = jest.fn();
    const insertMarkdown = jest.fn();
    const { getByTitle } = render(
      <Link editor={{ insertMarkdown, offKeyboard }} />
    );
    fireEvent.click(getByTitle(i18n.get('btnLink')));
    expect(insertMarkdown).toHaveBeenCalledWith('link');
  });

  test('registers keyboard shortcut', () => {
    const onKeyboard = jest.fn();
    const offKeyboard = jest.fn();
    const editor = { onKeyboard, offKeyboard };
    const editorConfigs = { shortcuts: true };
    render(<Link editor={editor} editorConfigs={editorConfigs} />);
    expect(onKeyboard).toHaveBeenCalled();
  });
});
