import React from 'react';
import ReactDOM from 'react-dom';
import * as log from 'loglevel';
import  { Container, Row, Col } from 'react-bootstrap';

class Popup extends React.Component {

  /**
  * Options page opening
  */
  openOptions() {

    log.info('Popup - openOptions');
    chrome.runtime.openOptionsPage();
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
              <button onClick={this.openOptions}>
                Open options
              </button>
            </Col>
          </Row>
      </Container>
    )
  }
}

export default Popup;
