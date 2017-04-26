import React from 'react';
import {t} from "../../../helpers/translator";

function confirmDepositPopup () {
    return (
        <div className="cashout-dialog">
            <div className="cashout-column-view">
                {
                    (() => {
                        if (this.props.payments) {
                            switch (true) {
                                case !!this.props.payments.hiddenForm && !!this.props.payments.hiddenForm.fields && !!this.props.payments.hiddenForm.action :
                                    return (
                                        <div className="cashout-info-container">

                                            <div>
                                                <form action={this.props.payments.hiddenForm.action}
                                                      noValidate
                                                      id={this.props.payments.hiddenForm.formId || 'hiddenFormId'}
                                                      method={this.props.payments.hiddenForm.method || 'post'}
                                                      target={this.props.payments.method.stayInSameTabOnDeposit ? '_self' : '_blank'}>

                                                    {
                                                        this.props.payments.hiddenForm.fields.map((field, index) => {
                                                            return <input type="hidden" name={field.name} value={field.value} key={index} />
                                                        })
                                                    }
                                                </form>

                                                <button className="button-view-normal-m" onClick={this.submit} type="button">{t("Confirm")}</button>
                                            </div>
                                        </div>
                                    );

                                case !!this.props.payments.confirmAction:
                                    return (
                                        <div className="cashout-info-container">
                                            <div>
                                                <div className="pu-head-j">
                                                    <span>{this.props.payments.confirmAction.title}</span>
                                                </div>
                                                <div className="pu-contain-j">
                                                    <p>{this.props.payments.confirmAction.message}</p>
                                                </div>
                                                <div className="pu-button-wrap-j">
                                                    <button className="button-view-normal-m" type="button" onClick={() => {this.closeDialog('confirm')}}>{t("Yes")}</button>
                                                    <button className="button-view-normal-m" type="button" onClick={() => {this.closeDialog('reject')}}>{t("No")}</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                default :
                                    return (null)
                            }
                        } else {
                            return (null);
                        }

                    })()
                }
            </div>
        </div>
    );
}
module.exports = confirmDepositPopup;

