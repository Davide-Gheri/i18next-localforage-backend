import localforage from 'localforage';

interface CacheOptions {
  name?: string;
  storeName?: string;
  description?: string;
  size?: number;
  expirationTime?: number;
  version?: number;
  versions?: Record<string, number>;
  driver?: string | string[];
}

type ReadCallback = (err: any, data: any) => void;

function getDefaults(): CacheOptions {
  return {
    name: 'i18next_res',
    storeName: 'keyvaluepair',
    description: '',
    size: 4980736,
    expirationTime: 7 * 24 * 60 * 60 * 1000,
    version: 1.0,
    versions: {},
    driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  };
}

class Cache {
  public static type = 'backend';

  public services: any;

  public options!: Required<CacheOptions>;

  public storage: any = localforage;

  constructor(services: any, options: CacheOptions = {}) {
    this.init(services, options);
  }

  init(services: any, options = {}): void {
    this.services = services;
    this.options = { ...getDefaults(), ...this.options, ...options };

    this.storage.config(this.options);
  }

  async read(language: string, namespace: string, callback: ReadCallback): Promise<void> {
    const nowMS = new Date().getTime();

    const localName = await this.storage.getItem(`${language}-${namespace}`);

    if (localName) {
      const local = JSON.parse(localName);
      if (
        local.i18nStamp && local.i18nStamp + this.options.expirationTime > nowMS
        && this.options.versions[language] === local.i18nVersion
      ) {
        delete local.i18nVersion;
        delete local.i18nStamp;
        return callback(null, local);
      }
    }

    return callback(null, null);
  }

  async save(language: string, namespace: string, data: any): Promise<void> {
    data.i18nStamp = new Date().getTime();

    // language version (if set)
    if (this.options.versions[language]) {
      data.i18nVersion = this.options.versions[language];
    }

    // save
    await this.storage.setItem(`${language}-${namespace}`, JSON.stringify(data));
  }
}

export default Cache;
