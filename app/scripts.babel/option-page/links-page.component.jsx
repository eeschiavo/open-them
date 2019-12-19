import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import AddLink from "./add-link.component.jsx";
import Link from './link.component.jsx';
import { ChromeStorageSyncGet, ChromeStorageSyncSet } from '../common/chrome-storage.api.js';
import { MAX_VISIBLE_ITEMS, MAX_INCOGNITO_ITEMS } from '../common/properties.js'

/**
* Component per la gestione dei link
* @author Ernesto Schiavo - schiavo.ernesto@gmail.com
* @extends React.Component
*/
class LinksPage extends React.Component {

  constructor(props) {
    super(props);

    log.info('Welcome - constructor');

    this.state = {
      links: []
    };

    // recupero i links
    ChromeStorageSyncGet(['links']).then( result => {

      log.debug('Welcome - links recuperati dallo storage: ', result);

      if(result.links) {
        this.setState({links: result.links});
      } else {
        this.setState({links: []});
      }

    });

    this.addLink = this.addLink.bind(this);
    this.countLinks = this.countLinks.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.updateLink = this.updateLink.bind(this);
    this.updateSavedLinks = this.updateSavedLinks.bind(this);
    this.modalCloseCallback = this.modalCloseCallback.bind(this);
    this.almostOneIncognitoLink = this.almostOneIncognitoLink.bind(this);
    this.almostOneVisibleLink = this.almostOneVisibleLink.bind(this);
  }

  /**
   * Callback richiamata alla chiusura del modal del component AddLink
   * @param linkData quanto inserito nel modal (link e incognito)
   */
  modalCloseCallback(linkData) {

    log.info('modalCloseCallback - valore dal modal: ', linkData);

    // verifico se il link sia già presente
    const index = this.state.links.findIndex(l => { return l.id == linkData.id});

    // se il link è già salvato lo aggiorno altrimenti lo aggiungo
    if(index > 0) {
      this.updateLink(linkData, index);
    } else {
      this.addLink(linkData);
    }

  }

  /**
   * Aggiunta di un link
   * @param link
   */
  addLink(link) {

    // aggiunto il link allo state
    this.setState({
      links: this.state.links.concat(link)
    }, () => {

      //salvataggio dei link nello storage di Chrome
      ChromeStorageSyncSet({links: this.state.links}).then( () => {
        log.debug('addLink - link aggiunto');
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
      ChromeStorageSyncSet({links: links}).then( () => {
        log.debug('removeLink - link aggiornato nello storage');
      });
    });
  }

  /**
   * Verifica la presenza di almeno un link in incognito
   * @returns {}
   */
  almostOneIncognitoLink() {
    return this.state.links
           && !!this.state.links.find(link => {return link.incognito == true});
  }

  /**
   * Verifica la presenza di almeno un link non in incognito
   * @returns {}
   */
  almostOneVisibleLink() {
    return this.state.links
           && this.state.links.find(link => {return !link.incognito});
  }

  /**
   * Conta il numero di link (in incognito e non)
   * @param  {boolean} onlyIncognito se contare solo quelli in incognito
   * @return {number}               il numero di link
   */
  countLinks(onlyIncognito) {

    let counter = 0;
    log.debug('countLinks - onlyIncognito: ', onlyIncognito);

    if(this.state.links) {

      this.state.links.forEach(link => {
        if(onlyIncognito) {
          counter = link.incognito ? counter+1 : counter;
        } else {
          counter = link.incognito ? counter : counter+1;
        }
        log.debug('countLinks - counter: ', counter);
      });
    }

    return counter;
  }

  render() {
    return (
      <Container className="options-page">
        <Row className="options-page__links-row justify-content-md-center">
          <Col md="auto">
            {
              this.almostOneVisibleLink() &&
              (
                <Row className="justify-content-center">
                  <Col md="auto" className="counter-badge-col">
                    <div title="Numero di link salvati rispetto al totale possibile"
                         className="counter-badge">
                      <span>
                        {
                            this.countLinks()
                        }
                      </span>
                      <span>/</span>
                      <span>{MAX_VISIBLE_ITEMS}</span>
                    </div>
                  </Col>
                </Row>
              )
            }
            <Row className="justify-content-center">
              {
                this.almostOneVisibleLink() &&
                this.state.links.map((link, index) => {
                  if(!link.incognito) {
                    return (
                      <Link
                        key={index+''+link.id}
                        linkObj={link}
                        index={index}
                        removeLink={this.removeLink}
                        updateLink={this.updateLink}
                        closeCallback={this.modalCloseCallback}>
                      </Link>
                    )
                  }
                })
              }
              <AddLink incognito={false}
                     closeCallback={this.modalCloseCallback}/>
            </Row>
          </Col>
        </Row>
        {
          this.almostOneIncognitoLink() &&
          (
            <Row className="justify-content-md-center ">
              <Col md="auto options-page__links-row--incognito">
                <Row className="justify-content-center">
                  <Col md="auto" className="counter-badge-col">
                    <div title="Numero di link in incognito salvati rispetto al totale possibile"
                         className="counter-badge counter-badge--incognito">
                      <span>
                        {
                            this.countLinks(true)
                        }
                      </span>
                      <span>/</span>
                      <span>{MAX_INCOGNITO_ITEMS}</span>
                    </div>
                  </Col>
                </Row>
                <Row className="justify-content-center">
                  <Col md="auto">
                    <Row className="justify-content-center" style={{margin:'20px'}}>
                      {
                        this.state.links.map((link, index) => {
                          if(link.incognito) {
                            return (
                              <Link
                                key={index + '' + link.id}
                                linkObj={link}
                                index={index}
                                removeLink={this.removeLink}
                                updateLink={this.updateLink}
                                closeCallback={this.modalCloseCallback}>
                              </Link>
                            )
                          }
                        })
                      }
                      <AddLink incognito={true}
                               closeCallback={this.modalCloseCallback} />
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          )
        }
      </Container>
    )
  }
}

export default LinksPage;
