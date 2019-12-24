import React from 'react';
import * as log from 'loglevel';
import Sidebar from './sidebar.component.jsx';
import LinksPage from './links-page.component.jsx';
import SettingsPage from './settings-page.component.jsx';
import About from './about.component.jsx';
import Footer from './footer.component.jsx';

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

    this.linksPageRef = React.createRef();

    this.changePage = this.changePage.bind(this);
  }

  changePage(page) {
    this.setState({page}, () => {
      this.linksPageRef.current.closeModals();
    });
  }

  render() {
    return (

      <div style={{display:'flex',flexDirection:'row'}}>

        <Sidebar changePage={this.changePage} />

        <div style={{display:'flex',flexDirection:'column',width:'100%'}}>

          <div className="options-page">

            <div className={(this.state.page == 1 ? 'options-page--show':'options-page--hide')}>
              <LinksPage ref={this.linksPageRef} />
            </div>
            <div className={(this.state.page == 2 ? 'options-page--show':'options-page--hide')}>
              <SettingsPage />
            </div>
            <div className={(this.state.page == 3 ? 'options-page--show':'options-page--hide')}>
              <About />
            </div>
          </div>

          <Footer />

        </div>
      </div>
    )
  }
}

export default OptionsPage;
