import React from 'react';
import {connect} from 'react-redux';
import {UICollapseElement, UIExpandElement} from '../../../actions/ui';
import PropTypes from 'prop-types';

const Expandable = React.createClass({
    propTypes: {
        onExpand: PropTypes.func,
        className: PropTypes.string,
        initiallyExpanded: PropTypes.bool,
        openAnywhere: PropTypes.bool,
        childrenKeys: PropTypes.array,
        uiKey: PropTypes.string.isRequired,
        handleToggleEvent: PropTypes.func
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
    componentDidMount () {
        this.props.openAnywhere && this.props.dispatch(UIExpandElement(this.props.uiKey));
    },
    componentWillReceiveProps (nextProps) {
        nextProps.openAnywhere && !this.props.openAnywhere && this.props.dispatch(UIExpandElement(this.props.uiKey))
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