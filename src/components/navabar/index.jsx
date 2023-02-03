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

import LOGGER from '../../lib/logger/logger.js';

import { GitaText } from '../index.jsx';

import { NavbarContainer, RightChildContainer } from './styles/styles.jsx';

function Navbar({ rightChild, debug = false }) {
  const context = { rightChild };
  const logger = new LOGGER(
    Navbar.name,
    debug === true ? LOGGER.DEBUG : LOGGER.INFO
  );
  logger.debug(null, context);

  return (
    <NavbarContainer>
      {<GitaText />}
      {rightChild && <RightChildContainer>{rightChild}</RightChildContainer>}
    </NavbarContainer>
  );
}

export default Navbar;
