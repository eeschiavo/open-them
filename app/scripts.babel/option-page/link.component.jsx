import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import axios from 'axios';
import { RandomInt } from '../common/utilities.js';
import { Menu, Item, Separator, IconFont, Submenu, MenuProvider } from 'react-contexify';
import Spinner from '../common/spinner.component.jsx';

class Link extends React.Component {

  constructor(props) {
    super(props);

    log.info('Link - constructor');

    this.state = {
      domainIcon: '',
      firstLetter: (this.props.linkObj.name ?
        this.props.linkObj.name.charAt(0) :
        this.props.linkObj.domain.charAt(0)),
      enabled: this.props.linkObj.enabled,
      iconRetrieved: false,
      useIconFallback: false
    }

    const domain = this.props.linkObj.domain;
    log.debug('Link - constructor - dominio: ', domain);

    this.domainIcon = 'https://otbesticon.herokuapp.com/icon?url='+domain+'&size=80..120..200';
    this.contextMenuId = 'vertical-menu-'+RandomInt();

    this.removeLink = this.removeLink.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleButtonRelease = this.handleButtonRelease.bind(this);
    this.disableLink = this.disableLink.bind(this);
    this.enableLink = this.enableLink.bind(this);
  }

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

  handleButtonPress () {
    this.buttonPressTimer = setTimeout(() => {
      alert('long press activated')
    }, 1500);
  }

  handleButtonRelease () {
    clearTimeout(this.buttonPressTimer);
  }

  /**
   * Rimozione di un link
   */
  removeLink() {
    this.props.removeLink(this.props.linkObj, this.props.index);
  }

  /**
   * Disabilizatione di un link (per il lancio automatico)
   */
  disableLink() {
    this.setState({enabled: false}, () => {
      this.props.linkObj.enabled = false;
      this.props.updateLink(this.props.linkObj, this.props.index);
    });
  }

  /**
   * Abilitazione di un link (per il lancio automatico)
   */
  enableLink() {
    this.setState({enabled: true}, () => {
      this.props.linkObj.enabled = true;
      this.props.updateLink(this.props.linkObj, this.props.index);
    });
  }

  render() {

    let link = this.props.linkObj;

    return (
      <React.Fragment>

        <MenuProvider id={this.contextMenuId}>
          <Col
              className={'domain '+(!this.state.enabled ? 'domain--disabled':'')}
              onTouchStart={this.handleButtonPress}
              onTouchEnd={this.handleButtonRelease}
              onMouseDown={this.handleButtonPress}
              onMouseUp={this.handleButtonRelease}
              onMouseLeave={this.handleButtonRelease}>

            {/*
            <button
              className="domain__vertical-menu"
              onClick={(e) => this.openVerticalMenu(e)}>
            </button>
            */}
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

            <p className="domain__name">
              {
                this.props.linkObj.name &&
                (
                  <span>{this.props.linkObj.name}</span>
                )
              }
              {
                !this.props.linkObj.name &&
                (
                  <span>{this.props.linkObj.domain}</span>
                )
              }
            </p>

          </Col>
        </MenuProvider>

        <Menu id={this.contextMenuId}>
          <Item onClick={this.removeLink}>
            <IconFont className="fas fa-trash contentmenu-icon" />
            Rimuovi
          </Item>
          {
            this.state.enabled &&
            (
              <Item onClick={this.disableLink}>
                <IconFont className="fas fa-minus-square contentmenu-icon" />
                Disabilita
              </Item>
            )
          }
          {
            !this.state.enabled &&
            (
              <Item onClick={this.enableLink}>
                <IconFont className="fas fa-plus-square contentmenu-icon" />
                Abilita
              </Item>
            )
          }

         {/*
           <Separator />
           <Submenu label="Foobar">
              <Item onClick={this.onClick}>Foo</Item>
              <Item onClick={this.onClick}>Bar</Item>
           </Submenu>
          */}
      </Menu>
      </React.Fragment>
    )
  }

}

export default Link;
