import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as log from 'loglevel';
import axios from 'axios';

class Link extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      domainIcon: '',
      firstLetter: this.props.linkObj.domain.charAt(0)
    }

    this.openVerticalMenu = this.openVerticalMenu.bind(this);
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

  openVerticalMenu() {
    // this.props.removeLink(this.props.linkObj, this.props.index)
  }

  render() {

    let link = this.props.linkObj;

    return (
      <Col className="domain">
      <button
        className="domain__vertical-menu"
        onClick={this.openVerticalMenu}>
      </button>
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
    )
  }

}

export default Link;
