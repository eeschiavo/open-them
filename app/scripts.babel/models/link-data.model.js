'use strict';

/** @type {LinkData} Classe per la rappresenzaione dei dati di un link */
class LinkData {
  constructor(id, url, domain, incognito, enabled, name) {
    this.id = id;
    this.url = url;
    this.domain = domain;
    this.incognito = incognito;
    this.enabled = enabled;
    this.name = name;
  }
}

export default LinkData;
