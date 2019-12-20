import React from 'react';
import * as log from 'loglevel';
import { Localize } from './localization.js';

class Disclaimer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: this.props.icon,
      title: this.props.title,
      show: this.props.show,
      paragraphs: this.props.paragraphs
    }

    log.debug(this.state);
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.show &&
          (
            <div className="disclaimer">
              <h4>
                <img className="disclaimer__title-icon"
                 src={'../images/icons/'+this.state.icon} />
                <span>
                  {Localize(this.state.title)}
                </span>
              </h4>
              {
                this.state.paragraphs.map(paragraph => {
                  log.debug(paragraph);
                  return (
                    <p style={{marginLeft: '50px'}}>
                      {
                        paragraph.icon &&
                        (
                          <img  className="disclaimer__paragraph-icon"
                                src={'../images/icons/'+paragraph.icon} />
                        )
                      }
                      {Localize(paragraph.key)}
                    </p>
                  )
                })
              }
            </div>
          )
        }
      </React.Fragment>
    )
  }
}

export default Disclaimer;
