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

import { decorateIt } from '../../utils/decorate.js';

describe('decorateIt', () => {
  test('bold', () => {
    const result1 = decorateIt('hello', 'bold');

    expect(result1.text).toBe('**hello**');
    expect(result1.selection.start).toBe(2);
    expect(result1.selection.end).toBe(7);
  });

  test('italic', () => {
    const result1 = decorateIt('hello', 'italic');

    expect(result1.text).toBe('*hello*');
    expect(result1.selection.start).toBe(1);
    expect(result1.selection.end).toBe(6);
  });

  test('underline', () => {
    const result1 = decorateIt('hello', 'underline');

    expect(result1.text).toBe('++hello++');
    expect(result1.selection.start).toBe(2);
    expect(result1.selection.end).toBe(7);
  });

  test('strikethrough', () => {
    const result1 = decorateIt('hello', 'strikethrough');

    expect(result1.text).toBe('~~hello~~');
    expect(result1.selection.start).toBe(2);
    expect(result1.selection.end).toBe(7);
  });

  test('inlinecode', () => {
    const result1 = decorateIt('hello', 'inlinecode');

    expect(result1.text).toBe('`hello`');
    expect(result1.selection.start).toBe(1);
    expect(result1.selection.end).toBe(6);
  });

  test('quote', () => {
    const result1 = decorateIt('hello', 'quote');

    expect(result1.text).toBe('\n>hello\n');
    expect(result1.selection.start).toBe(2);
    expect(result1.selection.end).toBe(7);
  });

  test('code', () => {
    const result1 = decorateIt('hello', 'code');

    expect(result1.text).toBe('\n```\nhello\n```\n');
    expect(result1.selection.start).toBe(5);
    expect(result1.selection.end).toBe(10);
  });

  test('h1', () => {
    const result1 = decorateIt('hello', 'h1');

    expect(result1.text).toBe('\n# hello\n');
    expect(result1.selection.start).toBe(3);
    expect(result1.selection.end).toBe(8);
  });

  test('h2', () => {
    const result1 = decorateIt('hello', 'h2');

    expect(result1.text).toBe('\n## hello\n');
    expect(result1.selection.start).toBe(4);
    expect(result1.selection.end).toBe(9);
  });

  test('h3', () => {
    const result1 = decorateIt('hello', 'h3');

    expect(result1.text).toBe('\n### hello\n');
    expect(result1.selection.start).toBe(5);
    expect(result1.selection.end).toBe(10);
  });

  test('h4', () => {
    const result1 = decorateIt('hello', 'h4');

    expect(result1.text).toBe('\n#### hello\n');
    expect(result1.selection.start).toBe(6);
    expect(result1.selection.end).toBe(11);
  });

  test('h5', () => {
    const result1 = decorateIt('hello', 'h5');

    expect(result1.text).toBe('\n##### hello\n');
    expect(result1.selection.start).toBe(7);
    expect(result1.selection.end).toBe(12);
  });

  test('h6', () => {
    const result1 = decorateIt('hello', 'h6');

    expect(result1.text).toBe('\n###### hello\n');
    expect(result1.selection.start).toBe(8);
    expect(result1.selection.end).toBe(13);
  });

  test('unordered', () => {
    const result1 = decorateIt('hello\nworld\n', 'unordered');

    expect(result1.text).toBe('* hello\n* world');
    expect(result1.selection.start).toBe(0);
    expect(result1.selection.end).toBe(15);
    expect(result1.newBlock).toBe(true);
  });

  test('ordered', () => {
    const result1 = decorateIt('hello\nworld\n', 'ordered');

    expect(result1.text).toBe('1. hello\n2. world');
    expect(result1.selection.start).toBe(0);
    expect(result1.selection.end).toBe(17);
    expect(result1.newBlock).toBe(true);
  });

  test('hr', () => {
    const result1 = decorateIt('', 'hr');

    expect(result1.text).toBe('---');
    expect(result1.selection.start).toBe(0);
    expect(result1.selection.end).toBe(3);
    expect(result1.newBlock).toBe(true);
  });

  test('table', () => {
    const result1 = decorateIt('', 'table', { row: 2, col: 3 });

    expect(result1.text).toBe(
      '| Head | Head | Head |\n| --- | --- | --- |\n| Data | Data | Data |\n| Data | Data | Data |'
    );
    expect(result1.selection.start).toBe(0);
    expect(result1.selection.end).toBe(88);
    expect(result1.newBlock).toBe(true);
  });

  test('image', () => {
    const result1 = decorateIt('image', 'image', {
      imageUrl: 'https://example.com/image.jpg',
    });
    expect(result1.text).toBe('![image](https://example.com/image.jpg)');
    expect(result1.selection.start).toBe(2);
    expect(result1.selection.end).toBe(7);

    const result2 = decorateIt('my image', 'image', {
      target: 'image1',
      imageUrl: 'https://example.com/image.jpg',
    });
    expect(result2.text).toBe('![my image](https://example.com/image.jpg)');
    expect(result2.selection.start).toBe(2);
    expect(result2.selection.end).toBe(10);
  });

  test('link', () => {
    const result1 = decorateIt('link', 'link', {
      linkUrl: 'https://example.com',
    });
    expect(result1.text).toBe('[link](https://example.com)');
    expect(result1.selection.start).toBe(1);
    expect(result1.selection.end).toBe(5);

    const result2 = decorateIt('my link', 'link', {
      target: 'link1',
      linkUrl: 'https://example.com',
    });
    expect(result2.text).toBe('[my link](https://example.com)');
    expect(result2.selection.start).toBe(1);
    expect(result2.selection.end).toBe(8);
  });

  test('tab', () => {
    const result1 = decorateIt('hello\nworld', 'tab', { tabMapValue: 2 });
    expect(result1.text).toBe('  hello\n  world');
    expect(result1.selection.start).toBe(2);
    expect(result1.selection.end).toBe(15);

    const result2 = decorateIt('hello\n\nworld', 'tab', { tabMapValue: 4 });
    expect(result2.text).toBe('    hello\n    \n    world');
    expect(result2.selection.start).toBe(4);
    expect(result2.selection.end).toBe(24);
  });
});
