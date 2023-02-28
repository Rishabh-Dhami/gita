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

import { repeat } from '../utils/tools.js';

const DECORATOR = {
  bold: ['**', '**'],
  italic: ['*', '*'],
  underline: ['++', '++'],
  strikethrough: ['~~', '~~'],
  inlinecode: ['`', '`'],
  quote: ['\n>', '\n'],
  code: ['\n```\n', '\n```\n'],
};

for (let i = 1; i <= 6; ++i) DECORATOR[`h${i}`] = [`\n${repeat('#', i)}`, '\n'];

function decorateTableTemplate(option) {
  const { row = 2, col = 2 } = option;

  const header = ['|'];
  const data = ['|'];
  const division = ['|'];

  for (let i = 0; i < col; i++) header.push(' Head |');
  for (let i = 0; i < col; i++) division.push(' --- |');
  for (let i = 0; i < col; i++) data.push(' Data |');

  let rows = [
    header.join(''),
    division.join(''),
    ...repeat(data.join(''), row, { extend: false }),
  ];
  return rows.join('\n');
}

function decorateList(target, type) {
  let text = target;
  if (text[0] !== '\n') text = '\n' + text;

  if (type === 'unordered') {
    return text.length > 1 ? text.replace(/\n/g, '\n* ').trim() : '* ';
  }

  let count = 1;
  return text.length > 1 ? text.replace(/\n/g, () => `${count++}. `) : '1. ';
}

class Markdown {
  constructor(text) {
    this.text = text;
  }

  decorate(
    { newBlock, start, end } = {
      newBlock: undefined,
      start: -1,
      end: -1,
    }
  ) {
    return {
      text: this.text,
      ...((newBlock && { newBlock: newBlock }) || {}),
      selection: {
        ...((start !== -1 && { start: start }) || { start: text.length }),
        ...((end !== -1 && { end: end }) || { end: text.length }),
      },
    };
  }
}

export function decorateIt(target, type, option = {}) {
  if (typeof DECORATOR[type] !== 'undefined') {
    return new Markdown(
      `${DECORATOR[type][0]}${target}${DECORATOR[type][1]}`
    ).decorate({
      start: DECORATOR[type][0].length,
      end: DECORATOR[type][0].length + target.length,
    });
  }

  switch (type) {
    case 'tab': {
      const inputVal =
        option.tabMapValue === 1 ? '\t' : ' '.repeat(option.tabMapValue);
      const newSelectedText = `${inputVal}${target.replace(
        /\n/g,
        `\n${inputVal}`
      )}`;
      const lineBreakCount = target.includes('\n')
        ? target.match(/\n/g)?.length
        : 0;
      return new Markdown(newSelectedText).decorate({
        start: option.tabMapValue,
        end: option.tabMapValue * (lineBreakCount + 1) + target.length,
      });
    }
    case 'unordered': {
      return new Markdown(decorateList(target, 'unordered')).decorate({
        newBlock: true,
      });
    }
    case 'ordered': {
      return new Markdown(decorateList(target, 'ordered')).decorate({
        newBlock: true,
      });
    }
    case 'hr': {
      return new Markdown('---').decorate({ newBlock: true });
    }
    case 'table': {
      return new Markdown(decorateTableTemplate(option)).decorate({
        newBlock: true,
      });
    }
    case 'image': {
      return new Markdown(
        `![${target || option.target}](${option.imageUrl || ''})`
      ).decorate({
        start: 2,
        end: target.length + 2,
      });
    }
    case 'link': {
      return new Markdown(`[${target}](${option.linkUrl || ''})`).decorate({
        start: 1,
        end: target.length + 1,
      });
    }
  }

  return new Markdown(target).decorate({ start: 0, end: target.length });
}
