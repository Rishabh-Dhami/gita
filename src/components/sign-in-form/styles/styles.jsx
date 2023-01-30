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

export const Form = styled.form`
  display: flex;
  height: 200px;
  flex-direction: column;
  justify-content: space-between;
`;

export const Input = styled.input`
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  position: relative;
  bottom: 0;
  font-size: 16px;
  width: 100%;
  height: inherit;
`;

export const EyeIcon = styled.div`
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 50%;
  bottom: 0;
  transform: translateY(-50%);
  margin-right: 12px;

  svg {
    font-size: 20px;
  }
`;

export const Label = styled.label`
  position: relative;
  height: 40px;
  display: block;
  width: 100%;
`;

export const SignInActionContainer = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 925px) {
    flex-direction: column;
  }
`;

export const SignInButton = styled.button`
  border: none;
  outline: none;
  max-width: 80px;
  height: 40px;
  text-align: center;
  color: ${COLOR.secondary};
  background-color: ${BACKGROUND.buttonSecondary};
  position: relative;
  flex: 0 0 20%;
  cursor: pointer;
`;

export const ForgottenPasswordContainer = styled.div`
  flex: 0 0 80%;
`;
