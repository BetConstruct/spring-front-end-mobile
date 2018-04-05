import React from 'react';
import {connect} from 'react-redux';
import {SwarmClearData} from "../../../actions/swarm";
import {DoSportSearch, DoCasinoSearch} from "../../../actions/search";
import {GetSearchBarData} from "../../../helpers/selectors";
import PropTypes from 'prop-types';

const SearchBar = React.createClass({
    propTypes: {
        type: PropTypes.string, // casino or sport
        lang: PropTypes.string // casino or sport
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
        let minChar = this.props.lang !== "kor" ? 4 : 1,
            swarmData = this.props.swarmData,
            searchQuery = this.refs && this.refs.searchInput && this.refs.searchInput.value && this.refs.searchInput.value.replace(/ /g, "") || "",
            searchKey = (this.refs && this.refs.searchInput && this.refs.searchInput.value || "").trim();

        if (searchQuery.length < minChar) { //don't perform search unless term is at least 4 characters long
            this.hideResults = true;
            if (swarmData && (swarmData.loaded.searchResults || swarmData.loaded.casinoSearchResults)) {
                this.forceUpdate();
            }
            return;
        }
        this.hideResults = false;
        this.props.type === "casino"
            ? this.props.dispatch(DoCasinoSearch(searchKey))
            : this.props.dispatch(DoSportSearch(searchKey)); //eslint-disable-line react/prop-types
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
        lang: state.preferences.lang,
        ownParams
    };
}

export default connect(mapStateToProps)(SearchBar);