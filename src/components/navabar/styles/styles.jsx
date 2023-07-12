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

export const NavbarContainer = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 2000px;
  height: 50px;
  background-color: ${BACKGROUND.white};
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0px -5px 20px #888888;
  box-sizing: border-box;
  z-index: 1;
`;

export const RightChildContainer = styled.div`
  width: 100%;
  max-width: 800px;
`;
