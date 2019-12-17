import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import ReactModal from 'react-modal';

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
      incognito: false,
      showModal: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
  }

  /**
   * Change del campo di input
   * @param event event del campo di input per l'inserimento del link
   */
  handleChange(event) {
    this.setState({
      url: event.target.value
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
    if(!url || !this.isValidURL(url)) {
      alert('Inserire un indirizzo valido');
    } else {
      await this.closeModal();

      const value = {
        url: this.state.url,
        incognito: this.state.incognito
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
   * Verifica validità URL
   * @param str la stringa da validare
   * @returns {""|boolean}
   */
  isValidURL(str) {
    let a  = document.createElement('a');
    a.href = str;
    return (a.host && a.host != window.location.host);
  }

  /**
   * Render
   * @returns {*}
   */
  render() {

    return (
      <Container>

        <button onClick={this.openModal}>+</button>

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
                     onChange={this.handleChange} />
            </label>

            {/* INCOGNITO */}
            <label>
              Usa in incognito
              <input type="checkbox"
                     checked={this.state.incognito}
                     onChange={this.toggleChange}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>

          <button onClick={this.closeModal}>
            Close Modal
          </button>

        </ReactModal>

      </Container>
    )
  }
}

export default AddLink;
