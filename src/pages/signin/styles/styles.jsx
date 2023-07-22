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

export const SignInContainer = styled.div`
  background-color: ${BACKGROUND.lightgrey1};
  width: 100%;
  height: 100vh;
  position: relative;
  display: block;
  width: 100%;
  max-width: 2000px;
  margin: auto;

  .main-form-container {
    position: relative;
    margin-top: 50px;
    box-sizing: border-box;
  }

  .sign-in-header {
    height: 200px;
    background-color: ${BACKGROUND.white};
    width: 100%;
  }

  .sign-in-header-holder {
    width: 80%;
    height: 100%;
    display: block;
    margin: auto;
  }

  .sign-in-header-content {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    strong {
      font-size: 60px;
      font-weight: normal;
    }
  }

  .sign-in-form-container {
    position: absolute;
    top: 160px;
    width: 100%;
    height: content-fit;
    display: block;
  }

  .sign-in-form {
    background-color: ${BACKGROUND.white};
    width: 50%;
    height: 500px;
    display: block;
    margin: auto;
    padding: 40px 0;

    @media (max-width: 1000px) {
      width: 70%;
    }

    @media (max-width: 800px) {
      width: 80%;
    }

    @media (max-width: 700px) {
      width: 90%;
    }

    @media (max-width: 600px) {
      width: 100%;
    }
  }

  .sign-in-google {
    width: 80%;
    display: block;
    margin: 30px auto;

    @media (max-width: 800px) {
      width: 90%;
    }
  }

  .sign-in-email {
    width: 80%;
    margin: auto;

    @media (max-width: 800px) {
      width: 90%;
    }

    > div {
      width: 80%;

      @media (max-width: 800px) {
        width: 100%;
      }
    }
  }
`;
