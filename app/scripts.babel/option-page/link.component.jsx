import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import axios from 'axios';
import { RandomInt } from '../common/utilities.js';
import { Menu, Item, Separator, IconFont, Submenu, MenuProvider } from 'react-contexify';


class Link extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      domainIcon: '',
      firstLetter: this.props.linkObj.domain.charAt(0)
    }

    this.contextMenuId = 'vertical-menu-'+RandomInt();

    this.removeLink = this.removeLink.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleButtonRelease = this.handleButtonRelease.bind(this);
  }

  componentDidMount() {

    log.info('Link - componentDidMount');

    const domain = this.props.linkObj.domain;
    log.debug('componentDidMount - dominio: ', domain);

    const domainIcon = 'https://otbesticon.herokuapp.com/icon?url='+domain+'&size=80..120..200';

    axios.get(domainIcon)
      .then(res => {
        this.setState({ domainIcon });
      }).catch(err => {
        log.error('componentDidMount - fallito recupero della favicon');
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

  render() {

    let link = this.props.linkObj;

    return (
      <React.Fragment>

        <MenuProvider id={this.contextMenuId}>
          <Col
              className="domain"
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
              this.state.domainIcon &&
              this.state.domainIcon != '' &&
              (
                <img className="domain__favicon" src={this.state.domainIcon} />
              )
            }
            {
              (!this.state.domainIcon ||
              this.state.domainIcon == '') &&
              (
                <div>{this.state.firstLetter}</div>
              )
            }
            <p className="domain__name">
              {this.props.linkObj.domain}
            </p>

          </Col>
        </MenuProvider>

        <Menu id={this.contextMenuId}>
          <Item onClick={this.removeLink}>
            <IconFont className="fa fa-trash-alt" />
            Rimuovi
          </Item>
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
