import React from 'react';
import * as log from 'loglevel';
import { Row, Col } from 'react-bootstrap';
import { Localize } from '../common/localization.js';

/**
 * Sidebar della pagina options
 * @extends React.Component
 */
class Sidebar extends React.Component {

  /**
   * Costruttore di default
   * @param {[type]} props
   */
  constructor(props) {
    super(props);

    this.state = {
      itemSelected: 1
    }
  }

  selectItem(item) {
    this.setState({
      itemSelected: item
    }, () => {
      this.props.changePage(item);
    });
  }

  render() {
    return (
      <nav id="sidebar" className="sidebar">
        <div className="sidebar__header">
          <h3>{Localize('appName')}</h3>
        </div>

        <ul className="sidebar__components">
          <p className="sidebar__subheader">
            {Localize('appDescription')}
          </p>
          <li>
            <p onClick={() => this.selectItem(1)}
               className={'sidebar__item '+
                          (this.state.itemSelected == 1 ? 'sidebar__item--selected':'')}
               style={{marginTop:'50px'}}>
              <i className="fas fa-link"></i>
              <span>
                {Localize('MENU_ITEM_WEBSITE')}
              </span>
            </p>
            </li>
            <li>
              <p onClick={() => this.selectItem(2)}
                 className={'sidebar__item '+
                            (this.state.itemSelected == 2 ? 'sidebar__item--selected':'')}>
                <i className="fas fa-cogs"></i>
                <span>
                  {Localize('MENU_ITEM_SETTINGS')}
                </span>
              </p>
            </li>
        </ul>

        <footer
          className="sidebar__footer"
          onClick={() => this.selectItem(3)}>
          <Row>
            <Col>
              {Localize('ABOUT')}
            </Col>
          </Row>
        </footer>
     </nav>
    )
  }
}

export default Sidebar;
