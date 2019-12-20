import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Localize} from '../common/localization.js';
import * as log from 'loglevel';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false
    }

    this.enableLinks = this.enableLinks.bind(this);
    this.disableLinks = this.disableLinks.bind(this);
    this.removeLinks = this.removeLinks.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.stopEdit = this.stopEdit.bind(this);
  }

  enableLinks() {
    this.props.enableLinks();
  }

  disableLinks() {
    this.props.disableLinks();
  }

  removeLinks() {
    this.props.removeLinks();
  }

  startEdit() {
    log.info('TopBar - startEdit');

    if(!this.state.editMode) {
      this.props.enterEditMode(true);
      this.setState({editMode: true});
    }
  }

  stopEdit() {
    log.info('TopBar - stop');

    this.props.enterEditMode(false);
    this.setState({editMode: false});
  }

  render() {
    return (
      <Container className="topbar">
        <Row>
          <Col>
            {
              !this.state.editMode &&
              (
                <button className="ot-button ot-button--cancel"
                        type="button"
                        onClick={this.startEdit}>
                  {Localize('EDIT')}
                </button>
              )
            }
            {
              this.state.editMode &&
              (
                <React.Fragment>

                  <button
                    title={Localize('BUTTON_ENABLE_ALL_LINKS')}
                    className="ot-button ot-button--cancel"
                    type="button"
                    onClick={this.enableLinks}>
                      <i className="fas fa-plus-square"></i>
                  </button>

                  <button
                    title={Localize('BUTTON_DISABLE_ALL_LINKS')}
                    className="ot-button ot-button--cancel"
                    type="button"
                    onClick={this.disableLinks}>
                      <i className="fas fa-minus-square"></i>
                  </button>

                  <button
                    title={Localize('BUTTON_REMOVE_ALL_LINKS')}
                    className="ot-button ot-button--cancel"
                    type="button"
                    onClick={this.removeLinks}>
                      <i className="fas fa-trash"></i>
                  </button>

                  <button className="ot-button ot-button--success"
                          type="button"
                          onClick={this.stopEdit}>
                    {Localize('END')}
                  </button>
                </React.Fragment>
              )
            }

          </Col>
        </Row>
      </Container>
    )
  }
}

export default TopBar;
