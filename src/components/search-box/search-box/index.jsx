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
import { useState, useRef } from 'react';

import Fuse from 'fuse.js';

import LOGGER from '../../../lib/logger/logger.js';
import useOutsideClick from '../hooks/useOutisdeClick.js';

import { getFileName } from '../../../lib/utils/fs.js';

import { Input, Dropdown } from '../index.jsx';
import { StyledContainer } from './styles/styles.jsx';

function SearchBox({
  placeholder = '',
  name = '',
  data = [],
  fuseConfigs,
  autoFocus = false,
  onSelect,
  onFocus,
  onChange,
  inputBackgroundColor = '#fff',
  inputFontColor = '#000',
  inputBorderColor = '#cacaca96',
  inputFontSize = '14px',
  inputHeight = '40px',
  dropdownHoverColor = '#ccc',
  dropdownBorderColor = '#cacaca96',
  clearOnSelect = false,
  leftIcon,
  iconBoxSize = '24px',
  type = 'text',
  debug = false,
}) {
  const [matchedRecords, setMatchedRecords] = useState([]);
  const [value, setValue] = useState('');
  const [showDropdown, setDropdownVisibility] = useState(false);

  const wrapperRef = useRef(null);

  useOutsideClick(wrapperRef, setDropdownVisibility, setValue);

  /** @see http://fusejs.io/ for more details on Fuse.js. */
  const defaultFuseConfigs = {
    // At what point does the match algorithm give up. A threshold of 0.0
    // requires a perfect match (of both letters and location), a threshold
    // of 1.0 would match anything.
    threshold: 0.05,

    // Determines approximately where in the text is the pattern expected to
    // be found.
    location: 0,

    // Determines how close the match must be to the fuzzy location
    // (specified by location). An exact letter match which is distance
    // characters away from the fuzzy location would score as a complete
    // mismatch. A distance of 0 requires the match be at the exact
    // location specified, a distance of 1000 would require a perfect
    // match to be within 800 characters of the location to be found
    // using a threshold of 0.8.
    distance: 100,

    // When set to include matches, only the matches whose length exceeds this
    // value will be returned. (For instance, if you want to ignore single
    // character index returns, set to 2).
    minMatchCharLength: 1,

    // List of properties that will be searched. This supports nested properties,
    // weighted search, searching in arrays of strings and objects.
    keys: ['value'],
  };

  // Override the defaultFuseConfigs with fuseConfigs given by the user.
  const fuseConfigs = Object.assign({}, defaultFuseConfigs, fuseConfigs);
  const fuse = new Fuse(data, fuseConfigs);

  const context = {
    placeholder,
    name,
    data,
    fuseConfigs,
    autoFocus,
    onselect,
    onFocus,
    onChange,
    inputBackgroundColor,
    inputFontColor,
    inputBorderColor,
    inputFontSize,
    inputHeight,
    dropdownHoverColor,
    dropdownBorderColor,
    clearOnSelect,
    leftIcon,
    iconBoxSize,
    type,
  };
  const logger = new LOGGER(
    SearchBox.name,
    getFileName(import.meta.url),
    debug === true ? LOGGER.DEBUG : LOGGER.OFF
  );
  logger.debug(null, context);

  // Responsible for checking if any items from the input box's value matches
  // with any item from the `data` prop. If any item matches then that matched
  // object is pushed into the `matchedRecords` state which is responsible for
  // populating the dropdown.
  const handleInputChange = (event) => {
    const { value } = event.target;

    // Check all the values from `data` array whose value matches with `value`.
    const matchedRecords = fuse.search(value);

    setValue(value);
    setMatchedRecords(matchedRecords);
    setDropdownVisibility(true);
    !!onChange && onChange(value);
  };

  // Responsible for rendering the input box. The input box acts as a source of
  // entry for the data from the user. Once the user enters the value, it's
  // checked if that value matches with any value which is present in the `data`
  // prop.
  const inputNode = () => {
    const handleQuickSubmit = (event) => {
      if (matchedRecords.length === 1 && event.code === 'Enter') {
        event.preventDefault();
        onSelect(matchedRecords[0]);
      }
    };

    return (
      <Input
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleInputChange}
        autoFocus={autoFocus ? autoFocus : false}
        onFocus={onFocus ? onFocus : undefined}
        inputFontColor={inputFontColor}
        inputBorderColor={inputBorderColor}
        inputFontSize={inputFontSize}
        inputHeight={inputHeight}
        inputBackgroundColor={inputBackgroundColor}
        leftIcon={leftIcon}
        iconBoxSize={iconBoxSize}
        onKeyDown={handleQuickSubmit}
        type={type}
      />
    );
  };

  // Responsible for updating the value inside the input when any dropdown item
  // is clicked.
  const handleDropdownItemClick = (record) => {
    if (clearOnSelect) {
      setValue('');
    } else {
      setValue(record.item.value);
    }

    setDropdownVisibility(false);
    !!onSelect && onSelect(record);
    !!onChange && onChange(record.item.value);
  };

  // Renders the dropdown. When any value from the input box matches any value
  // from the `data` prop, that matched object from the data array shows up in
  // the dropdown `li`'s.
  const dropdownNode = () => {
    if (!showDropdown) {
      return null;
    }

    return (
      <Dropdown
        matchedRecords={matchedRecords}
        onClick={handleDropdownItemClick}
        dropdownHoverColor={dropdownHoverColor}
        dropdownBorderColor={dropdownBorderColor}
      />
    );
  };

  return (
    <div ref={wrapperRef}>
      <StyledContainer>
        {inputNode()}
        {dropdownNode()}
      </StyledContainer>
    </div>
  );
}

export default SearchBox;
