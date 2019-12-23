'use strict';
import * as log from 'loglevel';
import { ChromeStorageSyncGet, ChromeStorageSyncSet, ChromeStorageLocalGet, ChromeStorageLocalSet } from './common/chrome-storage.api.js';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

let openLinks = function(links) {

  links.forEach(linkData => {

    // se è impostata la URL
    if(linkData.url) {
      let url = linkData.url;

      if(!url.startsWith('http')) {
        url = 'https://'+url;
      }

      //se è in incognito
      if(linkData.incognito) {

        log.debug('background.js - apro url in incognito: ', url);
        chrome.windows.create({url: url, incognito: true});

      } else {

        log.debug('background.js - apro url non in incognito: ', url);
        chrome.tabs.create({url: url});
      }
    }
  });
}

// Verifico non sia la prima volta che viene avviata l'estensione
ChromeStorageSyncGet(['notFirstTime', 'links', 'settings']).then(result => {

  log.debug('background.js - ChromeStorageSyncGet(notFirstTime): ', result);

  let { notFirstTime, links, settings } = result;

  // se non è la prima volta e se ci sono link da aprire
  if(notFirstTime == true) {

    // se l'estensione è abilitata
    if(settings && settings.enabled && links && links.length > 0) {

      // verifico ci sia l'abilitazione su questo device
      ChromeStorageLocalGet(['localSettings']).then(localResult => {

        log.debug('get del localSettings nel local, localResult:', localResult);
        let localEnabled = true;

        if(localResult.localSettings && localResult.localSettings.enabled === false) {
          localEnabled = false;
        }

        if(localEnabled) {

          if(settings.askBeforeOpen) {

            if(window.confirm('OpenThem - vuoi aprire i siti web preimpostati? '+
            'per disattivare questo messaggio vai nelle impostazioni dell\'estensione')) {

              openLinks(links);

            }
          } else {
            openLinks(links);
          }
        }

      });

    }

  } else {

    // imposto che non è più la prima volta
    ChromeStorageSyncSet(
      {
        'notFirstTime':true,
        'settings':{
          enabled: true,
          askBeforeOpen: false
        }
      }
    ).then(res => {
      log.debug('background.js - ChromeStorageSyncSet(notFirstTime): ', res);
    });

    // imposto un uuid per questo device
    ChromeStorageLocalGet(['localSettings']).then(result => {

      let { localSettings } = result;

      if(!localSettings) {

        ChromeStorageLocalSet(
          {
            'localSettings': {
              enabled: true
            }
          }
        );
      }

    });

    chrome.browserAction.setBadgeText({text: 'New'});
    chrome.runtime.openOptionsPage();
  }
});


// TODO rimuovere
// chrome.runtime.openOptionsPage();
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.runtime.openOptionsPage();
});
