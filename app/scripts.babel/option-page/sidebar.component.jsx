import React from 'react';
import * as log from 'loglevel';

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
  }

  render() {
    return (
      <nav id="sidebar" className="sidebar">
         <div className="sidebar__header">
             <h3>Open Them</h3>
         </div>

         <ul className="sidebar__components">
             <p>Subheader</p>
             <li>
                 <a href="#">Portfolio</a>
             </li>
             <li>
                 <a href="#">Contact</a>
             </li>
         </ul>
     </nav>
    )
  }
}

export default Sidebar;
