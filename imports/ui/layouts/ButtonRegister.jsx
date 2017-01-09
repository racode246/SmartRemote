import React from 'react';
import i18n from 'meteor/universe:i18n';
import Header from '../components/Header';
import ReceiveIR from '../components/ReceiveIR';
import IrTest from '../components/IrTest';
import { Grid, Col, Row } from 'react-bootstrap';
import Validation from 'react-validation';
import Alert from 'react-s-alert';

export default class ButtonRegister extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      locale: i18n.getLocale(),
      receiveState: 'receive',
    };
    this.onLocale = this.onLocale.bind(this);
  }

  onLocale(locale) {
    this.setState({locale});
  }

  componentWillMount() {
    i18n.onChangeLocale(this.onLocale);
  }

  componentWillUnmount() {
    i18n.offChangeLocale(this.onLocale);
  }

  startReceiving() {
    this.setState({receiveState: "receiving"});
  }

  finishReceiving() {
    this.setState({receiveState: "received"});
  }

  handleSubmit(event) {
    event.preventDefault();
    const buttonTitle = event.target.buttonTitle.value;
    Meteor.call('insertIrData', buttonTitle, (error) => {
      if (error.error === 'Not unique id.') {
        Alert.error(i18n.getTranslation('buttonRegister', 'alerts.notUnique'), {
          position: 'bottom',
          effect: 'genie',
          timeout: 3000,
        });
      } else if (error.error === 'Could not connect to photon cloud.') {
        Alert.error(i18n.getTranslation('buttonRegister', 'alerts.connectionError'), {
          position: 'bottom',
          effect: 'genie',
          timeout: 3000,
        });
      } else {
        Alert.success(i18n.getTranslation('buttonRegister', 'alerts.success'), {
          position: 'bottom',
          effect: 'genie',
          timeout: 3000,
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Header/>
        <Grid className="center button-register-center">
          <Validation.components.Form onSubmit={this.handleSubmit.bind(this)} >
            <Row>
              <Col>
                <Validation.components.Input
                  id='input-button-title'
                  className='input-style'
                  type='text'
                  name='buttonTitle'
                  value=''
                  placeholder={i18n.getTranslation('buttonRegister', 'buttonTitle')}
                  validations={['required', 'buttonTitle']}/>
              </Col>
            </Row>
            <Row>
              <Col>
                <ReceiveIR
                  buttonState={this.state.receiveState}
                  startReceiving={() => this.startReceiving()}
                  finishReceiving={() => this.finishReceiving()}
                />
              </Col>
            </Row>
                {
                  (this.state.receiveState === "received")
                    ? <div>
                        <Row>
                          <Col>
                            <IrTest />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Validation.components.Button className="button-style button-register-margin">{i18n.getTranslation('buttonRegister', 'register')}</Validation.components.Button>
                          </Col>
                        </Row>
                      </div>
                    : null
                }
          </Validation.components.Form>
          <Alert stack={{limit: 1}}/>
        </Grid>
      </div>
    );
  }
}
