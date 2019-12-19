import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import ReactModal from 'react-modal';
import LinkModal from './link-modal.component.jsx';


/**
 * Component per l'aggiunta di un link
 * @author Ernesto Schiavo - schiavo.ernesto@gmail.com
 */
class AddLink extends React.Component {

  /**
   * Costruttore di default
   * @param props
   */
  constructor(props) {
    super(props);

    this.modalRef = React.createRef();

    this.openModal = this.openModal.bind(this);
    this.modalClosed = this.modalClosed.bind(this);
  }

  /**
   * Apertura del modal per creare il link
   */
  openModal() {
    this.modalRef.current.openModal();
  }

  /**
   * Chiusura del modal per le informazioni riguardanti il link
   */
  modalClosed(linkData) {
    log.info('AddLink - modalClosed');

    log.debug('AddLink - modalClosed - linkData: ', linkData);
    if(linkData) {
      this.props.closeCallback(linkData);
    }
  }

  /**
   * Render
   */
  render() {

    return (
      <Col className={'add-link '+(this.props.incognito ? 'add-link--incognito':'')}>

        <button onClick={this.openModal} className={'add-link__button '+
                (this.props.incognito ? 'add-link__button--incognito' : '')}>
          <i className="fas fa-plus"></i>
        </button>

        <p className={'add-link__description '+
           (this.props.incognito ? 'add-link__description--incognito' : '')}>
          Aggiungi
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
