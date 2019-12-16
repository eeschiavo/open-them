'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './option-page/welcome.component.jsx';

ReactDOM.render(
  <Welcome name="Ernesto" />,
  document.getElementById('root')
);

console.log('\'Allo \'Allo! Option');
