import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';

class Welcome extends React.Component {

  constructor(props) {
    super(props);

    log.info('Welcome - constructor');

    // imposto dei link di prova
    chrome.storage.sync.set(
      {
        urls: [
          {
            url: 'https://www.google.it',
            incognito: false
          },
          {
            url: 'https://www.facebook.com',
            incognito: true
          }]
      },
      function() {

        log.debug('Welcome - url impostata');
      });
  }

  render() {
    return <h1>Welcome, {this.props.name}</h1>
  }
}

export default Welcome;
