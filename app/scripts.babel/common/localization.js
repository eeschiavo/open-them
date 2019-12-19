'use strict';

export function Localize(key) {
  return chrome.i18n.getMessage(key);
}