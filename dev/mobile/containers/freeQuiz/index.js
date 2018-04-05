import {Component} from "react";
import {connect} from "react-redux";
import {GetFreeQuizData, SetQuizDateFilter} from "../../../actions/freeQuiz";
import PropTypes from "prop-types";
import {_GetFreeQuizData} from "../../../helpers/selectors";
import Config from "../../../config/main";

function loadAllQuizzes (force) {
    if (this.props.reallyLoggedIn || force) {
        Config.main.freeQuiz && Config.main.freeQuiz.days && Config.main.freeQuiz.days.forEach((i) => {
            this.props.dispatch(GetFreeQuizData({day: i}));
        });
    } else {
        this.props.dispatch(GetFreeQuizData({day: 0}));
    }
}

class FreeQuiz extends Component {
    componentDidMount () {
        loadAllQuizzes.apply(this);
    }
    componentWillReceiveProps (nextProps) {
        if (!this.props.reallyLoggedIn && nextProps.reallyLoggedIn || this.props.reallyLoggedIn && !nextProps.reallyLoggedIn) {
            loadAllQuizzes.apply(this, [nextProps.reallyLoggedIn]);
        }
    }
    setDateFilter (day) {
        this.props.dispatch(SetQuizDateFilter(day));
    }
    openInfo (enabled) {
        this.infoOpened = enabled;
        this.forceUpdate();
    }
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}
const mapStateToProps = (state) => {
    return {
        reallyLoggedIn: state.user.reallyLoggedIn,
        loggedIn: state.user.loggedIn,
        uiState: state.uiState,
        freeQuiz: _GetFreeQuizData(state)
    };
};

FreeQuiz.propTypes = {
    freeQuiz: PropTypes.object,
    reallyLoggedIn: PropTypes.bool,
    loggedIn: PropTypes.bool,
    filtersData: PropTypes.array
};

export default connect(mapStateToProps)(FreeQuiz);