import React from 'react';
import * as log from 'loglevel';
import Sidebar from './sidebar.component.jsx';
import LinksPage from './links-page.component.jsx';

/**
 * Component principale della pagina options
 * @extends React.Component
 */
class OptionsPage extends React.Component {

  /**
   * Costruttore di default
   * @param {[type]} props
   */
  constructor(props) {
    super(props);

    this.state = {
      page: 1
    }

    this.changePage = this.changePage.bind(this);
  }

  changePage(page) {
    this.setState({page})
  }

  render() {
    return (
      <div className="options-page">
        <Sidebar changePage={this.changePage} />
          <div className={(this.state.page == 1 ? 'options-page--show':'options-page--hide')}>
            <LinksPage />
          </div>
      </div>
    )
  }
}

export default OptionsPage;
