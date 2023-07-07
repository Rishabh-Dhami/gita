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

import { Input } from '../search-box/index.jsx';
import { SearchBox } from '../index.jsx';

import { FirestoreChapterManager } from '../../firebase/firestore-request.js';

import {
  ChapterCell,
  ChaptersContainer,
  ChapterIndexContainer,
  ChapterIndexActionContainer,
  ChapterAddButton,
} from './styles/styles.jsx';

function ChapterIndex({
  selectedChapter,
  setSelectedChapter,
  chapters,
  setChapters,
}) {
  const [newChapterName, setNewChapterName] = useState('');
  const [addChapterEvent, setAddChapterEvent] = useState('deactive');

  const executeAddChapterEvent = (e) => {
    setAddChapterEvent('active');
  };

  const handleQuickSubmit = (e) => {
    if (e.key !== 'Enter' || e.keyCode !== 13) return;

    const firestoreChapterManager = new FirestoreChapterManager();
    if (/\S/.test(newChapterName)) {
      firestoreChapterManager.addNewChapter(
        {
          name: newChapterName,
          data: '',
        },
        (docRef) => {
          setChapters([...chapters, { id: docRef.id, name: newChapterName }]);
        }
      );
    }

    setNewChapterName('');
    setAddChapterEvent('deactive');
  };

  return (
    <ChapterIndexContainer>
      <ChapterIndexActionContainer>
        {addChapterEvent === 'deactive' ? (
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
        ) : (
          <Input
            placeholder="Chapter Name"
            name=""
            value={newChapterName}
            onChange={(e) => setNewChapterName(e.target.value)}
            autoFocus={false}
            onFocus={() => {}}
            inputFontColor="#000"
            inputBorderColor="#cacaca96"
            inputFontSize="14px"
            inputHeight="40px"
            iconBoxSize="24px"
            onKeyDown={handleQuickSubmit}
            type="text"
          />
        )}
        <ChapterAddButton onClick={executeAddChapterEvent}>+</ChapterAddButton>
      </ChapterIndexActionContainer>
      <ChaptersContainer>
        {chapters &&
          chapters.map(({ id, name }) => (
            <ChapterCell
              key={id}
              id={id}
              active={id === selectedChapter?.id}
              onClick={(e) => {
                setSelectedChapter({
                  id: e.target.getAttribute('id'),
                  name: e.target.innerText,
                });
              }}
            >
              {name}
            </ChapterCell>
          ))}
      </ChaptersContainer>
    </ChapterIndexContainer>
  );
}

export default ChapterIndex;
