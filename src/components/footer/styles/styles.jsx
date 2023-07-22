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

export const FooterContainer = styled.footer`
  position: relative;
  width: 100%;
  max-width: 2000px;
  height: fit-content;
  display: block;
  margin: 0 auto;
  margin-top: 14px;

  .copyright-claim {
    text-align: center;
    font-size: 16px;
    font-weight: normal;

    a {
      font-weight: normal;
      text-decoration: none !important;
      transition: all 0.4s ease;
    }
  }
`;
