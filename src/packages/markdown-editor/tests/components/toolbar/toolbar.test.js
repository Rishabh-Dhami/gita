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

import { Toolbar } from '../../../components/index.jsx';

describe('Toolbar', () => {
  it('renders properly in the document', () => {
    const { getByTestId } = render(<Toolbar />);
    expect(getByTestId('me-toolbar')).toBeInTheDocument();
  });

  it('renders the children', () => {
    const { getByTestId } = render(
      <Toolbar>
        <button data-testid="me-toolbar-btn">Click Me</button>
      </Toolbar>
    );
    expect(getByTestId('me-toolbar-btn')).toBeInTheDocument();
  });
});
