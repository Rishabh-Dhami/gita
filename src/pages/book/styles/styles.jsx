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

export const Container = styled.div`
  background-color: #f1f3f4;
  overflow-x: hidden;
`;

export const BookContainer = styled.div`
  display: flex;
  width: 100vw;
  position: relative;
  margin-top: 50px;
`;

export const MenuContainer = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 250px;
  left: 0;
  top: 0;

  @media (min-width: 2500px) {
    position: absolute;
  }
`;

export const ChapterContainer = styled.div`
  width: 100%;
  max-width: 2000px;
  height: 100vh;
  display: block;
  margin: auto;
`;

export const OnThisPageContainer = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 200px;
  align-self: end;
  right: 0;
  top: 0;

  @media (min-width: 2500px) {
    position: absolute;
  }
`;

export const UserActionContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;
