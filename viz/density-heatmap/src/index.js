'use strict';

if (typeof module !== 'undefined') module.exports = simpleheat;

function simpleheat(canvas) {
  if (!(this instanceof simpleheat)) return new simpleheat(canvas);

  this._canvas = canvas =
    typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

  this._ctx = canvas.getContext('2d');
  this._width = canvas.width;
  this._height = canvas.height;

  this._max = 1;
  this._data = [];
}

simpleheat.prototype = {
  defaultRadius: 25,

  defaultGradient: {
    0.4: 'blue',
    0.6: 'cyan',
    0.7: 'lime',
    0.8: 'yellow',
    1.0: 'red',
  },

  data: function(data) {
    this._data = data;
    return this;
  },

  max: function(max) {
    this._max = max;
    return this;
  },

  add: function(point) {
    this._data.push(point);
    return this;
  },

  clear: function() {
    this._data = [];
    return this;
  },

  radius: function(r, blur) {
    blur = blur === undefined ? 15 : blur;

    // create a grayscale blurred circle image that we'll use for drawing points
    var circle = (this._circle = this._createCanvas()),
      ctx = circle.getContext('2d'),
      r2 = (this._r = r + blur);

    circle.width = circle.height = r2 * 2;

    ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
    ctx.shadowBlur = blur;
    ctx.shadowColor = 'black';

    ctx.beginPath();
    ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    return this;
  },

  resize: function() {
    this._width = this._canvas.width;
    this._height = this._canvas.height;
  },

  gradient: function(grad) {
    // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
    var canvas = this._createCanvas(),
      ctx = canvas.getContext('2d'),
      gradient = ctx.createLinearGradient(0, 0, 0, 256);

    canvas.width = 1;
    canvas.height = 256;

    for (var i in grad) {
      gradient.addColorStop(+i, grad[i]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);

    this._grad = ctx.getImageData(0, 0, 1, 256).data;

    return this;
  },

  draw: function(minOpacity) {
    if (!this._circle) this.radius(this.defaultRadius);
    if (!this._grad) this.gradient(this.defaultGradient);

    var ctx = this._ctx;

    ctx.clearRect(0, 0, this._width, this._height);

    // draw a grayscale heatmap by putting a blurred circle at each data point
    for (var i = 0, len = this._data.length, p; i < len; i++) {
      p = this._data[i];
      ctx.globalAlpha = Math.min(
        Math.max(
          p[2] / this._max,
          minOpacity === undefined ? 0.05 : minOpacity
        ),
        1
      );
      ctx.drawImage(this._circle, p[0] - this._r, p[1] - this._r);
    }

    // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
    var colored = ctx.getImageData(0, 0, this._width, this._height);
    this._colorize(colored.data, this._grad);
    ctx.putImageData(colored, 0, 0);

    return this;
  },

  _colorize: function(pixels, gradient) {
    for (var i = 0, len = pixels.length, j; i < len; i += 4) {
      j = pixels[i + 3] * 4; // get gradient color from opacity value

      if (j) {
        pixels[i] = gradient[j];
        pixels[i + 1] = gradient[j + 1];
        pixels[i + 2] = gradient[j + 2];
      }
    }
  },

  _createCanvas: function() {
    if (typeof document !== 'undefined') {
      return document.createElement('canvas');
    } else {
      // create a new canvas instance in node.js
      // the canvas class needs to have a default constructor without any parameter
      return new this._canvas.constructor();
    }
  },
};

!(function(e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define('dscc', [], t)
    : 'object' == typeof exports
    ? (exports.dscc = t())
    : (e.dscc = t());
})(window, function() {
  return (function(e) {
    var t = {};
    function R(n) {
      if (t[n]) return t[n].exports;
      var o = (t[n] = {i: n, l: !1, exports: {}});
      return e[n].call(o.exports, o, o.exports, R), (o.l = !0), o.exports;
    }
    return (
      (R.m = e),
      (R.c = t),
      (R.d = function(e, t, n) {
        R.o(e, t) ||
          Object.defineProperty(e, t, {
            configurable: !1,
            enumerable: !0,
            get: n,
          });
      }),
      (R.r = function(e) {
        Object.defineProperty(e, '__esModule', {value: !0});
      }),
      (R.n = function(e) {
        var t =
          e && e.__esModule
            ? function() {
                return e.default;
              }
            : function() {
                return e;
              };
        return R.d(t, 'a', t), t;
      }),
      (R.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (R.p = ''),
      R((R.s = './src/index.ts'))
    );
  })({
    './node_modules/querystringify/index.js': function(e, t, R) {
      'use strict';
      var n = Object.prototype.hasOwnProperty;
      function o(e) {
        return decodeURIComponent(e.replace(/\+/g, ' '));
      }
      (t.stringify = function(e, t) {
        t = t || '';
        var R = [];
        for (var o in ('string' != typeof t && (t = '?'), e))
          n.call(e, o) &&
            R.push(encodeURIComponent(o) + '=' + encodeURIComponent(e[o]));
        return R.length ? t + R.join('&') : '';
      }),
        (t.parse = function(e) {
          for (var t, R = /([^=?&]+)=?([^&]*)/g, n = {}; (t = R.exec(e)); ) {
            var C = o(t[1]),
              r = o(t[2]);
            C in n || (n[C] = r);
          }
          return n;
        });
    },
    './node_modules/requires-port/index.js': function(e, t, R) {
      'use strict';
      e.exports = function(e, t) {
        if (((t = t.split(':')[0]), !(e = +e))) return !1;
        switch (t) {
          case 'http':
          case 'ws':
            return 80 !== e;
          case 'https':
          case 'wss':
            return 443 !== e;
          case 'ftp':
            return 21 !== e;
          case 'gopher':
            return 70 !== e;
          case 'file':
            return !1;
        }
        return 0 !== e;
      };
    },
    './node_modules/url-parse/index.js': function(e, t, R) {
      'use strict';
      (function(t) {
        var n = R('./node_modules/requires-port/index.js'),
          o = R('./node_modules/querystringify/index.js'),
          C = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i,
          r = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//,
          E = [
            ['#', 'hash'],
            ['?', 'query'],
            ['/', 'pathname'],
            ['@', 'auth', 1],
            [NaN, 'host', void 0, 1, 1],
            [/:(\d+)$/, 'port', void 0, 1],
            [NaN, 'hostname', void 0, 1, 1],
          ],
          s = {hash: 1, query: 1};
        function a(e) {
          var R,
            n = {},
            o = typeof (e = e || t.location || {});
          if ('blob:' === e.protocol) n = new i(unescape(e.pathname), {});
          else if ('string' === o)
            for (R in ((n = new i(e, {})), s)) delete n[R];
          else if ('object' === o) {
            for (R in e) R in s || (n[R] = e[R]);
            void 0 === n.slashes && (n.slashes = r.test(e.href));
          }
          return n;
        }
        function N(e) {
          var t = C.exec(e);
          return {
            protocol: t[1] ? t[1].toLowerCase() : '',
            slashes: !!t[2],
            rest: t[3],
          };
        }
        function i(e, t, R) {
          if (!(this instanceof i)) return new i(e, t, R);
          var C,
            r,
            s,
            _,
            c,
            u,
            U = E.slice(),
            Y = typeof t,
            l = this,
            f = 0;
          for (
            'object' !== Y && 'string' !== Y && ((R = t), (t = null)),
              R && 'function' != typeof R && (R = o.parse),
              t = a(t),
              C = !(r = N(e || '')).protocol && !r.slashes,
              l.slashes = r.slashes || (C && t.slashes),
              l.protocol = r.protocol || t.protocol || '',
              e = r.rest,
              r.slashes || (U[2] = [/(.*)/, 'pathname']);
            f < U.length;
            f++
          )
            (s = (_ = U[f])[0]),
              (u = _[1]),
              s != s
                ? (l[u] = e)
                : 'string' == typeof s
                ? ~(c = e.indexOf(s)) &&
                  ('number' == typeof _[2]
                    ? ((l[u] = e.slice(0, c)), (e = e.slice(c + _[2])))
                    : ((l[u] = e.slice(c)), (e = e.slice(0, c))))
                : (c = s.exec(e)) && ((l[u] = c[1]), (e = e.slice(0, c.index))),
              (l[u] = l[u] || (C && _[3] && t[u]) || ''),
              _[4] && (l[u] = l[u].toLowerCase());
          R && (l.query = R(l.query)),
            C &&
              t.slashes &&
              '/' !== l.pathname.charAt(0) &&
              ('' !== l.pathname || '' !== t.pathname) &&
              (l.pathname = (function(e, t) {
                for (
                  var R = (t || '/')
                      .split('/')
                      .slice(0, -1)
                      .concat(e.split('/')),
                    n = R.length,
                    o = R[n - 1],
                    C = !1,
                    r = 0;
                  n--;

                )
                  '.' === R[n]
                    ? R.splice(n, 1)
                    : '..' === R[n]
                    ? (R.splice(n, 1), r++)
                    : r && (0 === n && (C = !0), R.splice(n, 1), r--);
                return (
                  C && R.unshift(''),
                  ('.' !== o && '..' !== o) || R.push(''),
                  R.join('/')
                );
              })(l.pathname, t.pathname)),
            n(l.port, l.protocol) || ((l.host = l.hostname), (l.port = '')),
            (l.username = l.password = ''),
            l.auth &&
              ((_ = l.auth.split(':')),
              (l.username = _[0] || ''),
              (l.password = _[1] || '')),
            (l.origin =
              l.protocol && l.host && 'file:' !== l.protocol
                ? l.protocol + '//' + l.host
                : 'null'),
            (l.href = l.toString());
        }
        (i.prototype = {
          set: function(e, t, R) {
            var C = this;
            switch (e) {
              case 'query':
                'string' == typeof t && t.length && (t = (R || o.parse)(t)),
                  (C[e] = t);
                break;
              case 'port':
                (C[e] = t),
                  n(t, C.protocol)
                    ? t && (C.host = C.hostname + ':' + t)
                    : ((C.host = C.hostname), (C[e] = ''));
                break;
              case 'hostname':
                (C[e] = t), C.port && (t += ':' + C.port), (C.host = t);
                break;
              case 'host':
                (C[e] = t),
                  /:\d+$/.test(t)
                    ? ((t = t.split(':')),
                      (C.port = t.pop()),
                      (C.hostname = t.join(':')))
                    : ((C.hostname = t), (C.port = ''));
                break;
              case 'protocol':
                (C.protocol = t.toLowerCase()), (C.slashes = !R);
                break;
              case 'pathname':
              case 'hash':
                if (t) {
                  var r = 'pathname' === e ? '/' : '#';
                  C[e] = t.charAt(0) !== r ? r + t : t;
                } else C[e] = t;
                break;
              default:
                C[e] = t;
            }
            for (var s = 0; s < E.length; s++) {
              var a = E[s];
              a[4] && (C[a[1]] = C[a[1]].toLowerCase());
            }
            return (
              (C.origin =
                C.protocol && C.host && 'file:' !== C.protocol
                  ? C.protocol + '//' + C.host
                  : 'null'),
              (C.href = C.toString()),
              C
            );
          },
          toString: function(e) {
            (e && 'function' == typeof e) || (e = o.stringify);
            var t,
              R = this,
              n = R.protocol;
            n && ':' !== n.charAt(n.length - 1) && (n += ':');
            var C = n + (R.slashes ? '//' : '');
            return (
              R.username &&
                ((C += R.username),
                R.password && (C += ':' + R.password),
                (C += '@')),
              (C += R.host + R.pathname),
              (t = 'object' == typeof R.query ? e(R.query) : R.query) &&
                (C += '?' !== t.charAt(0) ? '?' + t : t),
              R.hash && (C += R.hash),
              C
            );
          },
        }),
          (i.extractProtocol = N),
          (i.location = a),
          (i.qs = o),
          (e.exports = i);
      }.call(this, R('./node_modules/webpack/buildin/global.js')));
    },
    './node_modules/webpack/buildin/global.js': function(e, t) {
      var R;
      R = (function() {
        return this;
      })();
      try {
        R = R || Function('return this')() || (0, eval)('this');
      } catch (e) {
        'object' == typeof window && (R = window);
      }
      e.exports = R;
    },
    './src/index.ts': function(e, t, R) {
      'use strict';
      Object.defineProperty(t, '__esModule', {value: !0});
      var n = R('./node_modules/url-parse/index.js'),
        o = R('./src/types.ts');
      !(function(e) {
        for (var R in e) t.hasOwnProperty(R) || (t[R] = e[R]);
      })(R('./src/types.ts')),
        (t.getWidth = function() {
          return document.body.clientWidth;
        }),
        (t.getHeight = function() {
          return document.documentElement.clientHeight;
        });
      t.parseImage = function(e) {
        var t = e.split('????'),
          R = t[0],
          n = t[1];
        return {altText: t[2], originalUrl: R, proxiedUrl: n};
      };
      var C = function(e) {
          return e.fields.reduce(function(e, t) {
            return (e[t.id] = t), e;
          }, {});
        },
        r = function(e) {
          var t = [];
          return (
            e.config.data.forEach(function(e) {
              e.elements.forEach(function(e) {
                e.value.forEach(function() {
                  return t.push(e.id);
                });
              });
            }),
            t
          );
        },
        E = function(e) {
          var t = C(e),
            R = {};
          return (
            e.config.data.forEach(function(e) {
              e.elements.forEach(function(e) {
                R[e.id] = e.value.map(function(e) {
                  return t[e];
                });
              });
            }),
            R
          );
        },
        s = function(e) {
          var t = {};
          return (
            (e.config.style || []).forEach(function(e) {
              e.elements.forEach(function(e) {
                if (void 0 !== t[e.id])
                  throw new Error(
                    "styleIds must be unique. Your styleId: '" +
                      e.id +
                      "' is used more than once."
                  );
                t[e.id] = {value: e.value, defaultValue: e.defaultValue};
              });
            }, {}),
            t
          );
        };
      (t.tableTransform = function(e) {
        return {
          tables: (function(e) {
            var t,
              R = r(e),
              n =
                (C(e),
                ((t = {})[o.TableType.DEFAULT] = {headers: [], rows: []}),
                t);
            return (
              e.dataResponse.tables.forEach(function(e) {
                n[e.id] = {headers: R, rows: e.rows};
              }),
              n
            );
          })(e),
          fields: E(e),
          style: s(e),
        };
      }),
        (t.objectTransform = function(e) {
          return {
            tables: (function(e) {
              var t,
                R = r(e),
                n = (C(e), ((t = {})[o.TableType.DEFAULT] = []), t);
              return (
                e.dataResponse.tables.forEach(function(e) {
                  var t = e.rows.map(
                    (function(e) {
                      return function(t) {
                        var R,
                          n,
                          o = {};
                        return (
                          ((R = t),
                          (n = e),
                          R.length < n.length
                            ? R.map(function(e, t) {
                                return [e, n[t]];
                              })
                            : n.map(function(e, t) {
                                return [R[t], e];
                              })).forEach(function(e) {
                            var t = e[0],
                              R = e[1];
                            void 0 === o[R] && (o[R] = []), o[R].push(t);
                          }, {}),
                          o
                        );
                      };
                    })(R)
                  );
                  n[e.id] = t;
                }),
                n
              );
            })(e),
            fields: E(e),
            style: s(e),
          };
        }),
        (t.subscribeToData = function(e, R) {
          if (
            R.transform === t.tableTransform ||
            R.transform === t.objectTransform
          ) {
            var C = function(t) {
              t.data.type === o.MessageType.RENDER
                ? e(R.transform(t.data))
                : console.error(
                    'MessageType: ' +
                      t.data.type +
                      ' is not supported by this version of the library.'
                  );
            };
            window.addEventListener('message', C);
            var r = n(window.parent.location.href, !0).query.componentId;
            return (
              window.parent.postMessage(
                {componentId: r, type: 'vizReady'},
                '*'
              ),
              function() {
                return window.removeEventListener('message', C);
              }
            );
          }
          throw new Error(
            'Only the built in transform functions are supported.'
          );
        });
    },
    './src/types.ts': function(e, t, R) {
      'use strict';
      Object.defineProperty(t, '__esModule', {value: !0}),
        (function(e) {
          (e.METRIC = 'METRIC'), (e.DIMENSION = 'DIMENSION');
        })(t.ConceptType || (t.ConceptType = {})),
        (function(e) {
          e.RENDER = 'RENDER';
        })(t.MessageType || (t.MessageType = {})),
        (function(e) {
          (e.YEAR = 'YEAR'),
            (e.YEAR_QUARTER = 'YEAR_QUARTER'),
            (e.YEAR_MONTH = 'YEAR_MONTH'),
            (e.YEAR_WEEK = 'YEAR_WEEK'),
            (e.YEAR_MONTH_DAY = 'YEAR_MONTH_DAY'),
            (e.YEAR_MONTH_DAY_HOUR = 'YEAR_MONTH_DAY_HOUR'),
            (e.QUARTER = 'QUARTER'),
            (e.MONTH = 'MONTH'),
            (e.WEEK = 'WEEK'),
            (e.MONTH_DAY = 'MONTH_DAY'),
            (e.DAY_OF_WEEK = 'DAY_OF_WEEK'),
            (e.DAY = 'DAY'),
            (e.HOUR = 'HOUR'),
            (e.MINUTE = 'MINUTE'),
            (e.DURATION = 'DURATION'),
            (e.COUNTRY = 'COUNTRY'),
            (e.COUNTRY_CODE = 'COUNTRY_CODE'),
            (e.CONTINENT = 'CONTINENT'),
            (e.CONTINENT_CODE = 'CONTINENT_CODE'),
            (e.SUB_CONTINENT = 'SUB_CONTINENT'),
            (e.SUB_CONTINENT_CODE = 'SUB_CONTINENT_CODE'),
            (e.REGION = 'REGION'),
            (e.REGION_CODE = 'REGION_CODE'),
            (e.CITY = 'CITY'),
            (e.CITY_CODE = 'CITY_CODE'),
            (e.METRO_CODE = 'METRO_CODE'),
            (e.LATITUDE_LONGITUDE = 'LATITUDE_LONGITUDE'),
            (e.NUMBER = 'NUMBER'),
            (e.PERCENT = 'PERCENT'),
            (e.TEXT = 'TEXT'),
            (e.BOOLEAN = 'BOOLEAN'),
            (e.URL = 'URL'),
            (e.IMAGE = 'IMAGE'),
            (e.CURRENCY_AED = 'CURRENCY_AED'),
            (e.CURRENCY_ALL = 'CURRENCY_ALL'),
            (e.CURRENCY_ARS = 'CURRENCY_ARS'),
            (e.CURRENCY_AUD = 'CURRENCY_AUD'),
            (e.CURRENCY_BDT = 'CURRENCY_BDT'),
            (e.CURRENCY_BGN = 'CURRENCY_BGN'),
            (e.CURRENCY_BOB = 'CURRENCY_BOB'),
            (e.CURRENCY_BRL = 'CURRENCY_BRL'),
            (e.CURRENCY_CAD = 'CURRENCY_CAD'),
            (e.CURRENCY_CDF = 'CURRENCY_CDF'),
            (e.CURRENCY_CHF = 'CURRENCY_CHF'),
            (e.CURRENCY_CLP = 'CURRENCY_CLP'),
            (e.CURRENCY_CNY = 'CURRENCY_CNY'),
            (e.CURRENCY_COP = 'CURRENCY_COP'),
            (e.CURRENCY_CRC = 'CURRENCY_CRC'),
            (e.CURRENCY_CZK = 'CURRENCY_CZK'),
            (e.CURRENCY_DKK = 'CURRENCY_DKK'),
            (e.CURRENCY_DOP = 'CURRENCY_DOP'),
            (e.CURRENCY_EGP = 'CURRENCY_EGP'),
            (e.CURRENCY_ETB = 'CURRENCY_ETB'),
            (e.CURRENCY_EUR = 'CURRENCY_EUR'),
            (e.CURRENCY_GBP = 'CURRENCY_GBP'),
            (e.CURRENCY_HKD = 'CURRENCY_HKD'),
            (e.CURRENCY_HRK = 'CURRENCY_HRK'),
            (e.CURRENCY_HUF = 'CURRENCY_HUF'),
            (e.CURRENCY_IDR = 'CURRENCY_IDR'),
            (e.CURRENCY_ILS = 'CURRENCY_ILS'),
            (e.CURRENCY_INR = 'CURRENCY_INR'),
            (e.CURRENCY_IRR = 'CURRENCY_IRR'),
            (e.CURRENCY_ISK = 'CURRENCY_ISK'),
            (e.CURRENCY_JMD = 'CURRENCY_JMD'),
            (e.CURRENCY_JPY = 'CURRENCY_JPY'),
            (e.CURRENCY_KRW = 'CURRENCY_KRW'),
            (e.CURRENCY_LKR = 'CURRENCY_LKR'),
            (e.CURRENCY_LTL = 'CURRENCY_LTL'),
            (e.CURRENCY_MNT = 'CURRENCY_MNT'),
            (e.CURRENCY_MVR = 'CURRENCY_MVR'),
            (e.CURRENCY_MXN = 'CURRENCY_MXN'),
            (e.CURRENCY_MYR = 'CURRENCY_MYR'),
            (e.CURRENCY_NOK = 'CURRENCY_NOK'),
            (e.CURRENCY_NZD = 'CURRENCY_NZD'),
            (e.CURRENCY_PAB = 'CURRENCY_PAB'),
            (e.CURRENCY_PEN = 'CURRENCY_PEN'),
            (e.CURRENCY_PHP = 'CURRENCY_PHP'),
            (e.CURRENCY_PKR = 'CURRENCY_PKR'),
            (e.CURRENCY_PLN = 'CURRENCY_PLN'),
            (e.CURRENCY_RON = 'CURRENCY_RON'),
            (e.CURRENCY_RSD = 'CURRENCY_RSD'),
            (e.CURRENCY_RUB = 'CURRENCY_RUB'),
            (e.CURRENCY_SAR = 'CURRENCY_SAR'),
            (e.CURRENCY_SEK = 'CURRENCY_SEK'),
            (e.CURRENCY_SGD = 'CURRENCY_SGD'),
            (e.CURRENCY_THB = 'CURRENCY_THB'),
            (e.CURRENCY_TRY = 'CURRENCY_TRY'),
            (e.CURRENCY_TWD = 'CURRENCY_TWD'),
            (e.CURRENCY_TZS = 'CURRENCY_TZS'),
            (e.CURRENCY_UAH = 'CURRENCY_UAH'),
            (e.CURRENCY_USD = 'CURRENCY_USD'),
            (e.CURRENCY_UYU = 'CURRENCY_UYU'),
            (e.CURRENCY_VEF = 'CURRENCY_VEF'),
            (e.CURRENCY_VND = 'CURRENCY_VND'),
            (e.CURRENCY_YER = 'CURRENCY_YER'),
            (e.CURRENCY_ZAR = 'CURRENCY_ZAR');
        })(t.FieldType || (t.FieldType = {})),
        (function(e) {
          (e.DEFAULT = 'DEFAULT'),
            (e.COMPARISON = 'COMPARISON'),
            (e.SUMMARY = 'SUMMARY');
        })(t.TableType || (t.TableType = {})),
        (function(e) {
          (e.METRIC = 'METRIC'),
            (e.DIMENSION = 'DIMENSION'),
            (e.SORT = 'SORT'),
            (e.MAX_RESULTS = 'MAX_RESULTS');
        })(t.ConfigDataElementType || (t.ConfigDataElementType = {})),
        (function(e) {
          (e.TEXTINPUT = 'TEXTINPUT'),
            (e.SELECT_SINGLE = 'SELECT_SINGLE'),
            (e.CHECKBOX = 'CHECKBOX'),
            (e.FONT_COLOR = 'FONT_COLOR'),
            (e.FONT_SIZE = 'FONT_SIZE'),
            (e.FONT_FAMILY = 'FONT_FAMILY'),
            (e.FILL_COLOR = 'FILL_COLOR'),
            (e.BORDER_COLOR = 'BORDER_COLOR'),
            (e.AXIS_COLOR = 'AXIS_COLOR'),
            (e.GRID_COLOR = 'GRID_COLOR'),
            (e.OPACITY = 'OPACITY'),
            (e.LINE_WEIGHT = 'LINE_WEIGHT'),
            (e.LINE_STYLE = 'LINE_STYLE'),
            (e.BORDER_RADIUS = 'BORDER_RADIUS'),
            (e.INTERVAL = 'INTERVAL'),
            (e.SELECT_RADIO = 'SELECT_RADIO');
        })(t.ConfigStyleElementType || (t.ConfigStyleElementType = {}));
    },
  });
});
// create and add the canvas
var canvasElement = document.createElement('canvas');
var ctx = canvasElement.getContext('2d');
canvasElement.id = 'myViz';
document.body.appendChild(canvasElement);

dscc.subscribeToData(
  function(data) {
    //console.log(data)
    var dataByConfigId = data.tables.DEFAULT;
    //console.log(dataByConfigId);
    var parsedData = dataByConfigId.map(function(d) {
      return [d['xMetric'][0], d['yMetric'][0], d['valueMetric'][0]];
    });
    //console.log(parsedData);

    var styleByConfigId = data.style;
    //console.log(styleByConfigId);

    var ctx = canvasElement.getContext('2d');
    // clear the canvas.
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // set the canvas width and height
    var frameWidth = dscc.getWidth();
    var frameHeight = dscc.getHeight();
    ctx.canvas.width = frameWidth - 20;
    ctx.canvas.height = frameHeight - 20;
    //console.log('width: ' + ctx.canvas.width + ', height: ' + ctx.canvas.height);

    // get axis ranges
    var xmin = styleByConfigId.xmin.value
      ? styleByConfigId.xmin.value
      : styleByConfigId.xmin.defaultValue;
    var xmax = styleByConfigId.xmax.value
      ? styleByConfigId.xmax.value
      : styleByConfigId.xmax.defaultValue;
    var ymin = styleByConfigId.ymin.value
      ? styleByConfigId.ymin.value
      : styleByConfigId.ymin.defaultValue;
    var ymax = styleByConfigId.ymax.value
      ? styleByConfigId.ymax.value
      : styleByConfigId.ymax.defaultValue;

    // get axis reverse option
    var xrev = styleByConfigId.xrev.value ? -1 : 1;
    var yrev = styleByConfigId.yrev.value ? -1 : 1;
    //console.log('xrev: ' + xrev + ', yrev: ' + yrev);
    ctx.scale(xrev, yrev);

    // scale canvas
    var xscale = frameWidth / (xmax - xmin);
    var yscale = frameHeight / (ymax - ymin);
    //console.log('xscale: ' + xscale + ', yscale: ' + yscale);
    ctx.scale(xscale, yscale);

    //translate canvas
    ctx.translate(-xmin * xrev, ymin);

    // create a simpleheat object given an id or canvas reference
    var heat = simpleheat(canvasElement);
    //console.log(heat);

    // set data of [[x, y, value], ...] format
    heat.data(parsedData);

    // set max data value (1 by default)
    var maxValue = styleByConfigId.maxValue.value
      ? styleByConfigId.maxValue.value
      : styleByConfigId.maxValue.defaultValue;
    heat.max(maxValue);

    // set point radius and blur radius (25 and 15 by default)
    var radius = styleByConfigId.radius.value
      ? styleByConfigId.radius.value
      : styleByConfigId.radius.defaultValue;
    var blur = styleByConfigId.blur.value
      ? styleByConfigId.blur.value
      : styleByConfigId.blur.defaultValue;
    heat.radius(radius, blur);

    //set gradient colours
    var gradient = {
      default: {
        '0.4': 'blue',
        '0.6': 'cyan',
        '0.7': 'lime',
        '0.8': 'yellow',
        '1.0': 'red',
      },
      'blue-yellow': {
        '0.4': '#253494',
        '0.6': '#2c7fb8',
        '0.7': '#41b6c4',
        '0.8': '#a1dab4',
        '1.0': '#ffffcc',
      },
      viridis: {
        '1.000': '#fde725',
        '0.975': '#dde318',
        '0.950': '#bade28',
        '0.925': '#95d840',
        '0.900': '#75d054',
        '0.875': '#56c667',
        '0.850': '#3dbc74',
        '0.825': '#29af7f',
        '0.800': '#20a386',
        '0.775': '#1f968b',
        '0.750': '#238a8d',
        '0.725': '#287d8e',
        '0.700': '#2d718e',
        '0.675': '#33638d',
        '0.650': '#39558c',
        '0.625': '#404688',
        '0.600': '#453781',
        '0.575': '#482576',
        '0.550': '#481467',
        '0.525': '#440154',
      },
      inferno: {
        '1.000': '#fcffa4',
        '0.975': '#f1ed71',
        '0.950': '#f6d543',
        '0.925': '#fbba1f',
        '0.900': '#fca108',
        '0.875': '#f8870e',
        '0.850': '#f1711f',
        '0.825': '#e55c30',
        '0.800': '#d74b3f',
        '0.775': '#c43c4e',
        '0.750': '#b1325a',
        '0.725': '#9b2964',
        '0.700': '#87216b',
        '0.675': '#71196e',
        '0.650': '#5c126e',
        '0.625': '#450a69',
        '0.600': '#2f0a5b',
        '0.575': '#180c3c',
        '0.550': '#08051d',
        '0.525': '#000004',
      },
    };
    var grad = styleByConfigId.colourPalette.value
      ? styleByConfigId.colourPalette.value
      : styleByConfigId.colourPalette.defaultValue;
    heat.gradient(gradient[grad]);

    // draw the heatmap
    var minOpacity = styleByConfigId.minOpacity.value
      ? styleByConfigId.minOpacity.value
      : styleByConfigId.minOpacity.defaultValue;
    heat.draw(minOpacity);
  },
  {transform: dscc.objectTransform}
);
