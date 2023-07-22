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

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import { firebaseConfig } from './config.js';

class FirebaseOAuth {
  constructor() {
    initializeApp(firebaseConfig);

    this._auth = getAuth();
  }

  async signInWithGoogle(callback) {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this._auth, provider)
      .then((result) => {
        typeof callback === 'function' && callback(result);
        console.log(result);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  async authenticateWithEmailAndPassword({ email, password }, callback = null) {
    await createUserWithEmailAndPassword(this._auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        typeof callback === 'function' && callback(userCredential);
        console.log(userCredential);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  async userSignOut() {
    await signOut(this._auth)
      .then(() => {})
      .catch((error) => {});
  }
}

export { FirebaseOAuth };
