import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import AddLink from "./add-link.component.jsx";

class Welcome extends React.Component {

  constructor(props) {
    super(props);

    log.info('Welcome - constructor');

    this.state = {
      links: []
    };

    chrome.storage.sync.get(['links'], (result) => {
      log.debug(result);
      if(result.links) {
        this.setState({links: result.links});
      } else {
        this.setState({links: []});
      }

    });

    this.modalCloseCallback = this.modalCloseCallback.bind(this);
  }

  /**
   * Callback richiamata alla chiusura del modal del component AddLink
   * @param value
   */
  modalCloseCallback(value) {

    log.debug('Welcome - modalCloseCallback: ', value);

    this.setState({
      links: this.state.links.concat(value)
    }, () => {

      chrome.storage.sync.get(['links'], (result) => {

        let array = result.links ? result.links : [];

        let links = array.concat(this.state.links);
        log.debug('Welcome - salvo i links: ', links);
        chrome.storage.sync.set({links: links}, function() {
          log.debug('Welcome - link aggiunto');
        });
      });

    });
  }

  /**
   * Cancellazione di un link
   */
  removeLink(link, index) {

    let links = this.state.links;
    links.splice(index, 1);

    log.debug('Welcome - links rimasti: ', links);

    this.setState({
      links: links
    }, () => {
      log.debug('Welcome - link rimosso dalla pagina');
      chrome.storage.sync.set({links: this.state.links}, () => {
        log.debug('Welcome - link rimosso dallo storage');

      });
    });
  }

  render() {
    return (
      <Container>
        <Row>
          {
            this.state.links &&
            this.state.links.map((link, index) => {
              return (
                <Col key={index} onClick={() => this.removeLink(link, index)}>{link.url}</Col>
              )
            })
          }
          <AddLink closeCallback={this.modalCloseCallback}/>
        </Row>
      </Container>
    )
  }
}

export default Welcome;
