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

export const StyledInput = styled.input`
  font-size: ${({ inputFontSize }) => inputFontSize};
  padding: ${({ leftIcon, iconBoxSize }) =>
    leftIcon ? `10px ${iconBoxSize}` : '10px 20px'};
  height: ${({ inputHeight }) => inputHeight};
  border: 1px solid ${({ inputBorderColor }) => inputBorderColor};
  border-radius: 5px;
  color: ${({ inputFontColor }) => inputFontColor};
  background-color: ${({ inputBackgroundColor }) => inputBackgroundColor};
  width: 100%;

  &:focus {
    outline: none;
    background-color: #ffffff;
    box-shadow: 0px 1px 2px #888888;
  }
`;

export const StyledIconContainer = styled.span`
  height: ${({ inputHeight }) => inputHeight};
  width: ${({ iconBoxSize }) => iconBoxSize};
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledInputContainer = styled.span`
  position: relative;
`;
