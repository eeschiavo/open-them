'use strict';

let openOptions = function() {
  console.log('Apro la pagina delle opzioni')
  chrome.runtime.openOptionsPage();
}

document.getElementById("open-options").addEventListener("click", openOptions);
