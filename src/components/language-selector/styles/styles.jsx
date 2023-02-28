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

import { BACKGROUND, BORDER } from '../../../constants/styles/colors.js';

export const LanguageSelectorContainer = styled.div`
  position: relative;
  border: 2px solid ${BORDER.lightgrey1};
  border-radius: 5px;
`;

export const LanguageSelectorOption = styled.option``;

export const LanguageSelectorSelect = styled.select`
  width: 130px;
  height: 40px;
  outline: none;
  background-color: ${BACKGROUND.white};
  border: none;
  background: transparent;
  background-image: url(data:image/svg+xml,%3Csvg%20aria-hidden%3D%22true%22%20class%3D%22icon-language%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M12%2022q-2.05%200-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2%2014.05%202%2012q0-2.075.788-3.887.787-1.813%202.15-3.175Q6.3%203.575%208.125%202.787%209.95%202%2012%202q2.075%200%203.887.787%201.813.788%203.175%202.151%201.363%201.362%202.15%203.175Q22%209.925%2022%2012q0%202.05-.788%203.875-.787%201.825-2.15%203.187-1.362%201.363-3.175%202.15Q14.075%2022%2012%2022Zm0-2.05q.65-.9%201.125-1.875T13.9%2016h-3.8q.3%201.1.775%202.075.475.975%201.125%201.875Zm-2.6-.4q-.45-.825-.787-1.713Q8.275%2016.95%208.05%2016H5.1q.725%201.25%201.812%202.175Q8%2019.1%209.4%2019.55Zm5.2%200q1.4-.45%202.487-1.375Q18.175%2017.25%2018.9%2016h-2.95q-.225.95-.562%201.837-.338.888-.788%201.713ZM4.25%2014h3.4q-.075-.5-.113-.988Q7.5%2012.525%207.5%2012t.037-1.012q.038-.488.113-.988h-3.4q-.125.5-.188.988Q4%2011.475%204%2012t.062%201.012q.063.488.188.988Zm5.4%200h4.7q.075-.5.113-.988.037-.487.037-1.012t-.037-1.012q-.038-.488-.113-.988h-4.7q-.075.5-.112.988Q9.5%2011.475%209.5%2012t.038%201.012q.037.488.112.988Zm6.7%200h3.4q.125-.5.188-.988Q20%2012.525%2020%2012t-.062-1.012q-.063-.488-.188-.988h-3.4q.075.5.112.988.038.487.038%201.012t-.038%201.012q-.037.488-.112.988Zm-.4-6h2.95q-.725-1.25-1.813-2.175Q16%204.9%2014.6%204.45q.45.825.788%201.712.337.888.562%201.838ZM10.1%208h3.8q-.3-1.1-.775-2.075Q12.65%204.95%2012%204.05q-.65.9-1.125%201.875T10.1%208Zm-5%200h2.95q.225-.95.563-1.838.337-.887.787-1.712Q8%204.9%206.912%205.825%205.825%206.75%205.1%208Z%22%3E%3C%2Fpath%3E%0A%20%20%20%20%20%20%20%20%3C%2Fsvg%3E),
    url(data:image/svg+xml,%3Csvg%20aria-hidden%3D%22true%22%20class%3D%22icon-arrow%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22m12%2015-5-5h10Z%22%3E%3C%2Fpath%3E%0A%3C%2Fsvg%3E);
  background-position: left bottom, right top;
  background-repeat: no-repeat, no-repeat;
  background-size: 30px, 30px;
  background-position-x: 10%, 95%;
  background-position-y: 6px, 6px;
  text-indent: 35px;
  padding: 10px;

  -webkit-appearance: none;
  -moz-appearance: none;
`;
