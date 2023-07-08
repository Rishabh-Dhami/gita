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

import { initializeApp } from 'firebase/app';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  getFirestore,
} from 'firebase/firestore';

import { firebaseConfig } from './config.js';

export class FirestoreChapterManager {
  constructor(docId = null) {
    initializeApp(firebaseConfig);

    this._db = getFirestore();
    this._docId = docId || null;
    this._chapterList = [];
    this._chapterInfo = {};
    this._forceUpdateChapterList = false;
    this._forceUpdateChapterInfo = false;
  }

  lockForDocId(docId, { override } = { override: false }) {
    if (docId === undefined || docId === null) {
      throw new Error(
        `Cannot accept empty identifier, given '${docId}'.\n` +
          `You probably want to choose one by calling 'getChapterList()' first.`
      );
    }
    if (this._docId !== docId && override === false) {
      throw new Error(
        `Trying to lock on a different doc id when one is already set.\n` +
          `If this is supposed to override it, use { override: true } parameter.`
      );
    }
    if (this._docId !== docId) this._forceUpdateChapterInfo = true;
    this._docId = docId;
  }

  async getChapterList(callback) {
    if (
      this._chapterList.length !== 0 &&
      this._forceUpdateChapterList === false
    ) {
      return this._chapterList;
    }

    this._forceUpdateChapterList = false;
    const querySnapshot = await getDocs(collection(this._db, 'chapters'));

    querySnapshot.forEach((doc) => {
      this._chapterList.push({
        id: doc.id,
        name: doc.data()['name'],
        position: doc.data()['position'],
        isSelected: doc.data()['isSelected'],
      });
    });

    callback(this._chapterList);
  }

  async getChapterInfo(callback) {
    if (this._docId === undefined || this._docId === null) {
      throw new Error(
        `getChapterInfo() is called before assignment of document id.\n` +
          `Make sure you choose one by calling getChapterList() first.`
      );
    }

    if (
      Object.keys(this._chapterInfo).length !== 0 &&
      this._forceUpdateChapterInfo === false
    ) {
      return this._chapterInfo;
    }

    this._forceUpdateChapterInfo = false;
    const querySnapshot = await getDocs(collection(this._db, 'chapters'));

    querySnapshot.forEach((doc) => {
      if (this._docId !== doc.id) return;

      const chapterContents = doc.data();

      this._chapterInfo['name'] = chapterContents['name'];
      this._chapterInfo['data'] = chapterContents['data'];
      this._chapterInfo['position'] = chapterContents['position'];
      this._chapterInfo['isSelected'] = chapterContents['isSelected'];
    });

    callback({ id: this._docId, data: this._chapterInfo });
  }

  /**
   * @function addNewChapter() adds the given data in a newly created document
   * in the firestore database.
   *
   * You can use the "id" attribute of the "DocumentReference" returned to
   * later update the document using the "setDoc()" function which requires the
   * "id" attribute to locate the correct document.
   *
   * @returns DocumentReference
   */
  async addNewChapter({ name, data, position, isSelected }, callback) {
    const docRef = await addDoc(collection(this._db, 'chapters'), {
      name,
      data,
      position,
      isSelected,
    });

    this._forceUpdateChapterList = true;
    await this.getChapterList((chapterList) => {
      this._chapterList = chapterList;
    });
    callback(docRef);
  }

  async setChapterInfo({ name, data, position, isSelected }, callback) {
    await setDoc(
      doc(this._db, 'chapters', this._docId),
      {
        name,
        data,
        position,
        isSelected,
      },
      { merge: true }
    );

    this._forceUpdateChapterInfo = true;
    await this.getChapterInfo(({ id, data }) => {
      this._docId = id;
      this._chapterInfo = data;
    });
    callback({ id: this._docId, data: this._chapterInfo });
  }
}

export class FirestoreSupportedTranslationLanguageManager {
  constructor() {
    initializeApp(firebaseConfig);

    this._db = getFirestore();
    this._supportedTranslationLanguages = [];
  }

  async getSupportedTranslationLanguages(callback) {
    const querySnapshot = await getDocs(
      collection(this._db, 'supported_translation_languages')
    );

    querySnapshot.forEach((doc) => {
      this._supportedTranslationLanguages.push({ ...doc.data()['language'] });
    });

    callback(this._supportedTranslationLanguages);
  }
}
