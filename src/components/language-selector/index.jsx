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

import {
  LanguageSelectorSelect,
  LanguageSelectorOption,
  LanguageSelectorContainer,
} from './styles/styles.jsx';

function LanguageSelector({ language, setLanguage, languages }) {
  return (
    <LanguageSelectorContainer>
      <LanguageSelectorSelect
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <LanguageSelectorOption key={lang.code} value={lang.code}>
            {lang.label}
          </LanguageSelectorOption>
        ))}
      </LanguageSelectorSelect>
    </LanguageSelectorContainer>
  );
}

export default LanguageSelector;
