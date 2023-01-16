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

import LOGGER from '../../../lib/logger/logger.js';

describe('LOGGER', () => {
  it('should be importable from package', () => {
    expect(typeof LOGGER).toBe('function');
  });
});

describe('LOGGER.OFF', () => {
  it('should be importable once LOGGER is imported', () => {
    expect(typeof LOGGER.OFF).toBe('object');
  });
});

describe('LOGGER.ERROR', () => {
  it('should be importable once LOGGER is imported', () => {
    expect(typeof LOGGER.ERROR).toBe('object');
  });
});

describe('LOGGER.WARN', () => {
  it('should be importable once LOGGER is imported', () => {
    expect(typeof LOGGER.WARN).toBe('object');
  });
});

describe('LOGGER.INFO', () => {
  it('should be importable once LOGGER is imported', () => {
    expect(typeof LOGGER.INFO).toBe('object');
  });
});

describe('LOGGER.DEBUG', () => {
  it('should be importable once LOGGER is imported', () => {
    expect(typeof LOGGER.DEBUG).toBe('object');
  });
});

describe('LOGGER.TRACE', () => {
  it('should be importable once LOGGER is imported', () => {
    expect(typeof LOGGER.TRACE).toBe('object');
  });
});

describe('LOGGER.OFF', () => {
  describe('LOGGER.OFF.value', () => {
    it('should be accessible within OFF', () => {
      expect(LOGGER.OFF.value).toBe(99);
    });
  });

  describe('LOGGER.OFF.name', () => {
    it("should be accessible as 'undefined' within OFF", () => {
      expect(LOGGER.OFF.name).toBe(undefined);
    });
  });
});

describe('LOGGER.ERROR', () => {
  describe('LOGGER.ERROR.value', () => {
    it('should be accessible within ERROR', () => {
      expect(LOGGER.ERROR.value).toBe(8);
    });
  });

  describe('LOGGER.ERROR.name', () => {
    it('should be accessible within ERROR', () => {
      expect(LOGGER.ERROR.name).toBe('ERROR');
    });
  });
});

describe('LOGGER.WARN', () => {
  describe('LOGGER.WARN.value', () => {
    it('should be accessible within WARN', () => {
      expect(LOGGER.WARN.value).toBe(5);
    });
  });

  describe('LOGGER.WARN.name', () => {
    it('should be accessible within WARN', () => {
      expect(LOGGER.WARN.name).toBe('WARN');
    });
  });
});

describe('LOGGER.INFO', () => {
  describe('LOGGER.INFO.value', () => {
    it('should be accessible within INFO', () => {
      expect(LOGGER.INFO.value).toBe(3);
    });
  });

  describe('LOGGER.INFO.name', () => {
    it('should be accessible within INFO', () => {
      expect(LOGGER.INFO.name).toBe('INFO');
    });
  });
});

describe('LOGGER.DEBUG', () => {
  describe('LOGGER.DEBUG.value', () => {
    it('should be accessible within DEBUG', () => {
      expect(LOGGER.DEBUG.value).toBe(2);
    });
  });

  describe('LOGGER.DEBUG.name', () => {
    it('should be accessible within DEBUG', () => {
      expect(LOGGER.DEBUG.name).toBe('DEBUG');
    });
  });
});

describe('LOGGER.TRACE', () => {
  describe('LOGGER.TRACE.value', () => {
    it('should be accessible within TRACE', () => {
      expect(LOGGER.TRACE.value).toBe(1);
    });
  });

  describe('LOGGER.TRACE.name', () => {
    it('should be accessible within TRACE', () => {
      expect(LOGGER.TRACE.name).toBe('TRACE');
    });
  });
});
