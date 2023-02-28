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

import styled from 'styled-components';

import { BACKGROUND } from '../../../constants/styles/colors.js';

export const Button = styled.button`
  background-color: ${BACKGROUND.white};
  color: #000000;
  cursor: pointer;
  outline: none;
  font-size: 16px;
  padding: 0px 20px;
  border: none;
  display: flex;
  align-items: center;
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.75);
  height: content-fit;

  transition: all 0.2s ease-in-out;
  &:active {
    transform: translateY(2px);
    box-shadow: none;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 0px 16px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 0px 12px;
  }
`;

export const GoogleLogo = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;
