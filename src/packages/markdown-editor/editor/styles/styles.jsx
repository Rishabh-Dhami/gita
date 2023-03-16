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

import styled from 'styled-components';

export const MarkdownEditorContainer = styled.div`
  padding-bottom: 1px;
  position: relative;
  border: 1px solid #e0e0e0;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &.full {
    width: 100%;
    height: 100% !important;
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 1000;
  }
`;

export const MarkdownEditorContainerInner = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  min-height: 0;
  position: relative;
`;

export const MarkdownEditorTextAreaContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 1px;
  border-right: 1px solid #e0e0e0;
  min-height: 0;
  min-width: 0;
  height: fit-content;

  &.in-visible {
    display: none;
  }

  > textarea {
    padding: 15px;
    padding-top: 10px;
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    border: none;
    resize: none;
    outline: none;
    min-height: 0;
    background: #fff;
    color: #333;
    font-size: 16px;
    line-height: 1.7;
    overflow: hidden;
  }
`;

export const MarkdownEditorPreviewContainer = styled.div`
  min-height: 0;
  min-width: 0;

  &.in-visible {
    display: none;
  }

  > .preview-wrapper {
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
  }
`;
