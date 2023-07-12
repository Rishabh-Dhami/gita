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

export const HtmlRendererContainer = styled.div`
  color: #333;
  font-family: 'Roboto', sans-serif;

  h1 {
    font-size: 32px;
    padding: 0px;
    border: none;
    font-weight: 700;
    margin: 32px 0;
    line-height: 1.2;
  }

  h2 {
    font-size: 24px;
    padding: 0px 0;
    border: none;
    font-weight: 700;
    margin: 24px 0;
    line-height: 1.7;
  }

  h3 {
    font-size: 18px;
    margin: 18px 0;
    padding: 0px 0;
    line-height: 1.7;
    border: none;
  }

  p {
    font-size: 18px;
    line-height: 1.7;
    margin: 8px 0;
  }

  a {
    color: #0052d9;
  }

  a:hover {
    text-decoration: none;
  }

  strong {
    font-weight: 700;
  }

  ol,
  ul {
    font-size: 18px;
    line-height: 28px;
    padding-left: 36px;
  }

  li {
    margin-bottom: 8px;
    line-height: 1.7;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  pre {
    display: block;
    background-color: #f5f5f5;
    padding: 20px;
    font-size: 18px;
    line-height: 28px;
    border-radius: 0;
    overflow-x: auto;
    word-break: break-word;
  }

  code {
    background-color: #f5f5f5;
    border-radius: 0;
    padding: 3px 0;
    margin: 0;
    font-size: 18px;
    overflow-x: auto;
    word-break: normal;
  }

  code:after,
  code:before {
    letter-spacing: 0;
  }

  blockquote {
    position: relative;
    margin: 16px 0;
    padding: 5px 8px 5px 30px;
    background: none repeat scroll 0 0 rgba(102, 128, 153, 0.05);
    border: none;
    color: #333;
    border-left: 10px solid #d6dbdf;
  }

  img,
  video {
    max-width: 100%;
  }

  table {
    font-size: 18px;
    line-height: 1.7;
    max-width: 100%;
    overflow: auto;
    border: 1px solid #f6f6f6;
    border-collapse: collapse;
    border-spacing: 0;
    box-sizing: border-box;
  }

  table td,
  table th {
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
  }

  table tr {
    border: 1px solid #efefef;
  }

  table tr:nth-child(2n) {
    background-color: transparent;
  }

  table th {
    text-align: center;
    font-weight: 700;
    border: 1px solid #efefef;
    padding: 10px 6px;
    background-color: #f5f7fa;
    word-break: break-word;
  }

  table td {
    border: 1px solid #efefef;
    text-align: left;
    padding: 10px 15px;
    word-break: break-word;
    min-width: 60px;
  }
`;
