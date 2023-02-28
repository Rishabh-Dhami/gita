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

import { isPromise } from './tools';
import { v4 as uuid } from 'uuid';
import { decorateIt } from './decorate.js';

export function getUploadPlaceholder(file, onImageUpload) {
  const placeholder = decorateIt('', 'image', {
    target: `Uploading_${uuid()}`,
    imageUrl: '',
  }).text;

  const uploaded = new Promise((resolve) => {
    const handleUploaded = (url) => {
      resolve(
        decorateIt('', 'image', { target: file.name, imageUrl: url }).text
      );
    };

    const upload = onImageUpload(file, handleUploaded);
    if (isPromise(upload)) upload.then(handleUploaded);
    else
      throw new Error(
        `${getUploadPlaceholder.name}: Can't resolve Promise 'upload'`
      );
  });

  return { placeholder, uploaded };
}
