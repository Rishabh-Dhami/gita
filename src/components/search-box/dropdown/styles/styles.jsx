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

export const StyledDropdown = styled.div`
  margin: 10px 0 0;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 0, rgba(0, 0, 0, 0.1) 0px 4px 11px;
  border-radius: 5px;

  > ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    > li {
      padding: 10px 20px;
      background-color: #fff;
      border: 1px solid ${({ dropdownBorderColor }) => dropdownBorderColor};
      height: 40px;
      display: flex;
      align-items: center;

      &:hover {
        background-color: ${({ dropdownHoverColor }) => dropdownHoverColor};
        cursor: pointer;
      }

      &:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }

      &:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }

      &:not(:first-child) {
        border-top: 0;
      }
    }
  }
`;
