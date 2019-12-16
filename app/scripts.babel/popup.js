'use strict';
import * as log from 'loglevel';
import * as prefix from 'loglevel-plugin-prefix';
import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './popup-page/popup.component.jsx';

prefix.reg(log);
log.enableAll();

prefix.apply(log, {
  format(level, name, timestamp) {
    return `(${timestamp}) ${level.toUpperCase()} ${name}:)}`;
  },
});

prefix.apply(log.getLogger('critical'), {
  format(level, name, timestamp) {
    return `[${timestamp}] ${level} ${name}:`;
  },
});

log.setLevel('trace');

/*
log.trace('trace');
log.debug('debug');
log.getLogger('critical').info('Something significant happened');
log.log('log');
log.info('info');
log.warn('warn');
log.error('error');
*/

/**
* Apertura pagina options
*/
let openOptions = function() {
  console.log('Apro la pagina delle opzioni')
  log.info('openOptions - apertura pagina options');
  chrome.runtime.openOptionsPage();
}

// rimuovo il badge
chrome.browserAction.setBadgeText({text: ''});

ReactDOM.render(
  <Popup />,
  document.getElementById('popup-root')
);

//document.getElementById("open-options").addEventListener("click", openOptions);
