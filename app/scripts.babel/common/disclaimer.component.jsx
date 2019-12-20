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

    this.closeDisclaimer = this.closeDisclaimer.bind(this);
    this.showDisclaimer = this.showDisclaimer.bind(this);
  }

  closeDisclaimer() {
    this.setState({show: false});
  }

  showDisclaimer() {
    this.setState({show: true});
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.show &&
          (
            <div className="disclaimer">
              <i  onClick={this.closeDisclaimer}
                  className="fas fa-times disclaimer__close"></i>
              <h4>
                <img className="disclaimer__title-icon"
                 src={'../images/icons/'+this.state.icon} />
                <span>
                  {Localize(this.state.title)}
                </span>
              </h4>
              {
                this.state.paragraphs.map((paragraph, index) => {
                  return (
                    <p key={index} style={{marginLeft: '50px'}}>
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
