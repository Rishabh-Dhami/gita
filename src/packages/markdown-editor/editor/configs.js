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

export const defaultConfigs = {
  theme: 'default',
  view: {
    menu: true,
    md: true,
    html: true,
  },
  canView: {
    menu: true,
    md: true,
    html: true,
    both: true,
    fullScreen: true,
    hideMenu: true,
  },
  htmlClass: '',
  markdownClass: '',
  syncScrollMode: ['rightFollowLeft', 'leftFollowRight'],
  imageUrl: '',
  imageAccept: '',
  linkUrl: '',
  loggerMaxSize: 100,
  loggerInterval: 600,
  table: {
    maxRow: 4,
    maxCol: 6,
  },
  allowPasteImage: true,
  onImageUpload: undefined,
  onCustomImageUpload: undefined,
  shortcuts: true,
  onChangeTrigger: 'both',
};
