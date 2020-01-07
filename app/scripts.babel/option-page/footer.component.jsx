import React from 'react';
import { Localize } from '../common/localization.js';
import { AUTHOR, AUTHOR_WEB_PAGE } from '../common/properties.js';
import { OpenTwitter } from '../common/utilities';

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
            <a href={AUTHOR_WEB_PAGE} target="_blank">{AUTHOR}</a>
            {'\u00A0'}-{'\u00A0'}
            <img
              onClick={OpenTwitter}
              alt="Twitter"
              src="https://img.shields.io/twitter/follow/ernesto_schiavo?label=follow&style=social">
            </img>
          </p>
        </div>
      </footer>

    )
  }
}

export default Footer;
