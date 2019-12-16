'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './option-page/welcome.component.jsx';

// rimuovo il badge
chrome.browserAction.setBadgeText({text: ''});

ReactDOM.render(
  <Welcome name="Ernesto" />,
  document.getElementById('root')
);
