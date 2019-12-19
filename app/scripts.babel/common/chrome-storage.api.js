'use strict';

import * as log from 'loglevel';

/**
 * Richiama chrome.storage.sync.get per recuperare un oggetto salvato online
 * @param key la chiave dell'oggetto da recuperare
 * @returns {Promise<any>}
 */
export function ChromeStorageSyncGet(key) {

  log.info('ChromeStorageSyncGet - method called');

  return new Promise(resolve => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result);
    });
  })
}

/**
 * Richiama chrome.storage.sync.set per salvare online l'oggetto passato
 * @param linkData l'oggetto da salvare
 * @returns {Promise<any>}
 */
export function ChromeStorageSyncSet(linkData) {

  log.info('ChromeStorageSyncSet - method called');

  return new Promise(resolve => {
    chrome.storage.sync.set(linkData, () => {
      resolve();
    });
  })
}
