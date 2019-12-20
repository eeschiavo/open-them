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
export function ChromeStorageSyncSet(data) {

  log.info('ChromeStorageSyncSet - method called: ', data);

  return new Promise(resolve => {
    chrome.storage.sync.set(data, () => {
      log.debug('ChromeStorageSyncSet - set avvenuto con successo');
      resolve();
    });
  });
}

/**
 * Richiama chrome.storage.local.get per recuperare un oggetto salvato
 * @param key la chiave dell'oggetto da recuperare
 * @returns {Promise<any>}
 */
export function ChromeStorageLocalGet(key) {

  log.info('ChromeStorageLocalGet - method called');

  return new Promise(resolve => {
    chrome.storage.local.get(key, (result) => {
      resolve(result);
    });
  })
}

/**
 * Richiama chrome.storage.local.set per salvare l'oggetto passato
 * @param linkData l'oggetto da salvare
 * @returns {Promise<any>}
 */
export function ChromeStorageLocalSet(data) {

  log.info('ChromeStorageLocalSet - method called: ', data);

  return new Promise(resolve => {
    chrome.storage.local.set(data, () => {
      log.debug('ChromeStorageLocalSet - set avvenuto con successo');
      resolve();
    });
  });
}
