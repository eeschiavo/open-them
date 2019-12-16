'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './option-page/welcome.component.jsx';
import * as log from 'loglevel';

ReactDOM.render(
  <Welcome />,
  document.getElementById('options-root')
);
