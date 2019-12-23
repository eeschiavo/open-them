import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import axios from 'axios';
import { RandomInt, OpenLink } from '../common/utilities.js';
import { Menu, Item, Separator, IconFont, Submenu, MenuProvider } from 'react-contexify';
import Spinner from '../common/spinner.component.jsx';
import LinkModal from './link-modal.component.jsx';
import { URL_BESTICON } from '../common/properties.js';
import { Localize } from '../common/localization.js';

/**
 * Rappresentazione di un link
 * @author Ernesto Schiavo - schiavo.ernesto@gmail.com
 * @extends React.Component
 */
class Link extends React.Component {

  constructor(props) {
    super(props);

    log.info('Link - constructor');

    this.state = {
      domainIcon: '',
      linkData: this.props.linkObj,
      firstLetter: (this.props.linkObj.name ?
        this.props.linkObj.name.charAt(0) :
        this.props.linkObj.domain.charAt(0)),
      iconRetrieved: false,
      useIconFallback: false,
      editMode: false,
      checked: false
    };

    this.modalRef = React.createRef();

    const domain = this.state.linkData.domain;
    log.debug('Link - constructor - dominio: ', domain);

    this.domainIcon = URL_BESTICON.replace('%domain%', domain);

    this.contextMenuId = 'vertical-menu-'+RandomInt();

    this.enterEditMode = this.enterEditMode.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleButtonRelease = this.handleButtonRelease.bind(this);
    this.disableLink = this.disableLink.bind(this);
    this.enableLink = this.enableLink.bind(this);
    this.editLink = this.editLink.bind(this);
    this.openLink = this.openLink.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
    this.modalClosed = this.modalClosed.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  /**
   * Chiusura del modal eventualmente aperto
   * @return {[type]} [description]
   */
  closeModal() {
    if(this.modalRef.current) {
      this.modalRef.current.closeModal();
    }
  }

  /**
   * Abilitazione della modalità di modifica
   * @param  {boolean} enter se abilitare o meno la modalità di modifica
   * @param {boolean} uncheck se fare l'uncheck degli elementi
   */
  enterEditMode(enter, uncheck) {

    log.debug('Link - enterEditMode, enter: ', enter);

    let checked = this.state.checked;
    if(uncheck) {
      checked = false;
    }

    this.setState({editMode:enter, checked:checked}, () => {
      log.debug('Link - enterEditMode, this.state: ', this.state);
    });
  }

  /**
   * Check dell'elemento per la modifica multipla
   */
  toggleChange() {
    this.setState({checked: !this.state.checked}, () => {
      this.props.checkLink(this.state.linkData, this.state.checked);
    });
  }

  /**
   * ComponentDiMount
   */
  componentDidMount() {

    log.info('Link - componentDidMount');

    axios.get(this.domainIcon, {timeout: 5000})
      .then(res => {
        this.setState({ domainIcon: this.domainIcon, iconRetrieved: true });
      }).catch(err => {
        log.error('componentDidMount - fallito recupero della favicon');
        this.setState({useIconFallback: true});
      });
  }

  /**
   * Modifica di un link esistente
   */
  editLink() {
    this.modalRef.current.openModal(true, this.state.linkData);
  }

  /**
   * Salvataggio del link dopo la chiusura del modal
   * @param linkData eventuale dati del link
   */
  modalClosed(linkData) {

    // se è presente un oggetto ovvero un nuovo link lo salvo
    if(linkData) {
      this.props.closeCallback(linkData);
    }
  }

  /**
   * Attivazione del long press sul link
   */
  handleButtonPress () {
    this.buttonPressTimer = setTimeout(() => {
      this.props.enterEditModeFromLeaf();
    }, 1500);
  }

  /**
   * Cancellazione del long press
   */
  handleButtonRelease() {
    clearTimeout(this.buttonPressTimer);
  }

  /**
   * Rimozione di un link
   */
  removeLink() {
    this.props.removeLink(this.state.linkData, this.props.index);
  }

  /**
   * Disabilizatione di un link (per il lancio automatico)
   */
  disableLink() {
    let linkData = this.state.linkData;
    linkData.enabled = false;
    this.setState({linkData: linkData}, () => {
      this.props.updateLink(this.state.linkData, this.props.index);
    });
  }

  /**
   * Abilitazione di un link (per il lancio automatico)
   */
  enableLink() {
    let linkData = this.state.linkData;
    linkData.enabled = true;
    this.setState({linkData: linkData}, () => {
      this.props.updateLink(this.state.linkData, this.props.index);
    });
  }

  /**
   * Apertura di un sito web
   */
  openLink() {
    if(!this.state.editMode) {
      OpenLink(this.state.linkData);
    } else {
      this.toggleChange();
    }
  }

  render() {

    let link = this.state.linkData;

    return (
      <React.Fragment>
        <MenuProvider id={this.contextMenuId}>
          <Col
              className={'domain'+
                          (!this.state.linkData.enabled ? ' domain--disabled':'')+
                          (link.incognito ? ' domain--incognito':'')+
                          (this.state.editMode ? ' domain--edit-mode':'')}
              onTouchStart={this.handleButtonPress}
              onTouchEnd={this.handleButtonRelease}
              onMouseDown={this.handleButtonPress}
              onMouseUp={this.handleButtonRelease}
              onMouseLeave={this.handleButtonRelease}
              onClick={this.openLink}>
              {
                this.state.editMode &&
                (
                  <input
                          className="domain__checkbox"
                          type="checkbox"
                          checked={this.state.checked}
                          onChange={this.toggleChange} />
                )
              }
            {
              this.state.iconRetrieved &&
              (
                <img className="domain__favicon" src={this.state.domainIcon} />
              )
            }
            {
              !this.state.iconRetrieved &&
              !this.state.useIconFallback &&
              (
                <Spinner visible={true}></Spinner>
              )
            }
            {
              this.state.useIconFallback &&
              (
                <div className="domain__favicon domain__favicon--fallback">
                {this.state.firstLetter}
                </div>
              )
            }

            <p className={'domain__name '+
               (link.incognito ? 'domain__name--incognito':'')}>
              {
                link.name &&
                (
                  <span>{link.name}</span>
                )
              }
              {
                !link.name &&
                (
                  <span>{link.domain}</span>
                )
              }
            </p>

          </Col>
        </MenuProvider>

        <LinkModal isEdit={true}
                   ref={this.modalRef}
                   url={link.url}
                   name={link.name}
                   incognito={link.incognito}
                   enabled={link.enabled}
                   modalClosed={this.modalClosed} />

        <Menu id={this.contextMenuId}>
          <Item onClick={this.editLink}>
            <IconFont className="fas fa-edit contentmenu-icon" />
            {Localize('EDIT')}
          </Item>
          <Separator />
          {
            this.state.linkData.enabled &&
            (
              <Item onClick={this.disableLink}>
                <IconFont className="fas fa-minus-square contentmenu-icon" />
                {Localize('DISABLE')}
              </Item>
            )
          }
          {
            !this.state.linkData.enabled &&
            (
              <Item onClick={this.enableLink}>
                <IconFont className="fas fa-plus-square contentmenu-icon" />
                {Localize('ENABLE')}
              </Item>
            )
          }
          <Item onClick={this.removeLink}>
            <IconFont className="fas fa-trash contentmenu-icon" />
            {Localize('REMOVE')}
          </Item>
      </Menu>
      </React.Fragment>
    )
  }

}

export default Link;
