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

import { BACKGROUND, BORDER } from '../../../constants/styles/colors.js';

export const AddTextCellContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 20px;
  background: ${BACKGROUND.transparent};
  margin: 5px 0;
`;

export const AddTextCellInnerBar = styled.hr`
  border-top: none;
  border-bottom: 1px solid ${BORDER.darkgrey};
  position: absolute;
  width: 100%;
`;

export const AddTextCellButton = styled.button`
  outline: none;
  border: none;
  background-color: ${BACKGROUND.white};
  color: black;
  width: 100%;
  max-width: 70px;
  height: 20px;
  margin: auto;
  text-align: right;
  padding: 0 12px;
  z-index: 0;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  font-size: 16px;

  transition: all 0.2s ease-in-out;
  &:active {
    transform: translateY(2px);
  }
`;
