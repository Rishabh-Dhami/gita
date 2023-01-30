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
import { FaPlus } from 'react-icons/fa';

import {
  AddTextCellButton,
  AddTextCellInnerBar,
  AddTextCellContainer,
} from './styles/styles.jsx';

function AddTextCell({ onAddTextCell }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const addTextCellContainers = document.querySelectorAll(
      '.add-text-cell-toolbar-container'
    );
    addTextCellContainers.forEach((addTextCellContainer) =>
      addTextCellContainer.addEventListener('mouseenter', handleMouseEnter)
    );
    addTextCellContainers.forEach((addTextCellContainer) =>
      addTextCellContainer.addEventListener('mouseleave', handleMouseLeave)
    );

    return () => {
      addTextCellContainers.forEach((addTextCellContainer) =>
        addTextCellContainer.removeEventListener('mouseenter', handleMouseEnter)
      );
      addTextCellContainers.forEach((addTextCellContainer) =>
        addTextCellContainer.removeEventListener('mouseleave', handleMouseLeave)
      );
    };
  }, []);

  return (
    <AddTextCellContainer className="add-text-cell-toolbar-container">
      {isVisible && (
        <>
          <AddTextCellInnerBar />
          <AddTextCellButton onClick={onAddTextCell}>
            <FaPlus /> Text
          </AddTextCellButton>
        </>
      )}
    </AddTextCellContainer>
  );
}

export default AddTextCell;
