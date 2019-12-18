import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import ReactModal from 'react-modal';
import psl from 'psl';
import { UuidV4, IsValidURL } from '../common/utilities.js';

ReactModal.setAppElement('#options-root');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    width                 : '35%',
    height                : '30%',
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

    if(url && !url.startsWith('http')) {
      url = 'https://'+url;
    }

    // verifico valdità URL
    if(!url || !IsValidURL(url)) {
      alert('Inserire un indirizzo valido');
    } else {
      await this.closeModal();

      const value = {
        url: url,
        domain: psl.get(this.extractHostname(url)),
        incognito: this.state.incognito,
        enabled: true,
        name: this.state.name,
        id: UuidV4()
      };

      this.props.closeCallback(value);
    }
  }

  extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

  /**
   * Apertura del modal per richiedere le informazioni per il link
   */
  async openModal() {
    log.info('AddLink - openModal');

    await this.setState(
      {
        url: '',
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
          style={customStyles}
          contentLabel="Minimal Modal Example">

          {/* Form inserimento URL */}
          <form onSubmit={this.handleSubmit}>

            {/* URL */}
            <label>
              Indirizzo:
              <input type="text"
                     value={this.state.url}
                     onChange={this.handleChangeUrl} />
            </label>

            {/* INCOGNITO */}
            <label>
              Usa in incognito
              <input type="checkbox"
                     checked={this.state.incognito}
                     onChange={this.toggleChange}
              />
            </label>

            {/* NAME */}
            <label>
              Nome:
              <input type="text"
                     value={this.state.name}
                     onChange={this.handleChangeName} />
            </label>

            <input type="submit" value="Submit" />
          </form>

          <button onClick={this.closeModal}>
            Close Modal
          </button>

        </ReactModal>

      </Col>
    )
  }
}

export default AddLink;
