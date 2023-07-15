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

import { BACKGROUND, COLOR } from '../../../constants/styles/colors.js';

export const ChapterIndexContainer = styled.div`
  position: relative;

  .chapter-index-container {
    max-width: 250px;
    height: 100%;
    position: fixed;
    overflow-x: hidden;
    overflow-y: scroll;
    background-color: ${BACKGROUND.white};
    animation: ${({ effect }) =>
        effect === 'slideIn'
          ? slideIn
          : effect === 'slideOut'
          ? slideOut
          : 'none'}
      2s linear;
    z-index: 8;

    ::-webkit-scrollbar {
      width: 0px;
    }
    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 50px;
    }
    ::-webkit-scrollbar-button {
      display: none;
    }
    ::-webkit-scrollbar-corner {
      background-color: #e3e2e1;
    }

    &.container-in {
      width: 0;
    }

    &.container-out {
      width: 100%;
    }
  }

  .chapter-index-action-container {
    padding: 12px;
    display: flex;
    gap: 10px;
    align-items: center;
    overflow: hidden;
  }
`;

export const ChapterAddButton = styled.div`
  width: 50px;
  height: 40px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: bold;
  background: -webkit-linear-gradient(#eee, #333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  box-shadow: 0 0 5px 0px #888888;
  user-select: none;

  &:active {
    transform: scale(0.9);
  }
`;

export const ChaptersContainer = styled.ul`
  list-style-type: none;
  padding: 0;
  padding-bottom: 50px;
`;

export const ChapterCell = styled.li`
  color: ${COLOR.lightgrey2};
  padding: 5px 13px;
  cursor: pointer;
  background-color: ${({ active }) =>
    active === true ? BACKGROUND.white : BACKGROUND.transparent};

  &:hover {
    background-color: ${BACKGROUND.lightgrey1};
  }

  &:active {
    background-color: ${BACKGROUND.white};
  }
`;
