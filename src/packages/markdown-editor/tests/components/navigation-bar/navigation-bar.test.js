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

import { NavigationBar } from '../../../components/index.jsx';

describe('NavigationBar', () => {
  test('renders left and right buttons', () => {
    const leftBtn1 = <button data-testid="l-btn1">Left Button</button>;
    const leftBtn2 = <button data-testid="l-btn2">Left Button</button>;
    const leftBtn3 = <button data-testid="l-btn3">Left Button</button>;
    const leftBtn4 = <button data-testid="l-btn4">Left Button</button>;
    const leftBtn5 = <button data-testid="l-btn5">Left Button</button>;

    const rightBtn1 = <button data-testid="r-btn1">Right Button</button>;
    const rightBtn2 = <button data-testid="r-btn2">Right Button</button>;
    const rightBtn3 = <button data-testid="r-btn3">Right Button</button>;
    const rightBtn4 = <button data-testid="r-btn4">Right Button</button>;
    const rightBtn5 = <button data-testid="r-btn5">Right Button</button>;

    const { getByTestId } = render(
      <NavigationBar
        left={[leftBtn1, leftBtn2, leftBtn3, leftBtn4, leftBtn5]}
        right={[rightBtn1, rightBtn2, rightBtn3, rightBtn4, rightBtn5]}
      />
    );

    const leftBtnElement1 = getByTestId('l-btn1');
    const rightBtnElement1 = getByTestId('r-btn1');
    expect(leftBtnElement1).toBeInTheDocument();
    expect(rightBtnElement1).toBeInTheDocument();

    const leftBtnElement2 = getByTestId('l-btn2');
    const rightBtnElement2 = getByTestId('r-btn2');
    expect(leftBtnElement2).toBeInTheDocument();
    expect(rightBtnElement2).toBeInTheDocument();

    const leftBtnElement3 = getByTestId('l-btn3');
    const rightBtnElement3 = getByTestId('r-btn3');
    expect(leftBtnElement3).toBeInTheDocument();
    expect(rightBtnElement3).toBeInTheDocument();

    const leftBtnElement4 = getByTestId('l-btn4');
    const rightBtnElement4 = getByTestId('r-btn4');
    expect(leftBtnElement4).toBeInTheDocument();
    expect(rightBtnElement4).toBeInTheDocument();

    const leftBtnElement5 = getByTestId('l-btn5');
    const rightBtnElement5 = getByTestId('r-btn5');
    expect(leftBtnElement5).toBeInTheDocument();
    expect(rightBtnElement5).toBeInTheDocument();
  });
});
