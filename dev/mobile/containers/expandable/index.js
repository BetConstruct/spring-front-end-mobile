import React from 'react';
import {connect} from 'react-redux';
import {UICollapseElement, UIExpandElement} from '../../../actions/ui';

const Expandable = React.createClass({
    propTypes: {
        onExpand: React.PropTypes.func,
        className: React.PropTypes.string,
        initiallyExpanded: React.PropTypes.bool,
        childrenKeys: React.PropTypes.array,
        uiKey: React.PropTypes.string.isRequired,
        handleToggleEvent: React.PropTypes.func
    },
    toggleElement (externalToggleHandler) {

        let expand;
        if (this.props.persistentUIState.expanded[this.props.uiKey] === undefined) { //eslint-disable-line react/prop-types
            expand = !this.props.initiallyExpanded;
        } else {
            expand = !this.props.persistentUIState.expanded[this.props.uiKey]; //eslint-disable-line react/prop-types
        }
        externalToggleHandler && externalToggleHandler(expand);
        expand ? this.props.dispatch(UIExpandElement(this.props.uiKey)) : this.props.dispatch(UICollapseElement(this.props.uiKey));
        if (this.props.onExpand && expand) {
            this.props.onExpand();
        }

        if (this.props.childrenKeys) {
            this.toggleChildren(!expand);
        }

    },
    toggleChildren (expand) {
        this.props.childrenKeys.map(key => this.props.dispatch({
            true: UICollapseElement,
            false: UIExpandElement
        }[expand](key))); //eslint-disable-line react/prop-types
    },
    render () {
        let expanded = this.props.persistentUIState.expanded[this.props.uiKey]; //eslint-disable-line react/prop-types
        expanded = expanded === undefined ? this.props.initiallyExpanded : expanded;

        return <div
            className={(this.props.className || "") + " " + (expanded ? "active" : "")}
            onClick={() => { this.toggleElement(this.props.handleToggleEvent); }}>
            {this.props.children}
        </div>;
    }
});

function mapStateToProps (state) {
    return {
        persistentUIState: state.persistentUIState
    };
}

export default connect(mapStateToProps)(Expandable);