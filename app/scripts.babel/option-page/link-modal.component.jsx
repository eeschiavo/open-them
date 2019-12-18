import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import ReactModal from 'react-modal';
import psl from 'psl';
import { UuidV4, IsValidURL, ExtractHostname } from '../common/utilities.js';

ReactModal.setAppElement('#options-root');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    width                 : '450px',
    transform             : 'translate(-50%, -50%)'
  }
};

class LinkModal extends React.Component {

  constructor(props) {
    super(props);

    this.initialState = {
      url: this.props.url ? this.props.url : '',
      name: this.props.name ? this.props.name : '',
      incognito: this.props.incognito ? this.props.incognito : false,
      showModal: this.props.showModal,
      enabled: this.props.enabled,
      isEdit: this.props.isEdit
    };
    this.state = this.initialState;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
  }


  /**
   * Change del campo di input dell'URL
   * @param event event del campo di input per l'inserimento del link
   */
  handleChangeUrl(event) {
    this.setState({
      url: event.target.value
    });
  }

  /**
   * Change del campo di input del nome
   * @param event event del campo di input per l'inserimento del nome
   */
  handleChangeName(event) {
    this.setState({
      name: event.target.value
    });
  }

  /**
   * Toggle per la modalità incognito
   * @param event event del campo di input (type checkbox)
   */
  toggleChange(event) {
    this.setState({
      incognito: !this.state.incognito
    });
  }

  /**
   * Submit del form
   * @param event
   */
  async handleSubmit(event) {

    log.debug('LinkModal - è stato inserito un URL: ' + this.state.url);
    event.preventDefault();

    let url = this.state.url;

    // verifico valdità URL
    if(!url || !IsValidURL(url)) {

      alert('Inserire un indirizzo valido');

    } else if(!this.state.name) {

      alert('Inserire un nome');

    } else {

      const value = {
        url: url,
        domain: psl.get(ExtractHostname(url)),
        incognito: this.state.incognito,
        enabled: this.props.enabled,
        name: this.state.name,
        id: UuidV4()
      };

      await this.closeModal(null, value);

    }
  }

  /**
   * Apertura del modal per richiedere le informazioni per il link
   */
  async openModal() {
    log.info('AddLink - openModal');

    await this.setState(
      {
        showModal: true
      });
  }

  /**
   * Chiusura del modal per le informazioni riguardanti il link
   */
  closeModal(event, value) {

    log.info('AddLink - closeModal');

    this.setState({showModal: false}, () => {
      this.props.modalClosed(value);
      this.setState(this.initialState);
    });

  }

  render() {

    return (

      <ReactModal
        isOpen={this.state.showModal}
        onRequestClose={this.closeModal}
        style={customStyles}>

        <p className="link-modal link-modal__title">
          {
            this.state.isEdit &&
            (
              <span>Modifica</span>
            )
          }
          {
            !this.state.isEdit &&
            (
              <span>Aggiungi indirizzo</span>
            )
          }
        </p>

        {/* Form inserimento URL */}
        <form onSubmit={this.handleSubmit}>

          {/* URL */}
          <Row className="row input-effect">
            <Col>
              <input type="text"
                   className={'input-effect__move-and-color '+
                               (this.state.url ? 'has-content' : '')}
                   value={this.state.url}
                   onChange={this.handleChangeUrl} />
              <label>Link</label>
              <span className="focus-bg"></span>
            </Col>
          </Row>

          {/* NAME */}
          <Row className="row input-effect">
            <Col>
              <input type="text"
                className={'input-effect__move-and-color '+
                            (this.state.name ? 'has-content' : '')}
                   value={this.state.name}
                   onChange={this.handleChangeName} />
                <label>Nome</label>
                <span className="focus-bg"></span>
            </Col>
          </Row>

          {/* INCOGNITO */}
          <Row>
            <Col className="link-modal link-modal__incognito">
              <label className="form-switch">
                <input type="checkbox"
                       checked={this.state.incognito}
                       onChange={this.toggleChange} />
                <i></i>
                <p>Apri sempre in incognito</p>
              </label>
            </Col>
          </Row>

          {/* TASTI */}
          <Row>
            <Col className="link-modal__buttons">
              <button className="ot-button ot-button--cancel"
                      onClick={this.closeModal}>
                Annulla
              </button>
              <button className="ot-button ot-button--confirm"
                      type="submit"
                      value="Submit">
                Aggiungi
              </button>
            </Col>
          </Row>

        </form>

      </ReactModal>
    );
  }

}

export default LinkModal;
