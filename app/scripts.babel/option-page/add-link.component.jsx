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
   * @return {[type]} [description]
   */
  openModal() {
    this.modalRef.current.openModal();
  }

  /**
   * Chiusura del modal per le informazioni riguardanti il link
   */
  modalClosed(value) {
    log.info('AddLink - modalClosed');

    log.debug('AddLink - modalClosed - value: ', value);
    if(value) {
      this.props.closeCallback(value);
    }
  }

  /**
   * Render
   * @returns {*}
   */
  render() {

    return (
      <Col className="add-link">

        <button onClick={this.openModal} className="add-link__button">
        </button>

        <p className="add-link__description">
          Aggiungi
        </p>

        <LinkModal modalClosed={this.modalClosed}
                   ref={this.modalRef}
                   enabled={true}
                   isEdit={false}>
        </LinkModal>

      </Col>
    )
  }
}

export default AddLink;
