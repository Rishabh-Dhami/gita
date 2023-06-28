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

import { SearchBox } from '../index.jsx';

import {
  ChapterCell,
  ChaptersContainer,
  ChapterIndexContainer,
  ChapterIndexFilterContainer,
} from './styles/styles.jsx';

function ChapterIndex({ selectedChapter, setSelectedChapter, chapters }) {
  return (
    <ChapterIndexContainer>
      <ChapterIndexFilterContainer>
        <SearchBox
          placeholder="Search"
          name="Filter Chapter"
          data={chapters}
          fuseConfigs={{}}
          autoFocus={false}
          onSelect={(record) => record}
          inputBackgroundColor="#f1f3f4"
          inputBorderColor="#f1f3f4"
          inputFontSize="16px"
        />
      </ChapterIndexFilterContainer>
      <ChaptersContainer>
        {chapters &&
          chapters.map((chapter) => (
            <ChapterCell
              key={chapter}
              active={chapter === selectedChapter}
              onClick={(e) => setSelectedChapter(e.target.getAttribute('key'))}
            >
              {chapter}
            </ChapterCell>
          ))}
      </ChaptersContainer>
    </ChapterIndexContainer>
  );
}

export default ChapterIndex;
