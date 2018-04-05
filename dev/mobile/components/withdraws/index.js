import {Component} from "react";
import {connect} from "react-redux";
import {GetWithdrawsData} from "../../../helpers/selectors";
import {cancelWithdraw, loadWithdrawals} from "../../../actions/payments";
import {OpenPopup} from "../../../actions/ui";
import {t} from "../../../helpers/translator";

class Withdraws extends Component {
    componentDidMount () {
        this.props.dispatch(loadWithdrawals());
    }
    cancelWithdraw (requestData) {
        this.pandingCancelRequest = requestData;
        this.props.dispatch(
            cancelWithdraw(
                requestData,
                () => {
                    this.props.dispatch(loadWithdrawals());
                },
                () => {
                    this.props.dispatch(OpenPopup("message", {
                        title: t("Warning"),
                        type: "warning",
                        body: t("This type of Withdrawal Requests cannot be Cancelled")
                    }));
                },
                () => {
                    this.pandingCancelRequest = null;
                }
            )
        );
    }
    render () {
        //eslint-disable-next-line no-undef
        return Template.apply(this);
    }
}

export default connect(GetWithdrawsData)(Withdraws);