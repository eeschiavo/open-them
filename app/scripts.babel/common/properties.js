'use strict';

/**
 * URL per il recupero dell'icona da un URL
 * @type {String}
 */
export const URL_BESTICON = 'https://otbesticon.herokuapp.com/icon?url=%domain%&size=80..120..200';

/**
 * Numero massimo di link salvabili
 * @type {Number}
 */
export const MAX_VISIBLE_ITEMS = 30;

/**
 * Numero massimo di link in incognito salvabili
 * @type {Number}
 */
export const MAX_INCOGNITO_ITEMS = 30;

/**
 * Pagina web dell'autore dell'estensione
 * @type {String}
 */
export const AUTHOR_WEB_PAGE = 'https://www.ernestoschiavo.it';

/**
 * L'autore dell'estensione
 * @type {String}
 */
export const AUTHOR = 'Ernesto Schiavo';

/**
 * Tempo di attesa prima di salvare la preferenza relativa all'orario di funzionamento dell'estensione
 * @type {Number}
 */
export const HOURS_SET_TIME = 1000;

/**
 * URL per l'immagine dell'autore
 * @type {String}
 */
export const AUTHOR_IMAGE = 'https://ernestoschiavo.it/img/profile.png';

/**
 * Link dei software di terze parti utilizzati
 * @type {Object}
 */
export const LINKS = {
  REACT: 'https://it.reactjs.org/',
  ICONS8: 'https://icons8.com/',
  MOMENTJS: 'https://momentjs.com/',
  BOOTSTRAP: 'https://getbootstrap.com/',
  FONTAWESOME: 'https://fontawesome.com/',
  AXIOS: 'https://github.com/axios/axios'
}
