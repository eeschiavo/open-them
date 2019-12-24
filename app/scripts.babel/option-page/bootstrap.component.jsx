import React from 'react';
import * as log from 'loglevel';
import OptionsPage from './options-page.component.jsx';

/**
 * Component principale della pagina options
 * @extends React.Component
 */
class Bootstrap extends React.Component {

  /**
   * Costruttore di default
   * @param {[type]} props
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <OptionsPage />
      </div>
    )
  }
}

export default Bootstrap;
