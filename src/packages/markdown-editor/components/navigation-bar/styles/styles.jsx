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

export const MarkdownNavigation = styled.div`
  min-height: 38px;
  padding: 0px 8px;
  box-sizing: border-box;
  border-bottom: 1px solid #e0e0e0;
  font-size: 16px;
  background: #f5f5f5;
  user-select: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: inherit;
    font-weight: 500;
    color: inherit;
    padding: 0;
    margin: 0;
    line-height: 1.1;
  }

  h1 {
    font-size: 34px;
  }

  h2 {
    font-size: 30px;
  }

  h3 {
    font-size: 24px;
  }

  h4 {
    font-size: 18px;
  }

  h5 {
    font-size: 14px;
  }

  h6 {
    font-size: 12px;
  }
`;

export const Nav = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #757575;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  button {
    position: relative;
    min-width: 24px;
    height: 28px;
    margin-left: 3px;
    margin-right: 3px;
    display: inline-block;
    cursor: pointer;
    line-height: 28px;
    text-align: center;
    color: #757575;

    &:hover {
      color: #212121;
    }

    &.disabled {
      color: #bdbdbd;
      cursor: not-allowed;
    }

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }
`;
