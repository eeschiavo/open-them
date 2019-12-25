'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from './option-page/bootstrap.component.jsx';
import * as log from 'loglevel';

let _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-61807084-7']);
_gaq.push(['_trackPageview']);
window._gaq = _gaq;

(function() {
  let ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  let s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

ReactDOM.render(
  <Bootstrap />,
  document.getElementById('options-root')
);
