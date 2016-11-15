import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import InlineSVG from 'svg-inline-react';

import styles from './DropdownControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class DropdownControl extends Component {
  state = {
    suggestionValue: '',
    suggestionsVisibility: false
  };
  suggestionsList = [];
  onSuggest = null;

  componentWillMount() {
    const {suggestionsList, suggest, current} = this.props;
    this.onSuggest = suggest;
    this.suggestionsList = suggestionsList;
    this.setCurrent(current);
  }
  
  componentWillReceiveProps(nextProps) {
    this.suggestionsList = nextProps.suggestionsList;
    this.setCurrent(nextProps.current);
  }
  
  setCurrent(cur) {
    if (this.suggestionsList.indexOf(cur) == -1)
      this.setState({suggestionValue: this.suggestionsList[0]});
    else
      this.setState({suggestionValue: cur});
  }

  onSuggestionClick = event => {
    let item = event.target.innerHTML;
    this.setState({
      suggestionValue: item,
      suggestionsVisibility: false
    });
    this.onSuggest(item);
  };

  onSuggestionInputClick = event => {
    this.setState({
      suggestionsVisibility: !this.state.suggestionsVisibility,
      suggestionValue: event.target.value
    });
  };

  onSuggestionBlur = () => {
    this.setState({
      suggestionsVisibility: false
    });
  };

  render() {
    const {label, type} = this.props;

    let wrapperClasses = classNames({
      'input-wrapper type-wrapper': type === undefined,
      'input-wrapper type-wrapper dropdown-big': type === 'big'
    });

    let inputClasses = classNames({
      'input': true,
      'input suggestions-visible': this.state.suggestionsVisibility
    });

    let arrowClasses = classNames({
      'arrow-down': true,
      'arrow-down arrow-rotated': this.state.suggestionsVisibility
    });

    let Suggestions = this.suggestionsList.map(suggestionsItem => {
      return (
        <div onMouseDown={this.onSuggestionClick}
             styleName="suggestion"
             key={suggestionsItem}>
          {suggestionsItem}
        </div>
      )
    });

    let icon = <InlineSVG styleName={arrowClasses} src={require("./arrow-down.svg")} />;
    if (type === 'big')
      icon = <InlineSVG styleName="arrows" src={require("./arrows.svg")} />;

    return (
      <div styleName={wrapperClasses} onBlur={this.onSuggestionBlur}>
        <div styleName="label">{label}</div>
        {icon}
        <input styleName={inputClasses}
               value={this.state.suggestionValue}
               onClick={this.onSuggestionInputClick}
               readOnly />
        <div styleName="suggestions">
          {Suggestions}
        </div>
      </div>
    );
  }
}
