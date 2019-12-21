import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import AddLink from "./add-link.component.jsx";
import Link from './link.component.jsx';
import { ChromeStorageSyncGet, ChromeStorageSyncSet } from '../common/chrome-storage.api.js';
import { MAX_VISIBLE_ITEMS, MAX_INCOGNITO_ITEMS } from '../common/properties.js'
import Disclaimer from '../common/disclaimer.component.jsx';
import TopBar from './top-bar.component.jsx';

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
      links: [],
      showDisclaimer: false
    };

    this.disclaimerRef = React.createRef();
    this.addLinkRef = React.createRef();
    this.topBarRef = React.createRef();
    this.linksRef = [];
    this.checkedLinks = [];

    this.disclaimerParagraphs = [
      {
        key: 'WELCOME_DISCLAIMER_FIRST',
        icon: ''
      },
      {
        key: 'WELCOME_DISCLAIMER_SECOND',
        icon: 'lightbulb.png'
      }
    ];

    // recupero i links
    ChromeStorageSyncGet(['links']).then( result => {

      log.debug('Welcome - links recuperati dallo storage: ', result);

      if(result.links) {

        const showDisclaimer = result.links.length == 0;
        if(showDisclaimer) {
          this.addLinkRef.current.extended(true);
          this.disclaimerRef.current.showDisclaimer();
        }

        this.setState({links: result.links, showDisclaimer: showDisclaimer});
      } else {

        this.addLinkRef.current.extended(true);
        this.disclaimerRef.current.showDisclaimer();
        this.setState({links: [], showDisclaimer: true});
      }
    });

    this.addLink = this.addLink.bind(this);
    this.countLinks = this.countLinks.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.updateLink = this.updateLink.bind(this);
    this.checkLink = this.checkLink.bind(this);
    this.editBulkLinks = this.editBulkLinks.bind(this);
    this.enableLinks = this.enableLinks.bind(this);
    this.disableLinks = this.disableLinks.bind(this);
    this.removeLinks = this.removeLinks.bind(this);
    this.enterEditMode = this.enterEditMode.bind(this);
    this.updateSavedLinks = this.updateSavedLinks.bind(this);
    this.modalCloseCallback = this.modalCloseCallback.bind(this);
    this.almostOneIncognitoLink = this.almostOneIncognitoLink.bind(this);
    this.almostOneVisibleLink = this.almostOneVisibleLink.bind(this);
  }

  /**
   * Abilitazione della modalità modifica dei link
   * @param  {boolean} enter se abilitare o meno la modalità
   * @param  {boolean} uncheck se effettuare l'uncheck dei link
   */
  enterEditMode(enter, uncheck) {

    log.info('LinksPage - enterEditMode, enter: ', enter);
    log.debug('LinksPage - enterEditMode, this.linksRef: ', this.linksRef);

    for(let el in this.linksRef) {
      if(this.linksRef[el].current) {
        this.linksRef[el].current.enterEditMode(enter, uncheck);
      }
    }
  }

  /**
   * Attivazione della edit mode generato tramite il long press su un link
   */
  enterEditModeFromLeaf() {
    this.topBarRef.current.startEdit();
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

  /**
   * Raccolta dei dati dei link con il check per la modifica multipla
   * @param  {[type]} linkData i dati del link
   * @param  {[type]} checked  se sia stato checkato o meno
   */
  checkLink(linkData, checked) {

    let index = this.checkedLinks.findIndex(el => {return el.id == linkData.id});
    if(index >= 0) {
      this.checkedLinks.splice(index, 1);
    } else {
      this.checkedLinks.push(linkData);
    }

    let enableTopBarBtns = this.checkedLinks.length > 0;
    this.topBarRef.current.changeButtonsStatus(enableTopBarBtns);

    log.debug('LinksPage - checkLink, this.checkedLinks: ', this.checkedLinks);
  }

  /**
   * Modifica di più link contemporaneamente
   * @param  {[type]} disable se disabilitarli
   * @param  {[type]} enable  se abilitarli
   * @param  {[type]} remove  se rimuoverli
   * @return {[type]}         i link modificati
   */
  editBulkLinks(enable, disable, remove) {

    let links = this.state.links;

    for(let i in this.checkedLinks) {
      for(let linkIndex in links) {
        if(this.checkedLinks[i].id == links[linkIndex].id) {
          if(enable) {
            links[linkIndex].enabled = true;
          }
          if(disable) {
            links[linkIndex].enabled = false;
          }
          if(remove) {
            links.splice(linkIndex, 1);
          }
        }
      }
    }

    return links;
  }

  /**
   * Abilitazione di link multipli
   */
  enableLinks() {
    let links = this.editBulkLinks(true, false, false);
    this.setState({links}, () => {
      this.checkedLinks = [];
      this.enterEditMode(false, true);
      this.topBarRef.current.stopEdit();
    });
  }

  /**
   * Disabilitazione di link multipli
   * @return {[type]} [description]
   */
  disableLinks() {
    let links = this.editBulkLinks(false, true, false);
    this.setState({links}, () => {
      this.checkedLinks = [];
      this.enterEditMode(false, true);
      this.topBarRef.current.stopEdit();
    });
  }

  /**
   * Rimozione multipla di link
   * @return {[type]} [description]
   */
  removeLinks() {
    let links = this.editBulkLinks(false, false, true);
    this.setState({links}, () => {
      this.checkedLinks = [];
      this.enterEditMode(false, true);
      this.topBarRef.current.stopEdit();
    });
  }

  render() {
    return (
      <Container className="options-page__container">
        <TopBar
          enableLinks={this.enableLinks}
          disableLinks={this.disableLinks}
          removeLinks={this.removeLinks}
          enterEditMode={this.enterEditMode}
          ref={this.topBarRef} />
        <Disclaimer ref={this.disclaimerRef}
                    icon={'welcome.png'}
                    title={'WELCOME_TITLE'}
                    paragraphs={this.disclaimerParagraphs}
         />
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

                    this.linksRef[link.id] = React.createRef();

                    return (
                      <Link
                        enterEditModeFromLeaf={this.enterEditModeFromLeaf}
                        checkLink={this.checkLink}
                        ref={this.linksRef[link.id]}
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
              <AddLink  disclaimerRef={this.disclaimerRef}
                        ref={this.addLinkRef}
                        incognito={false}
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
                    <Row className="justify-content-center" style={{margin:'20px 20px 0'}}>
                      {
                        this.state.links.map((link, index) => {

                          if(link.incognito) {

                            this.linksRef[link.id] = React.createRef();

                            return (
                              <Link
                                enterEditModeFromLeaf={this.enterEditModeFromLeaf}
                                checkLink={this.checkLink}
                                ref={this.linksRef[link.id]}
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
