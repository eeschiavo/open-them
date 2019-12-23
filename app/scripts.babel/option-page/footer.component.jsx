import React from 'react';
import * as log from 'loglevel';
import { Localize } from '../common/localization.js';
import { AUTHOR, AUTHOR_WEB_PAGE } from '../common/properties.js';

/**
 * Footer della pagina options
 * @extends React
 */
class Footer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className="footer">
        <div className="footer__container">
          <p>
            {'\u00a9'}
            {'\u00A0'}
            {Localize('appName')}
            {'\u00A0'}-{'\u00A0'}
            {new Date().getFullYear()}
            {'\u00A0'}-{'\u00A0'}
            {Localize('CREATED_BY')}
            {'\u00A0'}
            <a href={AUTHOR_WEB_PAGE}>{AUTHOR}</a>
          </p>
        </div>
      </footer>

    )
  }
}

export default Footer;
