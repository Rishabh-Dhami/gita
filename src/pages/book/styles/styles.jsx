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

export const Container = styled.div`
  background-color: ${BACKGROUND.lightgrey1};
  height: fit-content;
  position: relative;
  display: block;
  width: 100%;
  max-width: 2000px;
  margin: auto;

  .book-content-container {
    overflow: hidden;
    scroll-behaviour: smooth;
    display: flex;
    width: 100%;
    position: relative;
    margin: 50px 0px;
    height: content-fit;
  }
`;

export const MenuContainer = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
  max-width: 250px;
  left: 0;
  top: 0;

  .slide-in-out-action-button {
    position: fixed;
    top: 60px;
    width: 60px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: right;
    padding-right: 8px;
    font-weight: 800;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    cursor: pointer;
    background-color: ${BACKGROUND.white};
    box-shadow: 0 0 5px 2px ${BACKGROUND.lightgrey1};
    z-index: 7;

    &:hover {
      transform: scale(1.1);
    }

    &.slide-out {
      left: 210px;
    }

    &.slide-in {
      left: -40px;
    }

    @media (min-width: 2000px) {
      display: none;
    }
  }

  &.container-in {
    width: 0;
  }

  @media (max-width: 700px) {
    position: absolute;
  }
`;

export const ChapterContainer = styled.div`
  width: 100%;
  max-width: 2000px;
  height: 100%;
  display: block;
  margin: 0 auto;
  padding: 18px 18px;
`;

export const OnThisPageContainer = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 200px;
  align-self: end;
  right: 0;
  top: 0;

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const UserActionContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: flex-end;

  @media (max-width: 590px) {
    .g-search-box {
      display: none;
    }
  }
`;
