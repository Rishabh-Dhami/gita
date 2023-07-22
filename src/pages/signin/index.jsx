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

import React from 'react';

import { Navbar } from '../../components/index.jsx';

import {
  SignInForm as SignInWithEmailForm,
  GoogleSignInButton,
} from '../../components/index.jsx';

import { SignInContainer } from './styles/styles.jsx';

function SignIn() {
  return (
    <SignInContainer>
      <Navbar />
      <div className="main-form-container">
        <div className="sign-in-header">
          <div className="sign-in-header-holder">
            <div className="sign-in-header-content">
              <p>
                <strong>Sign in</strong>
              </p>
              <p>Access your Gita account</p>
            </div>
          </div>
        </div>
        <div className="sign-in-form-container">
          <div className="sign-in-form">
            <div className="sign-in-google">
              <GoogleSignInButton />
            </div>
            <div className="sign-in-email">
              <div>
                <SignInWithEmailForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SignInContainer>
  );
}

export default SignIn;
