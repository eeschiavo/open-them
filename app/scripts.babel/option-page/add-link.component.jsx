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

    this.state = {
      url: '',
      name: '',
      incognito: false,
      showModal: false
    };

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

    log.debug('AddLink - è stato inserito un URL: ' + this.state.url);
    event.preventDefault();

    let url = this.state.url;

    // verifico valdità URL
    if(!url || !IsValidURL(url)) {

      alert('Inserire un indirizzo valido');

    } else if(!this.state.name) {

      alert('Inserire un nome');

    } else {

      await this.closeModal();

      const value = {
        url: url,
        domain: psl.get(ExtractHostname(url)),
        incognito: this.state.incognito,
        enabled: true,
        name: this.state.name,
        id: UuidV4()
      };

      this.props.closeCallback(value);
    }
  }

  /**
   * Apertura del modal per richiedere le informazioni per il link
   */
  async openModal() {
    log.info('AddLink - openModal');

    await this.setState(
      {
        url: '',
        name: '',
        incognito: false,
        showModal: true
      });
  }

  /**
   * Chiusura del modal per le informazioni riguardanti il link
   */
  closeModal() {
    log.info('AddLink - closeModal');
    this.setState({showModal: false});
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

        <ReactModal
          isOpen={this.state.showModal}
          onRequestClose={this.closeModal}
          style={customStyles}>

          <p className="link-modal link-modal__title">
            Aggiungi indirizzo
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
      </Col>
    )
  }
}

export default AddLink;
