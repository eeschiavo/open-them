import React from 'react';
import * as log from 'loglevel';
import { Localize } from '../common/localization.js';
import { AUTHOR, AUTHOR_WEB_PAGE, AUTHOR_IMAGE, LINKS } from '../common/properties.js';
import { Container, Row, Col } from 'react-bootstrap';

function Attribution(props) {
  return (
    <Row>
      <Col>
        <span className="about-page__section--description">
          <a href={props.link} target="blank">{props.name}</a>
        </span>
      </Col>
    </Row>
  )
}

/**
 * Component della pagina 'About'
 * @extends React
 */
class About extends React.Component {

  constructor(props) {
    super(props);

    this.tps = [
      {
        link:LINKS.REACT,
        name:'React'
      },
      {
        link:LINKS.BOOTSTRAP,
        name:'Bootstrap'
      },
      {
        link:LINKS.FONTAWESOME,
        name:'Fontawesome'
      },
      {
        link:LINKS.MOMENTJS,
        name:'Moment.js'
      },
      {
        link:LINKS.AXIOS,
        name:'Axios'
      },
      {
        link:LINKS.ICONS8,
        name:'icons8'
      },
    ]
  }

  render() {
    return (
      <div className="about-page">

        <Row className="justify-content-center">
          <Col md="auto">

            {/* L'ESTENSIONE */}
            <Row className="about-page__section">
              <Col>
                <p className="about-page__section--title">
                  {Localize('WHY_THIS_EXTENSION')}
                </p>
              </Col>
            </Row>
            <Row className="about-page__section">
              <Col>
                <p className="about-page__section--description">
                  {Localize('EXTENSION_DESCRIPTION')}
                </p>
              </Col>
            </Row>

            {/* L'AUTORE */}
            <Row className="about-page__section" style={{marginBottom:'30px'}}>
              <Col>
                <p className="about-page__section--title">
                  {Localize('THE_AUTHOR')}
                </p>
              </Col>
            </Row>
            <Row className="about-page__section">
              <div className="about-page__section--profile">
                <img src={AUTHOR_IMAGE} className="profile-image" />
              </div>
              <Col>
                <p className="about-page__section--description">
                  {Localize('AUTHOR_DESCRIPTION')}
                </p>
              </Col>
            </Row>

            {/* Software di terze parti */}
            <Row className="about-page__section">
              <Col>
                <p className="about-page__section--title">
                  {Localize('THIRD_PARTY_SOFTWARE')}
                </p>
              </Col>
            </Row>
            <Row className="about-page__section">
              <Col>
                {
                  this.tps.map(software => {
                    return (
                      <Attribution
                        link={software.link}
                        name={software.name} />
                    )
                  })
                }
              </Col>

            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

export default About;
