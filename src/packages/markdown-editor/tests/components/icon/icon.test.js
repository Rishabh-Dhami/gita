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

import { Icon } from '../../../components/index.jsx';

describe('Icon', () => {
  it('renders tab icon', () => {
    const { getByTestId } = render(<Icon type="tab" />);
    const icon = getByTestId('me-icon');
    expect(icon.querySelector('i')).toHaveClass('rmel-icon-tab');
  });

  it('renders keyboard icon', () => {
    const { getByTestId } = render(<Icon type="keyboard" />);
    const icon = getByTestId('me-icon');
    expect(icon.querySelector('i')).toHaveClass('rmel-icon-keyboard');
  });

  it('renders delete icon', () => {
    const { getByTestId } = render(<Icon type="delete" />);
    const icon = getByTestId('me-icon');
    expect(icon.querySelector('i')).toHaveClass('rmel-icon-delete');
  });

  it('renders code block icon', () => {
    const { getByTestId } = render(<Icon type="code-block" />);
    const icon = getByTestId('me-icon');
    expect(icon.querySelector('i')).toHaveClass('rmel-icon-code-block');
  });

  it('renders code icon', () => {
    const { getByTestId } = render(<Icon type="code" />);
    const icon = getByTestId('me-icon');
    expect(icon.querySelector('i')).toHaveClass('rmel-icon-code');
  });
});
