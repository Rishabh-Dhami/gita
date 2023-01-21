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

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import {
  Form,
  Input,
  Label,
  EyeIcon,
  SignInButton,
  SignInActionContainer,
  ForgottenPasswordContainer,
} from './styles/styles.jsx';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form>
      <Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email*"
          required
        />
      </Label>

      <Label>
        <Input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password*"
          required
        />
        <EyeIcon onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </EyeIcon>
      </Label>

      <SignInActionContainer>
        <ForgottenPasswordContainer>
          Forgotten Password?
        </ForgottenPasswordContainer>
        <SignInButton type="submit">Sign In</SignInButton>
      </SignInActionContainer>
    </Form>
  );
}

export default SignInForm;
