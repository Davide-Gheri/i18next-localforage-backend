'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var localforage = _interopDefault(require('localforage'));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function getDefaults() {
  return {
    name: 'i18next_res',
    storeName: 'keyvaluepair',
    description: '',
    size: 4980736,
    expirationTime: 7 * 24 * 60 * 60 * 1000,
    version: 1.0,
    versions: {},
    driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE]
  };
}

var Cache =
/*#__PURE__*/
function () {
  function Cache(services) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Cache);

    _defineProperty(this, "services", void 0);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "storage", localforage);

    this.init(services, options);
  }

  _createClass(Cache, [{
    key: "init",
    value: function init(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.services = services;
      this.options = _objectSpread({}, getDefaults(), {}, this.options, {}, options);
      this.storage.config(this.options);
    }
  }, {
    key: "read",
    value: function () {
      var _read = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(language, namespace, callback) {
        var nowMS, localName, local;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                nowMS = new Date().getTime();
                _context.next = 3;
                return this.storage.getItem("".concat(language, "-").concat(namespace));

              case 3:
                localName = _context.sent;

                if (!localName) {
                  _context.next = 10;
                  break;
                }

                local = JSON.parse(localName);

                if (!(local.i18nStamp && local.i18nStamp + this.options.expirationTime > nowMS && this.options.versions[language] === local.i18nVersion)) {
                  _context.next = 10;
                  break;
                }

                delete local.i18nVersion;
                delete local.i18nStamp;
                return _context.abrupt("return", callback(null, local));

              case 10:
                return _context.abrupt("return", callback(null, null));

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function read(_x, _x2, _x3) {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(language, namespace, data) {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                data.i18nStamp = new Date().getTime(); // language version (if set)

                if (this.options.versions[language]) {
                  data.i18nVersion = this.options.versions[language];
                } // save


                _context2.next = 4;
                return this.storage.setItem("".concat(language, "-").concat(namespace), JSON.stringify(data));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function save(_x4, _x5, _x6) {
        return _save.apply(this, arguments);
      }

      return save;
    }()
  }]);

  return Cache;
}();

_defineProperty(Cache, "type", 'backend');

module.exports = Cache;
