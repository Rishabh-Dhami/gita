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
import { useNavigate } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

import {
  Navbar,
  SearchBox,
  TextEditor,
  AddTextCell,
  ChapterIndex,
  LanguageSelector,
} from '../../components/index.jsx';

import {
  Container,
  MenuContainer,
  BookContainer,
  ChapterContainer,
  OnThisPageContainer,
  UserActionContainer,
} from './styles/styles.jsx';
import { SignInButton } from '../../components/sign-in-form/styles/styles.jsx';

function SignIn() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/signin');
  };

  return <SignInButton onClick={handleClick}>Sign In</SignInButton>;
}

function UserAction() {
  const loadLanguageSelector = () => {
    const [language, setLanguage] = useState('en');
    const languages = [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
      { code: 'fr', label: 'Français' },
      { code: 'de', label: 'Deutsch' },
    ];

    return (
      <LanguageSelector
        language={language}
        setLanguage={setLanguage}
        languages={languages}
      />
    );
  };

  return (
    <UserActionContainer>
      <SearchBox
        placeholder="Search"
        name="Filter Chapter"
        data={[]}
        fuseConfigs={{}}
        autoFocus={false}
        onSelect={(record) => record}
        inputBackgroundColor="#f1f3f4"
        inputBorderColor="#f1f3f4"
        inputFontSize="16px"
      />
      {loadLanguageSelector()}
      <SignIn />
    </UserActionContainer>
  );
}

function Book() {
  const [textEditors, setTextEditors] = useState([]);
  const [textEditorsVisibility, setTextEditorsVisibility] = useState(false);

  const renderTextEditor = () => {
    return (
      <React.Fragment key={uuidv4()}>
        <TextEditor />
        <AddTextCell onAddTextCell={onAddTextCell} />
      </React.Fragment>
    );
  };

  const onAddTextCell = () => {
    setTextEditors([...textEditors, renderTextEditor]);
    setTextEditorsVisibility(true);
  };

  return (
    <Container>
      <Navbar rightChild={<UserAction />} />
      <BookContainer>
        <MenuContainer>
          <ChapterIndex />
        </MenuContainer>
        <ChapterContainer>
          <AddTextCell onAddTextCell={onAddTextCell} />
          {textEditorsVisibility && textEditors.map((editor) => editor())}
        </ChapterContainer>
        <OnThisPageContainer></OnThisPageContainer>
      </BookContainer>
    </Container>
  );
}

export default Book;
