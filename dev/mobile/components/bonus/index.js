import React from 'react';
import {connect} from 'react-redux';
import {checkIfUserIsLoggedIn} from "../../../mixins/checkAuthentication";
import {LoadBonusData, ClaimBonus, CancelBonus} from "../../../actions/bonus";
import {UIMixin} from "../../../mixins/uiMixin";

const Bonus = React.createClass({
    propTypes: {
        type: React.PropTypes.string
    },
    render () {
        //eslint-disable-next-line react/prop-types
        return checkIfUserIsLoggedIn(this.props.user, this.props.dispatch) || Template.apply(this); //eslint-disable-line no-undef
    },
    componentWillMount () {
        this.props.dispatch(LoadBonusData(this.props.type === "casino"));
    },

    /**
     * @description function claim bonus
     * @param id bonus id
     * @returns {Function} action dispatcher ( dispatch bonus id and bonus type)
     * */
    claimBonus (id) {
        return () => {
            this.props.dispatch(ClaimBonus(id, this.props.type === "casino"));
        };
    },

    /**
     * @description helper function preparing bonuse cancel
     * @param id bonus id
     * @returns {Function} action dispatcher ( dispatch bonus id and bonus type)
     * */
    cancelBonus (id) {
        return () => {
            this.props.dispatch(CancelBonus(id, this.props.type === "casino"));
        };
    }
});

function mapStateToProps (state) {
    return {
        user: state.user,
        swarmData: state.swarmData,
        ui: state.uiState
    };
}

export default connect(mapStateToProps)(UIMixin({Component: Bonus}));