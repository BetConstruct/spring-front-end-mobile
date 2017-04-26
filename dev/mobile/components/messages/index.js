import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm, reset} from 'redux-form';
import Validate from "../../../helpers/validate";
import formsNames from "../../../constants/formsNames";
import {checkIfUserIsLoggedIn} from "../../../mixins/checkAuthentication";
import {LoadUserMessages, ReadUserMessage, DeleteUserMessage, SendUserMessage, DeleteMessageById} from "../../../actions/messages";
import {UILoadingReset, OpenPopup, ConfirmationDialogReset} from "../../../actions/ui";
import {MSG_TYPE_INCOMING, MSG_TYPE_OUTGOING} from "../../../constants/messages";
import {t} from "../../../helpers/translator";

const Messages = React.createClass({
    propTypes: {
        ui: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired
    },
    render () {
        return checkIfUserIsLoggedIn(this.props.user, this.props.dispatch) || Template.apply(this); //eslint-disable-line no-undef
    },

    /**
     * @name readMessage
     * @description read selected message
     * @param {number} id
     * @returns {Function}
     * */
    readMessage (id) {
        return () => this.props.dispatch(ReadUserMessage(id));
    },

    /**
     * @name deleteMessage
     * @description remove selected message
     * @param {number} id
     * @returns {undefined}
     * */
    deleteMessage (id) {
        this.props.dispatch(OpenPopup("confirm", {
            id: "deleteMessage",
            type: "warning",
            body: t("Are you sure you want to delete this message?"),
            title: t("Delete message"),
            data: {id},
            answers: [
                {title: t("Delete"), type: "warning", value: true},
                {title: t("Cancel"), type: "cancel", value: false}
            ]
        }));
    },

    /**
     * @description send user's message
     * @param values
     * @returns {undefined}
     * */
    sendMessage (values) {
        // console.log(values); return;
        this.props.dispatch(SendUserMessage(values.subject, values.body));
    },
    resetSendMessage () {
        this.props.dispatch(UILoadingReset("sendUserMessage"));
        this.props.dispatch(reset(formsNames.sendMessageForm));
    },

    /**
     * @description load messages check types and dispatch
     * @param values
     * @returns {undefined}
     * */
    loadMessages (type) {
        let msgType = {"inbox": MSG_TYPE_INCOMING, "sent": MSG_TYPE_OUTGOING}[type];
        if (msgType !== undefined) {
            this.props.dispatch(LoadUserMessages(msgType));
        }
    },
    componentWillMount () {
        if (this.props.user.loggedIn) {
            this.loadMessages(this.props.routeParams.type);
        }
    },
    componentWillReceiveProps (nextProps) {
        if (nextProps.ui.confirmation.deleteMessage) {
            if (nextProps.ui.confirmation.deleteMessage.answer === true) {
                this.props.dispatch(DeleteUserMessage(nextProps.ui.confirmation.deleteMessage.data.id, () => {
                    this.props.dispatch(DeleteMessageById(nextProps.ui.confirmation.deleteMessage.data.id));
                }));
            }
            this.props.dispatch(ConfirmationDialogReset("deleteMessage"));
        }
        if ((this.props.user.loggedIn !== nextProps.user.loggedIn && nextProps.user.loggedIn) ||
            this.props.routeParams.type !== nextProps.routeParams.type) {
            this.loadMessages(nextProps.routeParams.type);
        }
    }
});

const validate = values => {
    const errors = {};
    Validate(values.subject, "subject", "required", errors);
    Validate(values.body, "body", "required", errors);
    return errors;
};

function mapStateToProps (state) {
    return {
        data: state.swarmData.data.messages,
        loaded: state.swarmData.loaded.messages,
        swarmData: state.swarmData,
        ui: state.uiState,
        user: state.user,
        forms: state.form
    };
}

export default connect(mapStateToProps)(reduxForm({form: formsNames.sendMessageForm, validate})(Messages));
