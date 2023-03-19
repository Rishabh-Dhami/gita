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

import { i18n } from '../../i18n/index.js';
import { Icon, DropList } from '../../components/index.jsx';

import { TableListContainer } from './styles/styles.jsx';

TableList.config = { padding: 3, width: 20, height: 20 };

function TableList({ ...props }) {
  const { maxRow = 5, maxCol = 6 } = props;

  const formatTableModel = (maxRow = 0, maxCol = 0) => {
    const result = new Array(maxRow).fill(undefined);
    return result.map((_) => new Array(maxCol).fill(0));
  };
  const [list, setList] = useState(formatTableModel(maxRow, maxCol));

  const calcWrapStyle = () => {
    const { width, height, padding } = TableList.config;
    const wrapWidth = (width + padding) * maxCol - padding;
    const wrapHeight = (height + padding) * maxRow - padding;
    return { width: `${wrapWidth}px`, height: `${wrapHeight}px` };
  };

  const calcItemStyle = (row = 0, col = 0) => {
    const { width, height, padding } = TableList.config;
    const top = (height + padding) * row;
    const left = (width + padding) * col;
    return { top: `${top}px`, left: `${left}px` };
  };

  const getList = (i, j) => {
    return list.map((v, row) =>
      v.map((_, col) => (row <= i && col <= j ? 1 : 0))
    );
  };

  const handleHover = (i, j) => {
    setList(getList(i, j));
  };

  const handleSetTable = (i, j) => {
    const { onSetTable } = props;
    typeof onSetTable === 'function' && onSetTable({ row: i + 1, col: j + 1 });
  };

  useEffect(() => {
    if (props.visibility) setList(getList(-1, -1));
  }, [props.visibility]);

  return (
    <TableListContainer style={calcWrapStyle()}>
      {list.map((row, i) =>
        row.map((col, j) => (
          <li
            className={`list-item ${col === 1 ? 'active' : ''}`}
            key={`${i}-${j}`}
            style={calcItemStyle(i, j)}
            onMouseOver={() => handleHover(i, j)}
            onClick={() => handleSetTable(i, j)}
          />
        ))
      )}
    </TableListContainer>
  );
}

Table.pluginName = 'table';
Table.align = 'left';
Table.defaultConfigs = { maxRow: 4, maxCol: 5 };

function Table({ ...props }) {
  const { editor } = props;
  const [show, setShow] = useState(false);

  return (
    <span
      className="button"
      title={i18n.get('btnTable')}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Icon type="table" />
      <DropList
        visibility={show ? 'visible' : 'in-visible'}
        onClose={() => setShow(false)}
      >
        <TableList
          visibility={show}
          maxRow={Table.defaultConfigs.maxRow}
          maxCol={Table.defaultConfigs.maxCol}
          onSetTable={(option) => editor.insertMarkdown('table', option)}
        />
      </DropList>
    </span>
  );
}

export default Table;
