import React from 'react';
import * as log from 'loglevel';
import Sidebar from './sidebar.component.jsx';
import LinksPage from './links-page.component.jsx';

/**
 * Component principale della pagina options
 * @extends React.Component
 */
class OptionsPage extends React.Component {

  /**
   * Costruttore di default
   * @param {[type]} props
   */
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="options-page">
        <Sidebar />
        <LinksPage />
      </div>
    )
  }
}

export default OptionsPage;
