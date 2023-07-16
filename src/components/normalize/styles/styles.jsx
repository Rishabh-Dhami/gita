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

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;

    ::-webkit-scrollbar {
      width: 0px;
    }
    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 50px;
    }
    ::-webkit-scrollbar-button {
      display: none;
    }
    ::-webkit-scrollbar-corner {
      background-color: #e3e2e1;
    }
  }

  /**
   * 1. Correct the line height in all browsers.
   * 2. Prevent adjustments of font size after orientation changes in iOS.
   */
  html {
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
  }

  /**
   * Remove browser margins.
   */ 
  body {
    margin: 0;
    width:100%;
    overflow-x:hidden;
    overflow-y:hidden;
  }

  /**
   * Render the main element consistently. 
   */
  main {
    display: block;
  }

  /**
   * Correct the font size and margin on "h1" elements within "section" and
   * "article" contexts in Chrome, Firefox, and Safari. 
   */
  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }

  /**
   * Remove the gray background on active links. 
   */
  a {
    background-color: transparent;
  }

  /**
   * Add the correct font weight in Chrome, Edge, and Safari. 
   */
  b, strong {
    font-weight: bolder;
  }

  /**
   * Add the correct font size in all the browsers. 
   */
  small {
    font-size: 80%;
  }

  /**
   * Remove the border on images inside links in IE 10. 
   */
  img {
    border-style: none;
  }

  /**
   * 1. Change the font style in all browsers.
   * 2. Remove the margin in Firefox and Safari. 
   */
  button, input, select, textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }

  /**
   * Show the overflow in IE.
   * 1. Show the overflow in Edge. 
   */
  button, input {
    overflow: visible;
  }

  /**
   * Remove the inheritance of text transform in Edge, Firefox, and IE.
   * 1. Remove the inheritance of text transform in Firefox.
   */
  button, select {
    text-transform: none;
  }
  
  /**
   * Correct the inability to style clickable types in iOS and Safari.
   */
  button, [type="button"], [type="reset"], [type="submit"] {
    -webkit-appearance: button;
  }
  
  /**
   * Remove the inner border and padding in Firefox.
   */
  button::-moz-focus-inner, [type="button"]::-moz-focus-inner,
  [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }
  
  /**
   * Restore the focus styles unset by the previous rule.
   */
  button:-moz-focusring, [type="button"]:-moz-focusring,
  [type="reset"]:-moz-focusring, [type="submit"]:-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  /**
   * Remove the default vertical scrollbar in IE 10+.
   */
  textarea {
    overflow: auto;
  }

  /**
   * 1. Correct the odd appearance in Chrome and Safari.
   * 2. Correct the outline style in Safari.
   */
  [type="search"] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }
  
  /**
   * Remove the inner padding in Chrome and Safari on macOS.
   */
  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }
`;
