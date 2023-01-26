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

export const SignInContainer = styled.div`
  background-color: #f1f3f4;
  width: 100%;
  height: 100vh;
  overflow: auto;
`;

export const SignInMainContainer = styled.div`
  position: relative;
  margin-top: 50px;
  box-sizing: border-box;
`;

export const SignInHeader = styled.div`
  height: 200px;
  background-color: #ffffff;
  width: 100%;

  > div {
    width: 80%;
    height: 100%;
    display: block;
    margin: auto;

    > div {
      width: 100%;
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      strong {
        font-size: 60px;
        font-weight: normal;
      }

      p {
        font-family: 'Roboto', sans-serif;
      }
    }
  }
`;

export const SignInFormMainContainer = styled.div`
  position: absolute;
  top: 160px;
  width: 100%;
  height: content-fit;
  display: block;
`;

export const SignInForm = styled.div`
  background-color: #ffffff;
  width: 50%;
  height: 500px;
  display: block;
  margin: auto;
  padding: 40px 0;
`;

export const SignInWithGoogleContainer = styled.div`
  width: 80%;
  display: block;
  margin: 30px auto;
`;

export const SignInWithEmailContainer = styled.div`
  width: 80%;
  margin: auto;

  > div {
    width: 80%;
  }
`;
