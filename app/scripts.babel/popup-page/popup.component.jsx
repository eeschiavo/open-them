import React from 'react';
import ReactDOM from 'react-dom';
import * as log from 'loglevel';

class Popup extends React.Component {

  /**
  * Options page opening
  */
  openOptions() {

    log.info('Popup - openOptions');
    chrome.runtime.openOptionsPage();
  }

  render() {
    return (
      <div>
        <button onClick={this.openOptions}>
          Open options
        </button>
      </div>
    )
  }
}

export default Popup;
