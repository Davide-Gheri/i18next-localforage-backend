(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('localforage')) :
  typeof define === 'function' && define.amd ? define(['localforage'], factory) :
  (global = global || self, global.i18nextLocalforageBackend = factory(global.localforage));
}(this, function (localforage) { 'use strict';

  localforage = localforage && localforage.hasOwnProperty('default') ? localforage['default'] : localforage;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  /* eslint-enable */

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

      _defineProperty(this, "storage", void 0);

      this.init(services, options);
    }

    _createClass(Cache, [{
      key: "init",
      value: function init(services) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.services = services;
        this.options = _objectSpread({}, getDefaults(), {}, this.options, {}, options);
        this.storage = localforage.createInstance(this.options);
        console.log(this.storage);
        window.i18forage = this.storage;
      }
    }, {
      key: "read",
      value: function read(language, namespace, callback) {
        var _this = this;

        console.log('START READ');
        var nowMS = new Date().getTime();
        this.storage.getItem("".concat(language, "-").concat(namespace)).then(function (local) {
          console.log('READ OK, calling cb');

          if (local && local.i18nStamp && local.i18nStamp + _this.options.expirationTime > nowMS && _this.options.versions[language] === local.i18nVersion) {
            delete local.i18nVersion;
            delete local.i18nStamp;
            return callback(null, local);
          }

          return callback(null, null);
        });
      }
    }, {
      key: "save",
      value: function save(language, namespace, data) {
        console.log('START SAVE');
        data.i18nStamp = new Date().getTime(); // language version (if set)

        if (this.options.versions[language]) {
          data.i18nVersion = this.options.versions[language];
        } // save


        return this.storage.setItem("".concat(language, "-").concat(namespace), data).then(function () {
          console.log('SAVE DONE');
        });
      }
    }]);

    return Cache;
  }();

  _defineProperty(Cache, "type", 'backend');

  return Cache;

}));
