import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import CSSTransition from 'react-transition-group/CSSTransition';

import SiteLoader from 'components/modals/SiteLoader/SiteLoader';
import FieldModal from 'components/modals/FieldModal/FieldModal';
import MediaModal from 'components/modals/MediaModal/MediaModal';
import WysiwygModal from 'components/modals/WysiwygModal/WysiwygModal';
import ReferenceModal from 'components/modals/ReferenceModal/ReferenceModal';
import ModelChooseModal from 'components/modals/ModelChooseModal/ModelChooseModal';
import AlertModal, {ALERT_TYPE_ALERT} from 'components/modals/AlertModal/AlertModal';
import {closeAlert, closeModal, MODAL_TYPE_FIELD, MODAL_TYPE_MEDIA, MODAL_TYPE_REFERENCE, MODAL_TYPE_WYSIWYG,
  MODAL_TYPE_MODEL_CHOOSE} from 'ducks/nav';
import {addField, updateField} from 'ducks/models';

import styles from './app.sss';


@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  lastModal = <span></span>;

  render() {
    const {nav, user, content, models, serverStatus} = this.props;
    const {closeAlert, closeModal} = this.props.navActions;
    const {addField, updateField} = this.props.modelActions;
  
    const getAlarm = () => {
      if (serverStatus.problemA && !serverStatus.problemB)
        return (
          <div styleName="alarm">
            There is a problem with server. Please wait...
          </div>
        );
      return null;
    };

    const getModal = () => {
      if (nav.alertShowing)
        return <AlertModal params={nav.alertParams} onClose={closeAlert}/>;
    
      if (!nav.modalShowing) {
        if (!serverStatus.problemB || !nav.initEnded)
          return null;

        let params = {
          type: ALERT_TYPE_ALERT,
          title: `Service problem`,
          description: "There are problems with our service or internet connection. You should try later.",
          btnText: 'Reload page'
        };
        return <AlertModal params={params}
                           onClose={() => window.location = '/'}/>;
      }
    
      switch (nav.modalType) {
        case MODAL_TYPE_FIELD:
          return <FieldModal params={nav.modalParams}
                             onClose={closeModal}
                             fields={models.currentModel.fields}
                             addField={addField}
                             updateField={updateField}/>;
      
        case MODAL_TYPE_MEDIA:
          return <MediaModal params={nav.modalParams}
                             onClose={closeModal}/>;
      
        case MODAL_TYPE_REFERENCE:
          return <ReferenceModal params={nav.modalParams}
                                 currentSite={models.currentSite}
                                 contentItems={content.items}
                                 onClose={closeModal}/>;
      
        case MODAL_TYPE_WYSIWYG:
          return <WysiwygModal params={nav.modalParams}
                               onClose={closeModal}/>;
  
        case MODAL_TYPE_MODEL_CHOOSE:
          return <ModelChooseModal params={nav.modalParams}
                                   models={models.currentSite.models}
                                   onClose={closeModal}/>;
      
      }
    };

    //костыльно чот, блин
    const trans = {
      enter: styles['modal-enter'],
      enterActive: styles['modal-enter-active'],
      exit: styles['modal-exit'],
      exitActive: styles['modal-exit-active']
    };
    let modal = getModal();
    if (modal)
      this.lastModal = modal;
    
    const showModalLoader =
      (user.pending || user.authorized && !nav.initEnded) &&
      !serverStatus.problemB;
    let res = (
      <div styleName="wrapper">
        {this.props.children}
        {
          showModalLoader &&
            <SiteLoader />
        }
        <CSSTransition in={!!modal}
                       timeout={300}
                       classNames={trans}
                       mountOnEnter={true}
                       unmountOnExit={true}>
          {this.lastModal}
        </CSSTransition>
        {getAlarm()}
      </div>
    );
    
    if (!user.localStorageReady)
      res = <SiteLoader />;
    
    return res;
  }
}

function mapStateToProps(state) {
  return {
    content:      state.content,
    models:       state.models,
    nav:          state.nav,
    serverStatus: state.serverStatus,
    user:         state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelActions: bindActionCreators({addField, updateField}, dispatch),
    navActions: bindActionCreators({closeAlert, closeModal}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
