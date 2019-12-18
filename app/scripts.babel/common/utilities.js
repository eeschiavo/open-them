/**
 * Creazione di un integer random
 * @param  min il valore minimo
 * @param  max il valore massimo
 * @return {integer} un numero random
 */
export function RandomInt(min, max) {
    if(!min) {
        min = 0;
    }
    if(!max) {
        max = 10000000;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Creazione di un UUID v4
 * @return {string} un UUID v4
 */
export function UuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


/**
 * Verifica validità URL
 * @param str la stringa da validare
 * @returns {""|boolean}
 */
export function IsValidURL(str) {
  /*let a  = document.createElement('a');
  a.href = str;
  return (a.host && a.host != window.location.host);*/
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
  var regexp = new RegExp(expression);
  return regexp.test(str);
}


/**
 * Estrazione dell'hostname da una URL
 * @param  url la URL dalla quale estrarre l'hostname
 * @return l'hostname dell'URL
 */
export function ExtractHostname(url) {
  var hostname;

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}
