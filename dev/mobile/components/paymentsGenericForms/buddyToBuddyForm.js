import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {t} from '../../../helpers/translator';
import Zergling from '../../../helpers/zergling';
import {OpenPopup} from "../../../actions/ui";
import Loader from "../../components/loader/";
import {GetBuddyToBuddyFriendsList} from "../../../actions/buddyToBuddyFriendsList";
import formnames from "../../../constants/formsNames";
import {changeBuddyToBuddyFriendName} from "../../../actions/reduxForm";
import {Field} from 'redux-form';

class BuddyToBuddyForm extends Component {
    constructor (props) {
        super(props);
        this.handleFriendSelection = this.handleFriendSelection.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    componentDidMount () {
        this.props.dispatch(GetBuddyToBuddyFriendsList());
    }
    componentWillReceiveProps (nextProps) {
        let nextValues = nextProps.formValues,
            currentValues = this.props.formValues,
            names = (nextProps.friendList || []).reduce((collected, current) => {
                collected.push(current.BuddyLogin);
                return collected;
            }, []);

        if (nextValues &&
            currentValues &&
            currentValues.friendName !== nextValues.friendName &&
            nextValues.friendName !== nextValues.friendNameRadio) {
            this.props.dispatch(changeBuddyToBuddyFriendName("", formnames.withdrawForm, "friendNameRadio"));
        } else if (names.includes(nextValues.friendName) && nextValues.friendNameRadio !== nextValues.friendName) {
            this.props.dispatch(changeBuddyToBuddyFriendName(nextValues.friendName, formnames.withdrawForm, "friendNameRadio"));
        }
    }
    handleFriendSelection (event) {
        let name = event.target.value;
        this.props.dispatch(changeBuddyToBuddyFriendName(name, formnames.withdrawForm, "friendName"));
    }
    submitHandler (values) {
        let self = this;
        Zergling.get({"to_user": values.friendName, "amount": values.amount}, 'buddy_to_buddy_transfer').then(function (response) {
            let result = response.result === 0 ? "accept" : "error";
            if (result === 'accept' || response.result_text && response.result_text !== "none") {
                self.props.dispatch(OpenPopup("message", {
                    type: result,
                    title: result === 'accept' ? t("Success") : t("Error"),
                    body: result === 'accept' ? t(`Your ${self.props.transactionType} has benn successfully processed`) : t(`${response.result_text}`)
                }));
            }
        }, function () {
            console.error('accept_terms_conditions ERROR');
        });
    }
    capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    render () {
        let {
                formFields,
                getFormItem,
                friendList,
                t,
                inlineStyle,
                method,
                limits,
                infoText,
                transactionType,
                error,
                invalid,
                submitting,
                handleSubmit } = this.props,
            fields = formFields.map((field, index) => {
                return (
                    <div className="details-form-item-m" key={index}>
                        <label>{t(field.label)}</label>
                        {
                            getFormItem(field, index)
                        }
                    </div>
                );
            }),

            friends = friendList && friendList.map((friend, index) =>
                    <div className="radio-form-item" key={index}>
                        <label>
                            <Field component="input" type="radio" name="friendNameRadio" value={friend.BuddyLogin} onChange={this.handleFriendSelection} />
                            <span>{friend.BuddyLogin}</span>
                        </label>
                    </div>
                );
        return (
            <div className="payments-form-wrapper animate-from-right-to-left">
                <div className="bread-crumbs-view-m">
                    <Link to={`/balance/${transactionType}`}>
                        <span className="back-arrow-crumbs"/>
                    </Link>
                    <p>
                        <span>{t(method.displayName || method.name)}</span>
                    </p>
                </div>
                <div className="single-payment-title">
                    <ul>
                        <li><div className="deposit-m-icon" style={inlineStyle(method)}/></li>
                        <li>
                            <div className="payment-text-container" dangerouslySetInnerHTML={{__html: infoText}}/>
                            {/*<p><i>{t("Service Fee:")} {paymentMethodInfoByCurrency[`${transactionType}Fee`] && paymentMethodInfoByCurrency.hasOwnProperty(`${transactionType}Fee`) !== 0 ? `${paymentMethodInfoByCurrency[[`${transactionType}Fee`]]} ${currencyCode}` : t("free")}</i></p>*/}
                            {
                                (limits ? (<p><i>{limits}</i></p>) : (null))
                            }
                        </li>
                    </ul>
                </div>
                {
                    friends && friends.length
                    ? <div className="frineds-list">
                        <div className="title">
                            <span>{t("Friends list")}</span>
                        </div>
                        <div>{friends}</div>
                    </div>
                    : friends && !friends.length
                    ? null : <Loader/>
                }
                <form className="deposit-form-container">
                    {
                        fields
                    }
                    {
                        <div className="separator-box-buttons-m">
                            <button onClick={handleSubmit(this.submitHandler)} disabled={submitting || invalid} className="button-view-normal-m">{t(transactionType)}</button>
                        </div>
                    }

                </form>

                { error
                    ? <div className="login-error"><span>{error}</span></div>
                    : null
                }
            </div>
        );
    }
}
function mapStateToProps (state, ownParams) {
    return {
        friendList: state.payments.buddyToBuddy.list,
        methodState: state.paymentItemsState,
        requestType: ownParams.transactionType === 'deposit' ? "0" : "1",
        paymentID: ownParams.method.paymentID,
        uiState: state.uiState,
        formValues: state.form && state.form[formnames.withdrawForm] && state.form[formnames.withdrawForm].values
    };
}
BuddyToBuddyForm.propTypes = {
    paymentID: PropTypes.number,
    formFields: PropTypes.array,
    friendList: PropTypes.array,
    getFormItem: PropTypes.func,
    inlineStyle: PropTypes.func,
    method: PropTypes.object,
    paymentMethodInfoByCurrency: PropTypes.object,
    uiState: PropTypes.object,
    methodState: PropTypes.object,
    currencyCode: PropTypes.string,
    requestType: PropTypes.string,
    transactionType: PropTypes.string,
    limits: PropTypes.string,
    infoText: PropTypes.string,
    t: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitHandler: PropTypes.func,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    error: PropTypes.object
};

export default connect(mapStateToProps)(BuddyToBuddyForm);