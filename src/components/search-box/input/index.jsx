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
import { useRef, useEffect } from 'react';

import LOGGER from '../../../lib/logger/logger.js';

import { getFileName } from '../../../lib/utils/fs.js';

import {
  StyledInput,
  StyledIconContainer,
  StyledInputContainer,
} from './styles/styles.jsx';

function Input({
  placeholder,
  name,
  value,
  onChange,
  onFocus,
  inputFontColor,
  inputBorderColor,
  inputFontSize,
  inputHeight,
  inputBackgroundColor,
  autoFocus,
  leftIcon,
  iconBoxSize,
  type,
  onKeyDown,
  debug = false,
}) {
  const inputRef = useRef(null);

  const context = {
    placeholder,
    name,
    value,
    onChange,
    onFocus,
    inputFontColor,
    inputBorderColor,
    inputFontSize,
    inputHeight,
    inputBackgroundColor,
    autoFocus,
    leftIcon,
    iconBoxSize,
    type,
    onKeyDown,
  };
  const logger = new LOGGER(
    Input.name,
    getFileName(import.meta.url),
    debug === true ? LOGGER.DEBUG : LOGGER.OFF
  );
  logger.debug(null, context);

  useEffect(() => {
    // Focusses on the input box if the `autoFocus` prop is `true`.
    !!autoFocus && inputRef.current?.focus();
  }, []);

  const leftIconNode = () => {
    if (!leftIcon) {
      return null;
    }

    return (
      <StyledIconContainer iconBoxSize={iconBoxSize} inputHeight={inputHeight}>
        {leftIcon}
      </StyledIconContainer>
    );
  };

  return (
    <StyledInputContainer>
      <StyledInput
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        ref={inputRef}
        inputFontColor={inputFontColor}
        inputBorderColor={inputBorderColor}
        inputFontSize={inputFontSize}
        inputHeight={inputHeight}
        inputBackgroundColor={inputBackgroundColor}
        leftIcon={leftIcon}
        iconBoxSize={iconBoxSize}
        onKeyDown={onKeyDown}
      />
      {leftIconNode()}
    </StyledInputContainer>
  );
}

export default Input;
