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

import { DropList } from '../../../components/index.jsx';

describe('DropList', () => {
  it('should render children when visibility is "visible"', () => {
    const { getByText } = render(
      <DropList visibility="visible">
        <div>Child content</div>
      </DropList>
    );

    expect(getByText('Child content')).toBeInTheDocument();
  });

  it('should call onClose function when clicked', () => {
    const handleClose = jest.fn();
    const { getByTestId } = render(
      <DropList visibility="visible" onClose={handleClose}>
        <div>Child content</div>
      </DropList>
    );

    fireEvent.click(getByTestId('me-drop-list'));
    expect(handleClose).toHaveBeenCalled();
  });
});
