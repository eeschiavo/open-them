import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import AddLink from "./add-link.component.jsx";
import Link from './link.component.jsx';

/**
* Component principale della pagina options
* @author Ernesto Schiavo - schiavo.ernesto@gmail.com
*/
class Welcome extends React.Component {

  constructor(props) {
    super(props);

    log.info('Welcome - constructor');

    this.state = {
      links: []
    };

    // recupero i links
    chrome.storage.sync.get(['links'], (result) => {

      log.debug('Welcome - links recuperati dallo storage: ', result);

      if(result.links) {
        this.setState({links: result.links});
      } else {
        this.setState({links: []});
      }

    });

    this.removeLink = this.removeLink.bind(this);
    this.updateLink = this.updateLink.bind(this);
    this.updateSavedLinks = this.updateSavedLinks.bind(this);
    this.modalCloseCallback = this.modalCloseCallback.bind(this);
  }

  /**
   * Callback richiamata alla chiusura del modal del component AddLink
   * @param value quanto inserito nel modal (link e incognito)
   */
  modalCloseCallback(value) {

    log.info('modalCloseCallback - valore dal modal: ', value);

    // aggiunto il link allo state
    this.setState({
      links: this.state.links.concat(value)
    }, () => {

      chrome.storage.sync.set({links: this.state.links}, function() {
        log.debug('modalCloseCallback - link aggiunto');
      });
    });
  }

  /**
   * Cancellazione di un link
   * @param link il link da rimuovere
   * @param index l'indice del link da rimuovere
   */
  removeLink(link, index) {

    log.info('removeLink - richiesta rimozione del link: ', link);

    // recupero i links attuali
    let links = this.state.links;

    // rimuovo quello specitificato
    links.splice(index, 1);
    log.debug('removeLink - links rimasti: ', links);

    this.updateSavedLinks(links);
  }

  /**
   * Aggiornamento di un link nello storage
   * @param link il link da aggiornare
   * @param index l'indice del link da aggiornare
   */
  updateLink(link, index) {

      let links = this.state.links;
      links[index] = link;

      this.updateSavedLinks(links);
  }

  /**
   * Aggiornamento dei links nello state e nello storage
   * @param links i links aggiornati
   */
  updateSavedLinks(links) {

    // aggiorno lo state
    this.setState({
      links: links
    }, () => {

      log.debug('updateSavedLinks - link aggiornato nello state');

      // salvo le modifiche nello storage
      chrome.storage.sync.set({links: links}, () => {
        log.debug('removeLink - link aggiornato nello storage');
      });
    });
  }

  render() {
    return (
      <Container className="options-page">
        <Row className="options-page__links-row">
          {
            this.state.links &&
            this.state.links.map((link, index) => {
              return (
                <Link
                  key={index+''+link.id}
                  linkObj={link}
                  index={index}
                  removeLink={this.removeLink}
                  updateLink={this.updateLink}>
                </Link>
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
