'use strict';

import * as log from 'loglevel';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: 'New'});

console.log('\'Allo \'Allo! Event Page for Browser Action');

chrome.runtime.openOptionsPage();

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
