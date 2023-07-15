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

import React, { useState, useEffect } from 'react';

import { Input } from '../search-box/index.jsx';
import { SearchBox } from '../index.jsx';

import { FirestoreChapterManager } from '../../firebase/firestore-request.js';

import {
  ChapterCell,
  ChaptersContainer,
  ChapterIndexContainer,
  ChapterAddButton,
} from './styles/styles.jsx';

function ChapterIndex({
  selectedChapter,
  setSelectedChapter,
  chapters,
  setChapters,
  position,
}) {
  const [newChapterName, setNewChapterName] = useState('');
  const [addChapterEvent, setAddChapterEvent] = useState('deactive');

  useEffect(() => {
    if (chapters.length > 0) chapters.sort((a, b) => a.position - b.position);
  }, [chapters]);

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
          position: chapters.length,
          isSelected: true,
        },
        (docRef) => {
          setChapters([
            ...chapters,
            {
              id: docRef.id,
              name: newChapterName,
              position: chapters.length,
              isSelected: true,
            },
          ]);
        }
      );
    }

    setNewChapterName('');
    setAddChapterEvent('deactive');
  };

  return (
    <ChapterIndexContainer>
      <div
        className={`chapter-index-container ${
          position === 'out' ? 'container-out' : 'container-in'
        }`}
      >
        <div className="chapter-index-action-container">
          {addChapterEvent === 'deactive' ? (
            <SearchBox
              placeholder="Search"
              name="Filter Chapter"
              data={chapters}
              fuseConfigs={{ keys: ['name'] }}
              autoFocus={false}
              onSelect={(record) => record}
              inputBackgroundColor="#f1f3f4"
              inputBorderColor="#f1f3f4"
              inputFontSize="16px"
              clearOnSelect={true}
              onSelect={(record) => {
                setSelectedChapter({
                  id: record.item.id,
                  name: record.item.name,
                  position: record.item.position,
                  isSelected: true,
                });
              }}
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
          <ChapterAddButton onClick={executeAddChapterEvent}>
            +
          </ChapterAddButton>
        </div>
        <ChaptersContainer>
          {chapters &&
            chapters.map(({ id, name, isSelected }) => (
              <ChapterCell
                key={id}
                id={id}
                active={isSelected}
                onClick={(e) => {
                  setSelectedChapter({
                    id: e.target.getAttribute('id'),
                    name: e.target.innerText,
                    isSelected: true,
                  });
                }}
              >
                {name}
              </ChapterCell>
            ))}
        </ChaptersContainer>
      </div>
    </ChapterIndexContainer>
  );
}

export default ChapterIndex;
