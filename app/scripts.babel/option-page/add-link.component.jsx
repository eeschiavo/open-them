import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import { Localize } from '../common/localization.js';
import LinkModal from './link-modal.component.jsx';


/**
 * Aggiunta di un link
 * @author Ernesto Schiavo - schiavo.ernesto@gmail.com
 * @extends React.Component
 */
class AddLink extends React.Component {

  /**
   * Costruttore di default
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      extended: false
    }

    this.modalRef = React.createRef();

    this.extended = this.extended.bind(this);
    this.openModal = this.openModal.bind(this);
    this.modalClosed = this.modalClosed.bind(this);
  }

  extended(extend) {
    this.setState({extended: extend});
  }

  /**
   * Apertura del modal per creare il link
   */
  openModal() {
    this.modalRef.current.openModal();
  }

  /**
   * Apertura del modal per creare il link
   */
  closeModal() {
    this.modalRef.current.closeModal();
  }

  /**
   * Chiusura del modal per le informazioni riguardanti il link
   */
  modalClosed(linkData) {
    log.info('AddLink - modalClosed');

    log.debug('AddLink - modalClosed - linkData: ', linkData);
    if(linkData) {
      this.props.closeCallback(linkData);

      if(this.state.extended) {
        this.props.disclaimerRef.current.closeDisclaimer();
        this.setState({extended: false});
      }
    }
  }

  /**
   * Render
   */
  render() {

    return (
      <Col onClick={this.openModal} className={'add-link '+(this.props.incognito ? 'add-link--incognito ':'')+
                      (this.state.extended ? 'add-link__extended':'')}>

        <button className={'add-link__button '+
                (this.props.incognito ? 'add-link__button--incognito' : '')}>
          <i className="fas fa-plus"></i>
        </button>

        <p className={'add-link__description '+
           (this.props.incognito ? 'add-link__description--incognito' : '')}>
           {
             this.state.extended &&
             Localize('ADD_FIRST_MESSAGE')
           }
           {
             !this.state.extended &&
             Localize('ADD')
           }

        </p>

        <LinkModal key={this.props.incognito ? '1' : '0'}
                   modalClosed={this.modalClosed}
                   ref={this.modalRef}
                   incognito={this.props.incognito}
                   enabled={true}
                   isEdit={false}>
        </LinkModal>

      </Col>
    )
  }
}

export default AddLink;
