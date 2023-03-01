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

import util from 'util';

import EventEmitter from '../index.js';

describe('EventEmitter', () => {
  it('exposes a `prefixed` property', () => {
    expect(
      EventEmitter.prefixed === false || EventEmitter.prefixed === '~'
    ).toBeTruthy();
  });

  it('inherits when used with `util.inherits`', () => {
    function Beast() {
      EventEmitter.call(this);
    }
    util.inherits(Beast, EventEmitter);

    var moop = new Beast(),
      meap = new Beast();

    expect(moop).toBeInstanceOf(Beast);
    expect(moop).toBeInstanceOf(EventEmitter);

    moop.listeners();
    meap.listeners();
    moop.on('data', function () {
      throw new Error('I should not emit');
    });
    meap.emit('data', 'rawr');
    meap.removeListener('foo');
    meap.removeAllListeners();
  });

  if (typeof Symbol !== 'undefined') {
    it('works with ES6 symbols', (next) => {
      var e = new EventEmitter(),
        event = Symbol('cows'),
        unknown = Symbol('moo');

      e.on(event, function foo(arg) {
        expect(e.listenerCount(unknown)).toBe(0);
        expect(e.listeners(unknown)).toEqual([]);
        expect(arg).toBe('bar');
        function bar(onced) {
          expect(e.listenerCount(unknown)).toBe(0);
          expect(e.listeners(unknown)).toEqual([]);
          expect(onced).toBe('foo');
          next();
        }
        e.once(unknown, bar);
        expect(e.listenerCount(event)).toBe(1);
        expect(e.listeners(event)).toEqual([foo]);
        expect(e.listenerCount(unknown)).toBe(1);
        expect(e.listeners(unknown)).toEqual([bar]);
        e.removeListener(event);
        expect(e.listenerCount(event)).toBe(0);
        expect(e.listeners(event)).toEqual([]);
        expect(e.emit(unknown, 'foo')).toBe(true);
      });
      expect(e.emit(unknown, 'bar')).toBe(false);
      expect(e.emit(event, 'bar')).toBe(true);
    });
  }

  describe('EventEmitter#emit', () => {
    it('should return false when there are not events to emit', () => {
      var e = new EventEmitter();
      expect(e.emit('foo')).toBe(false);
      expect(e.emit('bar')).toBe(false);
    });

    it('emits with context', (done) => {
      var context = {
          bar: 'baz',
        },
        e = new EventEmitter();
      e.on(
        'foo',
        function (bar) {
          expect(bar).toBe('bar');
          expect(this).toBe(context);
          done();
        },
        context
      ).emit('foo', 'bar');
    });

    it('emits with context, multiple arguments (force apply)', (done) => {
      var context = {
          bar: 'baz',
        },
        e = new EventEmitter();
      e.on(
        'foo',
        function (bar) {
          expect(bar).toBe('bar');
          expect(this).toBe(context);
          done();
        },
        context
      ).emit('foo', 'bar', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0);
    });

    it('can emit the function with multiple arguments', () => {
      var e = new EventEmitter();
      for (var i = 0; i < 100; i++) {
        (function (j) {
          for (var i = 0, args = []; i < j; i++) {
            args.push(j);
          }
          e.once('args', function () {
            expect(arguments.length).toBe(args.length);
          });
          e.emit.apply(e, ['args'].concat(args));
        })(i);
      }
    });

    it('can emit the function with multiple arguments, multiple listeners', () => {
      var e = new EventEmitter();
      for (var i = 0; i < 100; i++) {
        (function (j) {
          for (var i = 0, args = []; i < j; i++) {
            args.push(j);
          }
          e.once('args', function () {
            expect(arguments.length).toBe(args.length);
          });
          e.once('args', function () {
            expect(arguments.length).toBe(args.length);
          });
          e.once('args', function () {
            expect(arguments.length).toBe(args.length);
          });
          e.once('args', function () {
            expect(arguments.length).toBe(args.length);
          });
          e.emit.apply(e, ['args'].concat(args));
        })(i);
      }
    });

    it('emits with context, multiple listeners (force loop)', () => {
      var e = new EventEmitter();
      e.on(
        'foo',
        function (bar) {
          expect(this).toEqual({
            foo: 'bar',
          });
          expect(bar).toBe('bar');
        },
        {
          foo: 'bar',
        }
      );
      e.on(
        'foo',
        function (bar) {
          expect(this).toEqual({
            bar: 'baz',
          });
          expect(bar).toBe('bar');
        },
        {
          bar: 'baz',
        }
      );
      e.emit('foo', 'bar');
    });

    it('emits with different contexts', () => {
      var e = new EventEmitter(),
        pattern = '';
      function writer() {
        pattern += this;
      }
      e.on('write', writer, 'foo');
      e.on('write', writer, 'baz');
      e.once('write', writer, 'bar');
      e.once('write', writer, 'banana');
      e.emit('write');
      expect(pattern).toBe('foobazbarbanana');
    });

    it('should return true when there are events to emit', () => {
      var e = new EventEmitter(),
        called = 0;
      e.on('foo', function () {
        called++;
      });
      expect(e.emit('foo')).toBe(true);
      expect(e.emit('foob')).toBe(false);
      expect(called).toBe(1);
    });

    it('receives the emitted events', (done) => {
      var e = new EventEmitter();
      e.on('data', function (a, b, c, d, undef) {
        expect(a).toBe('foo');
        expect(b).toBe(e);
        expect(c).toBeInstanceOf(Date);
        expect(undef).toBe(undefined);
        expect(arguments.length).toBe(3);
        done();
      });
      e.emit('data', 'foo', e, new Date());
    });

    it('emits to all event listeners', () => {
      var e = new EventEmitter(),
        pattern = [];
      e.on('foo', () => {
        pattern.push('foo1');
      });
      e.on('foo', () => {
        pattern.push('foo2');
      });
      e.emit('foo');
      expect(pattern.join(';')).toBe('foo1;foo2');
    });

    (function each(keys) {
      var key = keys.shift();
      if (!key) return;
      it(`can store event which is a known property: ${key}`, (next) => {
        var e = new EventEmitter();
        e.on(key, (k) => {
          expect(k).toBe(key);
          next();
        }).emit(key, key);
      });
      each(keys);
    })([
      'hasOwnProperty',
      'constructor',
      '__proto__',
      'toString',
      'toValue',
      'unwatch',
      'watch',
    ]);
  });

  describe('EventEmitter#listeners', () => {
    it('returns an empty array if no listeners are specified', () => {
      var e = new EventEmitter();
      expect(e.listeners('foo')).toBeInstanceOf(Array);
      expect(e.listeners('foo').length).toBe(0);
    });

    it('returns an array of function', () => {
      var e = new EventEmitter();
      function foo() {}
      e.on('foo', foo);
      expect(e.listeners('foo')).toBeInstanceOf(Array);
      expect(e.listeners('foo').length).toBe(1);
      expect(e.listeners('foo')).toEqual([foo]);
    });

    it('is not vulnerable to modifications', () => {
      var e = new EventEmitter();
      function foo() {}
      e.on('foo', foo);
      expect(e.listeners('foo')).toEqual([foo]);
      e.listeners('foo').length = 0;
      expect(e.listeners('foo')).toEqual([foo]);
    });
  });

  describe('EventEmitter#listenerCount', () => {
    it('returns the number of listeners for a given event', () => {
      var e = new EventEmitter();
      expect(e.listenerCount()).toBe(0);
      expect(e.listenerCount('foo')).toBe(0);
      e.on('foo', () => {});
      expect(e.listenerCount('foo')).toBe(1);
      e.on('foo', () => {});
      expect(e.listenerCount('foo')).toBe(2);
    });
  });

  describe('EventEmitter#on', () => {
    it('throws an error if the listener is not a function', () => {
      var e = new EventEmitter();
      try {
        e.on('foo', 'bar');
      } catch (ex) {
        expect(ex).toBeInstanceOf(TypeError);
        expect(ex.message).toBe('The listener must be a function');
        return;
      }
      throw new Error('oops');
    });
  });

  describe('EventEmitter#once', () => {
    it('only emits it once', () => {
      var e = new EventEmitter(),
        calls = 0;
      e.once('foo', () => {
        calls++;
      });
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      expect(e.listeners('foo').length).toBe(0);
      expect(calls).toBe(1);
    });

    it('only emits once if emits are nested inside the listener', () => {
      var e = new EventEmitter(),
        calls = 0;
      e.once('foo', () => {
        calls++;
        e.emit('foo');
      });
      e.emit('foo');
      expect(e.listeners('foo').length).toBe(0);
      expect(calls).toBe(1);
    });

    it('only emits once for multiple events', () => {
      var e = new EventEmitter(),
        multi = 0,
        foo = 0,
        bar = 0;
      e.once('foo', () => {
        foo++;
      });
      e.once('foo', () => {
        bar++;
      });
      e.on('foo', () => {
        multi++;
      });
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      expect(e.listeners('foo').length).toBe(1);
      expect(multi).toBe(5);
      expect(foo).toBe(1);
      expect(bar).toBe(1);
    });

    it('only emits once with context', (done) => {
      var context = {
          foo: 'bar',
        },
        e = new EventEmitter();
      e.once(
        'foo',
        function (bar) {
          expect(this).toBe(context);
          expect(bar).toBe('bar');
          done();
        },
        context
      ).emit('foo', 'bar');
    });
  });

  describe('EventEmitter#removeListener', () => {
    it('removes all listeners when the listener is not specified', () => {
      var e = new EventEmitter();
      e.on('foo', () => {});
      e.on('foo', () => {});
      expect(e.removeListener('foo')).toBe(e);
      expect(e.listeners('foo')).toEqual([]);
    });

    it('removes only the listeners matching the specified listener', () => {
      var e = new EventEmitter();
      function foo() {}
      function bar() {}
      function baz() {}
      e.on('foo', foo);
      e.on('bar', bar);
      e.on('bar', baz);
      expect(e.removeListener('foo', bar)).toBe(e);
      expect(e.listeners('bar')).toEqual([bar, baz]);
      expect(e.listeners('foo')).toEqual([foo]);
      expect(e._eventsCount).toBe(2);
      expect(e.removeListener('foo', foo)).toBe(e);
      expect(e.listeners('bar')).toEqual([bar, baz]);
      expect(e.listeners('foo')).toEqual([]);
      expect(e._eventsCount).toBe(1);
      expect(e.removeListener('bar', bar)).toBe(e);
      expect(e.listeners('bar')).toEqual([baz]);
      expect(e._eventsCount).toBe(1);
      expect(e.removeListener('bar', baz)).toBe(e);
      expect(e.listeners('bar')).toEqual([]);
      expect(e._eventsCount).toBe(0);
      e.on('foo', foo);
      e.on('foo', foo);
      e.on('bar', bar);
      expect(e.removeListener('foo', foo)).toBe(e);
      expect(e.listeners('bar')).toEqual([bar]);
      expect(e.listeners('foo')).toEqual([]);
      expect(e._eventsCount).toBe(1);
    });

    it('removes only the once listeners when using the once flag', () => {
      var e = new EventEmitter();
      function foo() {}
      e.on('foo', foo);
      expect(e.removeListener('foo', () => {}, undefined, true)).toBe(e);
      expect(e.listeners('foo')).toEqual([foo]);
      expect(e._eventsCount).toBe(1);
      expect(e.removeListener('foo', foo, undefined, true)).toBe(e);
      expect(e.listeners('foo')).toEqual([foo]);
      expect(e._eventsCount).toBe(1);
      expect(e.removeListener('foo', foo)).toBe(e);
      expect(e.listeners('foo')).toEqual([]);
      expect(e._eventsCount).toBe(0);
      e.once('foo', foo);
      e.on('foo', foo);
      expect(e.removeListener('foo', () => {}, undefined, true)).toBe(e);
      expect(e.listeners('foo')).toEqual([foo, foo]);
      expect(e._eventsCount).toBe(1);
      expect(e.removeListener('foo', foo, undefined, true)).toBe(e);
      expect(e.listeners('foo')).toEqual([foo]);
      expect(e._eventsCount).toBe(1);
      e.once('foo', foo);
      expect(e.removeListener('foo', foo)).toBe(e);
      expect(e.listeners('foo')).toEqual([]);
      expect(e._eventsCount).toBe(0);
    });

    it('removes only the listeners matching the correct context', () => {
      var context = {
          foo: 'bar',
        },
        e = new EventEmitter();
      function foo() {}
      function bar() {}
      e.on('foo', foo, context);
      expect(e.removeListener('foo', () => {}, context)).toBe(e);
      expect(e.listeners('foo')).toEqual([foo]);
      expect(e._eventsCount).toBe(1);
      expect(
        e.removeListener('foo', foo, {
          baz: 'quux',
        })
      ).toBe(e);
      expect(e.listeners('foo')).toEqual([foo]);
      expect(e._eventsCount).toBe(1);
      expect(e.removeListener('foo', foo, context)).toBe(e);
      expect(e.listeners('foo')).toEqual([]);
      expect(e._eventsCount).toBe(0);
      e.on('foo', foo, context);
      e.on('foo', bar);
      expect(
        e.removeListener('foo', foo, {
          baz: 'quux',
        })
      ).toBe(e);
      expect(e.listeners('foo')).toEqual([foo, bar]);
      expect(e._eventsCount).toBe(1);
      expect(e.removeListener('foo', foo, context)).toBe(e);
      expect(e.listeners('foo')).toEqual([bar]);
      expect(e._eventsCount).toBe(1);
      e.on('foo', bar, context);
      expect(e.removeListener('foo', bar)).toBe(e);
      expect(e.listeners('foo')).toEqual([]);
      expect(e._eventsCount).toBe(0);
    });
  });

  describe('EventEmitter#removeAllListeners', () => {
    it('removes all events for the specified events', () => {
      var e = new EventEmitter();
      e.on('foo', () => {
        throw new Error('oops');
      });
      e.on('foo', () => {
        throw new Error('oops');
      });
      e.on('bar', () => {
        throw new Error('oops');
      });
      e.on('aaa', () => {
        throw new Error('oops');
      });
      expect(e.removeAllListeners('foo')).toBe(e);
      expect(e.listeners('foo').length).toBe(0);
      expect(e.listeners('bar').length).toBe(1);
      expect(e.listeners('aaa').length).toBe(1);
      expect(e._eventsCount).toBe(2);
      expect(e.removeAllListeners('bar')).toBe(e);
      expect(e._eventsCount).toBe(1);
      expect(e.removeAllListeners('aaa')).toBe(e);
      expect(e._eventsCount).toBe(0);
      expect(e.emit('foo')).toBe(false);
      expect(e.emit('bar')).toBe(false);
      expect(e.emit('aaa')).toBe(false);
    });

    it('just nukes the fuck out of everything', () => {
      var e = new EventEmitter();
      e.on('foo', () => {
        throw new Error('oops');
      });
      e.on('foo', () => {
        throw new Error('oops');
      });
      e.on('bar', () => {
        throw new Error('oops');
      });
      e.on('aaa', () => {
        throw new Error('oops');
      });
      expect(e.removeAllListeners()).toBe(e);
      expect(e.listeners('foo').length).toBe(0);
      expect(e.listeners('bar').length).toBe(0);
      expect(e.listeners('aaa').length).toBe(0);
      expect(e._eventsCount).toBe(0);
      expect(e.emit('foo')).toBe(false);
      expect(e.emit('bar')).toBe(false);
      expect(e.emit('aaa')).toBe(false);
    });
  });

  describe('EventEmitter#eventNames', () => {
    it('returns an empty array when there are no events', () => {
      var e = new EventEmitter();
      expect(e.eventNames()).toEqual([]);
      e.on('foo', () => {});
      e.removeAllListeners('foo');
      expect(e.eventNames()).toEqual([]);
    });

    it('does not return inherited property identifiers', () => {
      var e = new EventEmitter();
      function Collection() {}
      Collection.prototype.foo = () => {
        return 'foo';
      };
      e._events = new Collection();
      expect(e._events.foo()).toEqual('foo');
      expect(e.eventNames()).toEqual([]);
    });

    if (typeof Symbol !== 'undefined')
      it('includes ES6 symbols', () => {
        var e = new EventEmitter(),
          s = Symbol('s');
        function foo() {}
        e.on('foo', foo);
        e.on(s, () => {});
        expect(e.eventNames()).toEqual(['foo', s]);
        e.removeListener('foo', foo);
        expect(e.eventNames()).toEqual([s]);
      });
  });
});
