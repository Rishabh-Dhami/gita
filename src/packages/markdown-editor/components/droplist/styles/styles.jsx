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

import { BACKGROUND } from '../../../../../constants/styles/colors.js';

export const DropWrap = styled.div`
  display: ${({ visibility }) => (visibility === 'visible' ? 'block' : 'none')};
  position: absolute;
  left: 0;
  top: 28px;
  z-index: 2;
  min-width: 20px;
  padding: 0 0;
  text-align: center;
  background-color: ${BACKGROUND.white};
  border: 1px solid #f1f1f1;
  border-right-color: #ddd;
  border-bottom-color: #ddd;
`;
