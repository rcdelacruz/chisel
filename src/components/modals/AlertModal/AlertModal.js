import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';

import styles from './AlertModal.sss';


export const ALERT_TYPE_ALERT = "modals/alert/ALERT_TYPE_ALERT";
export const ALERT_TYPE_CONFIRM = "modals/alert/ALERT_TYPE_CONFIRM";


@CSSModules(styles, {allowMultiple: true})
export default class AlertModal extends Component {
  state = {
    confirmString: ''
  };
  
  active = false;
  type = ALERT_TYPE_ALERT;
  confirmString = '';
  focusElm = null;
  focusBtn = null;
  
  
  constructor(props) {
    super(props);
    
    if (props.params.confirmString)
      this.confirmString = props.params.confirmString;
  }
  
  componentDidMount() {
    this.active = true;
    document.addEventListener('keydown', this.onKeyDown);
  
    if (this.focusElm)
      setTimeout(() => this.focusElm.focus(), 2);
    else if (this.focusBtn)
      setTimeout(() => this.focusBtn.focus(), 2);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = () => {
    let event = window.event;
    event.stopPropagation();
    
    //Enter or Esc pressed
    if (event.keyCode == 13)
      setTimeout(this.onConfirm, 1);
    else if (event.keyCode == 27)
      setTimeout(this.close, 1);
  };
  
  onChangeString = event => {
    let confirmString = event.target.value;
    
    this.setState({confirmString});
  };
  
  onConfirm = () => {
    if (!this.active)
      return;
    
    if (this.type == ALERT_TYPE_CONFIRM) {
      if (this.confirmString == this.state.confirmString) {
        this.props.params.onConfirm();
        this.close();
      }
    } else {
      this.close();
    }
  };

  close = () => {
    this.active = false;
    this.props.onClose();
  };

  render() {
    const {title, description, type, btnText} = this.props.params;

    if (type)
      this.type = type;

    let btnOKText = btnText || 'OK';

    let titleHTML = {__html: title || ''};
    let descriptionHTML = {__html: description || ''};

    return (
      <div styleName="Modal" onClick={this.close}>

        <div styleName="modal-inner" onClick={e => e.stopPropagation()}>
          <div styleName="modal-header">
            <div styleName="title" dangerouslySetInnerHTML={titleHTML}>
            </div>
          </div>

          <div styleName="content">
            <div styleName="description" dangerouslySetInnerHTML={descriptionHTML}>
            </div>
            {
              this.confirmString &&
                <div styleName="input-wrapper">
                  <InputControl onChange={this.onChangeString}
                                DOMRef={inp => this.focusElm = inp}
                                value={this.state.confirmString} />
                </div>
            }
            {
              this.type == ALERT_TYPE_ALERT &&
                <div styleName="button">
                  <ButtonControl color="green"
                                 value={btnOKText}
                                 DOMRef={btn => this.focusBtn = btn}
                                 onClick={this.close} />
                </div>
            }
            {
              this.type == ALERT_TYPE_CONFIRM &&
                <div styleName="buttons-wrapper">
                  <div styleName="buttons-inner">
                    <ButtonControl color="red"
                                   value="Yes"
                                   disabled={this.confirmString != this.state.confirmString}
                                   DOMRef={btn => this.focusBtn = btn}
                                   onClick={this.onConfirm} />
                  </div>
                  <div styleName="buttons-inner">
                    <ButtonControl color="gray"
                                   value="No"
                                   onClick={this.close} />
                  </div>
                </div>
            }
          </div>

        </div>
      </div>
    );
  }
}
