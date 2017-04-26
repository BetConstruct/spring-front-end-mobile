import React from 'react';
import {connect} from 'react-redux';
import {SwarmClearData} from "../../../actions/swarm";
import {DoSportSearch, DoCasinoSearch} from "../../../actions/search";
import {GetSearchBarData} from "../../../helpers/selectors";

const SearchBar = React.createClass({
    propTypes: {
        type: React.PropTypes.string // casino or sport
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    },

    /**
     * @name search
     * @description search for selected values
     * @returns {undefined}
     * */
    search () {
        if (this.refs.searchInput.value.length < 4) { //don't perform search unless term is at least 4 characters long
            return;
        }
        this.props.type === "casino"
            ? this.props.dispatch(DoCasinoSearch(this.refs.searchInput.value))
            : this.props.dispatch(DoSportSearch(this.refs.searchInput.value)); //eslint-disable-line react/prop-types
    },

    /**
     * @name clearSearch
     * @description clear selected values in search input
     * @returns {undefined}
     * */
    clearSearch () {
        this.props.dispatch(SwarmClearData("casinoSearchResults"));
        this.props.dispatch(SwarmClearData("searchResults"));
        this.refs.searchInput.value = "";
    },

    handleOnChange (event) {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.search, 800);
    },

    handleCloseBtn () {
        this.refs.searchInput.value = "";
    }
});

function mapStateToProps (state, ownParams) {
    return {
        swarmData: GetSearchBarData(state),
        ownParams
    };
}

export default connect(mapStateToProps)(SearchBar);