import React from 'react';
import * as log from 'loglevel';
import { Localize } from '../common/localization.js';
import { HOURS_SET_TIME } from '../common/properties.js';
import { Container, Row, Col } from 'react-bootstrap';
import { ChromeStorageSyncGet, ChromeStorageSyncSet, ChromeStorageLocalGet, ChromeStorageLocalSet } from '../common/chrome-storage.api.js';
import TopBar from './top-bar.component.jsx';
import TimeInput from 'react-input-time';

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
      localEnabled: true,
      fromHours: '',
      toHours: ''
    }

    // recupero delle impostazioni
    ChromeStorageSyncGet(['settings']).then(result => {

      if(result && result.settings) {

        let { settings } = result;

        log.debug('Settings - settings recuperata dallo storage: ', settings);

        let { enabled, askBeforeOpen, fromHours, toHours } = settings;

        if(enabled !== this.state.enabled) {
          this.setState({enabled:enabled});
        }
        if(askBeforeOpen !==  this.state.askBeforeOpen) {
          this.setState({askBeforeOpen:settings.askBeforeOpen});
        }
        if(fromHours !== this.state.fromHours) {
          this.setState({fromHours:fromHours});
        }
        if(toHours !== this.state.toHours) {
          this.setState({toHours:toHours});
        }

      } else {

        log.warn('Settings - le impostazioni non ci sono, le aggiungo');
        ChromeStorageSyncSet(
          {
            'settings': {
              enabled: true,
              askBeforeOpen: false,
              fromHours: '',
              toHours: ''
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
    this.onChangeTime = this.onChangeTime.bind(this);
    this.setTime = this.setTime.bind(this);
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
          askBeforeOpen: this.state.askBeforeOpen,
          fromHours: this.state.fromHours,
          toHours: this.state.toHours
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
          askBeforeOpen: !this.state.askBeforeOpen,
          fromHours: this.state.fromHours,
          toHours: this.state.toHours
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

  /**
   * Impostazione dell'ora di funzionamento
   * @param {[type]}  value  [description]
   * @param {Boolean} isFrom [description]
   */
  setTime(value, isFrom) {

    ChromeStorageSyncSet(
      {
        'settings': {
          enabled: this.state.enabled,
          askBeforeOpen: this.state.askBeforeOpen,
          fromHours: (isFrom ? value : this.state.fromHours),
          toHours: (isFrom ? this.state.toHours : value)
        }
      }
    );

  }

  /**
   * Richiamato ad ogni modifica del time
   * @param  {object} event event dell'input
   * @param  {boolean} isFrom se è dal campo di input from
   * @return {[type]}       [description]
   */
  onChangeTime(event, isFrom) {

    let hours = event.target.value;

    if(isFrom) {

      this.setState({
        fromHours: hours
      }, () => {
        if(this.hoursFromSet) {
          clearTimeout(this.hoursFromSet);
        }

        this.hoursFromSet = setTimeout(() => {
          this.setTime(hours, isFrom);
        }, {HOURS_SET_TIME});
      });

    } else {

      this.setState({
        toHours: hours
      }, () => {
        if(this.hoursToSet) {
          clearTimeout(this.hoursToSet);
        }

        this.hoursToSet = setTimeout(() => {
          this.setTime(hours, isFrom);
        }, {HOURS_SET_TIME});
      });
    }
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
            <Row>
              <Col>
                <label className="settings-page__hours-label">
                  <p>
                    {Localize('SET_HOURS')}
                  </p>
                  <div>
                    <span>{Localize('HOURS_FROM')}</span>
                    <input
                      type="time"
                      className="input-time"
                      value={this.state.fromHours}
                      onChange={(event) => {this.onChangeTime(event, true)}}
                    />
                  </div>
                  <div>
                    <span>{Localize('HOURS_TO')}</span>
                    <input
                      type="time"
                      className="input-time"
                      value={this.state.toHours}
                      onChange={(event) => {this.onChangeTime(event, false)}}
                    />
                  </div>
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
