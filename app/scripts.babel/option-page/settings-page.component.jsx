import React from 'react';
import * as log from 'loglevel';
import { Localize } from '../common/localization.js';
import {Container, Row, Col} from 'react-bootstrap';
import { ChromeStorageSyncGet, ChromeStorageSyncSet, ChromeStorageLocalGet, ChromeStorageLocalSet } from '../common/chrome-storage.api.js';
import TopBar from './top-bar.component.jsx';

/**
 * Pagina delle impostazioni
 * @extends React
 */
class SettingsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      enabled: true,
      deviceEnabled: true,
      askBeforeOpen: false,
      localEnabled: true
    }

    // recupero delle impostazioni
    ChromeStorageSyncGet(['settings']).then(result => {

      if(result && result.settings) {

        let { settings } = result;

        log.debug('Settings - settings recuperata dallo storage: ', settings);

        if(settings.enabled !== this.state.enabled) {
          this.setState({enabled:settings.enabled});
        }
        if(settings.askBeforeOpen !==  this.state.askBeforeOpen) {
            this.setState({askBeforeOpen: result.settings.askBeforeOpen});
        }

      } else {

        log.warn('Settings - le impostazioni non ci sono, le aggiungo');
        ChromeStorageSyncSet(
          {
            'settings': {
              enabled: true,
              askBeforeOpen: false
            }
          }
        ).then(res => {
          log.debug('Settings - ChromeStorageSyncSet(settings): ', res);
        });
      }
    });

    // recupero le impostazioni locali
    ChromeStorageLocalGet(['localSettings']).then(localResult => {
      if(localResult) {
        const { localSettings } = localResult;

        if(localSettings.enabled !== this.state.localEnabled) {
          this.setState({localEnabled:localSettings.enabled})
        }
      }
    });

    this.toggleEnabled = this.toggleEnabled.bind(this);
    this.toggleAskBeforeOpen = this.toggleAskBeforeOpen.bind(this);
    this.toggleLocalEnabled = this.toggleLocalEnabled.bind(this);
  }

  /**
   * Toggle per abilitare o disabilitare l'estenzione
   * @param event event del campo di input (type checkbox)
   */
  toggleEnabled(event) {

    log.info('LinkModal - toggleEnabled');

    ChromeStorageSyncSet(
      {
        'settings': {
          enabled: !this.state.enabled,
          askBeforeOpen: this.state.askBeforeOpen
        }
      }
    ).then(res => {

      log.debug('Settings - ChromeStorageSyncSet(settings): ', res);

      this.setState({
        enabled: !this.state.enabled
      });
    });

  }

  /**
   * Toggle per abilitare o disabilitare il popup di conferma prima dell'apertura dei link
   * @param event event del campo di input (type checkbox)
   */
  toggleAskBeforeOpen(event) {

    log.info('LinkModal - toggleAskBeforeOpen');

    ChromeStorageSyncSet(
      {
        'settings': {
          enabled: this.state.enabled,
          askBeforeOpen: !this.state.askBeforeOpen
        }
      }
    ).then(res => {

      log.debug('Settings - ChromeStorageSyncSet(settings): ', res);

      this.setState({
        askBeforeOpen: !this.state.askBeforeOpen
      });
    });

  }

  /**
   * Toggle per abilitare o disabilitare l'estensione sul dispositivo
   * @param event event del campo di input (type checkbox)
   */
  toggleLocalEnabled(event) {

    log.info('LinkModal - toggleLocalEnabled');

    ChromeStorageLocalSet(
      {
        'localSettings': {
          enabled: !this.state.localEnabled
        }
      }
    ).then(res => {

      log.debug('Settings - ChromeStorageLocalSet(localSettings): ', res);

      this.setState({
        localEnabled: !this.state.localEnabled
      });
    });

  }

  render() {
    return (
      <div className="settings-page">
        <TopBar
          onlyTitle={true}
          title={Localize('MENU_ITEM_SETTINGS')} />
        <Row className="justify-content-center">
          <Col md="auto" className="settings-page__col">
            <Row>
              <Col>
                <label className="form-switch">
                  <p>
                    {Localize('ENABLE_EXTENSION')}
                  </p>
                  <input type="checkbox"
                  checked={this.state.enabled}
                  onChange={this.toggleEnabled} />
                  <i></i>
                </label>
              </Col>
            </Row>
            <Row>
              <Col>
                <label className="form-switch">
                  <p>
                    {Localize('ASK_BEFORE_OPEN')}
                  </p>
                  <input type="checkbox"
                  checked={this.state.askBeforeOpen}
                  onChange={this.toggleAskBeforeOpen} />
                  <i></i>
                </label>
              </Col>
            </Row>
            <Row>
              <Col>
                <label className="form-switch">
                  <p>
                    {Localize('ENABLE_THIS_DEVICE')}
                  </p>
                  <input type="checkbox"
                  checked={this.state.localEnabled}
                  onChange={this.toggleLocalEnabled} />
                  <i></i>
                </label>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

    )
  }
}

export default SettingsPage;
