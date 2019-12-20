'use strict';
import * as log from 'loglevel';
import { ChromeStorageSyncGet, ChromeStorageSyncSet } from './common/chrome-storage.api.js';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

// Verifico non sia la prima volta che viene avviata l'estensione
ChromeStorageSyncGet(['notFirstTime']).then(result => {

  log.debug('background.js - ChromeStorageSyncGet(notFirstTime): ', result);

  if(result && result.notFirstTime == true) {

    // Avvio links
    chrome.storage.sync.get(['links'], function(result) {

      log.debug('background.js - url salvate: ', result);

      // se ci sono url impostati
      if(result.links) {

        // per ogni url impostata
        result.links.forEach(urlObj => {

          // se è impostata la URL
          if(urlObj.url) {

            //TODO remove
            return;

            //se è in incognito
            if(urlObj.incognito) {

              log.debug('background.js - apro url in incognito: ', urlObj.url);
              chrome.windows.create({url: urlObj.url, incognito: true});

            } else {

              log.debug('background.js - apro url non in incognito: ', urlObj.url);
              chrome.tabs.create({url: urlObj.url});
            }
          }
        })
      }
    });

  } else {

    ChromeStorageSyncSet({'notFirstTime':true}).then(res => {
      log.debug('background.js - ChromeStorageSyncSet(notFirstTime): ', res);
    });

    chrome.browserAction.setBadgeText({text: 'New'});

    // TODO rimuovere
    chrome.runtime.openOptionsPage();
  }
});
