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

/**
 * Object containing the Markdown decorators and their corresponding starting and
 * ending characters.
 *
 * @typedef {Object} DecoratorObject
 */
const DECORATOR = {
  /**
   * @property {Array<string>} bold           - Array containing the starting and ending
   *                                            characters for bold text.
   */
  bold: ['**', '**'],
  /**
   * @property {Array<string>} italic         - Array containing the starting and ending
   *                                            characters for italic text.
   */
  italic: ['*', '*'],
  /**
   * @property {Array<string>} underline      - Array containing the starting and ending
   *                                            characters for underline text.
   */
  underline: ['++', '++'],
  /**
   * @property {Array<string>} strikethrough  - Array containing the starting and
   *                                            ending characters for strikethrough text.
   */
  strikethrough: ['~~', '~~'],
  /**
   * @property {Array<string>} inlinecode     - Array containing the starting and ending
   *                                            characters for inline code text.
   */
  inlinecode: ['`', '`'],
  /**
   * @property {Array<string>} quote          - Array containing the starting and ending
   *                                            characters for quoted text.
   */
  quote: ['\n>', '\n'],
  /**
   * @property {Array<string>} code           - Array containing the starting and ending
   *                                            characters for code blocks.
   */
  code: ['\n```\n', '\n```\n'],
};

/**
 * @property {Array<string>} header           - Array containing the starting and ending
 *                                              characters for headers.
 */
for (let i = 1; i <= 6; ++i)
  DECORATOR[`h${i}`] = [`\n${repeat('#', i)} `, '\n'];

/**
 * Generates a string representing a Markdown table with a specified number of
 * rows and columns.
 *
 * @param {Object} options      - An object containing options for the table.
 * @param {number} options.row  - The number of rows in the table (default is 2).
 * @param {number} options.col  - The number of columns in the table (default is 2).
 * @returns {string}            - A string representing the Markdown table.
 */
function generateMarkdownTable(option) {
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
    ...repeat(data, row, { extend: false }).map((item) => item.join('')),
  ];
  return rows.join('\n');
}

/**
 * Decorates a text as a list of either ordered or unordered type.
 *
 * @param {string} target - The target text to decorate.
 * @param {string} type   - The type of list to create. Can be either "ordered" or
 *                          "unordered".
 * @returns {string}      - The decorated text as a list.
 */
function generateList(target, type) {
  let text = target;
  if (text[0] !== '\n') text = `\n${text}`;
  if (text[text.length - 1] === '\n') text = text.substr(0, text.length - 1);

  if (type === 'unordered') {
    return text.length > 1 ? text.replace(/\n/g, '\n* ').trim() : '* ';
  }

  let count = 1;
  return text.length > 1
    ? text.replace(/\n/g, () => `\n${count++}. `).trim()
    : '1. ';
}

class Markdown {
  constructor(text) {
    this.text = text;
    this.textLength = this.text.length;
  }

  decorate({ newBlock = undefined, start = -1, end = -1 } = {}) {
    return {
      text: this.text,
      ...((newBlock && { newBlock: newBlock }) || {}),
      selection: {
        ...((start === -1 && { start: 0 }) || { start: start }),
        ...((end === -1 && { end: this.textLength }) || { end: end }),
      },
    };
  }
}

/**
 * Decorates the given input with the specified markdown syntax
 *
 * @param {string} target       - The text to decorate
 * @param {string} type         - The type of markdown decoration to apply
 * @param {object} [option={}]  - Additional options for the decoration (e.g. tabMapValue,
 *                                imageUrl, linkUrl)
 * @returns {Markdown}          - The decorated Markdown object
 */
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
        option.tabMapValue === 1 ? '\t' : repeat(' ', option.tabMapValue);
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
      return new Markdown(generateList(target, 'unordered')).decorate({
        newBlock: true,
      });
    }
    case 'ordered': {
      return new Markdown(generateList(target, 'ordered')).decorate({
        newBlock: true,
      });
    }
    case 'hr': {
      return new Markdown('---').decorate({ newBlock: true });
    }
    case 'table': {
      return new Markdown(generateMarkdownTable(option)).decorate({
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
