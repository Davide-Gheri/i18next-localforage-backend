# Introduction

This is a i18next cache layer to be used in the browser using [localforage](https://github.com/localForage/localForage) as storage layer. It will load and cache resources from IndexedDB, webSQL or localStorage and can be used in combination with the [chained backend](https://github.com/i18next/i18next-chained-backend).

# Getting started

Source can be loaded via [npm](https://www.npmjs.com/package/i18next-localforage-backend) or [downloaded](https://github.com/i18next/i18next-localforage-backend/blob/master/i18nextLocalforageBackend.min.js) from this repo.

- If you don't use a module loader it will be added to window.i18nextLocalForageBackend

```
# npm package
$ npm install i18next-localforage-backend
```

Wiring up with the chained backend:

```js
import i18next from 'i18next';
import Backend from 'i18next-chained-backend';
import LocalforageBackend from 'i18next-localforage-backend'; // primary use cache
import XHR from 'i18next-xhr-backend'; // fallback xhr load

i18next
  .use(Backend)
  .init({
    backend: {
      backends: [
        LocalforageBackend,  // primary
        XHR                   // fallback
      ],
      backendOptions: [{
        /* below options */
      }, {
        loadPath: '/locales/{{lng}}/{{ns}}.json' // xhr load path for my own fallback
      }]
    }
  });
```

## Cache Backend Options


```javascript
var options = {
  // expiration
  expirationTime: 7*24*60*60*1000,

  // language versions
  versions: {},

  /**
  * Localforage specific options
  */
  
  // database name (prefix is using localStorage as storage driver)
  name: 'i18next_res',

  // The driver(s) to use, if multiple are provided, the first available is used
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  
  // when using IndexedDb is the dataStore name, when using WebSQL is the table name
  storeName: 'keyvaluepair',
  
  // DB schema version, used only in IndexedDB and WebSQL
  version: 1.0,

  // WebSQL only, database size in bytes
  size: 4980736,

  // description of the database, for developer usage
  description: '',
};
```

- Contrary to cookies behavior, the cache will respect updates to `expirationTime`. If you set 7 days and later update to 10 days, the cache will persist for 10 days

- Passing in a `versions` object (ex.: `versions: { en: 'v1.2', fr: 'v1.1' }`) will give you control over the cache based on translations version. This setting works along `expirationTime`, so a cached translation will still expire even though the version did not change. You can still set `expirationTime` far into the future to avoid this
