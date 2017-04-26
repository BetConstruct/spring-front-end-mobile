import React from 'react';
import {Link} from 'react-router';
import moment from "moment";
import {Field} from 'redux-form';
import Config from "../../../config/main";
import Expandable from "../../containers/expandable/";
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import Helpers from "../../../helpers/helperFunctions";

module.exports = function messagesmenuTemplate () {
    let disableMessageRemoving = !!Config.main.messages && !Config.main.messages.disableMessageRemoving;
    let messageList = () => this.props.loaded
            ? messages.sort(sortByDate).map(message =>
                this.props.ui.loading["deleteUserMessage" + message.id] === false
                    ? <div className="deleted-message">{t("Message has been deleted")}</div>
                    : <Expandable key={message.id} uiKey={"message" + message.id} onExpand={this.readMessage(message.id)} className="message-container">
                        <div className="message-top-tow-b">
                            <div className="message-t">
                                { /* <h3>{message.sender}</h3> we don't have sender field for now */}
                                <span>{message.subject}</span>
                                <p>{moment.unix(message.date).format(Config.main.dateTimeFormat)}</p>
                            </div>
                            {/*<div className="message-date-view"><p>{moment.unix(message.date).format(Config.main.dateTimeFormat)}</p></div>*/}
                        </div>
                        {disableMessageRemoving ? <div className="message-delete-icon" onClick={(ev) => { this.deleteMessage(message.id); ev.stopPropagation(); ev.preventDefault(); } }/> : null}
                         <div className="message-text-body">
                            <div dangerouslySetInnerHTML={{__html: Helpers.nl2br(message.body)}} className="message-body"/>
                         </div>

                    </Expandable>
            )
            : <Loader/>;

    let sentMessages = () => {
        return <div className="messages-wrapper">
            <div className="title-message-view">
                <h2>{t("Sent messages")}</h2>
            </div>
                <div className="all-messages-box">
                {messageList()}
                </div>
            </div>;
    };
    let inbox = () => {
        return <div className="messages-wrapper">
            <div className="title-message-view">
                <h2>{t("Incoming messages")}</h2>
            </div>
                <div className="all-messages-box">
                {messageList()}
                </div>
            </div>;
    };
    let newMessage = () => {
        // console.log("ui", this.props.ui.loading.sendUserMessage);
        return <div className="messages-wrapper">
                <div className="title-message-view">
                    <h2>{t("New message")}</h2>
                </div>

            <div className="new-messages-box">
            {this.props.ui.loading.sendUserMessage === false
                ? <div className="message-sent">
                    <p>{t("Message sent")}</p>
                    <button className="button-view-normal-m" onClick={this.resetSendMessage}>{t("Send another one")}</button>
                </div>
                : <div className="new-message-form">
                    <form onSubmit={this.props.handleSubmit(this.sendMessage)}>
                    <div className="details-form-item-m">
                        <label>{t("Subject")}</label>
                        <div className="single-form-item">
                            <Field component="input" type="text" name="subject" />
                        </div>
                    </div>
                    <div className="details-form-item-m">
                        <label>{t("Message")}</label>
                        <div className="text-inp-f">
                            <Field name="body" component="textarea"/>
                        </div>
                    </div>
                    <div className="button-message-form">
                        <button className="button-view-normal-m" type="submit" disabled={this.props.submitting || this.props.pristine || !this.props.valid}>{t("Send")}</button>
                    </div>
                    </form>
                </div>
                }
            {this.props.ui.failReason.sendUserMessage
                ? <div className="error-send-m"><p>{t("Error sending message.")}</p></div>
                : null}
                </div>
        </div>;
    };
    console.debug("mesaage props", this.props);
    let messages = (this.props.data && this.props.data.messages) || [];
    let sortByDate = Helpers.createSortingFn("date", false);
    return (
        <div className="profile-view-wrapper">
            <div className="title-separator-contain-b">
                <h1>{t("Messages")}</h1>
            </div>
            <div className="page-menu-contain">
                <ul>
                    <li><Link to="/messages/inbox" activeClassName="active"><span>{t("Inbox")}</span></Link></li>
                    <li><Link to="/messages/sent" activeClassName="active"><span>{t("Sent")}</span></Link></li>
                    <li><Link to="/messages/new" activeClassName="active"><span>{t("New message")}</span></Link></li>
                </ul>
            </div>

            {(() => {
                // console.log("messages route", this.props.route && this.props.route.path, this.props);
                switch (this.props.routeParams.type) {
                    case "sent":
                        return sentMessages();
                    case "new":
                        return newMessage();
                    case "inbox":
                    default:
                        return inbox();
                }
            })()}
        </div>);
};
