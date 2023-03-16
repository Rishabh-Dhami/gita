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

import { i18n } from '../../i18n/index.js';
import { Icon, DropList } from '../../components/index.jsx';

import { HeaderListContainer } from './style/styles.jsx';

function HeaderList({ ...props }) {
  const { onSelectHeader } = props;

  const handleHeader = (header) => {
    typeof onSelectHeader === 'function' && onSelectHeader(header);
  };

  return (
    <HeaderListContainer>
      <li>
        <h1 onClick={() => handleHeader('h1')}>H1</h1>
      </li>
      <li>
        <h2 onClick={() => handleHeader('h2')}>H2</h2>
      </li>
      <li>
        <h3 onClick={() => handleHeader('h3')}>H3</h3>
      </li>
      <li>
        <h4 onClick={() => handleHeader('h4')}>H4</h4>
      </li>
      <li>
        <h5 onClick={() => handleHeader('h5')}>H5</h5>
      </li>
      <li>
        <h6 onClick={() => handleHeader('h6')}>H6</h6>
      </li>
    </HeaderListContainer>
  );
}

Header.pluginName = 'header';
Header.align = 'left';

function Header({ ...props }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className='button'
      title={i18n.get('btnHeader')}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Icon type="heading" />
      <DropList
        visibility={show ? 'visible' : 'in-visible'}
        onClose={() => setShow(false)}
      >
        <HeaderList
          onSelectHeader={(header) => props?.editor.insertMarkdown(header)}
        />
      </DropList>
    </span>
  );
}

export default Header;
